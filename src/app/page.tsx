'use client';

import React, { useState, useCallback } from 'react';
import styles from '@/styles/components/appLayout.module.css';
import { ChatPanel } from '@/components/layout/ChatPanel';
import { CodePanel } from '@/components/layout/CodePanel';
import { VersionHistory } from '@/components/layout/VersionHistory';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { ChatMessage, GenerationResult, ComponentNode, ComponentType, VersionEntry } from '@/types';

type ViewTab = 'split' | 'code' | 'preview';

export default function Home() {
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentCode, setCurrentCode] = useState('');
  const [componentList, setComponentList] = useState<ComponentType[]>([]);
  const [previewComponents, setPreviewComponents] = useState<ComponentNode[]>([]);
  const [previewLayout, setPreviewLayout] = useState('single-column');
  const [currentVersion, setCurrentVersion] = useState<number | null>(null);
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>('split');
  const [previewError, setPreviewError] = useState<string | undefined>();

  // Handle generation result
  const applyGenerationResult = useCallback((result: GenerationResult) => {
    setCurrentCode(result.generation.code);
    setComponentList(result.generation.componentList);
    setPreviewComponents(result.plan.components);
    setPreviewLayout(result.plan.layout);
    setCurrentVersion(result.version);
    setPreviewError(undefined);

    // Add to versions
    setVersions(prev => [
      ...prev,
      {
        version: result.version,
        code: result.generation.code,
        prompt: result.userPrompt,
        plan: result.plan,
        explanation: result.explanation,
        timestamp: result.timestamp,
      },
    ]);
  }, []);

  // Send message handler
  const handleSendMessage = useCallback(async (message: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      let response: Response;

      if (currentCode) {
        // Modification mode
        response = await fetch('/api/modify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: message,
            currentCode,
            currentVersion: currentVersion || 0,
            previousLayout: previewLayout,
            previousComponentList: componentList,
          }),
        });
      } else {
        // Generation mode
        response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: message }),
        });
      }

      const data = await response.json();

      if (data.success && data.data) {
        const result: GenerationResult = data.data;
        applyGenerationResult(result);

        const assistantMsg: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: result.explanation.explanation,
          timestamp: new Date().toISOString(),
          generationResult: result,
        };

        setMessages(prev => [...prev, assistantMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `❌ Error: ${data.error || 'Generation failed. Please try again.'}`,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `❌ Network error: ${error instanceof Error ? error.message : 'Failed to connect to server.'}`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [currentCode, currentVersion, applyGenerationResult]);

  // Rollback handler
  const handleRollback = useCallback(async (targetVersion: number) => {
    const version = versions.find(v => v.version === targetVersion);
    if (!version) return;

    setCurrentCode(version.code);
    setPreviewComponents(version.plan.components);
    setPreviewLayout(version.plan.layout);
    setCurrentVersion(version.version);
    setPreviewError(undefined);
    setShowVersionHistory(false);

    const rollbackMsg: ChatMessage = {
      id: `system-${Date.now()}`,
      role: 'assistant',
      content: `⏪ Rolled back to version ${targetVersion}. Original prompt: "${version.prompt}"`,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, rollbackMsg]);
  }, [versions]);

  // Regenerate handler
  const handleRegenerate = useCallback(async () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;

    // Clear current code to force full regeneration
    setCurrentCode('');
    setCurrentVersion(null);

    // Re-send the last user message
    handleSendMessage(lastUserMsg.content);
  }, [messages, handleSendMessage]);

  // Clear handler
  const handleClear = useCallback(() => {
    setMessages([]);
    setCurrentCode('');
    setComponentList([]);
    setPreviewComponents([]);
    setPreviewLayout('single-column');
    setCurrentVersion(null);
    setVersions([]);
    setPreviewError(undefined);
  }, []);

  return (
    <div className={styles.appContainer}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarBrand}>
          <span className={styles.topBarIcon}>✨</span>
          Deterministic UI Generator
          <span className={styles.topBarBrandSub}>by Harsh Kumar</span>
        </div>
        <div className={styles.topBarActions}>
          {currentVersion !== null && (
            <span className={styles.versionTag}>v{currentVersion}</span>
          )}
          {versions.length > 0 && (
            <button
              className={styles.topBarButton}
              onClick={() => setShowVersionHistory(true)}
              id="history-button"
            >
              📋 History ({versions.length})
            </button>
          )}
          {versions.length > 1 && (
            <select
              className={styles.topBarButton}
              onChange={(e) => handleRollback(Number(e.target.value))}
              value=""
              id="version-select"
            >
              <option value="" disabled>⏪ Rollback</option>
              {versions.map((v, idx) => (
                <option key={`opt-${idx}-${v.version}`} value={v.version}>
                  v{v.version} — {v.prompt.slice(0, 30)}...
                </option>
              ))}
            </select>
          )}
          {currentCode && (
            <button
              className={styles.topBarButton}
              onClick={handleRegenerate}
              disabled={isLoading}
              id="regenerate-button"
            >
              🔄 Regenerate
            </button>
          )}
          <button
            className={`${styles.topBarButton} ${styles.topBarButtonDanger}`}
            onClick={handleClear}
            id="clear-button"
          >
            🗑 Clear
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left: Chat Panel */}
        <div className={styles.leftPanel}>
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            hasCode={!!currentCode}
          />
        </div>

        {/* Right: Code + Preview */}
        <div className={styles.rightArea}>
          {/* Tab Bar */}
          <div className={styles.tabBar}>
            <button
              className={`${styles.tab} ${activeTab === 'split' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('split')}
              id="tab-split"
            >
              ◧ Split View
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'code' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('code')}
              id="tab-code"
            >
              📝 Code
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'preview' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('preview')}
              id="tab-preview"
            >
              👁️ Preview
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === 'split' && (
              <div className={styles.splitView}>
                <div className={styles.splitLeft}>
                  <CodePanel code={currentCode} componentList={componentList} />
                </div>
                <div className={styles.splitRight}>
                  <PreviewPanel
                    components={previewComponents}
                    layout={previewLayout}
                    version={currentVersion}
                    error={previewError}
                  />
                </div>
              </div>
            )}
            {activeTab === 'code' && (
              <CodePanel code={currentCode} componentList={componentList} />
            )}
            {activeTab === 'preview' && (
              <PreviewPanel
                components={previewComponents}
                layout={previewLayout}
                version={currentVersion}
                error={previewError}
              />
            )}
          </div>
        </div>
      </div>

      {/* Version History Modal */}
      <VersionHistory
        isOpen={showVersionHistory}
        onClose={() => setShowVersionHistory(false)}
        versions={versions}
        currentVersion={currentVersion}
        onRollback={handleRollback}
      />
    </div>
  );
}