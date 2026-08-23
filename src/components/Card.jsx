export default function Card({ children, className = '', style }) {
  return <div className={`sc-card ${className}`} style={style}>{children}</div>;
}
