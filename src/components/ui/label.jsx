import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Label = forwardRef(({ 
  className, 
  required,
  optional,
  error,
  ...props 
}, ref) => {
  return (
    <label 
      ref={ref}
      className={cn(
        'mb-1 block text-sm font-medium',
        error ? 'text-red-700' : 'text-gray-700',
        className
      )} 
      {...props}
    >
      {props.children}
      
      {required && (
        <span className="ml-1 text-red-500" aria-hidden="true">*</span>
      )}
      
      {optional && (
        <span className="ml-1 text-gray-400 font-normal">(optional)</span>
      )}
    </label>
  );
});

Label.displayName = 'Label';