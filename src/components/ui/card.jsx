import { cn } from '../../lib/utils';
export function Card({ className, ...props }) { return <div className={cn('rounded-2xl bg-white shadow-sm ring-1 ring-gray-200', className)} {...props} />; }
export function CardHeader({ className, ...props }) { return <div className={cn('p-4 border-b border-gray-100', className)} {...props} />; }
export function CardContent({ className, ...props }) { return <div className={cn('p-4', className)} {...props} />; }
