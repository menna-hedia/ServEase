import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'waiting' | 'pending' | 'confirmed' | 'completed' | 'refused' | 'outdated' | 'default';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-sm',
          {
            'bg-yellow-100 text-yellow-800': variant === 'waiting',
            'bg-orange-100 text-orange-800': variant === 'pending',
            'bg-blue-100 text-blue-800': variant === 'confirmed',
            'bg-green-100 text-green-800': variant === 'completed',
            'bg-red-100 text-red-800': variant === 'refused',
            'bg-gray-100 text-gray-800': variant === 'outdated',
            'bg-muted text-muted-foreground': variant === 'default',
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
