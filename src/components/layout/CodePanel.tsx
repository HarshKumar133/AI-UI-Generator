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
      // Fallback for older browsers
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
          <div className={styles.emptyIcon}>📄</div>
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
            {copied ? '✓ Copied' : '📋 Copy'}
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