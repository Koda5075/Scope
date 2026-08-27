import { useState, lazy, Suspense } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Swords, Crosshair, Target, Zap, Skull, Flame, Share2, Check } from 'lucide-react';
import Card from '../Card.jsx';
import StatReadout from '../StatReadout.jsx';
import ActivityCalendar from '../ActivityCalendar.jsx';
import Modal from '../Modal.jsx';
import KDAStat from '../KDAStat.jsx';
import InfoTip from '../InfoTip.jsx';
import Highlights from '../Highlights.jsx';
import SessionGoal from '../SessionGoal.jsx';
import InviteFriendsCard from '../InviteFriendsCard.jsx';
import AdSlot from '../AdSlot.jsx';
import TabLoading from '../TabLoading.jsx';

// Match-detail stats only render once a game row is clicked — splitting it out of the
// main bundle keeps everyone else's initial load lean.
const GameScoreboard = lazy(() => import('../GameScoreboard.jsx'));
import {
  rrHistory, badgeDefs, getMatchScoreboard, isBadgeUnlocked, getBadgeProgress, getStreaks,
  computeAverageAcs, computeAggregateKDA, computeAverageAccuracy, computeAverageHeadshots,
  computeFirstBloods, computeClutchRecord,
} from '../../data/mockData.js';
import { getAgentIcon, getMapImage } from '../../data/valorantAssets.js';
import { renderShareCard, downloadBlob, copyBlobToClipboard } from '../../lib/shareImage.js';

const MODE_LABEL_KEY = { competitive: 'modeCompetitive', unrated: 'modeUnrated', deathmatch: 'modeDeathmatch' };

export default function OverviewTab({ t, accent, isPremium, filteredGames }) {
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);

  const wins = filteredGames.filter((g) => g.result === 'win').length;
  const losses = filteredGames.length - wins;
  const winRate = filteredGames.length ? Math.round((wins / filteredGames.length) * 100) : null;
  const best = filteredGames.reduce((acc, g) => {
    const [k, d] = g.kda.split('/').map(Number);
    return k - d > acc.diff ? { diff: k - d, label: `${k}/${d}` } : acc;
  }, { diff: -Infinity, label: '—' });
  const worst = filteredGames.reduce((acc, g) => {
    const [k, d] = g.kda.split('/').map(Number);
    return k - d < acc.diff ? { diff: k - d, label: `${k}/${d}` } : acc;
  }, { diff: Infinity, label: '—' });

  const selectedMatch = selectedGameId ? getMatchScoreboard(selectedGameId) : null;
  const streaks = getStreaks(filteredGames);

  // Stat grid — genuinely derived from the filtered games, same as the rest of
  // Overview, rather than a fixed snapshot that ignores the global filter.
  const avgAcs = computeAverageAcs(filteredGames);
  const avgKda = computeAggregateKDA(filteredGames);
  const avgAccuracy = computeAverageAccuracy(filteredGames);
  const avgHeadshots = computeAverageHeadshots(filteredGames);
  const firstBloods = computeFirstBloods(filteredGames);
  const clutches = computeClutchRecord(filteredGames);

  async function handleShare() {
    setSharing(true);
    try {
      const blob = await renderShareCard({
        accent,
        rank: 'DIAMOND 2',
        playerName: 'KAITO#EUW1',
        stats: [
          { label: t.games, value: filteredGames.length },
          { label: t.record, value: `${wins}${t.winShort}-${losses}${t.lossShort}` },
          { label: t.best, value: best.label },
          { label: t.streakLabel, value: `${streaks.currentCount}${streaks.currentType === 'win' ? t.winShort : t.lossShort}` },
        ],
        footerText: t.sampleData,
      });
      downloadBlob(blob, 'scope-session.png');
      await copyBlobToClipboard(blob);
      setShared(true);
      setTimeout(() => setShared(false), 1800);
    } finally {
      setSharing(false);
    }
  }

  return (
    <>
      <Highlights t={t} filteredGames={filteredGames} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300">{t.rrEvolution}</span>
            <span className="text-[11px] font-mono text-accent">{t.rrSub}</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rrHistory} margin={{ top: 5, right: 5, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="rrGrad" x1="0" y1="0" x2="0" y2="1">
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
                <Area type="monotone" dataKey="rr" stroke={accent} strokeWidth={2} fill="url(#rrGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.sessionSummary}</span>
            <button
              onClick={handleShare}
              disabled={sharing}
              className="flex items-center gap-1 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors disabled:opacity-50"
            >
              {shared ? <Check size={12} className="text-accent" /> : <Share2 size={12} />}
              {shared ? t.shareDownloaded : t.share}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div><div className="text-[11px] text-neutral-500 font-body mb-1">{t.games}</div><div className="font-mono text-xl text-white">{filteredGames.length}</div></div>
            <div><div className="text-[11px] text-neutral-500 font-body mb-1">{t.record}</div><div className="font-mono text-xl text-accent">{wins}{t.winShort} – {losses}{t.lossShort}</div></div>
            <div>
              <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-body mb-1">{t.winRateLabel}<InfoTip text={t.tipWinRate} /></div>
              <div className="font-mono text-xl text-white">{winRate !== null ? `${winRate}%` : '—'}</div>
            </div>
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
                      <KDAStat kills={k} deaths={d} assists={a} showDiff />
                      <span className="flex flex-col items-end w-11 shrink-0">
                        <span className="font-mono text-xs text-white">{g.acs}</span>
                        <span className="text-[8px] text-neutral-600 uppercase tracking-wide">{t.statACS}</span>
                      </span>
                      <span className="font-mono text-xs text-white">{g.score}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </Card>

        <AdSlot t={t} isPremium={isPremium} variant="banner" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <StatReadout label={t.statKDA} value={avgKda ?? '—'} Icon={Swords} tip={t.tipKDA} />
          <StatReadout label={t.statAccuracy} value={avgAccuracy ?? '—'} unit={avgAccuracy !== null ? '%' : undefined} Icon={Crosshair} tip={t.tipAccuracy} />
          <StatReadout label={t.statHeadshots} value={avgHeadshots ?? '—'} unit={avgHeadshots !== null ? '%' : undefined} Icon={Target} tip={t.tipHeadshots} />
          <StatReadout label={t.statACS} value={avgAcs ?? '—'} Icon={Zap} tip={t.tipACS} />
          <StatReadout label={t.statFirstBloods} value={firstBloods} Icon={Skull} tip={t.tipFirstBloods} />
          <StatReadout label={t.statClutches} value={clutches.won} unit={`/${clutches.played}`} Icon={Flame} tip={t.tipClutches} />
        </div>

        <InviteFriendsCard t={t} />

        <SessionGoal t={t} />

        <Card>
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.recentBadges}</span>
          <div className="flex flex-col gap-2">
            {badgeDefs.filter(isBadgeUnlocked).slice(0, 3).map((b) => {
              const Icon = b.icon;
              const info = t.badges[b.id];
              const progress = getBadgeProgress(b);
              return (
                <div key={b.id} className="sc-badge px-3 py-2 flex items-center justify-between gap-2.5">
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon size={14} className="text-accent shrink-0" />
                    <span className="text-xs font-body text-neutral-300 truncate">{info.label}</span>
                  </span>
                  {progress && (
                    <span
                      className="font-display text-[9px] font-bold uppercase tracking-wide px-1 py-0.5 shrink-0"
                      style={{ color: progress.tierColor, border: `1px solid ${progress.tierColor}` }}
                    >
                      {progress.tierName}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <ActivityCalendar t={t} />
        </Card>

        <AdSlot t={t} isPremium={isPremium} variant="rectangle" />
      </div>

      {selectedMatch && (
        <Modal onClose={() => setSelectedGameId(null)} closeLabel={t.close} size="lg">
          <Suspense fallback={<TabLoading />}>
            <GameScoreboard match={selectedMatch} t={t} />
          </Suspense>
        </Modal>
      )}
      </div>
    </>
  );
}
