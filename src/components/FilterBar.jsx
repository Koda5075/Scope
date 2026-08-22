export default function FilterBar({ t, mode, setMode, period, setPeriod }) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 font-body">{t.filterMode}</span>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 text-xs font-body text-neutral-300 px-2 py-1.5 focus:border-accent outline-none"
        >
          <option value="all">{t.modeAll}</option>
          <option value="competitive">{t.modeCompetitive}</option>
          <option value="unrated">{t.modeUnrated}</option>
          <option value="deathmatch">{t.modeDeathmatch}</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-600 font-body">{t.filterPeriod}</span>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-neutral-950 border border-neutral-800 text-xs font-body text-neutral-300 px-2 py-1.5 focus:border-accent outline-none"
        >
          <option value="7d">{t.period7}</option>
          <option value="30d">{t.period30}</option>
          <option value="act">{t.periodAct}</option>
          <option value="all">{t.periodAll}</option>
        </select>
      </div>
    </div>
  );
}
