import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Flame, TrendingUp, Swords, Lock, Crosshair, Target, ChevronRight, Zap, Skull } from 'lucide-react';

const rrHistory = [
  { s: 'S1', rr: 38 },
  { s: 'S2', rr: 52 },
  { s: 'S3', rr: 45 },
  { s: 'S4', rr: 61 },
  { s: 'S5', rr: 57 },
  { s: 'S6', rr: 74 },
  { s: 'S7', rr: 67 },
];

const badges = [
  { icon: Users, label: 'Team Player', sub: '50 parties coordonnées' },
  { icon: Swords, label: 'Ace x3', sub: 'Exploit solo' },
  { icon: Flame, label: '5 jours d\u2019affilée', sub: 'Régularité' },
  { icon: TrendingUp, label: 'Nouveau palier', sub: 'Diamond atteint' },
];

const agentStats = [
  { name: 'Jett', games: 14, wr: 64 },
  { name: 'Reyna', games: 9, wr: 56 },
  { name: 'Sova', games: 6, wr: 50 },
];

function Card({ children, className = '' }) {
  return <div className={`sc-card ${className}`}>{children}</div>;
}

function StatReadout({ label, value, unit, Icon }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body">{label}</span>
        <Icon size={14} className="text-yellow" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-2xl font-bold text-white">{value}</span>
        {unit && <span className="font-mono text-xs text-neutral-500">{unit}</span>}
      </div>
    </Card>
  );
}

export default function ScopeDashboard() {
  const [tab, setTab] = useState('overview');
  const rrCurrent = 67;
  const rrGoal = 100;

  return (
    <div className="min-h-screen w-full bg-black text-neutral-100 font-body">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');

        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .text-yellow { color: #FFC300; }

        .sc-card {
          background: #0F0F0F;
          border: 1px solid #262626;
          border-left: 3px solid #FFC300;
          padding: 16px 18px;
        }

        .sc-track { background: #1A1A1A; border: 1px solid #2A2A2A; }
        .sc-fill { background: #FFC300; box-shadow: 0 0 8px rgba(255,195,0,0.4); }

        .sc-badge {
          background: #0F0F0F;
          border: 1px solid #262626;
          border-left: 2px solid #FFC300;
        }

        .locked-overlay { backdrop-filter: blur(3px); background: rgba(0,0,0,0.65); }
      `}</style>

      <div className="max-w-5xl mx-auto px-5 py-8">

        {/* Wordmark */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold tracking-wide text-white">SCOPE</span>
            <span className="w-2 h-2 bg-yellow inline-block" />
          </div>
          <div className="h-[2px] w-14 bg-yellow mt-1" />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-7">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-900 border border-neutral-700 flex items-center justify-center font-display font-bold text-lg text-yellow">
              K
            </div>
            <div>
              <div className="font-display text-xl font-semibold tracking-wide text-white">KAITO<span className="text-neutral-600">#EUW1</span></div>
              <div className="text-xs text-neutral-500 font-body">Dernière session : aujourd'hui, 21h04</div>
            </div>
          </div>

          <div className="border border-neutral-800 bg-neutral-950 px-5 py-3 min-w-[220px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-body">Rang actuel</span>
              <span className="font-display text-xs font-bold text-yellow">DIAMOND 2</span>
            </div>
            <div className="sc-track h-2 w-full overflow-hidden">
              <div className="sc-fill h-full" style={{ width: `${rrCurrent}%` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[11px] text-neutral-300">{rrCurrent} RR</span>
              <span className="font-mono text-[11px] text-neutral-600">/ {rrGoal}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-neutral-800">
          {['overview', 'agents', 'badges'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-display text-sm tracking-wide px-4 py-2 uppercase transition-colors ${
                tab === t ? 'text-yellow border-b-2 border-yellow' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {t === 'overview' ? 'Vue d\u2019ensemble' : t === 'agents' ? 'Agents & cartes' : 'Badges'}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-sm tracking-wide uppercase text-neutral-300">Évolution du RR</span>
                  <span className="text-[11px] font-mono text-yellow">+29 sur 7 sessions</span>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rrHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="rrGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FFC300" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#FFC300" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="s" tick={{ fill: '#737373', fontSize: 11 }} axisLine={{ stroke: '#262626' }} tickLine={false} />
                      <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                      <Tooltip
                        contentStyle={{ background: '#0F0F0F', border: '1px solid #262626', fontSize: 12, fontFamily: 'JetBrains Mono' }}
                        labelStyle={{ color: '#a3a3a3' }}
                      />
                      <Area type="monotone" dataKey="rr" stroke="#FFC300" strokeWidth={2} fill="url(#rrGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">Résumé de session</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-[11px] text-neutral-500 font-body mb-1">Parties</div>
                    <div className="font-mono text-xl text-white">7</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-neutral-500 font-body mb-1">Bilan</div>
                    <div className="font-mono text-xl text-yellow">5V – 2D</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-neutral-500 font-body mb-1">Meilleure</div>
                    <div className="font-mono text-xl text-white">24/9</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-neutral-500 font-body mb-1">Pire</div>
                    <div className="font-mono text-xl text-neutral-400">8/17</div>
                  </div>
                </div>
              </Card>

              <div className="relative">
                <Card>
                  <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">Analyse & coaching</span>
                  <div className="space-y-2 opacity-30 select-none">
                    <div className="h-3 bg-neutral-700 w-5/6" />
                    <div className="h-3 bg-neutral-700 w-2/3" />
                    <div className="h-3 bg-neutral-700 w-4/5" />
                  </div>
                </Card>
                <div className="absolute inset-0 locked-overlay flex flex-col items-center justify-center gap-2">
                  <Lock size={18} className="text-yellow" />
                  <span className="font-display text-xs tracking-wide uppercase text-neutral-100">Débloquer avec l'abonnement</span>
                  <button className="mt-1 flex items-center gap-1 text-[11px] font-body text-yellow hover:underline">
                    Voir les offres <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <StatReadout label="KDA" value="1.42" Icon={Swords} />
                <StatReadout label="Précision" value="24" unit="%" Icon={Crosshair} />
                <StatReadout label="Headshots" value="31" unit="%" Icon={Target} />
                <StatReadout label="ACS" value="238" Icon={Zap} />
                <StatReadout label="First Bloods" value="9" Icon={Skull} />
                <StatReadout label="Clutchs" value="3" unit="/5" Icon={Flame} />
              </div>

              <Card>
                <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">Derniers badges</span>
                <div className="flex flex-col gap-2">
                  {badges.slice(0, 3).map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <div key={i} className="sc-badge px-3 py-2 flex items-center gap-2.5">
                        <Icon size={14} className="text-yellow" />
                        <span className="text-xs font-body text-neutral-300">{b.label}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        )}

        {tab === 'agents' && (
          <Card>
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">Performance par agent</span>
            <div className="flex flex-col gap-3">
              {agentStats.map((a) => (
                <div key={a.name} className="flex items-center gap-4">
                  <span className="font-display text-sm text-white w-16">{a.name}</span>
                  <div className="flex-1 sc-track h-2 overflow-hidden">
                    <div className="sc-fill h-full" style={{ width: `${a.wr}%` }} />
                  </div>
                  <span className="font-mono text-xs text-neutral-500 w-16 text-right">{a.games} parties</span>
                  <span className="font-mono text-xs text-yellow w-12 text-right">{a.wr}%</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === 'badges' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((b, i) => {
              const Icon = b.icon;
              return (
                <Card key={i}>
                  <div className="flex items-center gap-3">
                    <div className="sc-badge w-10 h-10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-yellow" />
                    </div>
                    <div>
                      <div className="font-display text-sm text-white">{b.label}</div>
                      <div className="text-[11px] text-neutral-500 font-body">{b.sub}</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-2 text-[11px] text-neutral-700 font-body">
          <div className="flex gap-4">
            <a href="/cgu.html" className="hover:text-yellow transition-colors">CGU</a>
            <a href="/confidentialite.html" className="hover:text-yellow transition-colors">Politique de confidentialité</a>
          </div>
          <div>Données d'exemple — maquette Scope, phase 1</div>
        </div>
      </div>
    </div>
  );
}
