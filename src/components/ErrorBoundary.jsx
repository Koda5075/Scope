import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
import { T } from '../i18n/translations.js';

// Reads localStorage directly rather than via props/context -- this boundary sits above
// <App>, so React state (including whatever language the app had selected) is exactly
// what may have just crashed and can't be trusted here.
function getFallbackT() {
  try {
    const saved = localStorage.getItem('scope-lang');
    return (saved && T[saved]) || T.en;
  } catch {
    return T.en;
  }
}

// Class component: React only supports catching render-time errors via
// getDerivedStateFromError/componentDidCatch, no hook equivalent exists.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Scope crashed:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const t = getFallbackT();

    return (
      <div
        className="min-h-screen w-full bg-black text-neutral-100 font-body flex items-center justify-center px-5"
        style={{ '--accent': '#FFC939' }}
      >
        <style>{`
          .font-display { font-family: 'Rajdhani', sans-serif; }
          .font-body { font-family: 'Inter', sans-serif; }
        `}</style>
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center border border-[var(--accent)] rounded-full">
            <AlertTriangle size={24} className="text-[var(--accent)]" />
          </div>
          <div className="font-display text-xl font-bold uppercase tracking-wide text-white mb-2">{t.errorTitle}</div>
          <p className="text-sm text-neutral-400 font-body mb-6 leading-relaxed">
            {t.errorBody}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[var(--accent)] text-black font-display font-bold uppercase text-xs tracking-wide px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            {t.errorReload}
          </button>
        </div>
      </div>
    );
  }
}
