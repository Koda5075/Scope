import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Swords, Crosshair, Target, Zap, Skull, Flame, Share2 } from 'lucide-react';
import Card from '../Card.jsx';
import StatReadout from '../StatReadout.jsx';
import PremiumLock from '../PremiumLock.jsx';
import { rrHistory, badgeDefs, performanceScore } from '../../data/mockData.js';

export default function OverviewTab({ t, accent }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300">{t.rrEvolution}</span>
            <span className="text-[11px] font-mono text-accent">{t.rrSub}</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rrHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={accent} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="s" tick={{ fill: '#737373', fontSize: 11 }} axisLine={{ stroke: '#262626' }} tickLine={false} />
                <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip contentStyle={{ background: '#0F0F0F', border: '1px solid #262626', fontSize: 12, fontFamily: 'JetBrains Mono' }} labelStyle={{ color: '#a3a3a3' }} />
                <Area type="monotone" dataKey="rr" stroke={accent} strokeWidth={2} fill="url(#rrGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.sessionSummary}</span>
            <button className="flex items-center gap-1 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors">
              <Share2 size={12} /> {t.share}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div><div className="text-[11px] text-neutral-500 font-body mb-1">{t.games}</div><div className="font-mono text-xl text-white">7</div></div>
            <div><div className="text-[11px] text-neutral-500 font-body mb-1">{t.record}</div><div className="font-mono text-xl text-accent">5V – 2D</div></div>
            <div><div className="text-[11px] text-neutral-500 font-body mb-1">{t.best}</div><div className="font-mono text-xl text-white">24/9</div></div>
            <div><div className="text-[11px] text-neutral-500 font-body mb-1">{t.worst}</div><div className="font-mono text-xl text-neutral-400">8/17</div></div>
          </div>
        </Card>

        <PremiumLock title={t.unlock} description={t.perfDesc} ctaLabel={t.seePlans}>
          <Card>
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.scopePerformance}</span>
            <div className="grid grid-cols-2 gap-3">
              {performanceScore.map((p) => (
                <div key={p.label}>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1"><span>{p.label}</span><span>{p.value}</span></div>
                  <div className="sc-track h-1.5 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${p.value}%` }} /></div>
                </div>
              ))}
            </div>
          </Card>
        </PremiumLock>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <StatReadout label={t.statKDA} value="1.42" Icon={Swords} />
          <StatReadout label={t.statAccuracy} value="24" unit="%" Icon={Crosshair} />
          <StatReadout label={t.statHeadshots} value="31" unit="%" Icon={Target} />
          <StatReadout label={t.statACS} value="238" Icon={Zap} />
          <StatReadout label={t.statFirstBloods} value="9" Icon={Skull} />
          <StatReadout label={t.statClutches} value="3" unit="/5" Icon={Flame} />
        </div>

        <Card>
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.recentBadges}</span>
          <div className="flex flex-col gap-2">
            {badgeDefs.slice(0, 3).map((b) => {
              const Icon = b.icon;
              const info = t.badges[b.id];
              return (
                <div key={b.id} className="sc-badge px-3 py-2 flex items-center gap-2.5">
                  <Icon size={14} className="text-accent" />
                  <span className="text-xs font-body text-neutral-300">{info.label}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
