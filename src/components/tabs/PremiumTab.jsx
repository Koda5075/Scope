import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Card from '../Card.jsx';
import PremiumLock from '../PremiumLock.jsx';
import { performanceScore, performanceHistory, teammates, buildGamesCSV } from '../../data/mockData.js';

const METRICS = ['aim', 'consistency', 'impact', 'clutch'];

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

export default function PremiumTab({ t, accent }) {
  const weakest = performanceScore.reduce((min, p) => (p.value < min.value ? p : min), performanceScore[0]);
  const [metric, setMetric] = useState(weakest.label.toLowerCase());
  const recoText = t[`reco${weakest.label}`];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <PremiumLock title={t.unlock} description={t.perfDesc} ctaLabel={t.seePlans}>
        <Card>
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.scopePerformance}</span>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {performanceScore.map((p) => (
              <div key={p.label}>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1"><span>{p.label}</span><span>{p.value}</span></div>
                <div className="sc-track h-1.5 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${p.value}%` }} /></div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body">{t.perfHistoryTitle}</span>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              aria-label={t.perfHistoryTitle}
              className="bg-neutral-950 border border-neutral-800 text-xs font-body text-neutral-300 px-2 py-1 focus:border-accent outline-none"
            >
              {METRICS.map((m) => (
                <option key={m} value={m}>
                  {performanceScore.find((p) => p.label.toLowerCase() === m)?.label}
                </option>
              ))}
            </select>
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
                <XAxis dataKey="s" tick={{ fill: '#737373', fontSize: 11 }} axisLine={{ stroke: '#262626' }} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#0F0F0F', border: '1px solid #262626', fontSize: 12, fontFamily: 'JetBrains Mono' }} labelStyle={{ color: '#a3a3a3' }} />
                <Area type="monotone" dataKey={metric} stroke={accent} strokeWidth={2} fill="url(#perfGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </PremiumLock>

      <PremiumLock title={t.unlock} description={t.descReco} ctaLabel={t.seePlans}>
        <Card>
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.recoTitle}</span>
          <p className="text-sm font-body text-neutral-300 leading-relaxed">{recoText}</p>
        </Card>
      </PremiumLock>

      <PremiumLock title={t.unlock} description={t.descSynergy} ctaLabel={t.seePlans}>
        <Card>
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.synergyTitle}</span>
          <div className="flex flex-col gap-2">
            {teammates.map((tm) => (
              <div key={tm.name} className="flex items-center justify-between px-3 py-2 border border-neutral-800 bg-neutral-950">
                <span className="font-body text-sm text-neutral-300">{tm.name}</span>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-neutral-500">{tm.gamesTogether} {t.synergyGamesTogether}</span>
                  <span className="font-mono text-xs text-accent w-10 text-right">{tm.winRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </PremiumLock>

      <PremiumLock title={t.unlock} description={t.descAlerts} ctaLabel={t.seePlans}>
        <Card>
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.alertsTitle}</span>
          <label className="flex items-center gap-2 text-xs font-body text-neutral-300 mb-3">
            <input type="checkbox" defaultChecked readOnly className="accent-[var(--accent)]" />{t.alertDerankLabel}
          </label>
          <label className="flex items-center gap-2 text-xs font-body text-neutral-300 mb-3">
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

      <PremiumLock title={t.unlock} description={t.descExport} ctaLabel={t.seePlans}>
        <Card>
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-2 block">{t.exportTitle}</span>
          <p className="text-xs font-body text-neutral-500 mb-3">{t.exportDesc}</p>
          <button
            onClick={() => downloadCSV(buildGamesCSV(), 'scope-games.csv')}
            className="bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-4 py-2.5 hover:opacity-90 transition-opacity"
          >
            {t.exportButton}
          </button>
        </Card>
      </PremiumLock>
    </div>
  );
}
