import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Users, Flame, TrendingUp, Swords, Lock, Crosshair, Target, ChevronRight,
  Zap, Skull, Trophy, Share2, Settings, Check, LogIn,
} from 'lucide-react';

const THEMES = {
  yellow: { accent: '#FFC300', dim: '#7A6100', label: 'Jaune' },
  cyan: { accent: '#35D0F0', dim: '#155A66', label: 'Cyan' },
  coral: { accent: '#FF5C72', dim: '#7A2C36', label: 'Corail' },
  mono: { accent: '#E5E5E5', dim: '#525252', label: 'Mono' },
};

const T = {
  en: {
    lastSession: 'Last session: today, 9:04 PM',
    rank: 'Current rank',
    tabs: { overview: 'Overview', agents: 'Agents & maps', compare: 'Comparisons', badges: 'Badges' },
    rrEvolution: 'RR progress',
    rrSub: '+29 over 7 sessions',
    sessionSummary: 'Session summary',
    share: 'Share',
    games: 'Games',
    record: 'Record',
    best: 'Best',
    worst: 'Worst',
    scopePerformance: 'Scope Performance',
    unlock: 'Unlock with subscription',
    perfDesc: 'Aim, consistency, impact and clutch — broken down from your real games',
    seePlans: 'See plans',
    statKDA: 'KDA', statAccuracy: 'Accuracy', statHeadshots: 'Headshots',
    statACS: 'ACS', statFirstBloods: 'First Bloods', statClutches: 'Clutches',
    recentBadges: 'Recent badges',
    agentPerf: 'Agent performance',
    mapPerf: 'Map performance',
    gamesShort: 'games',
    compareTitle: 'You vs Diamond 2 vs 30 days ago',
    you: 'You', rankAvg: 'Rank average', past30: '30 days ago',
    friendsBoard: 'Friends leaderboard — ACS',
    sampleData: 'Sample data — Scope mockup, phase 1',
    cgu: 'Terms', privacy: 'Privacy Policy',
    language: 'Language', appearance: 'Appearance',
    loginTitle: 'Track your progress. Understand your game. Improve.',
    loginSub: 'Connect your Riot account to see your VALORANT stats.',
    loginBtn: 'Sign in with my Riot account',
    loginConsent: 'Scope will access your rank, match history, and stats, only with your explicit consent. You can revoke access at any time.',
    loginDemo: '(Demo — real sign-in will be enabled once the production key is approved)',
    badges: {
      teamPlayer: { label: 'Team Player', sub: '50 coordinated games' },
      aceX3: { label: 'Ace x3', sub: 'Solo highlight' },
      headshots200: { label: '200 Headshots', sub: 'Cumulative accuracy' },
      streak5: { label: '5-day streak', sub: 'Consistency' },
      newTier: { label: 'New tier', sub: 'Diamond reached' },
      top15: { label: 'Top 15% of server', sub: 'Regional ranking' },
    },
  },
  fr: {
    lastSession: "Dernière session : aujourd'hui, 21h04",
    rank: 'Rang actuel',
    tabs: { overview: 'Vue d\u2019ensemble', agents: 'Agents & cartes', compare: 'Comparaisons', badges: 'Badges' },
    rrEvolution: 'Évolution du RR',
    rrSub: '+29 sur 7 sessions',
    sessionSummary: 'Résumé de session',
    share: 'Partager',
    games: 'Parties',
    record: 'Bilan',
    best: 'Meilleure',
    worst: 'Pire',
    scopePerformance: 'Scope Performance',
    unlock: "Débloquer avec l'abonnement",
    perfDesc: 'Aim, régularité, impact et clutch — décomposés à partir de tes vraies parties',
    seePlans: 'Voir les offres',
    statKDA: 'KDA', statAccuracy: 'Précision', statHeadshots: 'Headshots',
    statACS: 'ACS', statFirstBloods: 'First Bloods', statClutches: 'Clutchs',
    recentBadges: 'Derniers badges',
    agentPerf: 'Performance par agent',
    mapPerf: 'Performance par carte',
    gamesShort: 'parties',
    compareTitle: 'Toi vs Diamond 2 vs il y a 30 jours',
    you: 'Toi', rankAvg: 'Moyenne du rang', past30: 'Il y a 30 jours',
    friendsBoard: 'Classement entre amis — ACS',
    sampleData: "Données d'exemple — maquette Scope, phase 1",
    cgu: 'CGU', privacy: 'Politique de confidentialité',
    language: 'Langue', appearance: 'Apparence',
    loginTitle: 'Suis ta progression. Comprends ton jeu. Progresse.',
    loginSub: 'Connecte ton compte Riot pour voir tes statistiques VALORANT.',
    loginBtn: 'Se connecter avec mon compte Riot',
    loginConsent: "Scope accédera à ton rang, ton historique de parties et tes statistiques, uniquement avec ton accord explicite. Tu peux révoquer cet accès à tout moment.",
    loginDemo: '(Démo — la connexion réelle sera activée une fois la clé de production approuvée)',
    badges: {
      teamPlayer: { label: 'Team Player', sub: '50 parties coordonnées' },
      aceX3: { label: 'Ace x3', sub: 'Exploit solo' },
      headshots200: { label: '200 Headshots', sub: 'Précision cumulée' },
      streak5: { label: '5 jours d\u2019affilée', sub: 'Régularité' },
      newTier: { label: 'Nouveau palier', sub: 'Diamond atteint' },
      top15: { label: 'Top 15% du serveur', sub: 'Classement régional' },
    },
  },
  de: {
    lastSession: 'Letzte Sitzung: heute, 21:04 Uhr',
    rank: 'Aktueller Rang',
    tabs: { overview: 'Übersicht', agents: 'Agenten & Karten', compare: 'Vergleiche', badges: 'Abzeichen' },
    rrEvolution: 'RR-Verlauf',
    rrSub: '+29 über 7 Sitzungen',
    sessionSummary: 'Sitzungsübersicht',
    share: 'Teilen',
    games: 'Spiele',
    record: 'Bilanz',
    best: 'Beste',
    worst: 'Schlechteste',
    scopePerformance: 'Scope Performance',
    unlock: 'Mit Abo freischalten',
    perfDesc: 'Zielgenauigkeit, Konstanz, Impact und Clutch — aus deinen echten Spielen berechnet',
    seePlans: 'Angebote ansehen',
    statKDA: 'KDA', statAccuracy: 'Genauigkeit', statHeadshots: 'Headshots',
    statACS: 'ACS', statFirstBloods: 'First Bloods', statClutches: 'Clutches',
    recentBadges: 'Neueste Abzeichen',
    agentPerf: 'Leistung nach Agent',
    mapPerf: 'Leistung nach Karte',
    gamesShort: 'Spiele',
    compareTitle: 'Du vs. Diamond 2 vs. vor 30 Tagen',
    you: 'Du', rankAvg: 'Rang-Durchschnitt', past30: 'Vor 30 Tagen',
    friendsBoard: 'Freundesrangliste — ACS',
    sampleData: 'Beispieldaten — Scope-Mockup, Phase 1',
    cgu: 'AGB', privacy: 'Datenschutz',
    language: 'Sprache', appearance: 'Erscheinungsbild',
    loginTitle: 'Verfolge deinen Fortschritt. Verstehe dein Spiel. Verbessere dich.',
    loginSub: 'Verbinde dein Riot-Konto, um deine VALORANT-Statistiken zu sehen.',
    loginBtn: 'Mit Riot-Konto anmelden',
    loginConsent: 'Scope greift nur mit deiner ausdrücklichen Zustimmung auf deinen Rang, deinen Spielverlauf und deine Statistiken zu. Du kannst den Zugriff jederzeit widerrufen.',
    loginDemo: '(Demo — die echte Anmeldung wird aktiviert, sobald der Produktionsschlüssel genehmigt ist)',
    badges: {
      teamPlayer: { label: 'Team Player', sub: '50 koordinierte Spiele' },
      aceX3: { label: 'Ace x3', sub: 'Solo-Highlight' },
      headshots200: { label: '200 Headshots', sub: 'Kumulierte Genauigkeit' },
      streak5: { label: '5 Tage in Folge', sub: 'Konstanz' },
      newTier: { label: 'Neue Stufe', sub: 'Diamond erreicht' },
      top15: { label: 'Top 15% des Servers', sub: 'Regionales Ranking' },
    },
  },
  es: {
    lastSession: 'Última sesión: hoy, 21:04',
    rank: 'Rango actual',
    tabs: { overview: 'Resumen', agents: 'Agentes y mapas', compare: 'Comparaciones', badges: 'Insignias' },
    rrEvolution: 'Evolución de RR',
    rrSub: '+29 en 7 sesiones',
    sessionSummary: 'Resumen de la sesión',
    share: 'Compartir',
    games: 'Partidas',
    record: 'Balance',
    best: 'Mejor',
    worst: 'Peor',
    scopePerformance: 'Scope Performance',
    unlock: 'Desbloquear con la suscripción',
    perfDesc: 'Puntería, consistencia, impacto y clutch — calculados a partir de tus partidas reales',
    seePlans: 'Ver planes',
    statKDA: 'KDA', statAccuracy: 'Precisión', statHeadshots: 'Headshots',
    statACS: 'ACS', statFirstBloods: 'First Bloods', statClutches: 'Clutches',
    recentBadges: 'Insignias recientes',
    agentPerf: 'Rendimiento por agente',
    mapPerf: 'Rendimiento por mapa',
    gamesShort: 'partidas',
    compareTitle: 'Tú vs Diamond 2 vs hace 30 días',
    you: 'Tú', rankAvg: 'Media del rango', past30: 'Hace 30 días',
    friendsBoard: 'Clasificación entre amigos — ACS',
    sampleData: 'Datos de ejemplo — maqueta de Scope, fase 1',
    cgu: 'Términos', privacy: 'Privacidad',
    language: 'Idioma', appearance: 'Apariencia',
    loginTitle: 'Sigue tu progreso. Entiende tu juego. Mejora.',
    loginSub: 'Conecta tu cuenta de Riot para ver tus estadísticas de VALORANT.',
    loginBtn: 'Iniciar sesión con mi cuenta de Riot',
    loginConsent: 'Scope accederá a tu rango, historial de partidas y estadísticas solo con tu consentimiento explícito. Puedes revocar el acceso en cualquier momento.',
    loginDemo: '(Demo — el inicio de sesión real se activará una vez aprobada la clave de producción)',
    badges: {
      teamPlayer: { label: 'Team Player', sub: '50 partidas coordinadas' },
      aceX3: { label: 'Ace x3', sub: 'Jugada individual destacada' },
      headshots200: { label: '200 Headshots', sub: 'Precisión acumulada' },
      streak5: { label: '5 días seguidos', sub: 'Constancia' },
      newTier: { label: 'Nuevo nivel', sub: 'Diamond alcanzado' },
      top15: { label: 'Top 15% del servidor', sub: 'Clasificación regional' },
    },
  },
  it: {
    lastSession: 'Ultima sessione: oggi, 21:04',
    rank: 'Rango attuale',
    tabs: { overview: 'Panoramica', agents: 'Agenti e mappe', compare: 'Confronti', badges: 'Badge' },
    rrEvolution: 'Andamento RR',
    rrSub: '+29 in 7 sessioni',
    sessionSummary: 'Riepilogo sessione',
    share: 'Condividi',
    games: 'Partite',
    record: 'Bilancio',
    best: 'Migliore',
    worst: 'Peggiore',
    scopePerformance: 'Scope Performance',
    unlock: "Sblocca con l'abbonamento",
    perfDesc: 'Mira, costanza, impatto e clutch — calcolati dalle tue partite reali',
    seePlans: 'Vedi i piani',
    statKDA: 'KDA', statAccuracy: 'Precisione', statHeadshots: 'Headshots',
    statACS: 'ACS', statFirstBloods: 'First Bloods', statClutches: 'Clutches',
    recentBadges: 'Badge recenti',
    agentPerf: 'Prestazioni per agente',
    mapPerf: 'Prestazioni per mappa',
    gamesShort: 'partite',
    compareTitle: 'Tu vs Diamond 2 vs 30 giorni fa',
    you: 'Tu', rankAvg: 'Media del rango', past30: '30 giorni fa',
    friendsBoard: 'Classifica tra amici — ACS',
    sampleData: 'Dati di esempio — mockup Scope, fase 1',
    cgu: 'Termini', privacy: 'Privacy',
    language: 'Lingua', appearance: 'Aspetto',
    loginTitle: 'Monitora i tuoi progressi. Capisci il tuo gioco. Migliora.',
    loginSub: 'Collega il tuo account Riot per vedere le tue statistiche VALORANT.',
    loginBtn: 'Accedi con il mio account Riot',
    loginConsent: 'Scope accederà al tuo rango, alla cronologia partite e alle statistiche solo con il tuo consenso esplicito. Puoi revocare l\u2019accesso in qualsiasi momento.',
    loginDemo: "(Demo — l'accesso reale sarà attivato una volta approvata la chiave di produzione)",
    badges: {
      teamPlayer: { label: 'Team Player', sub: '50 partite coordinate' },
      aceX3: { label: 'Ace x3', sub: 'Giocata solista' },
      headshots200: { label: '200 Headshots', sub: 'Precisione cumulativa' },
      streak5: { label: '5 giorni consecutivi', sub: 'Costanza' },
      newTier: { label: 'Nuovo livello', sub: 'Diamond raggiunto' },
      top15: { label: 'Top 15% del server', sub: 'Classifica regionale' },
    },
  },
  pt: {
    lastSession: 'Última sessão: hoje, 21:04',
    rank: 'Rank atual',
    tabs: { overview: 'Visão geral', agents: 'Agentes e mapas', compare: 'Comparações', badges: 'Emblemas' },
    rrEvolution: 'Evolução de RR',
    rrSub: '+29 em 7 sessões',
    sessionSummary: 'Resumo da sessão',
    share: 'Partilhar',
    games: 'Partidas',
    record: 'Resultado',
    best: 'Melhor',
    worst: 'Pior',
    scopePerformance: 'Scope Performance',
    unlock: 'Desbloquear com a subscrição',
    perfDesc: 'Mira, consistência, impacto e clutch — calculados a partir das tuas partidas reais',
    seePlans: 'Ver planos',
    statKDA: 'KDA', statAccuracy: 'Precisão', statHeadshots: 'Headshots',
    statACS: 'ACS', statFirstBloods: 'First Bloods', statClutches: 'Clutches',
    recentBadges: 'Emblemas recentes',
    agentPerf: 'Desempenho por agente',
    mapPerf: 'Desempenho por mapa',
    gamesShort: 'partidas',
    compareTitle: 'Tu vs Diamond 2 vs há 30 dias',
    you: 'Tu', rankAvg: 'Média do rank', past30: 'Há 30 dias',
    friendsBoard: 'Classificação entre amigos — ACS',
    sampleData: 'Dados de exemplo — maquete Scope, fase 1',
    cgu: 'Termos', privacy: 'Privacidade',
    language: 'Idioma', appearance: 'Aparência',
    loginTitle: 'Acompanha o teu progresso. Entende o teu jogo. Melhora.',
    loginSub: 'Liga a tua conta Riot para veres as tuas estatísticas de VALORANT.',
    loginBtn: 'Iniciar sessão com a minha conta Riot',
    loginConsent: 'A Scope só acede ao teu rank, histórico de partidas e estatísticas com o teu consentimento explícito. Podes revogar o acesso a qualquer momento.',
    loginDemo: '(Demo — o login real será ativado assim que a chave de produção for aprovada)',
    badges: {
      teamPlayer: { label: 'Team Player', sub: '50 partidas coordenadas' },
      aceX3: { label: 'Ace x3', sub: 'Jogada solo em destaque' },
      headshots200: { label: '200 Headshots', sub: 'Precisão acumulada' },
      streak5: { label: '5 dias seguidos', sub: 'Consistência' },
      newTier: { label: 'Novo nível', sub: 'Diamond alcançado' },
      top15: { label: 'Top 15% do servidor', sub: 'Classificação regional' },
    },
  },
};

const rrHistory = [
  { s: 'S1', rr: 38 }, { s: 'S2', rr: 52 }, { s: 'S3', rr: 45 }, { s: 'S4', rr: 61 },
  { s: 'S5', rr: 57 }, { s: 'S6', rr: 74 }, { s: 'S7', rr: 67 },
];

const badgeDefs = [
  { id: 'teamPlayer', icon: Users }, { id: 'aceX3', icon: Swords },
  { id: 'headshots200', icon: Target }, { id: 'streak5', icon: Flame },
  { id: 'newTier', icon: TrendingUp }, { id: 'top15', icon: Trophy },
];

const agentStats = [ { name: 'Jett', games: 14, wr: 64 }, { name: 'Reyna', games: 9, wr: 56 }, { name: 'Sova', games: 6, wr: 50 } ];
const mapStats = [ { name: 'Bind', games: 8, wr: 62 }, { name: 'Ascent', games: 6, wr: 50 }, { name: 'Haven', games: 5, wr: 40 } ];
const performanceScore = [ { label: 'Aim', value: 82 }, { label: 'Consistency', value: 74 }, { label: 'Impact', value: 86 }, { label: 'Clutch', value: 61 } ];
const comparisons = [ { metric: 'ACS', you: 238, rankAvg: 210, past: 195, max: 300 }, { metric: 'KDA', you: 1.42, rankAvg: 1.25, past: 1.10, max: 2 } ];
const friends = [ { name: 'Nova#EUW1', acs: 261 }, { name: 'KAITO#EUW1', acs: 238, isYou: true }, { name: 'Miro#EUW1', acs: 204 } ];

function Card({ children, className = '' }) {
  return <div className={`sc-card ${className}`}>{children}</div>;
}

function StatReadout({ label, value, unit, Icon }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body">{label}</span>
        <Icon size={14} className="text-accent" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-2xl font-bold text-white">{value}</span>
        {unit && <span className="font-mono text-xs text-neutral-500">{unit}</span>}
      </div>
    </Card>
  );
}

function CompareRow({ label, value, max, tone }) {
  const pct = Math.min(100, (value / max) * 100);
  const barClass = tone === 'you' ? 'sc-fill' : tone === 'past' ? 'sc-fill-dim' : 'sc-fill-muted';
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-body text-neutral-400 w-32 shrink-0">{label}</span>
      <div className="flex-1 sc-track h-2 overflow-hidden">
        <div className={`h-full ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-xs text-neutral-300 w-12 text-right">{value}</span>
    </div>
  );
}

export default function ScopeDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState('overview');
  const [lang, setLang] = useState('en');
  const [theme, setTheme] = useState('yellow');
  const [showSettings, setShowSettings] = useState(false);
  const rrCurrent = 67;
  const rrGoal = 100;
  const t = T[lang];
  const accent = THEMES[theme].accent;

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('scope-lang');
      const savedTheme = localStorage.getItem('scope-theme');
      if (savedLang && T[savedLang]) setLang(savedLang);
      if (savedTheme && THEMES[savedTheme]) setTheme(savedTheme);
    } catch (e) { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('scope-lang', lang);
      localStorage.setItem('scope-theme', theme);
    } catch (e) { /* ignore */ }
  }, [lang, theme]);

  return (
    <div
      className="min-h-screen w-full bg-black text-neutral-100 font-body"
      style={{ '--accent': THEMES[theme].accent, '--accent-dim': THEMES[theme].dim }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');

        .font-display { font-family: 'Rajdhani', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .text-accent { color: var(--accent); }
        .bg-accent { background: var(--accent); }
        .border-accent { border-color: var(--accent); }

        .sc-card { background: #0F0F0F; border: 1px solid #262626; border-left: 3px solid var(--accent); padding: 16px 18px; }
        .sc-track { background: #1A1A1A; border: 1px solid #2A2A2A; }
        .sc-fill { background: var(--accent); box-shadow: 0 0 8px color-mix(in srgb, var(--accent) 45%, transparent); }
        .sc-fill-dim { background: var(--accent-dim); }
        .sc-fill-muted { background: #4D4D4D; }
        .sc-badge { background: #0F0F0F; border: 1px solid #262626; border-left: 2px solid var(--accent); }
        .locked-overlay { backdrop-filter: blur(3px); background: rgba(0,0,0,0.65); }
        .settings-panel { background: #0F0F0F; border: 1px solid #262626; }
        .swatch { width: 22px; height: 22px; border-radius: 999px; display: flex; align-items: center; justify-content: center; border: 2px solid transparent; cursor: pointer; }
      `}</style>

      <div className="max-w-5xl mx-auto px-5 py-8">

        {/* Wordmark + settings */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Scope" className="w-10 h-10 object-contain" />
            <div>
              <span className="font-display text-3xl font-bold tracking-wide text-white">SCOPE</span>
              <div className="h-[2px] w-14 bg-accent mt-1" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLoggedIn((s) => !s)}
              className="w-9 h-9 flex items-center justify-center bg-black border border-accent text-accent hover:opacity-80 transition-opacity"
              aria-label={loggedIn ? 'Se déconnecter' : 'Se connecter avec Riot'}
              title={loggedIn ? 'KAITO#EUW1 — connecté' : t.loginBtn}
            >
              <LogIn size={16} />
            </button>

            <div className="relative">
            <button
              onClick={() => setShowSettings((s) => !s)}
              className="w-9 h-9 flex items-center justify-center border border-neutral-800 text-neutral-400 hover:text-accent hover:border-accent transition-colors"
              aria-label="Settings"
            >
              <Settings size={16} />
            </button>

            {showSettings && (
              <div className="settings-panel absolute right-0 top-11 w-64 p-4 z-10">
                <div className="mb-4">
                  <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-2">{t.language}</div>
                  <div className="flex flex-wrap gap-2">
                    {['en', 'fr', 'de', 'es', 'it', 'pt'].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`px-3 py-1 text-xs font-display uppercase border transition-colors ${
                          lang === l ? 'border-accent text-accent' : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-2">{t.appearance}</div>
                  <div className="flex gap-2.5">
                    {Object.entries(THEMES).map(([key, val]) => (
                      <button
                        key={key}
                        onClick={() => setTheme(key)}
                        className="swatch"
                        style={{ background: val.accent, borderColor: theme === key ? '#fff' : 'transparent' }}
                        aria-label={val.label}
                        title={val.label}
                      >
                        {theme === key && <Check size={12} color={key === 'mono' ? '#000' : '#000'} strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          </div>
        </div>

        {!loggedIn ? (
          <div className="flex flex-col items-center text-center py-20 px-4">
            <img src="/logo.png" alt="Scope" className="w-16 h-16 object-contain mb-6" />
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white max-w-md mb-3">{t.loginTitle}</h1>
            <p className="text-sm text-neutral-400 font-body max-w-sm mb-8">{t.loginSub}</p>
            <button
              onClick={() => setLoggedIn(true)}
              className="flex items-center gap-2 bg-accent text-black font-display font-bold uppercase text-sm tracking-wide px-6 py-3 hover:opacity-90 transition-opacity"
            >
              <LogIn size={16} /> {t.loginBtn}
            </button>
            <p className="text-[11px] text-neutral-600 font-body max-w-xs mt-5 leading-relaxed">{t.loginConsent}</p>
            <p className="text-[10px] text-neutral-700 font-body mt-2 italic">{t.loginDemo}</p>
          </div>
        ) : (
        <>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-7">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-neutral-900 border border-neutral-700 flex items-center justify-center font-display font-bold text-lg text-accent">
              K
            </div>
            <div>
              <div className="font-display text-xl font-semibold tracking-wide text-white">KAITO<span className="text-neutral-600">#EUW1</span></div>
              <div className="text-xs text-neutral-500 font-body">{t.lastSession}</div>
            </div>
          </div>

          <div className="border border-neutral-800 bg-neutral-950 px-5 py-3 min-w-[220px]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-500 font-body">{t.rank}</span>
              <span className="font-display text-xs font-bold text-accent">DIAMOND 2</span>
            </div>
            <div className="sc-track h-2 w-full overflow-hidden">
              <div className="sc-fill h-full" style={{ width: `${rrCurrent}%` }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[11px] text-neutral-300">{rrCurrent} RR</span>
              <span className="font-mono text-[11px] text-neutral-600">/ {rrGoal}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-neutral-800 overflow-x-auto">
          {['overview', 'agents', 'compare', 'badges'].map((tb) => (
            <button
              key={tb}
              onClick={() => setTab(tb)}
              className={`font-display text-sm tracking-wide px-4 py-2 uppercase whitespace-nowrap transition-colors ${
                tab === tb ? 'text-accent border-b-2 border-accent' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {t.tabs[tb]}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-sm tracking-wide uppercase text-neutral-300">{t.rrEvolution}</span>
                  <span className="text-[11px] font-mono text-accent">{t.rrSub}</span>
                </div>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={rrHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="rrGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={accent} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={accent} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="s" tick={{ fill: '#737373', fontSize: 11 }} axisLine={{ stroke: '#262626' }} tickLine={false} />
                      <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                      <Tooltip contentStyle={{ background: '#0F0F0F', border: '1px solid #262626', fontSize: 12, fontFamily: 'JetBrains Mono' }} labelStyle={{ color: '#a3a3a3' }} />
                      <Area type="monotone" dataKey="rr" stroke={accent} strokeWidth={2} fill="url(#rrGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display text-sm tracking-wide uppercase text-neutral-300 block">{t.sessionSummary}</span>
                  <button className="flex items-center gap-1 text-[11px] font-body text-neutral-500 hover:text-accent transition-colors">
                    <Share2 size={12} /> {t.share}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div><div className="text-[11px] text-neutral-500 font-body mb-1">{t.games}</div><div className="font-mono text-xl text-white">7</div></div>
                  <div><div className="text-[11px] text-neutral-500 font-body mb-1">{t.record}</div><div className="font-mono text-xl text-accent">5V – 2D</div></div>
                  <div><div className="text-[11px] text-neutral-500 font-body mb-1">{t.best}</div><div className="font-mono text-xl text-white">24/9</div></div>
                  <div><div className="text-[11px] text-neutral-500 font-body mb-1">{t.worst}</div><div className="font-mono text-xl text-neutral-400">8/17</div></div>
                </div>
              </Card>

              <div className="relative">
                <Card>
                  <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-3 block">{t.scopePerformance}</span>
                  <div className="grid grid-cols-2 gap-3 opacity-40 select-none">
                    {performanceScore.map((p) => (
                      <div key={p.label}>
                        <div className="flex justify-between text-[11px] text-neutral-400 mb-1"><span>{p.label}</span><span>{p.value}</span></div>
                        <div className="sc-track h-1.5 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${p.value}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </Card>
                <div className="absolute inset-0 locked-overlay flex flex-col items-center justify-center gap-2">
                  <Lock size={18} className="text-accent" />
                  <span className="font-display text-xs tracking-wide uppercase text-neutral-100">{t.unlock}</span>
                  <span className="text-[10px] text-neutral-400 font-body text-center max-w-[220px]">{t.perfDesc}</span>
                  <button className="mt-1 flex items-center gap-1 text-[11px] font-body text-accent hover:underline">
                    {t.seePlans} <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <StatReadout label={t.statKDA} value="1.42" Icon={Swords} />
                <StatReadout label={t.statAccuracy} value="24" unit="%" Icon={Crosshair} />
                <StatReadout label={t.statHeadshots} value="31" unit="%" Icon={Target} />
                <StatReadout label={t.statACS} value="238" Icon={Zap} />
                <StatReadout label={t.statFirstBloods} value="9" Icon={Skull} />
                <StatReadout label={t.statClutches} value="3" unit="/5" Icon={Flame} />
              </div>

              <Card>
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
            </div>
          </div>
        )}

        {tab === 'agents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.agentPerf}</span>
              <div className="flex flex-col gap-3">
                {agentStats.map((a) => (
                  <div key={a.name} className="flex items-center gap-4">
                    <span className="font-display text-sm text-white w-16">{a.name}</span>
                    <div className="flex-1 sc-track h-2 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${a.wr}%` }} /></div>
                    <span className="font-mono text-xs text-neutral-500 w-20 text-right">{a.games} {t.gamesShort}</span>
                    <span className="font-mono text-xs text-accent w-12 text-right">{a.wr}%</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.mapPerf}</span>
              <div className="flex flex-col gap-3">
                {mapStats.map((m) => (
                  <div key={m.name} className="flex items-center gap-4">
                    <span className="font-display text-sm text-white w-16">{m.name}</span>
                    <div className="flex-1 sc-track h-2 overflow-hidden"><div className="sc-fill h-full" style={{ width: `${m.wr}%` }} /></div>
                    <span className="font-mono text-xs text-neutral-500 w-20 text-right">{m.games} {t.gamesShort}</span>
                    <span className="font-mono text-xs text-accent w-12 text-right">{m.wr}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab === 'compare' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-1 block">{t.compareTitle}</span>
              <div className="flex gap-3 mb-4 text-[10px] font-body text-neutral-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-accent inline-block" /> {t.you}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 bg-neutral-500 inline-block" /> {t.rankAvg}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 inline-block" style={{ background: THEMES[theme].dim }} /> {t.past30}</span>
              </div>
              <div className="flex flex-col gap-4">
                {comparisons.map((c) => (
                  <div key={c.metric}>
                    <div className="text-xs font-display uppercase text-neutral-300 mb-2">{c.metric}</div>
                    <div className="flex flex-col gap-1.5">
                      <CompareRow label={t.you} value={c.you} max={c.max} tone="you" />
                      <CompareRow label={t.rankAvg} value={c.rankAvg} max={c.max} tone="avg" />
                      <CompareRow label={t.past30} value={c.past} max={c.max} tone="past" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <span className="font-display text-sm tracking-wide uppercase text-neutral-300 mb-4 block">{t.friendsBoard}</span>
              <div className="flex flex-col gap-2">
                {[...friends].sort((a, b) => b.acs - a.acs).map((f, i) => (
                  <div key={f.name} className={`flex items-center justify-between px-3 py-2 border ${f.isYou ? 'border-accent bg-neutral-900' : 'border-neutral-800 bg-neutral-950'}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-neutral-500 w-4">{i + 1}</span>
                      <span className={`font-body text-sm ${f.isYou ? 'text-accent' : 'text-neutral-300'}`}>{f.name}</span>
                    </div>
                    <span className="font-mono text-sm text-white">{f.acs}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab === 'badges' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badgeDefs.map((b) => {
              const Icon = b.icon;
              const info = t.badges[b.id];
              return (
                <Card key={b.id}>
                  <div className="flex items-center gap-3">
                    <div className="sc-badge w-10 h-10 flex items-center justify-center shrink-0"><Icon size={18} className="text-accent" /></div>
                    <div>
                      <div className="font-display text-sm text-white">{info.label}</div>
                      <div className="text-[11px] text-neutral-500 font-body">{info.sub}</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        </>
        )}

        <div className="mt-10 flex flex-col items-center gap-3 text-[11px] text-neutral-700 font-body">
          <div className="flex gap-4">
            <a href="/cgu.html" className="hover:text-accent transition-colors">{t.cgu}</a>
            <a href="/confidentialite.html" className="hover:text-accent transition-colors">{t.privacy}</a>
          </div>
          <div>{t.sampleData}</div>
          <div className="max-w-md text-center text-neutral-800 leading-relaxed">
            Scope isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
          </div>
        </div>
      </div>
    </div>
  );
}
