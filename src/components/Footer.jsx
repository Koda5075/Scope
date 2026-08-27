import ServerStatusBadge from './ServerStatusBadge.jsx';

export default function Footer({ t, lang }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 text-[11px] text-neutral-700 font-body">
      <div className="flex gap-4">
        <a href={`/cgu.html?lang=${lang}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">{t.cgu}</a>
        <a href={`/confidentialite.html?lang=${lang}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">{t.privacy}</a>
      </div>
      <ServerStatusBadge t={t} />
      <div>{t.sampleData}</div>
      <div className="max-w-md text-left text-neutral-800 leading-relaxed">
        {t.riotDisclaimer}
      </div>
    </div>
  );
}
