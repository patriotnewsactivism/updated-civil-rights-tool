import { cn } from '../../lib/utils';
export function Input({ className, ...props }) {
  return (
    <input className={cn('w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2', className)} {...props} />
  );
}
