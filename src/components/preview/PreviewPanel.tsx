'use client';

import React from 'react';
import styles from '@/styles/components/previewPanel.module.css';
import { ComponentNode } from '@/types';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ComponentRenderer } from './componentrenderer';
import LivePreview from './livepreview';
import { Eye, AlertTriangle } from 'lucide-react';

interface PreviewPanelProps {
    components: ComponentNode[];
    layout: string;
    version: number | null;
    error?: string;
    code?: string;
    htmlOutput?: string;
    title?: string;
    outputMode?: 'tsx' | 'html' | 'nextjs';
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
    components, layout, version, error, code, htmlOutput, title, outputMode: externalMode,
}) => {
    const hasContent = (components && components.length > 0) || !!code || !!htmlOutput;
    const liveCode = htmlOutput || code;
    // Use external outputMode if provided, otherwise auto-detect from content
    const outputMode: 'html' | 'tsx' | 'nextjs' = externalMode || (htmlOutput ? 'html' : 'tsx');


    if (error) {
        return (
            <div className={styles.previewPanel}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <Eye size={15} className={styles.headerIconSvg} />
                        <span className={styles.headerTitle}>Preview</span>
                        <div className={`${styles.statusDot} ${styles.statusDotError}`} />
                    </div>
                </div>
                <div className={styles.errorState}>
                    <AlertTriangle size={32} className={styles.errorIconSvg} />
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
                        <Eye size={15} className={styles.headerIconSvg} />
                        <span className={styles.headerTitle}>Preview</span>
                        <div className={`${styles.statusDot} ${styles.statusDotIdle}`} />
                    </div>
                </div>
                <div className={styles.emptyState}>
                    <div className={styles.wireframe}>
                        <div className={styles.wireframeNav}>
                            <div className={styles.wireframeDot} />
                            <div className={styles.wireframeDot} />
                            <div className={styles.wireframeDot} />
                            <div className={styles.wireframeNavBar} />
                        </div>
                        <div className={styles.wireframeBody}>
                            <div className={styles.wireframeSidebar}>
                                <div className={styles.wireframeLine} />
                                <div className={styles.wireframeLine} />
                                <div className={styles.wireframeLine} />
                                <div className={styles.wirelineShort} />
                            </div>
                            <div className={styles.wireframeMain}>
                                <div className={styles.wireframeCardRow}>
                                    <div className={styles.wireframeCard} />
                                    <div className={styles.wireframeCard} />
                                </div>
                                <div className={styles.wireframeChart} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.emptyTitle}>Live Preview</div>
                    <div className={styles.emptyHint}>
                        Your generated UI will be rendered here in real-time.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.previewPanel}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Eye size={15} className={styles.headerIconSvg} />
                    <span className={styles.headerTitle}>Preview</span>
                    <div className={styles.statusDot} />
                </div>
                <div className={styles.headerActions}>
                    {version !== null && (
                        <span className={styles.versionBadge}>v{version}</span>
                    )}
                </div>
            </div>

            <div className={styles.previewContainer}>
                <div className={styles.previewContent}>
                    {liveCode ? (
                        <LivePreview code={liveCode} outputMode={outputMode} title={title} />
                    ) : (
                        <ErrorBoundary>
                            <ComponentRenderer nodes={components} layout={layout} />
                        </ErrorBoundary>
                    )}
                </div>
            </div>
        </div>
    );
};