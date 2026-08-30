import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../Card.jsx';
import PremiumLock from '../PremiumLock.jsx';
import {
  performanceScore,
  performanceHistory,
  teammates,
  buildGamesCSV,
  roundBreakdown,
  timePatterns,
  rrHistory,
} from '../../data/mockData.js';
import { pluralLabel } from '../../i18n/translations.js';

const METRICS = ['aim', 'consistency', 'impact', 'clutch'];

// performanceScore's `label` (Aim/Consistency/Impact/Clutch) stays a stable English key --
// it's used to look up t.recoAim/t.recoConsistency/... and to match the metric dropdown's
// value, neither of which should change with the UI language. This maps that key to the
// actual translated text for display only.
const METRIC_LABEL_KEYS = { Aim: 'metricAim', Consistency: 'metricConsistency', Impact: 'metricImpact', Clutch: 'metricClutch' };
function metricLabel(label, t) {
  return t[METRIC_LABEL_KEYS[label]] ?? label;
}

function fmt(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function PremiumTab({ t, accent, onSeePlans, isPremium }) {
  const weakest = performanceScore.reduce((min, p) => (p.value < min.value ? p : min), performanceScore[0]);
  const strongest = performanceScore.reduce((max, p) => (p.value > max.value ? p : max), performanceScore[0]);
  const [metric, setMetric] = useState(weakest.label.toLowerCase());
  const recoText = t[`reco${weakest.label}`];
  const recoPreview = recoText.split('. ')[0] + '.';

  const bestSlot = [...timePatterns].sort((a, b) => b.wr - a.wr)[0];
  const timePatternsBestText = t.timePatternsBest.replace('{slot}', t.timeSlots[bestSlot.id]).replace('{wr}', bestSlot.wr);

  const topTeammate = [...teammates].sort((a, b) => b.winRate - a.winRate)[0];
  const firstClutch = roundBreakdown.clutches[0];
  const clutchPct = firstClutch.attempts ? Math.round((firstClutch.won / firstClutch.attempts) * 100) : 0;
  const currentRR = rrHistory[rrHistory.length - 1]?.rr ?? 0;
  const rrToGoal = Math.max(0, 100 - currentRR);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="sc-card"
        style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 14%, transparent), var(--sc-surface) 60%)' }}
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={14} className="text-accent" />
              <span className="font-display text-sm uppercase tracking-wide text-white">{t.scopePlusHeroTitle}</span>
            </div>
            <p className="text-xs font-body text-neutral-300 leading-relaxed max-w-2xl">{t.scopePlusHeroDesc}</p>
          </div>
          <button
            onClick={onSeePlans}
            className="shrink-0 bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-4 py-2.5 hover:opacity-90 transition-opacity"
          >
            {t.seePlans}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PremiumLock className="lg:col-span-2" title={t.unlock} description={t.descReco} ctaLabel={t.seePlans} onCtaClick={onSeePlans} preview={recoPreview} isPremium={isPremium}>
          <Card className="h-full">
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.recoTitle}</span>
            <p className="text-sm font-body text-neutral-300 leading-relaxed max-w-3xl">{recoText}</p>
          </Card>
        </PremiumLock>

        <PremiumLock
          title={t.unlock}
          description={t.perfDesc}
          ctaLabel={t.seePlans} onCtaClick={onSeePlans}
          preview={fmt(t.previewPerf, { metric: metricLabel(strongest.label, t), value: strongest.value })}
          isPremium={isPremium}
        >
          <Card className="h-full">
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.scopePerformance}</span>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {performanceScore.map((p) => {
                const isWeakest = p.label === weakest.label;
                return (
                  <div key={p.label}>
                    <div className={`flex justify-between text-[11px] mb-1 ${isWeakest ? 'text-red-400' : 'text-neutral-400'}`}>
                      <span>{metricLabel(p.label, t)}</span><span>{p.value}</span>
                    </div>
                    <div className="sc-track h-1.5 overflow-hidden">
                      <div className={`h-full ${isWeakest ? '' : 'sc-fill'}`} style={{ width: `${p.value}%`, ...(isWeakest ? { background: '#EF4444' } : {}) }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body">{t.perfHistoryTitle}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-neutral-600">/100</span>
                <select
                  value={metric}
                  onChange={(e) => setMetric(e.target.value)}
                  aria-label={t.perfHistoryTitle}
                  className="bg-neutral-950 border border-neutral-800 text-xs font-body text-neutral-300 px-2 py-1 focus:border-accent outline-none"
                >
                  {METRICS.map((m) => (
                    <option key={m} value={m}>
                      {metricLabel(performanceScore.find((p) => p.label.toLowerCase() === m)?.label, t)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="perfGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accent} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="s" tick={{ fill: '#737373', fontSize: 11 }} axisLine={{ stroke: 'var(--sc-line)' }} tickLine={false} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: 'var(--sc-surface)', border: '1px solid var(--sc-line)', fontSize: 12, fontFamily: 'JetBrains Mono' }} labelStyle={{ color: '#a3a3a3' }} />
                  <Area type="monotone" dataKey={metric} stroke={accent} strokeWidth={2} fill="url(#perfGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </PremiumLock>

        <PremiumLock
          title={t.unlock}
          description={t.descSynergy}
          ctaLabel={t.seePlans} onCtaClick={onSeePlans}
          preview={fmt(t.previewSynergy, { wr: topTeammate.winRate, name: topTeammate.name })}
          isPremium={isPremium}
        >
          <Card className="h-full">
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.synergyTitle}</span>
            <div className="flex flex-col gap-2">
              {teammates.map((tm) => (
                <div key={tm.name} className="flex items-center justify-between px-3 py-2 border border-neutral-800 bg-neutral-950">
                  <span className="font-body text-sm text-neutral-300">{tm.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs text-neutral-500">{tm.gamesTogether} {pluralLabel(tm.gamesTogether, t, 'synergyGamesTogether')}</span>
                    <span className="font-mono text-xs text-accent w-10 text-right">{tm.winRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </PremiumLock>


        <PremiumLock
          title={t.unlock}
          description={t.descRoundBreakdown}
          ctaLabel={t.seePlans} onCtaClick={onSeePlans}
          preview={fmt(t.previewRoundBreakdown, { pct: clutchPct })}
          isPremium={isPremium}
        >
          <Card className="h-full">
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.roundBreakdownTitle}</span>
            <div className="flex flex-col gap-3 mb-4">
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1"><span>{t.pistolRoundsLabel}</span><span>{roundBreakdown.pistolWr}%</span></div>
                <div className="sc-track h-1.5 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${roundBreakdown.pistolWr}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1"><span>{t.ecoForceLabel}</span><span>{roundBreakdown.ecoForceWr}%</span></div>
                <div className="sc-track h-1.5 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${roundBreakdown.ecoForceWr}%` }} /></div>
              </div>
            </div>
            <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-2">{t.clutchBreakdownLabel}</div>
            <div className="flex flex-col gap-1.5">
              {roundBreakdown.clutches.map((c) => (
                <div key={c.situation} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-neutral-400 w-10 shrink-0">{c.situation}</span>
                  <div className="flex-1 sc-track h-1.5 overflow-hidden">
                    <div className="sc-fill-dim h-full" style={{ width: `${c.attempts ? Math.round((c.won / c.attempts) * 100) : 0}%` }} />
                  </div>
                  <span className="font-mono text-xs text-neutral-300 w-14 text-right shrink-0">{c.won}/{c.attempts}</span>
                </div>
              ))}
            </div>
          </Card>
        </PremiumLock>

        <PremiumLock title={t.unlock} description={t.descTimePatterns} ctaLabel={t.seePlans} onCtaClick={onSeePlans} preview={timePatternsBestText} isPremium={isPremium}>
          <Card className="h-full">
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-2 block">{t.timePatternsTitle}</span>
            <p className="text-xs font-body text-neutral-400 mb-4">{timePatternsBestText}</p>
            <div className="flex flex-col gap-2.5">
              {timePatterns.map((slot) => (
                <div key={slot.id} className="flex items-center gap-3">
                  <span className="text-[11px] font-body text-neutral-400 w-36 shrink-0 truncate">{t.timeSlots[slot.id]}</span>
                  <div className="flex-1 sc-track h-2 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${slot.wr}%` }} /></div>
                  <span className="font-mono text-xs text-neutral-300 w-10 text-right shrink-0">{slot.wr}%</span>
                </div>
              ))}
            </div>
          </Card>
        </PremiumLock>

        <PremiumLock
          title={t.unlock}
          description={t.descAlerts}
          ctaLabel={t.seePlans} onCtaClick={onSeePlans}
          preview={fmt(t.previewAlerts, { rr: rrToGoal, rank: 'Diamond 3' })}
          isPremium={isPremium}
        >
          <Card className="h-full">
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.alertsTitle}</span>
            <label className="flex items-center gap-2 text-xs font-body text-neutral-300 mb-2">
              <input type="checkbox" defaultChecked readOnly className="accent-[var(--accent)]" />{t.alertDerankLabel}
            </label>
            <label className="flex items-center gap-2 text-xs font-body text-neutral-300 mb-2">
              <input type="checkbox" defaultChecked readOnly className="accent-[var(--accent)]" />{t.alertGoalLabel}
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 font-body">{t.alertGoalRankLabel}</span>
              <select
                defaultValue="Diamond 3"
                aria-label={t.alertGoalRankLabel}
                className="bg-neutral-950 border border-neutral-800 text-xs font-body text-neutral-300 px-2 py-1 focus:border-accent outline-none"
              >
                <option>Platinum 1</option>
                <option>Diamond 1</option>
                <option>Diamond 3</option>
                <option>Immortal 1</option>
              </select>
            </div>
          </Card>
        </PremiumLock>

        <PremiumLock title={t.unlock} description={t.descExport} ctaLabel={t.seePlans} onCtaClick={onSeePlans} isPremium={isPremium}>
          <Card className="h-full">
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-1.5 block">{t.exportTitle}</span>
            <p className="text-xs font-body text-neutral-500 mb-2.5">{t.exportDesc}</p>
            <button
              onClick={() => downloadCSV(buildGamesCSV(), 'scope-games.csv')}
              className="bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-4 py-2.5 hover:opacity-90 transition-opacity"
            >
              {t.exportButton}
            </button>
          </Card>
        </PremiumLock>
      </div>
    </div>
  );
}
