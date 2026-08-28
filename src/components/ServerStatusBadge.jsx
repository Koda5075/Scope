import { serverStatus } from '../data/mockData.js';

const STATUS_COLOR = {
  operational: '#4ADE80',
  degraded: '#F59E0B',
  maintenance: '#F87171',
};

const STATUS_LABEL_KEY = {
  operational: 'serverStatusOperational',
  degraded: 'serverStatusDegraded',
  maintenance: 'serverStatusMaintenance',
};

// Reflects VALORANT's own platform status (mock for now — wired to Riot's
// /val/status/v1/platform-data later). Links out to Riot's official status page so
// the badge is a real, checkable claim rather than a decorative "all good".
const RIOT_STATUS_URL = 'https://status.riotgames.com/?product=valorant';

export default function ServerStatusBadge({ t }) {
  const color = STATUS_COLOR[serverStatus.status];
  return (
    <a
      href={RIOT_STATUS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 hover:text-accent transition-colors"
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      <span>{t.serverStatusLabel} · {t[STATUS_LABEL_KEY[serverStatus.status]]}</span>
    </a>
  );
}
