// Tier colors are a stylized approximation of VALORANT's real rank palette, not a
// hotlinked asset — avoids adding another dependency on a third-party image mirror for
// a purely educational block. Widths shrink toward the top so the stack reads as a
// pyramid, Iron at the wide base up to Radiant at the point.
const TIERS = [
  { name: 'Radiant', color: '#FFF3B0', width: '32%' },
  { name: 'Immortal', color: '#B93A46', width: '42%' },
  { name: 'Ascendant', color: '#2FBE7C', width: '52%' },
  { name: 'Diamond', color: '#A97FE0', width: '62%' },
  { name: 'Platinum', color: '#3FA9A0', width: '72%' },
  { name: 'Gold', color: '#F2C94C', width: '82%' },
  { name: 'Silver', color: '#C0C4C9', width: '91%' },
  { name: 'Bronze', color: '#CD7F32', width: '96%' },
  { name: 'Iron', color: '#6B6B6B', width: '100%' },
];

export default function RankPyramid({ t }) {
  return (
    <div>
      <p className="text-xs text-neutral-400 font-body leading-relaxed mb-5">{t.rankPyramidDesc}</p>
      <div className="flex flex-col items-center gap-1.5">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="flex items-center justify-center text-center py-2 font-display text-xs font-bold uppercase tracking-wide"
            style={{ width: tier.width, background: `${tier.color}22`, border: `1px solid ${tier.color}`, color: tier.color }}
          >
            {tier.name}
          </div>
        ))}
      </div>
      <p className="text-[11px] text-neutral-500 font-body leading-relaxed mt-5">{t.rankPyramidRRNote}</p>
    </div>
  );
}
