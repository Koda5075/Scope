import { LogIn } from 'lucide-react';

export default function LoginScreen({ t, setLoggedIn }) {
  return (
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
  );
}
