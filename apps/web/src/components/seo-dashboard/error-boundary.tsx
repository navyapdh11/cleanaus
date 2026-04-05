'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface SEOErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface SEOErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export class SEOErrorBoundary extends React.Component<SEOErrorBoundaryProps, SEOErrorBoundaryState> {
  constructor(props: SEOErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): SEOErrorBoundaryState {
    return { hasError: true, error, retryCount: 0 };
  }

  retry = () => {
    this.setState({ hasError: false, error: null, retryCount: this.state.retryCount + 1 });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900">Component Error</h3>
              <p className="mt-1 text-sm text-red-700">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              {this.state.retryCount < 3 && (
                <button
                  onClick={this.retry}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-900"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry ({this.state.retryCount + 1}/3)
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
