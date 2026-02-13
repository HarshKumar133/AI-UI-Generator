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
const COMPONENT_MAP: Record<ComponentType, React.FC<Record<string, unknown>>> = {
  Button: Button as React.FC<Record<string, unknown>>,
  Card: Card as React.FC<Record<string, unknown>>,
  Input: Input as React.FC<Record<string, unknown>>,
  Table: Table as React.FC<Record<string, unknown>>,
  Modal: Modal as React.FC<Record<string, unknown>>,
  Sidebar: Sidebar as React.FC<Record<string, unknown>>,
  Navbar: Navbar as React.FC<Record<string, unknown>>,
  Chart: Chart as React.FC<Record<string, unknown>>,
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

  const Component = COMPONENT_MAP[node.type];
  if (!Component) {
    return (
      <div key={index} style={{ color: '#f87171', padding: '8px', fontSize: '0.8rem' }}>
        ⚠️ Unknown component: {node.type}
      </div>
    );
  }

  // Process children
  const children = node.children?.map((child, i) => renderNode(child, i));

  // Special handling for Modal — always show in preview
  const props = { ...node.props };
  if (node.type === 'Modal') {
    props.isOpen = true;
    props.onClose = () => {};
  }

  return (
    <Component key={index} {...props}>
      {children}
    </Component>
  );
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