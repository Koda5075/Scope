// Minimal placeholder shown while a lazy-loaded tab's chunk downloads — brief enough on
// a normal connection that it doesn't need translation or animation.
export default function TabLoading() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-6 h-6 border-2 border-neutral-700 border-t-accent rounded-full animate-spin" />
    </div>
  );
}
