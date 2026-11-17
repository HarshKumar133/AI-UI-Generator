'use client';

import { useEffect, useState } from 'react';
import LivePreview from '@/components/preview/LivePreview';

interface SharedPayload {
  project: {
    title: string;
    updatedAt: string;
  };
  version: {
    versionNumber: number;
    source: string;
    sourceType: 'tsx' | 'html' | 'expo';
    metadata: unknown;
  };
}

interface SharedPageProps {
  params: Promise<{ token: string }>;
}

function getExpoPreview(metadata: unknown): string | undefined {
  if (!metadata || typeof metadata !== 'object') return undefined;
  const artifact = (metadata as { previewArtifact?: unknown }).previewArtifact;
  if (!artifact || typeof artifact !== 'object') return undefined;
  const candidate = artifact as { kind?: unknown; content?: unknown };
  return candidate.kind === 'html' && typeof candidate.content === 'string' ? candidate.content : undefined;
}

export default function SharedProjectPage({ params }: SharedPageProps) {
  const [project, setProject] = useState<SharedPayload>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let active = true;
    void params.then(async ({ token }) => {
      try {
        const response = await fetch(`/api/share/${token}`);
        const payload = await response.json();
        if (!response.ok || !payload.success) throw new Error(payload.error || 'This shared project is unavailable.');
        if (active) setProject(payload.data as SharedPayload);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'This shared project is unavailable.');
      }
    });
    return () => { active = false; };
  }, [params]);

  const previewHtml = project?.version.sourceType === 'expo' ? getExpoPreview(project.version.metadata) : undefined;
  const isHtml = project?.version.sourceType === 'html' || Boolean(previewHtml);
  const source = previewHtml || project?.version.source || '';

  return (
    <main style={{ minHeight: '100vh', background: '#fffaf5', color: '#15120f', padding: 'clamp(14px, 3vw, 36px)' }}>
      <section style={{ width: 'min(1280px, 100%)', minHeight: 'calc(100vh - clamp(28px, 6vw, 72px))', margin: '0 auto', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(21,18,15,0.12)', borderRadius: 20, background: '#fffdf9', boxShadow: '0 24px 80px rgba(30,20,14,0.12)' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid rgba(21,18,15,0.09)', padding: '15px 18px', background: 'rgba(255,255,255,0.84)' }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: '#da4f2f', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.11em', textTransform: 'uppercase' }}>SimplyUI shared preview</div>
            <h1 style={{ overflow: 'hidden', margin: '4px 0 0', color: '#15120f', fontSize: '1rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project?.project.title || 'Loading project…'}</h1>
          </div>
          {project && <span style={{ flexShrink: 0, color: '#766f66', fontSize: '0.76rem' }}>v{project.version.versionNumber}</span>}
        </header>
        <div style={{ flex: 1, minHeight: 460 }}>
          {error ? (
            <div style={{ display: 'grid', height: '100%', minHeight: 460, placeItems: 'center', padding: 28, color: '#9d3524', textAlign: 'center' }}>{error}</div>
          ) : project ? (
            <LivePreview code={source} outputMode={isHtml ? 'html' : 'tsx'} title={project.project.title} />
          ) : (
            <div style={{ display: 'grid', height: '100%', minHeight: 460, placeItems: 'center', color: '#766f66', fontSize: '0.85rem' }}>Loading preview…</div>
          )}
        </div>
      </section>
    </main>
  );
}
