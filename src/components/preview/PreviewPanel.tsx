'use client';

import React from 'react';
import styles from '@/styles/components/previewPanel.module.css';
import { ComponentRenderer } from './ComponentRenderer';
import { ComponentNode } from '@/types';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface PreviewPanelProps {
    components: ComponentNode[];
    layout: string;
    version: number | null;
    error?: string;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
    components,
    layout,
    version,
    error,
}) => {
    const hasContent = components && components.length > 0;

    if (error) {
        return (
            <div className={styles.previewPanel}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <span className={styles.headerTitle}>👁️ Preview</span>
                        <div className={`${styles.statusDot} ${styles.statusDotIdle}`} />
                    </div>
                </div>
                <div className={styles.errorState}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <div className={styles.errorTitle}>Preview Error</div>
                    <div className={styles.errorMessage}>{error}</div>
                </div>
            </div>
        );
    }

    if (!hasContent) {
        return (
            <div className={styles.previewPanel}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <span className={styles.headerTitle}>👁️ Preview</span>
                        <div className={`${styles.statusDot} ${styles.statusDotIdle}`} />
                    </div>
                </div>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>👁️</div>
                    <div className={styles.emptyTitle}>Live Preview</div>
                    <div className={styles.emptyHint}>
                        Your generated UI will be rendered here in real-time using the deterministic component library.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.previewPanel}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <span className={styles.headerTitle}>👁️ Preview</span>
                    <div className={styles.statusDot} />
                </div>
                <div className={styles.headerActions}>
                    {version !== null && (
                        <span className={styles.versionBadge}>v{version}</span>
                    )}
                </div>
            </div>

            {/* Preview Content */}
            <div className={styles.previewContainer}>
                <div className={styles.previewContent}>
                    <ErrorBoundary>
                        <ComponentRenderer nodes={components} layout={layout} />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};