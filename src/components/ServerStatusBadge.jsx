import { useEffect, useState } from 'react';
import { serverStatus } from '../data/mockData.js';
import { fetchValStatus } from '../lib/riotLive.js';

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

// VALORANT's own platform status. Tries the val-status proxy (real data when a Riot
// key is configured server-side) and falls back to the mock value otherwise. Links
// out to Riot's official status page so the badge is a checkable claim.
const RIOT_STATUS_URL = 'https://status.riotgames.com/?product=valorant';

export default function ServerStatusBadge({ t }) {
  const [status, setStatus] = useState(serverStatus.status);

  useEffect(() => {
    let alive = true;
    fetchValStatus('eu').then((data) => {
      if (alive && data?.status && STATUS_COLOR[data.status]) setStatus(data.status);
    });
    return () => {
      alive = false;
    };
  }, []);

  const color = STATUS_COLOR[status];
  return (
    <a
      href={RIOT_STATUS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 hover:text-accent transition-colors"
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      <span>{t.serverStatusLabel} · {t[STATUS_LABEL_KEY[status]]}</span>
    </a>
  );
}
