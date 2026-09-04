import { useState } from 'react';
import { MessageSquarePlus, X } from 'lucide-react';

// No backend inbox exists yet, so this composes a real, pre-filled email to Scope's
// own registered contact address (the same one already used for legal/privacy
// inquiries in legal.html) via mailto: — honest about what actually happens on
// submit, rather than pretending to save feedback somewhere nobody reads it.
const FEEDBACK_EMAIL = 'contact@scopestats.com';

export default function FeedbackButton({ t }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  function handleSend(e) {
    e.preventDefault();
    const body = encodeURIComponent(message);
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent('Scope feedback')}&body=${body}`;
    setOpen(false);
    setMessage('');
  }

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && (
        <form
          onSubmit={handleSend}
          className="absolute bottom-12 right-0 w-72 bg-[#0F0F0F] border border-neutral-800 p-4 shadow-2xl flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-xs tracking-wide uppercase text-neutral-300">{t.feedbackModalTitle}</span>
            <button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="text-neutral-600 hover:text-accent transition-colors">
              <X size={14} />
            </button>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.feedbackPlaceholder}
            aria-label={t.feedbackPlaceholder}
            rows={4}
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-accent outline-none px-2.5 py-2 text-xs font-body text-neutral-200 placeholder:text-neutral-600 resize-none transition-colors"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="bg-accent text-black font-display font-bold uppercase text-xs tracking-wide px-3 py-2 hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {t.feedbackSend}
          </button>
        </form>
      )}
      <button
        onClick={() => setOpen((s) => !s)}
        aria-label={t.feedbackButtonAria}
        title={t.feedbackButtonAria}
        className="w-11 h-11 flex items-center justify-center bg-accent text-black shadow-lg hover:opacity-90 transition-opacity rounded-full"
      >
        <MessageSquarePlus size={18} />
      </button>
    </div>
  );
}
