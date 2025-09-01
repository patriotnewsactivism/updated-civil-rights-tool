import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Input = forwardRef(({ 
  className, 
  type = 'text',
  error,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  const baseStyles = 'w-full rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  
  const errorStyles = error ? 'border-red-300 focus-visible:ring-red-500 text-red-900 placeholder:text-red-300' : '';
  
  // If we have icons, wrap the input in a container
  if (leftIcon || rightIcon) {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={cn(
            baseStyles,
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            errorStyles,
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
        
        {error && typeof error === 'string' && (
          <p className="mt-1 text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
  
  // Simple input without icons
  return (
    <>
      <input
        ref={ref}
        type={type}
        className={cn(baseStyles, errorStyles, className)}
        {...props}
      />
      
      {error && typeof error === 'string' && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </>
  );
});

Input.displayName = 'Input';