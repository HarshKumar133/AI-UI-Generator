'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';

// Dynamically import the generated UI — no SSR (it's always a client component)
// The key prop forces a remount when the file version changes
const GeneratedUI = dynamic(
    () => import('@/generated/GeneratedUI').catch(() => {
        return {
            default: () => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fffdf9', color: '#d43d31', fontFamily: 'system-ui', fontSize: '0.85rem', flexDirection: 'column', gap: 12 }}>
                    <div style={{ fontSize: '1.5rem' }}>⚠️</div>
                    <div>Component failed to load — check for syntax errors.</div>
                </div>
            )
        };
    }),
    {
        ssr: false,
        loading: () => (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fffdf9', color: '#8a7e72', fontFamily: 'system-ui', fontSize: '0.85rem', gap: 10 }}>
                <span>Compiling…</span>
            </div>
        ),
    }
);

export default function PreviewPage() {
    const [renderKey, setRenderKey] = useState(0);

    // Listen for postMessage from parent to trigger re-render after file write
    useEffect(() => {
        const handler = (e: MessageEvent) => {
            if (e.data?.type === 'RELOAD_PREVIEW') {
                setRenderKey(k => k + 1);
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#fffdf9', color: '#15120f' }}>
            <GeneratedUI key={renderKey} />
        </div>
    );
}
