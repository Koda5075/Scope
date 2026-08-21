export default function Card({ children, className = '' }) {
  return <div className={`sc-card ${className}`}>{children}</div>;
}
