'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '@/styles/components/codePanel.module.css';
import { ComponentType } from '@/types';
import {
  FileCode2,
  Copy,
  Check,
  Sparkles,
  Wand2,
} from 'lucide-react';

interface CodePanelProps {
  code: string;
  componentList: ComponentType[];
  onCodeChange?: (code: string) => void;
}

export const CodePanel: React.FC<CodePanelProps> = ({
  code,
  componentList,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lineCount = code ? code.split('\n').length : 0;

  if (!code) {
    return (
      <div className={styles.codePanel}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <FileCode2 size={15} className={styles.headerIconSvg} />
            <span className={styles.headerTitle}>Code</span>
            <span className={styles.fileName}>GeneratedUI.tsx</span>
          </div>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyBadge}>
            <Sparkles size={13} />
            Builder Ready
          </div>
          {/* Code wireframe illustration */}
          <div className={styles.codeWireframe}>
            <div className={styles.codeLine}>
              <span className={styles.lineNum}>1</span>
              <span className={styles.codeKeyword} style={{ width: '42px' }} />
              <span className={styles.codeString} style={{ width: '55px' }} />
              <span className={styles.codeKeyword} style={{ width: '30px' }} />
              <span className={styles.codeString} style={{ width: '50px' }} />
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNum}>2</span>
              <span className={styles.codeKeyword} style={{ width: '42px' }} />
              <span className={styles.codeBlock} style={{ width: '70px' }} />
              <span className={styles.codeKeyword} style={{ width: '30px' }} />
              <span className={styles.codeString} style={{ width: '80px' }} />
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNum}>3</span>
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNum}>4</span>
              <span className={styles.codeKeyword} style={{ width: '50px' }} />
              <span className={styles.codeBlock} style={{ width: '25px' }} />
              <span className={styles.codeKeyword} style={{ width: '60px' }} />
              <span className={styles.codeBlock} style={{ width: '35px' }} />
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNum}>5</span>
              <span className={styles.codeIndent} />
              <span className={styles.codeKeyword} style={{ width: '35px' }} />
              <span className={styles.codeBlock} style={{ width: '15px' }} />
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNum}>6</span>
              <span className={styles.codeIndent} />
              <span className={styles.codeIndent} />
              <span className={styles.codeTag} style={{ width: '45px' }} />
              <span className={styles.codeString} style={{ width: '55px' }} />
            </div>
            <div className={styles.codeLine}>
              <span className={styles.lineNum}>7</span>
              <span className={styles.codeIndent} />
              <span className={styles.codeBlock} style={{ width: '30px' }} />
            </div>
          </div>
          <div className={styles.emptyTitle}>No code generated yet</div>
          <div className={styles.emptyHint}>
            Generated `GeneratedUI.tsx` appears here. Start with a clear prompt like:
          </div>
          <div className={styles.quickPrompt}>
            <Wand2 size={13} />
            Build a reporting dashboard with KPI cards, trend chart, and recent reports table.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.codePanel}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <FileCode2 size={15} className={styles.headerIconSvg} />
          <span className={styles.headerTitle}>Code</span>
          <span className={styles.fileName}>GeneratedUI.tsx</span>
        </div>
        <div className={styles.headerActions}>
          <button
            className={`${styles.actionButton} ${copied ? styles.actionButtonSuccess : ''}`}
            onClick={handleCopy}
            id="copy-code-button"
          >
            {copied ? (
              <><Check size={13} /> Copied!</>
            ) : (
              <><Copy size={13} /> Copy</>
            )}
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className={styles.codeContainer}>
        <div className={styles.codeWrapper}>
          <SyntaxHighlighter
            language="tsx"
            style={oneLight}
            showLineNumbers
            wrapLines
            customStyle={{
              margin: 0,
              background: '#fffaf4',
              fontSize: '0.82rem',
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* Component List Footer */}
      {componentList.length > 0 && (
        <div className={styles.componentList}>
          {componentList.map((comp) => (
            <span key={comp} className={styles.componentBadge}>
              {comp}
            </span>
          ))}
          <span className={styles.lineCount}>{lineCount} lines</span>
        </div>
      )}
    </div>
  );
};
