import { Link } from 'react-router-dom';

const base = 'focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60';

export function PrimaryButton({ children, className = '', to, ...props }) {
  const classes = `${base} bg-ritual-text text-ritual-card shadow-soft hover:-translate-y-0.5 hover:bg-ritual-brown ${className}`;
  if (to) return <Link className={classes} to={to}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}

export function SecondaryButton({ children, className = '', to, ...props }) {
  const classes = `${base} border border-ritual-border bg-ritual-card text-ritual-text hover:-translate-y-0.5 hover:border-ritual-gold hover:text-ritual-gold ${className}`;
  if (to) return <Link className={classes} to={to}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}
