import { useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { alertsFeed } from '../data/mockData.js';
import { useClickOutside } from '../hooks/useClickOutside.js';

function fmt(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

export default function NotificationsBell({ t }) {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState(alertsFeed);
  const unreadCount = alerts.filter((a) => !a.read).length;
  const panelRef = useRef(null);
  useClickOutside(panelRef, open, () => setOpen(false));

  function toggle() {
    setOpen((s) => {
      const next = !s;
      if (next) setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
      return next;
    });
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={toggle}
        className="relative w-9 h-9 flex items-center justify-center border border-neutral-800 text-neutral-400 hover:text-accent hover:border-accent transition-colors"
        aria-label={t.alertsCenterTitle}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-accent text-[9px] font-bold text-black">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="settings-panel absolute right-0 top-11 w-80 max-h-[70vh] overflow-y-auto p-4 z-10">
          <div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body mb-3">{t.alertsCenterTitle}</div>
          {alerts.length === 0 ? (
            <div className="text-xs font-body text-neutral-500 py-2">{t.alertsEmpty}</div>
          ) : (
            <div className="flex flex-col gap-2">
              {alerts.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.id} className="flex items-start gap-2.5 px-3 py-2.5 border border-neutral-800 bg-neutral-950">
                    <Icon size={14} className="text-accent shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="text-xs font-body text-neutral-200 leading-snug">{fmt(t[a.messageKey], a.params)}</div>
                      <div className="text-[10px] font-mono text-neutral-600 mt-1">
                        {a.daysAgo === 0 ? t.alertToday : `${a.daysAgo}${t.daysAgoSuffix}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
