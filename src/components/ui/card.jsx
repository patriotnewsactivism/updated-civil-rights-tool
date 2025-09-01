import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        'rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden transition-shadow',
        className
      )} 
      {...props} 
    />
  );
});

export const CardHeader = forwardRef(({ className, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={cn('p-4 border-b border-gray-100', className)} 
      {...props} 
    />
  );
});

export const CardTitle = forwardRef(({ className, ...props }, ref) => {
  return (
    <h3 
      ref={ref}
      className={cn('text-lg font-semibold text-gray-900', className)} 
      {...props} 
    />
  );
});

export const CardDescription = forwardRef(({ className, ...props }, ref) => {
  return (
    <p 
      ref={ref}
      className={cn('text-sm text-gray-500 mt-1', className)} 
      {...props} 
    />
  );
});

export const CardContent = forwardRef(({ className, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={cn('p-4', className)} 
      {...props} 
    />
  );
});

export const CardFooter = forwardRef(({ className, ...props }, ref) => {
  return (
    <div 
      ref={ref}
      className={cn('p-4 border-t border-gray-100', className)} 
      {...props} 
    />
  );
});

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';