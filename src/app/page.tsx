'use client';

import React, { useState, useCallback, useRef } from 'react';
import styles from '@/styles/components/appLayout.module.css';
import { ChatPanel } from '@/components/layout/ChatPanel';
import { CodePanel } from '@/components/layout/CodePanel';
import { VersionHistory } from '@/components/layout/VersionHistory';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { ChatMessage, GenerationResult, ComponentNode, ComponentType, VersionEntry } from '@/types';
import { Template } from '@/lib/templates';
import {
  Sparkles,
  PanelLeft,
  Code2,
  Eye,
  Clock,
  RotateCcw,
  Trash2,
} from 'lucide-react';

type ViewTab = 'split' | 'code' | 'preview';

// Keywords that suggest an interactive app (should use full HTML mode)
const INTERACTIVE_APP_KEYWORDS = [
  'calculator', 'game', 'todo', 'to-do', 'timer', 'stopwatch', 'countdown',
  'quiz', 'pomodoro', 'markdown editor', 'text editor', 'notepad', 'paint',
  'drawing', 'canvas', 'snake', 'tetris', 'memory game', 'flashcard',
  'currency converter', 'unit converter', 'password generator', 'color picker',
  'random', 'generator', 'app that', 'app which', 'working', 'functional',
  'interactive', 'click', 'button that', 'form that', 'tool',
];

function detectFullAppMode(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return INTERACTIVE_APP_KEYWORDS.some(kw => lower.includes(kw));
}

export default function Home() {
  // Generation state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentCode, setCurrentCode] = useState('');
  const [currentHtml, setCurrentHtml] = useState(''); // for full-app HTML mode
  const [outputMode, setOutputMode] = useState<'tsx' | 'html' | 'nextjs'>('tsx');
  const [previewKey, setPreviewKey] = useState(0); // increments to force iframe reload
  const [componentList, setComponentList] = useState<ComponentType[]>([]);
  const [previewComponents, setPreviewComponents] = useState<ComponentNode[]>([]);
  const [previewLayout, setPreviewLayout] = useState('single-column');
  const [currentVersion, setCurrentVersion] = useState<number | null>(null);
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>('split');
  const [previewError, setPreviewError] = useState<string | undefined>();
  const [currentTitle, setCurrentTitle] = useState('');

  const versionCounterRef = useRef(0);

  // Write TSX to disk so Next.js can compile it natively
  const writePreviewFile = useCallback(async (code: string) => {
    try {
      await fetch('/api/write-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      setPreviewKey(k => k + 1); // triggers LivePreview reload
    } catch (e) {
      console.warn('[writePreviewFile] Failed:', e);
    }
  }, []);

  // Apply TSX generation result (existing pipeline)
  const applyGenerationResult = useCallback((result: GenerationResult) => {
    setCurrentCode(result.generation.code);
    setCurrentHtml('');
    setOutputMode('nextjs'); // use Next.js native compilation
    setComponentList(result.generation.componentList);
    setPreviewComponents(result.plan.components);
    setPreviewLayout(result.plan.layout);
    setCurrentVersion(result.version);
    setPreviewError(undefined);
    setCurrentTitle(result.userPrompt);

    if (result.version > versionCounterRef.current) {
      versionCounterRef.current = result.version;
    }

    // Write to disk for Next.js live preview (fire-and-forget)
    writePreviewFile(result.generation.code);

    setVersions(prev => {
      if (prev.some(v => v.version === result.version)) return prev;
      return [...prev, {
        version: result.version,
        code: result.generation.code,
        prompt: result.userPrompt,
        plan: result.plan,
        explanation: result.explanation,
        timestamp: result.timestamp,
      }];
    });
  }, [writePreviewFile]);

  // Apply full HTML app result
  const applyHtmlResult = useCallback((html: string, title: string) => {
    versionCounterRef.current += 1;
    setCurrentHtml(html);
    setCurrentCode('');
    setOutputMode('html');
    setPreviewComponents([]);
    setCurrentVersion(versionCounterRef.current);
    setPreviewError(undefined);
    setCurrentTitle(title);
  }, []);

  // Load template (instant — no API)
  const handleLoadTemplate = useCallback((template: Template) => {
    versionCounterRef.current += 1;
    const nextVersion = versionCounterRef.current;
    const result = { ...template.result, version: nextVersion, timestamp: new Date().toISOString() };
    applyGenerationResult(result);

    const userMsg: ChatMessage = { id: `user-tpl-${Date.now()}`, role: 'user', content: `📐 Template: ${template.name}`, timestamp: new Date().toISOString() };
    const assistantMsg: ChatMessage = { id: `assistant-tpl-${Date.now()}`, role: 'assistant', content: result.explanation.explanation, timestamp: new Date().toISOString(), generationResult: result };
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setActiveTab('preview');
  }, [applyGenerationResult]);

  // ── MAIN SEND HANDLER ──
  const handleSendMessage = useCallback(async (message: string) => {
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: message, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Detect whether to use full-app mode or component mode
      const useFullApp = detectFullAppMode(message) && !currentCode;

      if (useFullApp) {
        // ── FULL HTML APP MODE ──
        const response = await fetch('/api/generate-app', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: message }),
        });
        const data = await response.json();
        if (data.success && data.data?.html) {
          applyHtmlResult(data.data.html, data.data.title || message);
          const assistantMsg: ChatMessage = {
            id: `assistant-${Date.now()}`, role: 'assistant',
            content: `✅ Built your **${data.data.title || message}** — a fully working app! You can interact with it in the Preview panel. Click **↓ Download** to save the HTML file.`,
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, assistantMsg]);
          setActiveTab('preview');
        } else {
          throw new Error(data.error || 'Full-app generation failed');
        }
      } else if (currentCode || currentHtml) {
        // ── MODIFY MODE (existing pipeline) ──
        const response = await fetch('/api/modify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: message, currentCode: currentCode || '// empty', currentVersion: currentVersion || 0, previousLayout: previewLayout, previousComponentList: componentList }),
        });
        const data = await response.json();
        if (data.success && data.data) {
          applyGenerationResult(data.data as GenerationResult);
          const assistantMsg: ChatMessage = { id: `assistant-${Date.now()}`, role: 'assistant', content: (data.data as GenerationResult).explanation.explanation, timestamp: new Date().toISOString(), generationResult: data.data };
          setMessages(prev => [...prev, assistantMsg]);
        } else throw new Error(data.error || 'Modification failed');
      } else {
        // ── COMPONENT/LAYOUT GENERATION MODE ──
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: message }),
        });
        const data = await response.json();
        if (data.success && data.data) {
          const result = data.data as GenerationResult;
          applyGenerationResult(result);
          const assistantMsg: ChatMessage = { id: `assistant-${Date.now()}`, role: 'assistant', content: result.explanation.explanation, timestamp: new Date().toISOString(), generationResult: result };
          setMessages(prev => [...prev, assistantMsg]);
          setActiveTab('preview');
        } else throw new Error(data.error || 'Generation failed');
      }
    } catch (error) {
      const errorMsg: ChatMessage = { id: `error-${Date.now()}`, role: 'assistant', content: `Error: ${error instanceof Error ? error.message : 'Generation failed. Please try again.'}`, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [currentCode, currentHtml, currentVersion, applyGenerationResult, applyHtmlResult, previewLayout, componentList]);

  const handleRollback = useCallback(async (targetVersion: number) => {
    const version = versions.find(v => v.version === targetVersion);
    if (!version) return;
    setCurrentCode(version.code);
    setCurrentHtml('');
    setOutputMode('tsx');
    setPreviewComponents(version.plan.components);
    setPreviewLayout(version.plan.layout);
    setCurrentVersion(version.version);
    setPreviewError(undefined);
    setShowVersionHistory(false);
    setMessages(prev => [...prev, { id: `system-${Date.now()}`, role: 'assistant', content: `Rolled back to version ${targetVersion}. Original prompt: "${version.prompt}"`, timestamp: new Date().toISOString() }]);
  }, [versions]);

  const handleRegenerate = useCallback(async () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;
    setCurrentCode('');
    setCurrentHtml('');
    setCurrentVersion(null);
    handleSendMessage(lastUserMsg.content);
  }, [messages, handleSendMessage]);

  const handleClear = useCallback(() => {
    setMessages([]);
    setCurrentCode('');
    setCurrentHtml('');
    setOutputMode('tsx');
    setComponentList([]);
    setPreviewComponents([]);
    setPreviewLayout('single-column');
    setCurrentVersion(null);
    setVersions([]);
    setPreviewError(undefined);
    setCurrentTitle('');
  }, []);

  const hasOutput = !!(currentCode || currentHtml);

  return (
    <div className={styles.appContainer}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarBrand}>
          <Sparkles size={18} className={styles.topBarIcon} />
          SimplyUI
          <span className={styles.topBarBrandSub}>Describe it. Build it.</span>
        </div>
        <div className={styles.topBarActions}>
          {currentVersion !== null && (
            <span className={styles.versionTag}>v{currentVersion}</span>
          )}
          {outputMode === 'html' && (
            <span className={styles.versionTag} style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>⚡ Full App</span>
          )}
          {versions.length > 0 && (
            <button className={styles.topBarButton} onClick={() => setShowVersionHistory(true)} id="history-button">
              <Clock size={13} /> History ({versions.length})
            </button>
          )}
          {versions.length > 1 && (
            <select className={styles.topBarButton} onChange={(e) => handleRollback(Number(e.target.value))} value="" id="version-select">
              <option value="" disabled>Rollback</option>
              {versions.map((v, idx) => (
                <option key={`opt-${idx}-${v.version}`} value={v.version}>v{v.version} — {v.prompt.slice(0, 30)}...</option>
              ))}
            </select>
          )}
          {hasOutput && (
            <button className={styles.topBarButton} onClick={handleRegenerate} disabled={isLoading} id="regenerate-button">
              <RotateCcw size={13} /> Regenerate
            </button>
          )}
          <button className={`${styles.topBarButton} ${styles.topBarButtonDanger}`} onClick={handleClear} id="clear-button">
            <Trash2 size={13} /> Clear
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
            onLoadTemplate={handleLoadTemplate}
            isLoading={isLoading}
            hasCode={hasOutput}
          />
        </div>

        {/* Right: Code + Preview */}
        <div className={styles.rightArea}>
          {/* Tab Bar */}
          <div className={styles.tabBar}>
            <button className={`${styles.tab} ${activeTab === 'split' ? styles.tabActive : ''}`} onClick={() => setActiveTab('split')} id="tab-split">
              <PanelLeft size={14} /> Split View
            </button>
            <button className={`${styles.tab} ${activeTab === 'code' ? styles.tabActive : ''}`} onClick={() => setActiveTab('code')} id="tab-code">
              <Code2 size={14} /> Code
            </button>
            <button className={`${styles.tab} ${activeTab === 'preview' ? styles.tabActive : ''}`} onClick={() => setActiveTab('preview')} id="tab-preview">
              <Eye size={14} /> Preview
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {activeTab === 'split' && (
              <div className={styles.splitView}>
                <div className={styles.splitLeft}>
                  <CodePanel code={currentCode || (currentHtml ? `<!-- Full App HTML -->\n${currentHtml.slice(0, 2000)}...` : '')} componentList={componentList} />
                </div>
                <div className={styles.splitRight}>
                  <PreviewPanel
                    key={previewKey}
                    components={previewComponents}
                    layout={previewLayout}
                    version={currentVersion}
                    error={previewError}
                    code={currentCode || undefined}
                    htmlOutput={currentHtml || undefined}
                    outputMode={outputMode}
                    title={currentTitle}
                  />
                </div>
              </div>
            )}
            {activeTab === 'code' && (
              <CodePanel code={currentCode || (currentHtml ? `<!-- Full App HTML (${currentHtml.length} chars) -->\n${currentHtml.slice(0, 3000)}...` : '')} componentList={componentList} />
            )}
            {activeTab === 'preview' && (
              <PreviewPanel
                key={previewKey}
                components={previewComponents}
                layout={previewLayout}
                version={currentVersion}
                error={previewError}
                code={currentCode || undefined}
                htmlOutput={currentHtml || undefined}
                outputMode={outputMode}
                title={currentTitle}
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