import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

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

    return (
      <div
        className="min-h-screen w-full bg-black text-neutral-100 font-body flex items-center justify-center px-5"
        style={{ '--accent': '#FFC939' }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Inter:wght@400;500;600&display=swap');
          .font-display { font-family: 'Rajdhani', sans-serif; }
          .font-body { font-family: 'Inter', sans-serif; }
        `}</style>
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 mx-auto mb-5 flex items-center justify-center border border-[var(--accent)] rounded-full">
            <AlertTriangle size={24} className="text-[var(--accent)]" />
          </div>
          <div className="font-display text-xl font-bold uppercase tracking-wide text-white mb-2">Something went wrong</div>
          <p className="text-sm text-neutral-400 font-body mb-6 leading-relaxed">
            Scope hit an unexpected error. Reloading the page usually fixes it — your data hasn't been lost.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[var(--accent)] text-black font-display font-bold uppercase text-xs tracking-wide px-5 py-2.5 hover:opacity-90 transition-opacity"
          >
            Reload Scope
          </button>
        </div>
      </div>
    );
  }
}
