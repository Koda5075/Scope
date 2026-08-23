export default function Card({ children, className = '', style, ...rest }) {
  return (
    <div className={`sc-card ${className}`} style={style} {...rest}>
      {children}
    </div>
  );
}
