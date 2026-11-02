import Ajv2020 from 'ajv/dist/2020';
import { parse as parseHtml, type DefaultTreeAdapterTypes } from 'parse5';
import ts from 'typescript';
import postcss from 'postcss';

export type GeneratedArtifactFormat = 'tsx' | 'expo' | 'html';

export interface GeneratedArtifact {
  format: GeneratedArtifactFormat;
  code: string;
}

export interface GeneratedArtifactValidation {
  isValid: boolean;
  errors: string[];
  diagnostics: string;
}

// Runtime contract for values that are allowed to cross from generation into preview.
export const GENERATED_ARTIFACT_JSON_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  type: 'object',
  required: ['format', 'code'],
  additionalProperties: false,
  properties: {
    format: { enum: ['tsx', 'expo', 'html'] },
    code: { type: 'string', minLength: 1, maxLength: 1_000_000 },
  },
} as const;

const validateArtifactSchema = new Ajv2020({ allErrors: true }).compile(GENERATED_ARTIFACT_JSON_SCHEMA as object);

const MAX_TSX_LENGTH = 100_000;
const MAX_EXPO_LENGTH = 1_000_000;
const MAX_HTML_LENGTH = 1_000_000;
const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
const VOID_HTML_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const OPTIONAL_END_TAG_ELEMENTS = new Set(['html', 'head', 'body', 'li', 'dt', 'dd', 'p', 'rt', 'rp', 'optgroup', 'option', 'colgroup', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th']);

export function validateGeneratedArtifact(
  value: unknown,
  expectedFormat: GeneratedArtifactFormat
): GeneratedArtifactValidation {
  const schemaErrors = validateArtifactEnvelope(value, expectedFormat);
  if (schemaErrors.length > 0) {
    return result(schemaErrors);
  }

  const artifact = value as GeneratedArtifact;
  if (artifact.format === 'tsx') return validateTsx(artifact.code, 'GeneratedUI.tsx', true);
  if (artifact.format === 'expo') return validateExpoBundle(artifact.code);
  return validateHtml(artifact.code);
}

function validateArtifactEnvelope(value: unknown, expectedFormat: GeneratedArtifactFormat): string[] {
  if (!validateArtifactSchema(value)) {
    return (validateArtifactSchema.errors ?? []).map((error) => {
      const field = error.instancePath || '(artifact)';
      return `Artifact JSON Schema validation failed at ${field}: ${error.message ?? 'invalid value'}.`;
    });
  }

  const artifact = value as GeneratedArtifact;
  if (artifact.format !== expectedFormat) {
    return [`Artifact JSON Schema validation failed at /format: expected "${expectedFormat}".`];
  }

  const maxLength = expectedFormat === 'tsx' ? MAX_TSX_LENGTH : expectedFormat === 'expo' ? MAX_EXPO_LENGTH : MAX_HTML_LENGTH;
  if (artifact.code.length > maxLength) {
    return [`Artifact JSON Schema validation failed at /code: ${expectedFormat} code exceeds ${maxLength.toLocaleString()} characters.`];
  }

  return [];
}

function validateTsx(code: string, fileName: string, requireDefaultExport: boolean): GeneratedArtifactValidation {
  const sourceFile = ts.createSourceFile(fileName, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const diagnostics = [...getSyntaxDiagnostics(sourceFile)];
  const errors: string[] = [];

  if (requireDefaultExport && !hasGeneratedUiDefaultExport(sourceFile)) {
    errors.push(`${fileName}: generated UI must default-export the GeneratedUI component.`);
  }
  if (diagnostics.length > 0) errors.push(formatTypeScriptDiagnostics(diagnostics));
  return result(errors);
}

function validateExpoBundle(code: string): GeneratedArtifactValidation {
  const filePattern = /^\/\/\s*FILE:\s*(.+?)\s*$/gm;
  const markers = Array.from(code.matchAll(filePattern));
  if (markers.length === 0) return result(['Expo bundle schema requires at least one // FILE: path marker.']);

  const errors: string[] = [];
  const files = markers.map((marker, index) => {
    const start = (marker.index ?? 0) + marker[0].length;
    const end = markers[index + 1]?.index ?? code.length;
    return { name: marker[1].trim(), content: code.slice(start, end).trim() };
  });

  if (!files.some((file) => /(^|\/)App\.(tsx?|jsx?)$/i.test(file.name))) {
    errors.push('Expo bundle schema requires an App.tsx or App.js entry file.');
  }

  for (const file of files) {
    if (!/\.(tsx?|jsx?)$/i.test(file.name)) continue;
    const fileResult = validateTsx(file.content, file.name, false);
    errors.push(...fileResult.errors);
  }

  return result(errors);
}

function validateHtml(html: string): GeneratedArtifactValidation {
  const errors: string[] = [];
  const document = parseHtml(html, {
    sourceCodeLocationInfo: true,
    onParseError: (error) => errors.push(`HTML(${error.startLine},${error.startCol}): ${error.code}.`),
  });
  const htmlNode = document.childNodes.find(isElementNode);
  const rootElement = htmlNode && htmlNode.tagName === 'html' ? htmlNode : undefined;
  const bodyNode = rootElement?.childNodes.find(
    (node): node is DefaultTreeAdapterTypes.Element | DefaultTreeAdapterTypes.Template => isElementNode(node) && node.tagName === 'body'
  );

  if (!document.childNodes.some((node) => isDocumentTypeNode(node) && node.name.toLowerCase() === 'html')) {
    errors.push('HTML document schema requires a <!DOCTYPE html> declaration.');
  }
  if (!rootElement || !getElementStartTag(rootElement)) errors.push('HTML document schema requires an explicit <html> root element.');
  if (!bodyNode || !getElementStartTag(bodyNode)) errors.push('HTML document schema requires an explicit <body> element inside <html>.');

  walkHtml(document, (node) => {
    if (!isElementNode(node)) return;
    validateElementClosure(node, errors);
    if (node.tagName === 'script') validateInlineScript(node, errors);
    if (node.tagName === 'style') validateInlineStyle(node, errors);
    for (const attribute of node.attrs) {
      if (/^on[a-z]+$/i.test(attribute.name)) {
        validateInlineJavaScript(attribute.value, `inline-handler-${attribute.name}.js`, errors);
      }
    }
  });

  return result(errors);
}

function validateElementClosure(node: DefaultTreeAdapterTypes.Element | DefaultTreeAdapterTypes.Template, errors: string[]): void {
  if (node.namespaceURI !== HTML_NAMESPACE || VOID_HTML_ELEMENTS.has(node.tagName) || OPTIONAL_END_TAG_ELEMENTS.has(node.tagName)) return;
  const location = getElementStartTag(node);
  if (location && !node.sourceCodeLocation?.endTag) {
    errors.push(`HTML(${location.startLine},${location.startCol}): <${node.tagName}> is missing its closing tag.`);
  }
}

function getElementStartTag(
  node: DefaultTreeAdapterTypes.Element | DefaultTreeAdapterTypes.Template
): { startLine: number; startCol: number } | undefined {
  const location = node.sourceCodeLocation;
  return location && 'startTag' in location ? location.startTag : undefined;
}

function validateInlineScript(node: DefaultTreeAdapterTypes.Element, errors: string[]): void {
  const source = getTextContent(node);
  const scriptType = node.attrs.find((attribute) => attribute.name === 'type')?.value.toLowerCase();
  if (scriptType === 'application/json' || scriptType === 'application/ld+json') {
    try {
      JSON.parse(source);
    } catch (error) {
      errors.push(`Invalid JSON in <script type="${scriptType}">: ${error instanceof Error ? error.message : 'invalid JSON'}.`);
    }
  } else if (!scriptType || /javascript|ecmascript|babel|module/i.test(scriptType)) {
    const scriptKind = /babel/i.test(scriptType ?? '') ? ts.ScriptKind.JSX : ts.ScriptKind.JS;
    validateInlineJavaScript(source, 'inline-script.js', errors, scriptKind);
  }
}

function validateInlineJavaScript(
  source: string,
  fileName: string,
  errors: string[],
  scriptKind: ts.ScriptKind = ts.ScriptKind.JS
): void {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, scriptKind);
  const diagnostics = getSyntaxDiagnostics(sourceFile);
  if (diagnostics.length > 0) errors.push(formatTypeScriptDiagnostics(diagnostics));
}

function validateInlineStyle(node: DefaultTreeAdapterTypes.Element, errors: string[]): void {
  try {
    postcss.parse(getTextContent(node), { from: 'inline-style.css' });
  } catch (error) {
    const cssError = error as { reason?: string; line?: number; column?: number };
    errors.push(`inline-style.css(${cssError.line ?? 1},${cssError.column ?? 1}): ${cssError.reason ?? 'invalid CSS syntax'}.`);
  }
}

function isElementNode(node: DefaultTreeAdapterTypes.Node): node is DefaultTreeAdapterTypes.Element | DefaultTreeAdapterTypes.Template {
  return !['#document', '#document-fragment', '#text', '#comment', '#documentType'].includes(node.nodeName);
}

function isDocumentTypeNode(node: DefaultTreeAdapterTypes.ChildNode): node is DefaultTreeAdapterTypes.DocumentType {
  return node.nodeName === '#documentType';
}

function isTextNode(node: DefaultTreeAdapterTypes.ChildNode): node is DefaultTreeAdapterTypes.TextNode {
  return node.nodeName === '#text';
}

function isTemplateNode(node: DefaultTreeAdapterTypes.Node): node is DefaultTreeAdapterTypes.Template {
  return node.nodeName === 'template' && 'content' in node;
}

function isParentNode(node: DefaultTreeAdapterTypes.Node): node is DefaultTreeAdapterTypes.ParentNode {
  return 'childNodes' in node;
}

function walkHtml(node: DefaultTreeAdapterTypes.Node, visit: (node: DefaultTreeAdapterTypes.Node) => void): void {
  visit(node);
  if (isParentNode(node)) node.childNodes.forEach((child) => walkHtml(child, visit));
  if (isTemplateNode(node)) node.content.childNodes.forEach((child) => walkHtml(child, visit));
}

function getTextContent(node: DefaultTreeAdapterTypes.Element | DefaultTreeAdapterTypes.Template): string {
  return node.childNodes.map((child) => {
    if (isTextNode(child)) return child.value;
    if (isElementNode(child)) return getTextContent(child);
    return '';
  }).join('');
}

function getSyntaxDiagnostics(sourceFile: ts.SourceFile): readonly ts.Diagnostic[] {
  return (sourceFile as ts.SourceFile & { parseDiagnostics: readonly ts.Diagnostic[] }).parseDiagnostics;
}

function hasGeneratedUiDefaultExport(sourceFile: ts.SourceFile): boolean {
  return sourceFile.statements.some((statement) => {
    if (ts.isExportAssignment(statement)) {
      return ts.isIdentifier(statement.expression) && statement.expression.text === 'GeneratedUI';
    }
    const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
    if (!modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)) return false;
    if ((ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) && statement.name?.text === 'GeneratedUI') return true;
    if (ts.isVariableStatement(statement)) {
      return statement.declarationList.declarations.some((declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === 'GeneratedUI');
    }
    return false;
  });
}

function formatTypeScriptDiagnostics(diagnostics: readonly ts.Diagnostic[]): string {
  return ts.formatDiagnostics([...diagnostics], {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => '\n',
  }).trim();
}

function result(errors: string[]): GeneratedArtifactValidation {
  return {
    isValid: errors.length === 0,
    errors,
    diagnostics: errors.join('\n'),
  };
}
