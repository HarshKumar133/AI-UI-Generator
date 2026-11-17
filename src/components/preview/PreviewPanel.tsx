'use client';

import React from 'react';
import styles from '@/styles/components/previewPanel.module.css';
import LivePreview from './LivePreview';
import { Eye, AlertTriangle, Wand2, KeyRound } from 'lucide-react';

interface PreviewPanelProps {
    version: number | null;
    error?: string;
    code?: string;
    htmlOutput?: string;
    title?: string;
    outputMode?: 'tsx' | 'html';
    downloadPayload?: {
        filename: string;
        content: string;
        mimeType?: string;
        label?: string;
    };
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
    version, error, code, htmlOutput, title, outputMode: externalMode, downloadPayload,
}) => {
    const hasContent = !!code || !!htmlOutput;
    const liveCode = htmlOutput || code || '';
    // Use external outputMode if provided, otherwise auto-detect from content
    const outputMode: 'html' | 'tsx' = externalMode || (htmlOutput ? 'html' : 'tsx');
    const isQuotaError = !!error && /(quota|api key)/i.test(error);


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
                    <div className={styles.errorTitle}>{isQuotaError ? 'API Quota Reached' : 'Preview Error'}</div>
                    <div className={styles.errorMessage}>{error}</div>
                    <div className={styles.errorHintCard}>
                        <div className={styles.errorHintTitle}>
                            {isQuotaError ? <KeyRound size={13} /> : <Wand2 size={13} />}
                            {isQuotaError ? 'How to continue' : 'Quick recovery'}
                        </div>
                        <ul className={styles.errorHintList}>
                            {isQuotaError ? (
                                <>
                                    <li>Add a fresh API key in your local env and restart dev server.</li>
                                    <li>Retry your prompt after the server is ready.</li>
                                </>
                            ) : (
                                <>
                                    <li>Retry with a tighter prompt and fewer requirements.</li>
                                    <li>Describe the intended result in a single focused request.</li>
                                </>
                            )}
                        </ul>
                    </div>
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
                    <div className={styles.emptyBadge}>
                        <Wand2 size={12} />
                        Waiting for generation
                    </div>
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
                    <div className={styles.emptySteps}>
                        <div className={styles.emptyStep}>1. Describe the interface in chat.</div>
                        <div className={styles.emptyStep}>2. Review the generated code and preview.</div>
                        <div className={styles.emptyStep}>3. Refine it in a follow-up message.</div>
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
                    <LivePreview code={liveCode} outputMode={outputMode} title={title} downloadPayload={downloadPayload} />
                </div>
            </div>
        </div>
    );
};
