import { useState, useEffect, lazy, Suspense } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Swords, Crosshair, Target, Zap, Skull, Flame, Share2, Check, Sparkles, Copy, X, CalendarClock } from 'lucide-react';
import Card from '../Card.jsx';
import StatReadout from '../StatReadout.jsx';
import ActivityCalendar from '../ActivityCalendar.jsx';
import StreakFlame from '../StreakFlame.jsx';
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
  computeFirstBloods, computeClutchRecord, performanceScore, computeSideWinrates, ACT_DAYS_REMAINING,
} from '../../data/mockData.js';
import { getAgentIcon, getMapImage, optimizeImg } from '../../data/valorantAssets.js';
import { renderShareCard, downloadBlob, copyBlobToClipboard } from '../../lib/shareImage.js';

const MODE_LABEL_KEY = { competitive: 'modeCompetitive', unrated: 'modeUnrated', deathmatch: 'modeDeathmatch' };
const WELCOME_SEEN_KEY = 'scope-welcome-seen';

export default function OverviewTab({ t, accent, isPremium, filteredGames }) {
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);
  const [statsCopied, setStatsCopied] = useState(false);
  const GAMES_PAGE = 8;
  const [visibleGames, setVisibleGames] = useState(GAMES_PAGE);
  // Collapse back to the first page whenever the global filter changes the list.
  useEffect(() => setVisibleGames(GAMES_PAGE), [filteredGames]);

  // Shown once, ever — first thing a brand-new account sees on Overview, separate from
  // the onboarding tour (which walks through the UI; this just says hello).
  const [showWelcome, setShowWelcome] = useState(() => {
    try {
      return localStorage.getItem(WELCOME_SEEN_KEY) !== 'true';
    } catch {
      return false;
    }
  });
  function dismissWelcome() {
    setShowWelcome(false);
    try { localStorage.setItem(WELCOME_SEEN_KEY, 'true'); } catch { /* ignore */ }
  }

  // Last game recorded — same "relative time, not a baked-in clock" reasoning as
  // PlayerHeader's account-level lastSession, just for the most recent match specifically.
  const [lastGameMinutesAgo] = useState(() => 3 + Math.floor(Math.random() * 40));

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
  // "Form" reuses the exact same streak data already driving the session-summary streak
  // readout below — just a one-word read on it (hot/cold/steady) rather than a second,
  // separately-computed metric.
  const form = streaks.currentType === 'win' && streaks.currentCount >= 3
    ? { key: 'formHot', color: 'text-accent' }
    : streaks.currentType === 'loss' && streaks.currentCount >= 2
      ? { key: 'formCold', color: 'text-red-500' }
      : { key: 'formSteady', color: 'text-neutral-400' };
  const sideWinrates = computeSideWinrates(filteredGames);

  // Stat grid — genuinely derived from the filtered games, same as the rest of
  // Overview, rather than a fixed snapshot that ignores the global filter.
  const avgAcs = computeAverageAcs(filteredGames);
  const avgKda = computeAggregateKDA(filteredGames);
  const avgAccuracy = computeAverageAccuracy(filteredGames);
  const avgHeadshots = computeAverageHeadshots(filteredGames);
  const firstBloods = computeFirstBloods(filteredGames);
  const clutches = computeClutchRecord(filteredGames);

  // Recent-vs-earlier momentum on the rate stats: filteredGames is most-recent-first,
  // so split it in half and diff the aggregates. Needs >= 4 games to mean anything.
  const half = Math.floor(filteredGames.length / 2);
  const recentHalf = filteredGames.slice(0, half);
  const earlierHalf = filteredGames.slice(half);
  const statDelta = (fn, decimals = 0) => {
    if (filteredGames.length < 4) return null;
    const r = fn(recentHalf);
    const e = fn(earlierHalf);
    if (r == null || e == null) return null;
    const p = 10 ** decimals;
    return Math.round((r - e) * p) / p;
  };
  const kdaDelta = statDelta(computeAggregateKDA, 2);
  const accuracyDelta = statDelta(computeAverageAccuracy);
  const headshotsDelta = statDelta(computeAverageHeadshots);
  const acsDelta = statDelta(computeAverageAcs);

  // Auto-generated one-line headline: picks whichever tracked stat improved the most
  // (ACS first as the most representative "impact" number when it ties with others),
  // falling back to a neutral games-played line once there isn't enough of a sample
  // for statDelta to return anything at all.
  const headlineCandidates = [
    { stat: t.statACS, delta: acsDelta },
    { stat: t.statAccuracy, delta: accuracyDelta, unit: '%' },
    { stat: t.statHeadshots, delta: headshotsDelta, unit: '%' },
    { stat: t.statKDA, delta: kdaDelta },
  ].filter((c) => c.delta !== null && c.delta > 0);
  const bestHeadline = headlineCandidates.sort((a, b) => b.delta - a.delta)[0];
  const sessionHeadline = bestHeadline
    ? t.sessionHeadlineGood.replace('{stat}', bestHeadline.stat).replace('{delta}', `+${bestHeadline.delta}${bestHeadline.unit ?? ''}`)
    : t.sessionHeadlineNeutral.replace('{games}', filteredGames.length);

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

  async function handleCopyStatsText() {
    const streakValue = `${streaks.currentCount}${streaks.currentType === 'win' ? t.winShort : t.lossShort}`;
    const lines = [
      `**${t.sessionSummary}**`,
      `${t.games}: ${filteredGames.length} | ${t.record}: ${wins}${t.winShort}-${losses}${t.lossShort} | ${t.winRateLabel}: ${winRate !== null ? `${winRate}%` : '—'}`,
      `${t.best}: ${best.label} | ${t.worst}: ${worst.label}`,
      `${t.streakLabel}: ${streakValue} (${t.bestStreak}: ${streaks.bestWinStreak}${t.winShort})`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setStatsCopied(true);
      setTimeout(() => setStatsCopied(false), 1800);
    } catch {
      /* ignore — clipboard unavailable */
    }
  }

  // Pinned for Scope+ subscribers only, next to the streak — the weekly coach
  // recommendation is otherwise only visible by opening the Scope+ tab, so it never
  // shows up as a reason to come back on a given day. Same weakest-metric logic as
  // PremiumTab's own card, just truncated to a one-line teaser here.
  const coachWeakest = performanceScore.reduce((min, p) => (p.value < min.value ? p : min), performanceScore[0]);
  const coachRecoText = t[`reco${coachWeakest.label}`];
  const coachRecoPreview = coachRecoText.split('. ')[0] + '.';

  return (
    <>
      {showWelcome && (
        <Card className="mb-4">
          <div className="flex items-start gap-3">
            <Sparkles size={14} className="text-accent shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block mb-1">
                {t.welcomeBannerTitle.replace('{name}', 'KAITO')}
              </span>
              <p className="text-xs font-body text-neutral-400 leading-relaxed">{t.welcomeBannerDesc}</p>
            </div>
            <button onClick={dismissWelcome} aria-label={t.close} className="shrink-0 text-neutral-600 hover:text-accent transition-colors">
              <X size={14} />
            </button>
          </div>
        </Card>
      )}
      <StreakFlame t={t} />
      <div className="mb-4 flex items-center gap-2 text-[11px] font-body text-neutral-500">
        <CalendarClock size={12} className="shrink-0" />
        {t.alertMsgActEnding.replace('{days}', ACT_DAYS_REMAINING)}
      </div>
      {isPremium && (
        <Card className="mb-4">
          <div className="flex items-start gap-3">
            <Sparkles size={14} className="text-accent shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block mb-1">{t.recoTitle}</span>
              <p className="text-xs font-body text-neutral-400 leading-relaxed">{coachRecoPreview}</p>
            </div>
          </div>
        </Card>
      )}
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
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-y-1">
            <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.sessionSummary}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyStatsText}
                className="flex items-center gap-1 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors"
              >
                {statsCopied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
                {statsCopied ? t.statsCopied : t.copyStatsButton}
              </button>
              <button
                onClick={handleShare}
                disabled={sharing}
                className="flex items-center gap-1 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors disabled:opacity-50"
              >
                {shared ? <Check size={12} className="text-accent" /> : <Share2 size={12} />}
                {shared ? t.shareDownloaded : t.share}
              </button>
            </div>
          </div>
          {filteredGames.length > 0 && (
            <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
              <p className="text-xs font-body text-neutral-400 leading-relaxed">{sessionHeadline}</p>
              <span className="font-mono text-[10px] text-neutral-600 shrink-0">{t.lastGameLabel.replace('{n}', lastGameMinutesAgo)}</span>
            </div>
          )}
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
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[11px] text-neutral-500 font-body">{t.streakLabel}</span>
                {filteredGames.length >= 4 && (
                  <span className={`text-[9px] font-display uppercase tracking-wide ${form.color}`}>{t[form.key]}</span>
                )}
              </div>
              <div className={`font-mono text-xl ${streaks.currentType === 'win' ? 'text-accent' : 'text-neutral-400'}`}>
                {streaks.currentCount}{streaks.currentType === 'win' ? t.winShort : t.lossShort}
              </div>
              <div className="text-[10px] text-neutral-600 font-mono mt-0.5">{t.bestStreak}: {streaks.bestWinStreak}{t.winShort}</div>
            </div>
          </div>
          {sideWinrates && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-neutral-900">
              <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 font-body shrink-0">{t.sideWinrateLabel}</span>
              <span className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-neutral-500">ATK</span><span className="text-white">{sideWinrates.atk}%</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-neutral-500">DEF</span><span className="text-white">{sideWinrates.def}%</span>
              </span>
            </div>
          )}
          {filteredGames.length > 0 && filteredGames.length < 5 && (
            <div className="text-[10px] text-neutral-600 font-body mt-3">
              {t.smallSampleNote.replace('{n}', filteredGames.length)}
            </div>
          )}
        </Card>

        <Card>
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.recentGamesTitle}</span>
          <div className="flex flex-col gap-1.5">
            {filteredGames.length === 0 ? (
              <div className="text-xs font-body text-neutral-500 py-2">{t.noGamesForFilter}</div>
            ) : (
              filteredGames.slice(0, visibleGames).map((g) => {
                const [k, d, a] = g.kda.split('/').map(Number);
                const mapImage = getMapImage(g.map);
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGameId(g.id)}
                    className="flex items-center justify-between gap-3 px-3 py-2 border border-neutral-800 hover:border-accent bg-neutral-950 transition-colors text-left flex-wrap sm:flex-nowrap"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-2 h-2 shrink-0 rounded-full ${g.result === 'win' ? 'bg-accent' : 'bg-red-500'}`} />
                      {mapImage && <img src={optimizeImg(mapImage.splash, 48)} alt="" loading="lazy" className="val-icon w-12 h-7 rounded object-cover shrink-0" />}
                      <span className="font-display text-sm font-semibold text-white truncate">{g.map}</span>
                      <span
                        className={`font-body text-[10px] uppercase tracking-wide px-1.5 py-0.5 shrink-0 border ${
                          g.mode === 'competitive' ? 'text-accent border-accent' : 'text-neutral-500 border-neutral-700'
                        }`}
                      >
                        {t[MODE_LABEL_KEY[g.mode]]}
                      </span>
                      <span className="flex items-center gap-2 font-mono text-[10px] text-neutral-600 shrink-0">
                        {getAgentIcon(g.agent) && <img src={optimizeImg(getAgentIcon(g.agent), 32)} alt="" loading="lazy" className="val-icon w-8 h-8 rounded-full object-cover" />}
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
          {filteredGames.length > visibleGames && (
            <button
              type="button"
              onClick={() => setVisibleGames((n) => n + GAMES_PAGE)}
              className="mt-2.5 w-full py-2 text-[11px] font-display uppercase tracking-wide text-neutral-400 border border-neutral-800 hover:border-accent hover:text-accent transition-colors"
            >
              {t.seeMore} ({filteredGames.length - visibleGames})
            </button>
          )}
        </Card>

        <AdSlot t={t} isPremium={isPremium} variant="banner" />
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <StatReadout label={t.statKDA} value={avgKda ?? '—'} Icon={Swords} tip={t.tipKDA} delta={kdaDelta} deltaTip={t.statTrendTip} />
          <StatReadout label={t.statAccuracy} value={avgAccuracy ?? '—'} unit={avgAccuracy !== null ? '%' : undefined} Icon={Crosshair} tip={t.tipAccuracy} delta={accuracyDelta} deltaTip={t.statTrendTip} />
          <StatReadout label={t.statHeadshots} value={avgHeadshots ?? '—'} unit={avgHeadshots !== null ? '%' : undefined} Icon={Target} tip={t.tipHeadshots} delta={headshotsDelta} deltaTip={t.statTrendTip} />
          <StatReadout label={t.statACS} value={avgAcs ?? '—'} Icon={Zap} tip={t.tipACS} delta={acsDelta} deltaTip={t.statTrendTip} />
          <StatReadout label={t.statFirstBloods} value={firstBloods} Icon={Skull} tip={t.tipFirstBloods} />
          <StatReadout label={t.statClutches} value={clutches.won} unit={`/${clutches.played}`} Icon={Flame} tip={t.tipClutches} />
        </div>

        <Card>
          <ActivityCalendar t={t} />
        </Card>

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
                      style={{ color: '#0A0A0A', background: progress.tierColor }}
                    >
                      {progress.tierName}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
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
