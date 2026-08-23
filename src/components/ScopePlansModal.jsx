import { Sparkles, Check } from 'lucide-react';
import Modal from './Modal.jsx';
import { scopePlusPlans, scopePlusFeatureKeys } from '../data/mockData.js';

function fmt(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

export default function ScopePlansModal({ onClose, onChoose, t }) {
  return (
    <Modal onClose={onClose} closeLabel={t.close}>
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={16} className="text-accent" />
        <span className="font-display text-lg text-white">{t.plansTitle}</span>
      </div>
      <p className="text-xs text-neutral-500 font-body mb-5">{t.plansSubtitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {scopePlusPlans.map((plan) => (
          <div key={plan.id} className={`relative border px-4 py-4 ${plan.badge ? 'border-accent bg-neutral-900' : 'border-neutral-800 bg-neutral-950'}`}>
            {plan.badge && (
              <span className="absolute -top-2.5 left-4 bg-accent text-black text-[9px] font-display font-bold uppercase tracking-wide px-2 py-0.5">
                {t.plansBestValue}
              </span>
            )}
            <div className="font-display text-sm text-white uppercase tracking-wide mb-2">{t[plan.nameKey]}</div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-mono text-3xl font-bold text-accent">${plan.price}</span>
              <span className="text-xs text-neutral-500 font-body">/ {t[plan.periodKey]}</span>
            </div>
            {plan.perMonthEquivalent && (
              <div className="text-[11px] text-neutral-500 font-body mb-3">
                {fmt(t.plansPerMonthEquiv, { price: plan.perMonthEquivalent.toFixed(2) })}
              </div>
            )}
            <button
              onClick={onChoose}
              className="w-full mt-2 bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-4 py-2.5 hover:opacity-90 transition-opacity"
            >
              {t.plansChoose}
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-800 pt-4">
        <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-2.5">{t.plansIncluded}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {scopePlusFeatureKeys.map((key) => (
            <div key={key} className="flex items-center gap-2 text-xs font-body text-neutral-300">
              <Check size={12} className="text-accent shrink-0" /> {t[key]}
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-neutral-600 font-body mt-4 leading-relaxed">{t.plansDisclaimer}</p>
    </Modal>
  );
}
