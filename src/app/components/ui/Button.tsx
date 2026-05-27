import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'active:scale-95',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md shadow-sm': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-md shadow-sm': variant === 'secondary',
            'border-2 border-border hover:bg-accent hover:text-accent-foreground hover:border-primary': variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md shadow-sm': variant === 'destructive',
            'bg-success text-success-foreground hover:bg-success/90 hover:shadow-md shadow-sm': variant === 'success',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-6 py-3': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
