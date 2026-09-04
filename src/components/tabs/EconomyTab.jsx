import { Wallet, Users } from 'lucide-react';
import Card from '../Card.jsx';
import InfoTip from '../InfoTip.jsx';
import AdSlot from '../AdSlot.jsx';
import { roundBreakdown, economyStats } from '../../data/mockData.js';

export default function EconomyTab({ t, isPremium }) {
  const { syncRate, outOfSyncBuys, outOfSyncSaves } = economyStats;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-center gap-2 mb-1">
          <Wallet size={14} className="text-accent" />
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300">{t.economyRoundsTitle}</span>
        </div>
        <p className="text-[11px] text-neutral-500 font-body mb-4">{t.economyRoundsDesc}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
              <span className="flex items-center gap-1">{t.pistolRoundsLabel}<InfoTip text={t.tipPistolRounds} /></span>
              <span className="font-mono text-white">{roundBreakdown.pistolWr}%</span>
            </div>
            <div className="sc-track h-1.5 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${roundBreakdown.pistolWr}%` }} /></div>
          </div>
          <div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
              <span className="flex items-center gap-1">{t.ecoForceLabel}<InfoTip text={t.tipEcoForceRounds} /></span>
              <span className="font-mono text-white">{roundBreakdown.ecoForceWr}%</span>
            </div>
            <div className="sc-track h-1.5 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${roundBreakdown.ecoForceWr}%` }} /></div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-1">
          <Users size={14} className="text-accent" />
          <span className="font-display text-sm tracking-wide uppercase text-neutral-300">{t.economySyncTitle}</span>
        </div>
        <p className="text-[11px] text-neutral-500 font-body mb-4">{t.economySyncDesc}</p>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-display text-3xl font-bold text-white">{syncRate}%</span>
          <span className="text-xs text-neutral-500 font-body">{t.economySyncRateLabel}</span>
        </div>
        <div className="sc-track h-2 overflow-hidden mb-4"><div className="sc-fill h-full" style={{ width: `${syncRate}%` }} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-mono text-xl text-white">{outOfSyncBuys}</div>
            <div className="text-[11px] text-neutral-500 font-body">{t.economyOutOfSyncBuys}</div>
          </div>
          <div>
            <div className="font-mono text-xl text-white">{outOfSyncSaves}</div>
            <div className="text-[11px] text-neutral-500 font-body">{t.economyOutOfSyncSaves}</div>
          </div>
        </div>
      </Card>

      <AdSlot t={t} isPremium={isPremium} variant="banner" />
    </div>
  );
}
