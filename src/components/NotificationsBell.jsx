import { useState, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { alertsFeed } from '../data/mockData.js';
import { useClickOutside } from '../hooks/useClickOutside.js';

function fmt(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''));
}

// Per-type accent so the feed scans as categories, not one colour of row.
const TONE_COLOR = {
  success: 'var(--accent)',
  warn: '#F59E0B',
  hot: '#FB923C',
  info: '#38BDF8',
};

export default function NotificationsBell({ t, onManage }) {
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

  function dismiss(id) {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }

  // Collapses consecutive alerts that fall on the same day under one date header instead
  // of repeating "3 days ago" on every row — alerts arrive newest-first already, so this
  // is a single pass, no re-sorting needed.
  const groups = [];
  for (const a of alerts) {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.daysAgo === a.daysAgo) lastGroup.items.push(a);
    else groups.push({ daysAgo: a.daysAgo, items: [a] });
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
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-body">{t.alertsCenterTitle}</span>
            {alerts.length > 0 && (
              <button
                onClick={() => setAlerts([])}
                className="text-[10px] font-body text-neutral-500 hover:text-accent transition-colors"
              >
                {t.alertsClearAll}
              </button>
            )}
          </div>
          {alerts.length === 0 ? (
            <div className="text-xs font-body text-neutral-500 py-2">{t.alertsEmpty}</div>
          ) : (
            <div className="flex flex-col gap-3">
              {groups.map((group) => (
                <div key={`${group.daysAgo}-${group.items[0].id}`} className="flex flex-col gap-2">
                  <div className="text-[10px] font-mono text-neutral-600">
                    {group.daysAgo === 0 ? t.alertToday : `${group.daysAgo}${t.daysAgoSuffix}`}
                  </div>
                  {group.items.map((a) => {
                    const Icon = a.icon;
                    const color = TONE_COLOR[a.tone] ?? 'var(--accent)';
                    return (
                      <div key={a.id} className="group flex items-start gap-2.5 px-3 py-2.5 border border-neutral-800 bg-neutral-950">
                        <span
                          className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full border"
                          style={{ color, borderColor: color, background: `color-mix(in srgb, ${color} 14%, transparent)` }}
                        >
                          <Icon size={14} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-body text-neutral-200 leading-snug">{fmt(t[a.messageKey], a.params)}</div>
                        </div>
                        <button
                          onClick={() => dismiss(a.id)}
                          aria-label={t.alertDismiss}
                          title={t.alertDismiss}
                          className="shrink-0 -mr-1 -mt-1 p-1 text-neutral-700 hover:text-accent transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
          {onManage && (
            <button
              onClick={() => { setOpen(false); onManage(); }}
              className="mt-3 w-full py-1.5 text-[10px] font-display uppercase tracking-wide text-neutral-500 border border-neutral-800 hover:border-accent hover:text-accent transition-colors"
            >
              {t.alertsManage}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
