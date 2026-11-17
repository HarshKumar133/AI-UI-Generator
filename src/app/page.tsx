'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import styles from '@/styles/components/appLayout.module.css';
import { ChatPanel } from '@/components/layout/ChatPanel';
import { CodePanel } from '@/components/layout/CodePanel';
import { VersionHistory } from '@/components/layout/VersionHistory';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { AuthControls } from '@/components/layout/AuthControls';
import { ChatMessage, GenerationResult, VersionEntry, AgentEventState, GenerationMode, GenerationTarget, ConversationTurn, ExplainerOutput, PlannerOutput, PreviewArtifact } from '@/types';
import {
  Sparkles,
  PanelLeft,
  Code2,
  Eye,
  Clock,
  RotateCcw,
  Trash2,
  FolderOpen,
  Link2,
  X,
  Plus,
  Pencil,
  Check,
} from 'lucide-react';

type ViewTab = 'split' | 'code' | 'preview';
const WORKSPACE_STORAGE_KEY = 'simply-ui-workspace-v1';
const AUTH_SESSION_USER_KEY = 'simply-ui-auth-session-user-v1';
const PENDING_ARCHIVES_STORAGE_KEY = 'simply-ui-pending-archives-v1';

interface SavedWorkspaceState {
  messages: ChatMessage[];
  currentCode: string;
  currentHtml: string;
  outputMode: 'tsx' | 'html';
  componentList: string[];
  previewLayout: string;
  currentMode: GenerationMode;
  currentTarget: GenerationTarget;
  currentVersion: number | null;
  currentTitle: string;
  projectId?: string;
  activeTab: ViewTab;
}

interface ProjectSummary {
  id: string;
  title: string;
  currentVersion: number;
  updatedAt: string;
}

interface StoredProjectVersion {
  versionNumber: number;
  prompt: string;
  source: string;
  sourceType: 'tsx' | 'html' | 'expo';
  metadata: unknown;
  createdAt: string;
}

interface StoredProjectDetail {
  project: {
    id: string;
    title: string;
    currentVersion: number;
    sourceType: 'tsx' | 'html' | 'expo';
  };
  version?: StoredProjectVersion;
  versions: StoredProjectVersion[];
  messages: Array<Pick<ChatMessage, 'role' | 'content' | 'timestamp'> & { id: string }>;
}

interface StoredVersionMetadata {
  componentList?: unknown;
  explanation?: ExplainerOutput;
  mode?: GenerationMode;
  plan?: PlannerOutput;
  previewArtifact?: PreviewArtifact;
  target?: GenerationTarget;
}

const STANDALONE_HTML_KEYWORDS = [
  'single html',
  'standalone html',
  'one html file',
  'plain html app',
  'download html',
];

function detectStandaloneHtmlMode(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return STANDALONE_HTML_KEYWORDS.some((kw) => lower.includes(kw));
}

function buildConversationContext(messages: ChatMessage[], latestPrompt: string): ConversationTurn[] {
  const recentTurns = messages
    .filter((entry) => !entry.content.startsWith('Error:'))
    .slice(-9)
    .map(({ role, content }) => ({ role, content }));

  return [...recentTurns, { role: 'user' as const, content: latestPrompt }].slice(-10);
}

function toKebabCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'generated-app';
}

function asStoredMetadata(value: unknown): StoredVersionMetadata {
  return value && typeof value === 'object' ? value as StoredVersionMetadata : {};
}

function toVersionEntry(version: StoredProjectVersion): VersionEntry {
  const metadata = asStoredMetadata(version.metadata);
  return {
    version: version.versionNumber,
    code: version.source,
    sourceType: version.sourceType,
    previewHtml: metadata.previewArtifact?.kind === 'html' ? metadata.previewArtifact.content : undefined,
    prompt: version.prompt,
    plan: metadata.plan ?? { layout: 'single-column', reasoning: 'Saved project version.' },
    explanation: metadata.explanation ?? { explanation: 'Saved project version.', componentChoices: [], layoutReason: '' },
    timestamp: version.createdAt,
  };
}

async function archiveWorkspaceOnSignIn(saved: Partial<SavedWorkspaceState>): Promise<void> {
  if (saved.projectId || (!saved.currentCode && !saved.currentHtml)) return;
  const messages = Array.isArray(saved.messages) ? saved.messages : [];
  const latestPrompt = [...messages].reverse().find((message) => message.role === 'user')?.content || 'Saved workspace';
  const assistantMessage = [...messages].reverse().find((message) => message.role === 'assistant')?.content;
  const source = saved.currentHtml || saved.currentCode || '';
  const sourceType = saved.currentHtml ? 'html' : saved.currentTarget === 'expo-rn' ? 'expo' : 'tsx';

  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: saved.currentTitle || latestPrompt,
      prompt: latestPrompt,
      source,
      sourceType,
      assistantMessage,
      metadata: {
        mode: saved.currentMode || 'creative',
        target: saved.currentTarget || 'web',
      },
    }),
  });
  if (!response.ok) throw new Error('Could not archive the previous workspace.');
}

function queuePendingArchive(saved: Partial<SavedWorkspaceState>): void {
  try {
    const queued = JSON.parse(sessionStorage.getItem(PENDING_ARCHIVES_STORAGE_KEY) || '[]') as Partial<SavedWorkspaceState>[];
    sessionStorage.setItem(PENDING_ARCHIVES_STORAGE_KEY, JSON.stringify([...queued.slice(-4), saved]));
  } catch (error) {
    console.warn('[workspace] Could not queue the previous workspace:', error);
  }
}

async function flushPendingArchives(): Promise<void> {
  const queued = JSON.parse(sessionStorage.getItem(PENDING_ARCHIVES_STORAGE_KEY) || '[]') as Partial<SavedWorkspaceState>[];
  if (!Array.isArray(queued) || queued.length === 0) return;
  const unsaved: Partial<SavedWorkspaceState>[] = [];
  for (const workspace of queued) {
    try {
      await archiveWorkspaceOnSignIn(workspace);
    } catch {
      unsaved.push(workspace);
    }
  }
  if (unsaved.length === 0) sessionStorage.removeItem(PENDING_ARCHIVES_STORAGE_KEY);
  else sessionStorage.setItem(PENDING_ARCHIVES_STORAGE_KEY, JSON.stringify(unsaved));
}

export default function Home() {
  if (/^pk_(test|live)_[A-Za-z0-9]+$/.test(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '')) {
    return <AuthenticatedHome />;
  }
  return <WorkspaceHome isAuthLoaded isSignedIn />;
}

function AuthenticatedHome() {
  const { isLoaded: isAuthLoaded, isSignedIn, userId } = useAuth();
  return <WorkspaceHome isAuthLoaded={isAuthLoaded} isSignedIn={isSignedIn} userId={userId} />;
}

function WorkspaceHome({ isAuthLoaded, isSignedIn, userId }: { isAuthLoaded: boolean; isSignedIn: boolean | undefined; userId?: string | null }) {
  // Generation state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentCode, setCurrentCode] = useState('');
  const [currentHtml, setCurrentHtml] = useState(''); // for full-app HTML mode
  const [outputMode, setOutputMode] = useState<'tsx' | 'html'>('tsx');
  const [componentList, setComponentList] = useState<string[]>([]);
  const [previewLayout, setPreviewLayout] = useState('single-column');
  const [currentMode, setCurrentMode] = useState<GenerationMode>('creative');
  const [currentTarget, setCurrentTarget] = useState<GenerationTarget>('web');
  const [downloadPayload, setDownloadPayload] = useState<{ filename: string; content: string; mimeType?: string; label?: string } | undefined>(undefined);
  const [currentVersion, setCurrentVersion] = useState<number | null>(null);
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>('split');
  const [previewError, setPreviewError] = useState<string | undefined>();
  const [currentTitle, setCurrentTitle] = useState('');
  const [projectId, setProjectId] = useState<string>();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isProjectLibraryOpen, setIsProjectLibraryOpen] = useState(false);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [shareStatus, setShareStatus] = useState<string>();
  const [isRenamingProject, setIsRenamingProject] = useState(false);
  const [projectNameDraft, setProjectNameDraft] = useState('');
  const [isSavingProjectName, setIsSavingProjectName] = useState(false);
  const [activeAgents, setActiveAgents] = useState<AgentEventState[]>([]);
  const [workspaceRestored, setWorkspaceRestored] = useState(false);

  const versionCounterRef = useRef(0);

  useEffect(() => {
    if (!isAuthLoaded) return;
    let active = true;

    const restore = async () => {
      try {
        const stored = sessionStorage.getItem(WORKSPACE_STORAGE_KEY);
        const saved = stored ? JSON.parse(stored) as Partial<SavedWorkspaceState> : undefined;
        const previousUserId = sessionStorage.getItem(AUTH_SESSION_USER_KEY);
        const isNewLogin = Boolean(isSignedIn && userId && previousUserId !== userId);

        if (isSignedIn && userId) await flushPendingArchives();

        if (isNewLogin) {
          if (saved) {
            try {
              await archiveWorkspaceOnSignIn(saved);
            } catch (error) {
              console.warn('[workspace] Could not archive the previous workspace:', error);
              queuePendingArchive(saved);
            }
          }
          sessionStorage.removeItem(WORKSPACE_STORAGE_KEY);
          sessionStorage.setItem(AUTH_SESSION_USER_KEY, userId!);
          if (!active) return;
          setMessages([]);
          setCurrentCode('');
          setCurrentHtml('');
          setOutputMode('tsx');
          setComponentList([]);
          setPreviewLayout('single-column');
          setCurrentMode('creative');
          setCurrentTarget('web');
          setDownloadPayload(undefined);
          setCurrentVersion(null);
          setVersions([]);
          setPreviewError(undefined);
          setCurrentTitle('');
          setProjectId(undefined);
          setActiveTab('split');
          versionCounterRef.current = 0;
        } else if (saved) {
        if (Array.isArray(saved.messages)) setMessages(saved.messages);
        if (typeof saved.currentCode === 'string') setCurrentCode(saved.currentCode);
        if (typeof saved.currentHtml === 'string') setCurrentHtml(saved.currentHtml);
        if (saved.outputMode === 'tsx' || saved.outputMode === 'html') {
          setOutputMode(saved.outputMode);
        }
        if (Array.isArray(saved.componentList)) setComponentList(saved.componentList);
        if (typeof saved.previewLayout === 'string') setPreviewLayout(saved.previewLayout);
        if (saved.currentMode === 'creative' || saved.currentMode === 'deterministic') setCurrentMode(saved.currentMode);
        if (saved.currentTarget === 'web' || saved.currentTarget === 'expo-rn') setCurrentTarget(saved.currentTarget);
        if (typeof saved.currentVersion === 'number' || saved.currentVersion === null) setCurrentVersion(saved.currentVersion);
        if (typeof saved.currentTitle === 'string') setCurrentTitle(saved.currentTitle);
        if (typeof saved.projectId === 'string') setProjectId(saved.projectId);
        if (saved.activeTab === 'split' || saved.activeTab === 'code' || saved.activeTab === 'preview') {
          setActiveTab(saved.activeTab);
        }
        }
        if (!isSignedIn) sessionStorage.removeItem(AUTH_SESSION_USER_KEY);
    } catch (error) {
      console.warn('[workspace] Could not restore saved workspace:', error);
      sessionStorage.removeItem(WORKSPACE_STORAGE_KEY);
    } finally {
      if (active) setWorkspaceRestored(true);
    }
    };
    void restore();
    return () => { active = false; };
  }, [isAuthLoaded, isSignedIn, userId]);

  useEffect(() => {
    if (!workspaceRestored) return;

    if (messages.length === 0 && !currentCode && !currentHtml) {
      sessionStorage.removeItem(WORKSPACE_STORAGE_KEY);
      return;
    }

    const saved: SavedWorkspaceState = {
      messages: messages.map(({ id, role, content, timestamp }) => ({ id, role, content, timestamp })),
      currentCode,
      currentHtml,
      outputMode,
      componentList,
      previewLayout,
      currentMode,
      currentTarget,
      currentVersion,
      currentTitle,
      projectId,
      activeTab,
    };

    try {
      sessionStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(saved));
    } catch (error) {
      console.warn('[workspace] Could not save current workspace:', error);
    }
  }, [
    workspaceRestored,
    messages,
    currentCode,
    currentHtml,
    outputMode,
    componentList,
    previewLayout,
    currentMode,
    currentTarget,
    currentVersion,
    currentTitle,
    projectId,
    activeTab,
  ]);

  // Apply generation result (web or expo-rn)
  const applyGenerationResult = useCallback((result: GenerationResult) => {
    const primaryCode = result.generation.primaryCode || result.generation.code;
    const metadata = result.metadata || result.generation.metadata;
    const mode = metadata?.mode || 'creative';
    const target = metadata?.target || result.plan.target || 'web';
    const previewArtifact = result.generation.previewArtifact;

    setCurrentMode(mode);
    setCurrentTarget(target);
    setCurrentCode(primaryCode);
    setComponentList(result.generation.componentList || []);
    setPreviewLayout(result.plan.layout);
    setCurrentVersion(result.version);
    setProjectId(result.projectId);
    setPreviewError(undefined);
    setCurrentTitle(result.userPrompt);
    setDownloadPayload(undefined);

    if (target === 'expo-rn' && previewArtifact?.kind === 'html') {
      setCurrentHtml(previewArtifact.content);
      setOutputMode('html');
      setDownloadPayload({
        filename: `${toKebabCase(result.userPrompt)}-expo-bundle.txt`,
        content: primaryCode,
        mimeType: 'text/plain',
        label: '↓ Download Code',
      });
    } else {
      setCurrentHtml('');
      setOutputMode('tsx');
    }

    if (result.version > versionCounterRef.current) {
      versionCounterRef.current = result.version;
    }

    setVersions(prev => {
      if (prev.some(v => v.version === result.version)) return prev;
      return [...prev, {
        version: result.version,
        code: primaryCode,
        sourceType: target === 'expo-rn' ? 'expo' : 'tsx',
        previewHtml: previewArtifact?.kind === 'html' ? previewArtifact.content : undefined,
        prompt: result.userPrompt,
        plan: result.plan,
        explanation: result.explanation,
        timestamp: result.timestamp,
      }];
    });
  }, []);

  // Apply full HTML app result
  const applyHtmlResult = useCallback((html: string, title: string, metadata?: { mode?: GenerationMode; target?: GenerationTarget }, persisted?: { projectId?: string; version?: number; prompt?: string }) => {
    const nextVersion = persisted?.version ?? versionCounterRef.current + 1;
    versionCounterRef.current = Math.max(versionCounterRef.current, nextVersion);
    setCurrentHtml(html);
    setCurrentCode('');
    setOutputMode('html');
    setCurrentMode(metadata?.mode || 'creative');
    setCurrentTarget(metadata?.target || 'web');
    setDownloadPayload(undefined);
    setCurrentVersion(nextVersion);
    setProjectId(persisted?.projectId);
    setPreviewError(undefined);
    setCurrentTitle(title);
    setVersions((previous) => {
      if (previous.some((entry) => entry.version === nextVersion)) return previous;
      return [...previous, {
        version: nextVersion,
        code: html,
        sourceType: 'html',
        prompt: persisted?.prompt || title,
        plan: { layout: 'single-column', reasoning: 'Standalone HTML application.' },
        explanation: { explanation: 'Standalone HTML application.', componentChoices: [], layoutReason: '' },
        timestamp: new Date().toISOString(),
      }];
    });
  }, []);

  const openProjectLibrary = useCallback(async () => {
    if (!isAuthLoaded || !isSignedIn) return;
    setIsProjectLibraryOpen(true);
    setIsProjectsLoading(true);
    try {
      const response = await fetch('/api/projects');
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || 'Could not load projects.');
      setProjects(payload.data as ProjectSummary[]);
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Could not load projects.');
    } finally {
      setIsProjectsLoading(false);
    }
  }, [isAuthLoaded, isSignedIn]);

  const loadProject = useCallback(async (nextProjectId: string) => {
    setIsProjectsLoading(true);
    try {
      const response = await fetch(`/api/projects/${nextProjectId}`);
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || 'Could not load this project.');

      const detail = payload.data as StoredProjectDetail;
      const current = detail.version;
      if (!current) throw new Error('This project has no saved version yet.');
      const metadata = asStoredMetadata(current.metadata);
      const restoredVersions = detail.versions.map(toVersionEntry);
      const sourceType = current.sourceType;
      const previewHtml = metadata.previewArtifact?.kind === 'html' ? metadata.previewArtifact.content : undefined;

      setProjectId(detail.project.id);
      setCurrentTitle(detail.project.title);
      setCurrentVersion(current.versionNumber);
      versionCounterRef.current = current.versionNumber;
      setVersions(restoredVersions);
      setMessages(detail.messages.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
        timestamp: message.timestamp,
      })));
      setComponentList(Array.isArray(metadata.componentList) ? metadata.componentList.filter((item): item is string => typeof item === 'string') : []);
      setPreviewLayout(metadata.plan?.layout || 'single-column');
      setCurrentMode(metadata.mode === 'deterministic' ? 'deterministic' : 'creative');
      setCurrentTarget(metadata.target === 'expo-rn' ? 'expo-rn' : 'web');
      setPreviewError(undefined);
      setDownloadPayload(undefined);

      if (sourceType === 'html') {
        setCurrentCode('');
        setCurrentHtml(current.source);
        setOutputMode('html');
      } else if (sourceType === 'expo' && previewHtml) {
        setCurrentCode(current.source);
        setCurrentHtml(previewHtml);
        setOutputMode('html');
        setDownloadPayload({
          filename: `${toKebabCase(detail.project.title)}-expo-bundle.txt`,
          content: current.source,
          mimeType: 'text/plain',
          label: '↓ Download Code',
        });
      } else {
        setCurrentCode(current.source);
        setCurrentHtml('');
        setOutputMode('tsx');
      }

      setActiveTab('preview');
      setIsProjectLibraryOpen(false);
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Could not load this project.');
    } finally {
      setIsProjectsLoading(false);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!projectId) return;
    setShareStatus('Creating secure link…');
    try {
      const response = await fetch(`/api/projects/${projectId}/share`, { method: 'POST' });
      const payload = await response.json();
      if (!response.ok || !payload.success || typeof payload.data?.shareToken !== 'string') {
        throw new Error(payload.error || 'Could not create a share link.');
      }
      const shareUrl = `${window.location.origin}/share/${payload.data.shareToken}`;
      await navigator.clipboard?.writeText(shareUrl);
      setShareStatus('Share link copied');
    } catch (error) {
      setShareStatus(error instanceof Error ? error.message : 'Could not create a share link.');
    }
  }, [projectId]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setCurrentCode('');
    setCurrentHtml('');
    setOutputMode('tsx');
    setComponentList([]);
    setPreviewLayout('single-column');
    setCurrentMode('creative');
    setCurrentTarget('web');
    setDownloadPayload(undefined);
    setCurrentVersion(null);
    setVersions([]);
    setPreviewError(undefined);
    setCurrentTitle('');
    setProjectId(undefined);
    setShareStatus(undefined);
    setIsRenamingProject(false);
    setProjectNameDraft('');
    setActiveTab('split');
    versionCounterRef.current = 0;
  }, []);

  const startRenameProject = useCallback(() => {
    setProjectNameDraft(currentTitle || 'Untitled project');
    setIsRenamingProject(true);
  }, [currentTitle]);

  const saveProjectName = useCallback(async () => {
    const title = projectNameDraft.trim();
    if (!title) return;
    if (!projectId) {
      setCurrentTitle(title);
      setIsRenamingProject(false);
      return;
    }
    setIsSavingProjectName(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || 'Could not rename this project.');
      setCurrentTitle(payload.data.title);
      setProjects((items) => items.map((item) => item.id === projectId ? { ...item, title: payload.data.title, updatedAt: payload.data.updatedAt } : item));
      setIsRenamingProject(false);
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Could not rename this project.');
    } finally {
      setIsSavingProjectName(false);
    }
  }, [projectId, projectNameDraft]);

  // ── MAIN SEND HANDLER ──
  const handleSendMessage = useCallback(async (message: string) => {
    if (!isAuthLoaded || !isSignedIn) {
      setMessages(prev => [...prev, { id: `auth-${Date.now()}`, role: 'assistant', content: 'Error: Sign in to generate, save versions, and share your projects.', timestamp: new Date().toISOString() }]);
      return;
    }
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: 'user', content: message, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setPreviewError(undefined);
    const conversationContext = buildConversationContext(messages, message);

    try {
      const useStandaloneHtml = detectStandaloneHtmlMode(message) && !currentCode && !currentHtml;

      if (useStandaloneHtml) {
        // ── FULL HTML APP MODE ──
        const response = await fetch('/api/generate-app', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: message, projectId, currentTitle, generationMode: 'creative', targetPreference: 'web' }),
        });
        const data = await response.json();
        if (data.success && data.data?.html) {
          applyHtmlResult(data.data.html, data.data.title || message, data.data.metadata, data.data);
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
      } else if (currentCode) {
        // ── MODIFY MODE (existing pipeline) ──
        const response = await fetch('/api/modify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: message,
            projectId,
            currentCode: currentCode || '// empty',
            conversationContext,
            currentTitle,
            currentVersion: currentVersion || 0,
            previousLayout: previewLayout,
            previousComponentList: componentList,
            generationMode: currentMode,
            targetPreference: currentTarget,
            previousTarget: currentTarget,
            previousMode: currentMode,
          }),
        });
        const data = await response.json();
        if (data.success && data.data) {
          applyGenerationResult(data.data as GenerationResult);
          setCurrentTitle(currentTitle || (data.data as GenerationResult).userPrompt);
          const assistantMsg: ChatMessage = { id: `assistant-${Date.now()}`, role: 'assistant', content: (data.data as GenerationResult).explanation.explanation, timestamp: new Date().toISOString(), generationResult: data.data };
          setMessages(prev => [...prev, assistantMsg]);
        } else throw new Error(data.error || 'Modification failed');
      } else if (currentHtml) {
        // HTML-only flow continues via /generate-app
        const response = await fetch('/api/generate-app', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: message,
            currentHtml,
            projectId,
            conversationContext,
            currentTitle,
            generationMode: currentMode,
            targetPreference: currentTarget,
          }),
        });
        const data = await response.json();
        if (data.success && data.data?.html) {
          applyHtmlResult(data.data.html, data.data.title || message, data.data.metadata, data.data);
          const assistantMsg: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: 'Updated standalone HTML app generated.',
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setActiveTab('preview');
        } else {
          throw new Error(data.error || 'HTML regeneration failed');
        }
      } else {
        // ── COMPONENT/LAYOUT GENERATION MODE ──
        setActiveAgents([]);
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: message,
            currentVersion: currentVersion || 0,
            currentTitle,
            projectId,
            generationMode: 'creative',
            targetPreference: 'auto',
          }),
        });

        if (!response.body) throw new Error('No response body from server');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let buffer = '';

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            buffer += decoder.decode(value, { stream: true });
            const events = buffer.split('\n\n');
            buffer = events.pop() || ''; // Keep the incomplete remaining part in buffer

            for (const eventString of events) {
              if (eventString.startsWith('data: ')) {
                let event;
                try {
                  event = JSON.parse(eventString.replace('data: ', '').trim());
                } catch {
                  continue; // Ignore JSON parse errors from chunk fragments
                }

                if (event.type.endsWith('_start') || event.type === 'agent_start') {
                  const id = event.agentId || event.type.replace('_start', '');
                  const name = event.agentName || (id.charAt(0).toUpperCase() + id.slice(1));
                  setActiveAgents(prev => {
                    const exists = prev.find(a => a.id === id);
                    if (exists) return prev.map(a => a.id === id ? { ...a, status: 'working', message: event.message } : a);
                    return [...prev, { id, name, status: 'working', message: event.message }];
                  });
                } else if (event.type.endsWith('_done') || event.type === 'agent_done') {
                  const id = event.agentId || event.type.replace('_done', '');
                  setActiveAgents(prev => prev.map(a => a.id === id ? { ...a, status: 'done', message: event.message } : a));
                } else if (event.type === 'error') {
                  if (event.agentId) {
                    setActiveAgents(prev => prev.map(a => a.id === event.agentId ? { ...a, status: 'error', message: event.message } : a));
                    throw new Error(`Agent ${event.agentId} Error: ${event.message}`);
                  } else {
                    throw new Error(event.message);
                  }
                } else if (event.type === 'complete') {
                  const result = event.data as GenerationResult;
                  applyGenerationResult(result);
                  const assistantMsg: ChatMessage = { id: `assistant-${Date.now()}`, role: 'assistant', content: `${result.explanation.explanation}${result.persistenceWarning ? `\n\n⚠️ ${result.persistenceWarning}` : ''}`, timestamp: new Date().toISOString(), generationResult: result };
                  setMessages(prev => [...prev, assistantMsg]);
                  setActiveAgents([]);
                  setActiveTab('preview');
                }
              }
            }
          }
        }
      }
    } catch (error) {
      const errorText = error instanceof Error ? error.message : 'Generation failed. Please try again.';
      const errorMsg: ChatMessage = { id: `error-${Date.now()}`, role: 'assistant', content: `Error: ${errorText}`, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, errorMsg]);
      setPreviewError(errorText);
      setActiveAgents([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentCode,
    currentHtml,
    currentVersion,
    applyGenerationResult,
    applyHtmlResult,
    previewLayout,
    componentList,
    currentMode,
    currentTarget,
    messages,
    currentTitle,
    projectId,
    isAuthLoaded,
    isSignedIn,
  ]);

  const handleRollback = useCallback(async (targetVersion: number) => {
    const version = versions.find((entry) => entry.version === targetVersion);
    if (!version || !projectId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetVersion }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || 'Could not restore that version.');

      const savedVersion = payload.data.version as StoredProjectVersion;
      const savedEntry = toVersionEntry(savedVersion);
      versionCounterRef.current = savedEntry.version;
      setVersions((previous) => [...previous, savedEntry]);
      setCurrentVersion(savedEntry.version);
      setPreviewLayout(version.plan.layout);
      setPreviewError(undefined);
      setShowVersionHistory(false);
      setMessages((previous) => [...previous, {
        id: `system-${Date.now()}`,
        role: 'assistant',
        content: `Restored version ${targetVersion} as v${savedEntry.version}.`,
        timestamp: new Date().toISOString(),
      }]);

      if (savedEntry.sourceType === 'html') {
        setCurrentCode('');
        setCurrentHtml(savedEntry.code);
        setOutputMode('html');
      } else if (savedEntry.sourceType === 'expo' && savedEntry.previewHtml) {
        setCurrentCode(savedEntry.code);
        setCurrentHtml(savedEntry.previewHtml);
        setOutputMode('html');
        setDownloadPayload({
          filename: `${toKebabCase(currentTitle)}-expo-bundle.txt`,
          content: savedEntry.code,
          mimeType: 'text/plain',
          label: '↓ Download Code',
        });
      } else {
        setCurrentCode(savedEntry.code);
        setCurrentHtml('');
        setOutputMode('tsx');
        setDownloadPayload(undefined);
      }
    } catch (error) {
      setPreviewError(error instanceof Error ? error.message : 'Could not restore that version.');
    } finally {
      setIsLoading(false);
    }
  }, [currentTitle, projectId, versions]);

  const handleRegenerate = useCallback(async () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMsg) return;
    setCurrentCode('');
    setCurrentHtml('');
    setCurrentVersion(null);
    setDownloadPayload(undefined);
    handleSendMessage(lastUserMsg.content);
  }, [messages, handleSendMessage]);

  const handleClear = useCallback(() => {
    setMessages([]);
    setCurrentCode('');
    setCurrentHtml('');
    setOutputMode('tsx');
    setComponentList([]);
    setPreviewLayout('single-column');
    setCurrentMode('creative');
    setCurrentTarget('web');
    setDownloadPayload(undefined);
    setCurrentVersion(null);
    setVersions([]);
    setPreviewError(undefined);
    setCurrentTitle('');
    setProjectId(undefined);
    setShareStatus(undefined);
  }, []);

  const hasOutput = !!(currentCode || currentHtml);
  if (!workspaceRestored) {
    return <div role="status" aria-label="Restoring workspace" style={{ minHeight: '100vh', background: '#fffdf9' }} />;
  }

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
          {isRenamingProject ? (
            <form
              onSubmit={(event) => { event.preventDefault(); void saveProjectName(); }}
              style={{ display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <input
                autoFocus
                aria-label="Project name"
                value={projectNameDraft}
                onChange={(event) => setProjectNameDraft(event.target.value)}
                onKeyDown={(event) => { if (event.key === 'Escape') setIsRenamingProject(false); }}
                style={{ width: 180, border: '1px solid rgba(21,18,15,0.2)', borderRadius: 8, background: '#fff', color: '#15120f', font: '600 12px var(--font-sans)', padding: '6px 8px' }}
              />
              <button className={styles.topBarButton} disabled={isSavingProjectName} aria-label="Save project name" title="Save project name">
                <Check size={13} /> Save
              </button>
            </form>
          ) : (
            <button className={styles.topBarButton} onClick={startRenameProject} title="Rename project" id="rename-project-button">
              <Pencil size={13} /> {currentTitle || 'Untitled chat'}
            </button>
          )}
          <button className={styles.topBarButton} onClick={handleNewChat} disabled={isLoading} id="new-chat-button" title="Start a new chat">
            <Plus size={14} /> New chat
          </button>
          {currentVersion !== null && (
            <span className={styles.versionTag}>v{currentVersion}</span>
          )}
          <span className={styles.versionTag} style={{ background: 'rgba(21,18,15,0.08)', color: '#433d37', border: '1px solid rgba(21,18,15,0.14)' }}>
            {currentMode === 'creative' ? 'Creative' : 'Deterministic'}
          </span>
          {currentTarget === 'expo-rn' && (
            <span className={styles.versionTag} style={{ background: 'rgba(218,79,47,0.12)', color: '#da4f2f', border: '1px solid rgba(218,79,47,0.2)' }}>📱 Expo Target</span>
          )}
          {outputMode === 'html' && currentTarget === 'web' && (
            <span className={styles.versionTag} style={{ background: 'rgba(218,79,47,0.12)', color: '#da4f2f', border: '1px solid rgba(218,79,47,0.2)' }}>⚡ Full App</span>
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
          <button className={styles.topBarButton} onClick={openProjectLibrary} disabled={!isAuthLoaded || !isSignedIn || isProjectsLoading} id="projects-button">
            <FolderOpen size={13} /> Projects
          </button>
          {projectId && (
            <button className={styles.topBarButton} onClick={handleShare} disabled={isLoading} id="share-button" title="Create a private, unlisted share link">
              <Link2 size={13} /> {shareStatus || 'Share'}
            </button>
          )}
          {hasOutput && (
            <button className={styles.topBarButton} onClick={handleRegenerate} disabled={isLoading} id="regenerate-button">
              <RotateCcw size={13} /> Regenerate
            </button>
          )}
          <button className={`${styles.topBarButton} ${styles.topBarButtonDanger}`} onClick={handleClear} id="clear-button" title="Clear this chat from the screen">
            <Trash2 size={13} /> Clear
          </button>
          <AuthControls />
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
            hasCode={hasOutput}
            activeAgents={activeAgents}
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
                    version={currentVersion}
                    error={previewError}
                    code={currentCode || undefined}
                    htmlOutput={currentHtml || undefined}
                    outputMode={outputMode}
                    title={currentTitle}
                    downloadPayload={downloadPayload}
                  />
                </div>
              </div>
            )}
            {activeTab === 'code' && (
              <CodePanel code={currentCode || (currentHtml ? `<!-- Full App HTML (${currentHtml.length} chars) -->\n${currentHtml.slice(0, 3000)}...` : '')} componentList={componentList} />
            )}
            {activeTab === 'preview' && (
              <PreviewPanel
                version={currentVersion}
                error={previewError}
                code={currentCode || undefined}
                htmlOutput={currentHtml || undefined}
                outputMode={outputMode}
                title={currentTitle}
                downloadPayload={downloadPayload}
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

      {isProjectLibraryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Saved projects"
          onClick={() => setIsProjectLibraryOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'grid', placeItems: 'center', padding: 20, background: 'rgba(21,18,15,0.38)', backdropFilter: 'blur(5px)' }}
        >
          <div onClick={(event) => event.stopPropagation()} style={{ width: 'min(560px, 100%)', maxHeight: 'min(620px, 80vh)', overflow: 'auto', borderRadius: 20, border: '1px solid rgba(21,18,15,0.14)', background: '#fffdf9', boxShadow: '0 28px 90px rgba(21,18,15,0.28)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
              <div>
                <h2 style={{ margin: 0, color: '#15120f', fontSize: '1.1rem', letterSpacing: '-0.03em' }}>Saved projects</h2>
                <p style={{ margin: '4px 0 0', color: '#766f66', fontSize: '0.78rem' }}>Each generation, follow-up, and restore is kept as a version.</p>
              </div>
              <button className={styles.topBarButton} onClick={() => setIsProjectLibraryOpen(false)} aria-label="Close saved projects"><X size={15} /></button>
            </div>
            {isProjectsLoading ? (
              <p style={{ color: '#766f66', fontSize: '0.85rem', padding: '24px 0', textAlign: 'center' }}>Loading saved projects…</p>
            ) : projects.length === 0 ? (
              <p style={{ color: '#766f66', fontSize: '0.85rem', padding: '24px 0', textAlign: 'center' }}>No projects yet. Your next generation will be saved here.</p>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => loadProject(project.id)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', gap: 16, textAlign: 'left', border: '1px solid rgba(21,18,15,0.11)', borderRadius: 12, background: '#fff', color: '#15120f', padding: '13px 14px', cursor: 'pointer', font: 'inherit' }}
                  >
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 700, fontSize: '0.88rem' }}>{project.title}</span>
                      <span style={{ display: 'block', marginTop: 3, color: '#766f66', fontSize: '0.72rem' }}>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                    </span>
                    <span style={{ flexShrink: 0, color: '#da4f2f', fontSize: '0.75rem', fontWeight: 700 }}>v{project.currentVersion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
