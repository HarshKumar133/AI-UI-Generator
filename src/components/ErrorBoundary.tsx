'use client';

import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: '24px',
          textAlign: 'center',
          color: '#f87171',
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚠️</div>
          <div style={{ fontWeight: 600, marginBottom: '4px' }}>Preview Error</div>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            {this.state.error?.message || 'An error occurred while rendering the preview.'}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: '12px',
              padding: '6px 16px',
              border: '1px solid #334155',
              borderRadius: '6px',
              background: 'transparent',
              color: '#e2e8f0',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            🔄 Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}