export default function Avatar({ name, photoUrl, size = 40 }) {
  const style = { width: size, height: size, fontSize: Math.max(11, size * 0.4) };

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        style={style}
        className="bg-neutral-900 border border-neutral-700 object-cover shrink-0"
      />
    );
  }

  return (
    <div
      style={style}
      className="bg-neutral-900 border border-neutral-700 flex items-center justify-center font-display font-bold text-accent shrink-0"
    >
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
}
