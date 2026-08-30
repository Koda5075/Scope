import { useEffect, useState } from 'react';
import { Swords, Crosshair, Target, Zap } from 'lucide-react';
import Card from '../components/Card.jsx';
import StatReadout from '../components/StatReadout.jsx';
import Footer from '../components/Footer.jsx';
import Avatar from '../components/Avatar.jsx';
import { T } from '../i18n/translations.js';
import { THEMES } from '../data/themes.js';
import { myStats, peakRank, badgeDefs } from '../data/mockData.js';
import { getRankIcon } from '../data/valorantAssets.js';

const CURRENT_RANK = 'DIAMOND 2';

const MOCK_PUBLIC_SLUG = 'kaito-euw1';

export default function PublicProfilePage({ slug }) {
  const [lang] = useState(() => {
    try {
      const saved = localStorage.getItem('scope-lang');
      return saved && T[saved] ? saved : 'en';
    } catch {
      return 'en';
    }
  });
  const [theme] = useState(() => {
    try {
      const saved = localStorage.getItem('scope-theme');
      return saved && THEMES[saved] ? saved : 'yellow';
    } catch {
      return 'yellow';
    }
  });
  const [publicVisible, setPublicVisible] = useState(true);

  // Deliberately never reads scope-avatar or scope-banner: personalization (photo,
  // banner, accent color) is only ever visible to the player who chose it, never to
  // anyone viewing their public profile — this page always renders the default letter
  // avatar and no banner, regardless of what's customized in the owner's own session.
  useEffect(() => {
    try {
      const stored = localStorage.getItem('scope-public-visible');
      if (stored !== null) setPublicVisible(stored === 'true');
    } catch {
      /* ignore */
    }
  }, []);

  const t = T[lang];
  const visible = slug === MOCK_PUBLIC_SLUG && publicVisible;

  return (
    <div
      className="min-h-screen w-full bg-black text-neutral-100 font-body"
      style={{ '--accent': THEMES[theme].accent, '--accent-dim': THEMES[theme].dim }}
    >
      <style>{`
        /* Fonts load via the <link> in index.html's <head>, not @import here. */
        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .text-accent { color: var(--accent); }
        .bg-accent { background: var(--accent); }
        .sc-card { background: #0F0F0F; border: 1px solid #262626; border-left: 3px solid var(--accent); padding: 16px 18px; }
        .sc-badge { background: #0F0F0F; border: 1px solid #262626; border-left: 2px solid var(--accent); }
        .val-icon { border: 1.5px solid var(--accent); background: transparent; padding: 2px; }
      `}</style>

      <div className="max-w-2xl mx-auto px-5 py-10">
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="Scope" className="w-9 h-9 object-contain" />
          <span className="font-display text-2xl font-bold tracking-wide text-white">SCOPE</span>
        </div>

        {visible ? (
          <>
            <div className="flex items-center gap-4 mb-6">
              <Avatar name="KAITO" size={56} />
              <div>
                <div className="font-display text-2xl font-semibold text-white">
                  KAITO<span className="text-neutral-600">#EUW1</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 font-body mt-1.5">
                  {getRankIcon(CURRENT_RANK) && <img src={getRankIcon(CURRENT_RANK)} alt="" className="val-icon w-6 h-6" />}
                  {CURRENT_RANK} · {t.peakRankLabel} {peakRank}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatReadout label={t.statKDA} value={myStats.kda} Icon={Swords} tip={t.tipKDA} />
              <StatReadout label={t.statAccuracy} value={myStats.accuracy} unit="%" Icon={Crosshair} tip={t.tipAccuracy} />
              <StatReadout label={t.statHeadshots} value={myStats.headshots} unit="%" Icon={Target} tip={t.tipHeadshots} />
              <StatReadout label={t.statACS} value={myStats.acs} Icon={Zap} tip={t.tipACS} />
            </div>

            <Card className="mb-6">
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

            <div className="text-[11px] text-neutral-600 font-body mb-8">{t.sampleData}</div>
          </>
        ) : (
          <div className="py-16 text-center text-neutral-500 font-body text-sm">{t.profileNotFound}</div>
        )}

        <Footer t={t} lang={lang} />
      </div>
    </div>
  );
}
