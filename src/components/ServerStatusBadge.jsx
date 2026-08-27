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

export default function ServerStatusBadge({ t }) {
  const color = STATUS_COLOR[serverStatus.status];
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
      <span>{t[STATUS_LABEL_KEY[serverStatus.status]]}</span>
    </div>
  );
}
