import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

// Segmented pill control — same visual language as the title grid / theme toggle /
// language picker, replacing the raw <select>s that felt unfinished.
function Segmented({ label, value, onChange, options }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 font-body">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              className={`px-2.5 py-1.5 text-[11px] font-display uppercase tracking-wide border transition-colors ${
                active
                  ? 'border-accent text-accent bg-accent/5'
                  : 'border-neutral-800 text-neutral-500 hover:text-neutral-300 hover:border-neutral-600'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function FilterBar({ t, mode, setMode, period, setPeriod, acts, actId, setActId }) {
  const [linkCopied, setLinkCopied] = useState(false);

  async function copyFilteredLink() {
    const params = new URLSearchParams({ mode, period });
    if (period === 'act') params.set('act', actId);
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?${params.toString()}`);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1500);
    } catch {
      /* ignore — clipboard unavailable */
    }
  }

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 mb-4">
      <Segmented
        label={t.filterMode}
        value={mode}
        onChange={setMode}
        options={[
          { value: 'all', label: t.modeAll },
          { value: 'competitive', label: t.modeCompetitive },
          { value: 'unrated', label: t.modeUnrated },
          { value: 'deathmatch', label: t.modeDeathmatch },
          { value: 'spikerush', label: t.modeSpikeRush },
          { value: 'escalation', label: t.modeEscalation },
          { value: 'teamdeathmatch', label: t.modeTeamDeathmatch },
          { value: 'swiftplay', label: t.modeSwiftplay },
        ]}
      />
      <Segmented
        label={t.filterPeriod}
        value={period}
        onChange={setPeriod}
        options={[
          { value: '7d', label: t.period7 },
          { value: '30d', label: t.period30 },
          { value: 'act', label: t.periodAct },
          { value: 'all', label: t.periodAll },
        ]}
      />
      {period === 'act' && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 font-body">{t.filterAct}</span>
          <select
            value={actId}
            onChange={(e) => setActId(e.target.value)}
            aria-label={t.filterAct}
            className="bg-neutral-950 border border-accent text-xs font-body text-neutral-300 px-2 py-1.5 focus:border-accent outline-none"
          >
            {acts.map((a) => (
              <option key={a.id} value={a.id}>{a.label}</option>
            ))}
          </select>
        </div>
      )}
      <button
        type="button"
        onClick={copyFilteredLink}
        className="flex items-center gap-1.5 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors"
      >
        {linkCopied ? <Check size={12} className="text-accent" /> : <Link2 size={12} />}
        {linkCopied ? t.linkCopied : t.copyFilterLink}
      </button>
    </div>
  );
}
