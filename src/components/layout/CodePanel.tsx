'use client';

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from '@/styles/components/codePanel.module.css';
import { ComponentType } from '@/types';

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
            <span className={styles.headerTitle}>📝 Code</span>
            <span className={styles.fileName}>GeneratedUI.tsx</span>
          </div>
        </div>
        <div className={styles.emptyState}>
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
          <div className={styles.emptyTitle}>No code yet</div>
          <div className={styles.emptyHint}>
            Generated code will appear here. Use the chat to describe your UI.
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
          <span className={styles.headerTitle}>📝 Code</span>
          <span className={styles.fileName}>GeneratedUI.tsx</span>
        </div>
        <div className={styles.headerActions}>
          <button
            className={`${styles.actionButton} ${copied ? styles.actionButtonSuccess : ''}`}
            onClick={handleCopy}
            id="copy-code-button"
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className={styles.codeContainer}>
        <div className={styles.codeWrapper}>
          <SyntaxHighlighter
            language="tsx"
            style={vscDarkPlus}
            showLineNumbers
            wrapLines
            customStyle={{
              margin: 0,
              background: 'transparent',
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