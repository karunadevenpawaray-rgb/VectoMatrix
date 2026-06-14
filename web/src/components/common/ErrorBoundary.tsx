"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-[family-name:var(--font-outfit)]">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-[0_20px_50px_-20px_rgba(0,0,0,0.12)] border border-slate-100 text-center">
            <span className="text-5xl block mb-6">⚠️</span>
            <h2 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tight">Something went wrong</h2>
            <p className="text-slate-500 mb-6 text-sm">
              We encountered an unexpected error on this page. Our technical team has been notified.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-[#ea580c] text-white font-black px-6 py-3 rounded-full hover:bg-orange-600 transition-colors shadow-lg shadow-orange-600/30"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
