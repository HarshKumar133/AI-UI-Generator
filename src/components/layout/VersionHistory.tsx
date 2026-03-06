'use client';

import React from 'react';
import styles from '@/styles/components/versionHistory.module.css';
import { VersionEntry } from '@/types';
import {
  History,
  X,
  Undo2,
} from 'lucide-react';

interface VersionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  versions: VersionEntry[];
  currentVersion: number | null;
  onRollback: (version: number) => void;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({
  isOpen,
  onClose,
  versions,
  currentVersion,
  onRollback,
}) => {
  if (!isOpen) return null;

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show versions in reverse order (newest first)
  const sortedVersions = [...versions].reverse();

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <History size={18} />
            Version History
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className={styles.body}>
          {sortedVersions.length === 0 ? (
            <div className={styles.emptyState}>
              No versions yet. Generate a UI to create your first version.
            </div>
          ) : (
            <div className={styles.versionList}>
              {sortedVersions.map((version) => {
                const isActive = version.version === currentVersion;
                return (
                  <div
                    key={version.version}
                    className={`${styles.versionItem} ${isActive ? styles.versionItemActive : ''}`}
                    onClick={() => !isActive && onRollback(version.version)}
                  >
                    <div className={styles.versionNumber}>
                      v{version.version}
                    </div>
                    <div className={styles.versionInfo}>
                      <div className={styles.versionPrompt}>
                        {version.prompt}
                      </div>
                      <div className={styles.versionMeta}>
                        <span>{formatTime(version.timestamp)}</span>
                        <span>•</span>
                        <span>{version.plan.layout}</span>
                        {version.plan.blocks && version.plan.blocks.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{version.plan.blocks.length} blocks</span>
                          </>
                        )}
                      </div>
                    </div>
                    {!isActive && (
                      <button
                        className={styles.rollbackButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRollback(version.version);
                        }}
                      >
                        <Undo2 size={13} />
                        Restore
                      </button>
                    )}
                    {isActive && (
                      <span className={styles.versionTag}>current</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};