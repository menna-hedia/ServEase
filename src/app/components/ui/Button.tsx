import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-md shadow-sm',
        outline: 'border-2 border-border hover:bg-accent hover:text-accent-foreground hover:border-primary',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md shadow-sm',
        success: 'bg-success text-success-foreground hover:bg-success/90 hover:shadow-md shadow-sm',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export default Button;
