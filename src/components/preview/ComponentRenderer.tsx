'use client';

import React from 'react';
import { ComponentNode, ComponentType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Modal } from '@/components/ui/Modal';
import { Sidebar } from '@/components/ui/Sidebar';
import { Navbar } from '@/components/ui/Navbar';
import { Chart } from '@/components/ui/Chart';

// Map component names to actual React components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyComponent = React.FC<any>;

const COMPONENT_MAP: Record<ComponentType, AnyComponent> = {
    Button: Button as AnyComponent,
    Card: Card as AnyComponent,
    Input: Input as AnyComponent,
    Table: Table as AnyComponent,
    Modal: Modal as AnyComponent,
    Sidebar: Sidebar as AnyComponent,
    Navbar: Navbar as AnyComponent,
    Chart: Chart as AnyComponent,
};

interface ComponentRendererProps {
    nodes: ComponentNode[];
    layout: string;
}

// Render a single component node recursively
function renderNode(node: ComponentNode | string, index: number): React.ReactNode {
    if (typeof node === 'string') {
        return node;
    }

    if (!node || typeof node !== 'object' || !node.type) {
        return null;
    }

    const Component = COMPONENT_MAP[node.type];
    if (!Component) {
        return (
            <div key={index} style={{ color: '#f87171', padding: '8px', fontSize: '0.8rem' }}>
                ⚠️ Unknown component: {String(node.type)}
            </div>
        );
    }

    // Process children safely
    const children = Array.isArray(node.children)
        ? node.children.map((child, i) => renderNode(child, i))
        : undefined;

    // Normalize props — ensure it's a plain object
    const props = { ...(node.props && typeof node.props === 'object' ? node.props : {}) };

    // Special handling for Modal — always show in preview
    if (node.type === 'Modal') {
        props.isOpen = true;
        props.onClose = () => { };
    }

    try {
        return (
            <Component key={index} {...props}>
                {children}
            </Component>
        );
    } catch {
        return (
            <div key={index} style={{ color: '#f87171', padding: '8px', fontSize: '0.8rem' }}>
                ⚠️ Error rendering: {node.type}
            </div>
        );
    }
}

// Get layout styles based on layout type
function getLayoutStyle(layout: string): React.CSSProperties {
    const styles: Record<string, React.CSSProperties> = {
        'single-column': {
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            padding: '24px',
            maxWidth: '800px',
            margin: '0 auto',
        },
        'two-column': {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            padding: '24px',
        },
        'sidebar-layout': {
            display: 'flex',
            height: '100%',
            minHeight: '400px',
        },
        'dashboard': {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '400px',
        },
        'centered': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '24px',
        },
        'full-width': {
            width: '100%',
            padding: '24px',
        },
    };

    return styles[layout] || styles['single-column'];
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ nodes, layout }) => {
    if (!nodes || nodes.length === 0) {
        return null;
    }

    // For sidebar-layout, render Sidebar separately from main content
    if (layout === 'sidebar-layout') {
        const sidebarNode = nodes.find(n => typeof n !== 'string' && n.type === 'Sidebar');
        const otherNodes = nodes.filter(n => typeof n === 'string' || n.type !== 'Sidebar');

        return (
            <div style={getLayoutStyle(layout)}>
                {sidebarNode && renderNode(sidebarNode, -1)}
                <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {otherNodes.map((node, i) => renderNode(node, i))}
                    </div>
                </main>
            </div>
        );
    }

    // For dashboard, render Navbar at top, then grid of other components
    if (layout === 'dashboard') {
        const navbarNode = nodes.find(n => typeof n !== 'string' && n.type === 'Navbar');
        const otherNodes = nodes.filter(n => typeof n === 'string' || n.type !== 'Navbar');

        return (
            <div style={getLayoutStyle(layout)}>
                {navbarNode && renderNode(navbarNode, -1)}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '16px',
                        padding: '24px',
                    }}
                >
                    {otherNodes.map((node, i) => renderNode(node, i))}
                </div>
            </div>
        );
    }

    return (
        <div style={getLayoutStyle(layout)}>
            {nodes.map((node, i) => renderNode(node, i))}
        </div>
    );
};