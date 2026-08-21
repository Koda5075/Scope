export default function Footer({ t, lang }) {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 text-[11px] text-neutral-700 font-body">
      <div className="flex gap-4">
        <a href={`/cgu.html?lang=${lang}`} className="hover:text-accent transition-colors">{t.cgu}</a>
        <a href={`/confidentialite.html?lang=${lang}`} className="hover:text-accent transition-colors">{t.privacy}</a>
      </div>
      <div>{t.sampleData}</div>
      <div className="max-w-md text-center text-neutral-800 leading-relaxed">
        Scope isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
      </div>
    </div>
  );
}
