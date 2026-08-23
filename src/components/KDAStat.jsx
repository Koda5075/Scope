export default function KDAStat({ kills, deaths, assists, tone = 'default', showDiff = false }) {
  const valueClass = tone === 'you' ? 'text-accent' : 'text-neutral-300';
  const diff = kills - deaths;

  return (
    <span className="flex items-center gap-1.5 font-mono text-xs whitespace-nowrap">
      <span className="flex items-center gap-1">
        <span className={valueClass}>{kills}</span>
        <span className="text-neutral-600 text-[9px]">K</span>
        <span className="text-neutral-700">/</span>
        <span className="text-neutral-400">{deaths}</span>
        <span className="text-neutral-600 text-[9px]">D</span>
        <span className="text-neutral-700">/</span>
        <span className="text-neutral-400">{assists}</span>
        <span className="text-neutral-600 text-[9px]">A</span>
      </span>
      {showDiff && (
        <span className={diff >= 0 ? 'text-accent' : 'text-neutral-500'}>
          {diff >= 0 ? '+' : ''}{diff}
        </span>
      )}
    </span>
  );
}
