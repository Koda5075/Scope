import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Swords, Crosshair, Target, Zap, Skull, Flame, Share2 } from 'lucide-react';
import Card from '../Card.jsx';
import StatReadout from '../StatReadout.jsx';
import FilterBar from '../FilterBar.jsx';
import ActivityCalendar from '../ActivityCalendar.jsx';
import Modal from '../Modal.jsx';
import GameScoreboard from '../GameScoreboard.jsx';
import KDAStat from '../KDAStat.jsx';
import Highlights from '../Highlights.jsx';
import { rrHistory, badgeDefs, recentGames, getMatchScoreboard, isBadgeUnlocked, acts, getStreaks } from '../../data/mockData.js';
import { getAgentIcon, getMapImage } from '../../data/valorantAssets.js';

const PERIOD_MAX_DAYS = { '7d': 6, '30d': 29, all: Infinity };
const MODE_LABEL_KEY = { competitive: 'modeCompetitive', unrated: 'modeUnrated', deathmatch: 'modeDeathmatch' };

export default function OverviewTab({ t, accent }) {
  const [filterMode, setFilterMode] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('7d');
  const [actId, setActId] = useState(acts.find((a) => a.current)?.id ?? acts[0].id);
  const [selectedGameId, setSelectedGameId] = useState(null);

  const selectedAct = acts.find((a) => a.id === actId) ?? acts[0];

  const filteredGames = recentGames.filter((g) => {
    if (filterMode !== 'all' && g.mode !== filterMode) return false;
    if (filterPeriod === 'act') return g.daysAgo >= selectedAct.minDaysAgo && g.daysAgo <= selectedAct.maxDaysAgo;
    return g.daysAgo <= PERIOD_MAX_DAYS[filterPeriod];
  });

  const wins = filteredGames.filter((g) => g.result === 'win').length;
  const losses = filteredGames.length - wins;
  const best = filteredGames.reduce((acc, g) => {
    const [k, d] = g.kda.split('/').map(Number);
    return k - d > acc.diff ? { diff: k - d, label: `${k}/${d}` } : acc;
  }, { diff: -Infinity, label: '—' });
  const worst = filteredGames.reduce((acc, g) => {
    const [k, d] = g.kda.split('/').map(Number);
    return k - d < acc.diff ? { diff: k - d, label: `${k}/${d}` } : acc;
  }, { diff: Infinity, label: '—' });

  const selectedMatch = selectedGameId ? getMatchScoreboard(selectedGameId) : null;
  const streaks = getStreaks();

  return (
    <>
      <Highlights t={t} />
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

        <FilterBar
          t={t}
          mode={filterMode}
          setMode={setFilterMode}
          period={filterPeriod}
          setPeriod={setFilterPeriod}
          acts={acts}
          actId={actId}
          setActId={setActId}
        />

        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.sessionSummary}</span>
            <button className="flex items-center gap-1 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors">
              <Share2 size={12} /> {t.share}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div><div className="text-[11px] text-neutral-500 font-body mb-1">{t.games}</div><div className="font-mono text-xl text-white">{filteredGames.length}</div></div>
            <div><div className="text-[11px] text-neutral-500 font-body mb-1">{t.record}</div><div className="font-mono text-xl text-accent">{wins}{t.winShort} – {losses}{t.lossShort}</div></div>
            <div><div className="text-[11px] text-neutral-500 font-body mb-1">{t.best}</div><div className="font-mono text-xl text-white">{best.label}</div></div>
            <div><div className="text-[11px] text-neutral-500 font-body mb-1">{t.worst}</div><div className="font-mono text-xl text-neutral-400">{worst.label}</div></div>
            <div>
              <div className="text-[11px] text-neutral-500 font-body mb-1">{t.streakLabel}</div>
              <div className={`font-mono text-xl ${streaks.currentType === 'win' ? 'text-accent' : 'text-neutral-400'}`}>
                {streaks.currentCount}{streaks.currentType === 'win' ? t.winShort : t.lossShort}
              </div>
              <div className="text-[10px] text-neutral-600 font-mono mt-0.5">{t.bestStreak}: {streaks.bestWinStreak}{t.winShort}</div>
            </div>
          </div>
        </Card>

        <Card>
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.recentGamesTitle}</span>
          <div className="flex flex-col gap-1.5">
            {filteredGames.length === 0 ? (
              <div className="text-xs font-body text-neutral-500 py-2">{t.noGamesForFilter}</div>
            ) : (
              filteredGames.map((g) => {
                const [k, d, a] = g.kda.split('/').map(Number);
                const mapImage = getMapImage(g.map);
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGameId(g.id)}
                    className="flex items-center justify-between gap-3 px-3 py-2 border border-neutral-800 hover:border-accent bg-neutral-950 transition-colors text-left flex-wrap sm:flex-nowrap"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-1.5 h-1.5 shrink-0 ${g.result === 'win' ? 'bg-accent' : 'bg-neutral-600'}`} />
                      {mapImage && <img src={mapImage.splash} alt="" className="val-icon w-12 h-7 rounded object-cover shrink-0" />}
                      <span className="font-display text-sm font-semibold text-white truncate">{g.map}</span>
                      <span
                        className={`font-body text-[10px] uppercase tracking-wide px-1.5 py-0.5 shrink-0 border ${
                          g.mode === 'competitive' ? 'text-accent border-accent' : 'text-neutral-500 border-neutral-700'
                        }`}
                      >
                        {t[MODE_LABEL_KEY[g.mode]]}
                      </span>
                      <span className="flex items-center gap-2 font-mono text-[10px] text-neutral-600 shrink-0">
                        {getAgentIcon(g.agent) && <img src={getAgentIcon(g.agent)} alt="" className="val-icon w-8 h-8 rounded-full object-cover" />}
                        {g.agent}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-auto sm:ml-0">
                      <KDAStat kills={k} deaths={d} assists={a} />
                      <span className="font-mono text-xs text-white">{g.score}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        <Card>
          <ActivityCalendar t={t} />
        </Card>
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
            {badgeDefs.filter(isBadgeUnlocked).slice(0, 3).map((b) => {
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

      {selectedMatch && (
        <Modal onClose={() => setSelectedGameId(null)} closeLabel={t.close}>
          <GameScoreboard match={selectedMatch} t={t} />
        </Modal>
      )}
      </div>
    </>
  );
}
