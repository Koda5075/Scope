import { lazy, Suspense, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Swords, Crosshair, Target, Zap, Skull, Flame } from 'lucide-react';
import Card from '../Card.jsx';
import Modal from '../Modal.jsx';
import StatReadout from '../StatReadout.jsx';
import Highlights from '../Highlights.jsx';
import RecentGamesList from '../RecentGamesList.jsx';
import ActivityCalendar from '../ActivityCalendar.jsx';
import TabLoading from '../TabLoading.jsx';
import {
  computeAverageAcs, computeAggregateKDA, computeAverageAccuracy, computeAverageHeadshots,
  computeFirstBloods, computeClutchRecord, getStreaks, getMatchScoreboard,
} from '../../data/mockData.js';

const GameScoreboard = lazy(() => import('../GameScoreboard.jsx'));

export default function ProfileOverview({ dataset, games, t, accent }) {
  const [selectedGameId, setSelectedGameId] = useState(null);
  const subjectName = `${dataset.identity.name}#${dataset.identity.tag}`;
  const selectedMatch = selectedGameId
    ? getMatchScoreboard(selectedGameId, { games, subjectName })
    : null;
  const wins = games.filter((g) => g.result === 'win').length;
  const losses = games.length - wins;
  const winRate = games.length ? Math.round((wins / games.length) * 100) : 0;
  const streaks = getStreaks(games);

  // The shared `rrSub` string bakes in the owner's own "+29" delta; on a profile, swap
  // the leading signed number for this player's actual first→last RR change (the "7
  // sessions" count after it is the same for everyone, so a single replace is enough).
  const rrDelta = dataset.rrHistory.length >= 2
    ? dataset.rrHistory[dataset.rrHistory.length - 1].rr - dataset.rrHistory[0].rr
    : 0;
  const rrSubText = t.rrSub.replace(/[+-]?\d+/, `${rrDelta >= 0 ? '+' : ''}${rrDelta}`);

  const avgAcs = computeAverageAcs(games);
  const avgKda = computeAggregateKDA(games);
  const avgAccuracy = computeAverageAccuracy(games);
  const avgHeadshots = computeAverageHeadshots(games);
  const firstBloods = computeFirstBloods(games);
  const clutches = computeClutchRecord(games);

  return (
    <div className="flex flex-col gap-4">
      <Highlights t={t} filteredGames={games} badges={dataset.badges} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <span className="font-display text-sm tracking-wide uppercase text-neutral-300">{t.rrEvolution}</span>
              <span className="text-[11px] font-mono text-accent">{rrSubText}</span>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataset.rrHistory} margin={{ top: 5, right: 5, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rrGradProfile" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={accent} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={accent} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" vertical={false} />
                  <XAxis
                    dataKey="s"
                    tickFormatter={(s) => `${t.sessionLabel} ${s}`}
                    tick={{ fill: '#737373', fontSize: 11 }}
                    axisLine={{ stroke: 'var(--sc-line)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#737373', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={34}
                    domain={['dataMin - 10', 'dataMax + 10']}
                  />
                  <Tooltip
                    contentStyle={{ background: 'var(--sc-surface)', border: '1px solid var(--sc-line)', fontSize: 12, fontFamily: 'JetBrains Mono' }}
                    labelStyle={{ color: '#a3a3a3' }}
                    labelFormatter={(s) => `${t.sessionLabel} ${s}`}
                    formatter={(value) => [`${value} RR`, '']}
                  />
                  <Area type="monotone" dataKey="rr" stroke={accent} strokeWidth={2} fill="url(#rrGradProfile)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <RecentGamesList games={games} t={t} onSelectGame={setSelectedGameId} />
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.sessionSummary}</span>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-display text-3xl font-bold text-white">{winRate}%</span>
              <span className="text-xs text-neutral-500 font-body">{t.wrShort}</span>
            </div>
            <div className="text-[11px] font-body text-neutral-500">
              {games.length} {t.games} · {wins}{t.winShort}–{losses}{t.lossShort}
              {streaks.currentCount >= 2 && (
                <> · {streaks.currentCount}{streaks.currentType === 'win' ? t.winShort : t.lossShort}</>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <StatReadout label={t.statKDA} value={avgKda ?? '—'} Icon={Swords} tip={t.tipKDA} />
            <StatReadout label={t.statAccuracy} value={avgAccuracy ?? '—'} unit={avgAccuracy != null ? '%' : undefined} Icon={Crosshair} tip={t.tipAccuracy} />
            <StatReadout label={t.statHeadshots} value={avgHeadshots ?? '—'} unit={avgHeadshots != null ? '%' : undefined} Icon={Target} tip={t.tipHeadshots} />
            <StatReadout label={t.statACS} value={avgAcs ?? '—'} Icon={Zap} tip={t.tipACS} />
            <StatReadout label={t.statFirstBloods} value={firstBloods} Icon={Skull} tip={t.tipFirstBloods} />
            <StatReadout label={t.statClutches} value={clutches.won} unit={`/${clutches.played}`} Icon={Flame} tip={t.tipClutches} />
          </div>
        </div>
      </div>

      <Card>
        <ActivityCalendar t={t} days={dataset.activity} />
      </Card>

      {selectedMatch && (
        <Modal onClose={() => setSelectedGameId(null)} closeLabel={t.close} size="lg">
          <Suspense fallback={<TabLoading />}>
            <GameScoreboard match={selectedMatch} t={t} />
          </Suspense>
        </Modal>
      )}
    </div>
  );
}
