export default function KDAStat({ kills, deaths, assists, tone = 'default' }) {
  const valueClass = tone === 'you' ? 'text-accent' : 'text-neutral-300';
  return (
    <span className="flex items-center gap-1 font-mono text-xs whitespace-nowrap">
      <span className={valueClass}>{kills}</span>
      <span className="text-neutral-600 text-[9px]">K</span>
      <span className="text-neutral-700">/</span>
      <span className="text-neutral-400">{deaths}</span>
      <span className="text-neutral-600 text-[9px]">D</span>
      <span className="text-neutral-700">/</span>
      <span className="text-neutral-400">{assists}</span>
      <span className="text-neutral-600 text-[9px]">A</span>
    </span>
  );
}
