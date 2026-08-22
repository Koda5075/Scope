import { useState } from 'react';
import { Flag } from 'lucide-react';

// Not wired to the real report-photo Edge Function yet: profiles shown here (searched
// players, the public profile page) are still mock data with no matching row in the
// real `users` table, so there's nothing real to attach a report to. The backend piece
// (supabase/functions/report-photo, photo_reports table) is real and ready.
export default function ReportPhotoButton({ t }) {
  const [reported, setReported] = useState(false);

  if (reported) {
    return <span className="text-[11px] font-body text-neutral-500">{t.reportSent}</span>;
  }

  return (
    <button
      onClick={() => setReported(true)}
      className="flex items-center gap-1 text-[11px] font-body text-neutral-600 hover:text-accent transition-colors"
    >
      <Flag size={11} /> {t.reportPhoto}
    </button>
  );
}
