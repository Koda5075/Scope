import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STEPS = [
  { target: 'highlights', titleKey: 'tourStep1Title', descKey: 'tourStep1Desc' },
  { target: 'search', titleKey: 'tourStep2Title', descKey: 'tourStep2Desc' },
  { target: 'tabs', titleKey: 'tourStep3Title', descKey: 'tourStep3Desc' },
  { target: 'scope-plus-tab', titleKey: 'tourStep4Title', descKey: 'tourStep4Desc' },
];

const STORAGE_KEY = 'scope-onboarding-seen';

export default function OnboardingTour({ t }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== 'true') setVisible(true);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    const el = document.querySelector(`[data-tour="${STEPS[step].target}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('tour-highlight');
    }
    return () => {
      if (el) el.classList.remove('tour-highlight');
    };
  }, [visible, step]);

  function finish() {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch { /* ignore */ }
  }

  function next() {
    if (step === STEPS.length - 1) finish();
    else setStep((s) => s + 1);
  }

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92vw] max-w-sm sc-card pointer-events-auto shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[10px] text-neutral-500">{step + 1} / {STEPS.length}</span>
          <button onClick={finish} aria-label={t.tourSkip} className="text-neutral-600 hover:text-neutral-300 transition-colors">
            <X size={14} />
          </button>
        </div>
        <div className="font-display text-sm text-white mb-1">{t[current.titleKey]}</div>
        <p className="text-xs text-neutral-400 font-body leading-relaxed mb-4">{t[current.descKey]}</p>
        <div className="flex items-center justify-between">
          <button onClick={finish} className="text-[11px] font-body text-neutral-500 hover:text-neutral-300 transition-colors">
            {t.tourSkip}
          </button>
          <button onClick={next} className="bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-4 py-1.5 hover:opacity-90 transition-opacity">
            {isLast ? t.tourDone : t.tourNext}
          </button>
        </div>
      </div>
    </div>
  );
}
