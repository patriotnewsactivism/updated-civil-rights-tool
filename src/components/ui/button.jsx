import { cn } from '../../lib/utils';
export function Button({ className, variant = 'primary', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const styles = variant === 'primary' ? 'bg-brand-600 text-white hover:bg-brand-700' : variant === 'secondary' ? 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50' : 'text-gray-700 hover:bg-gray-100';
  return <button className={cn(base, styles, className)} {...props} />;
}
