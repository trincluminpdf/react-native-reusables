/**
 * RNR Button + ◆ Lumin deltas (Figma: PDF-Mobile-DS › Button, tokens 5. Component › button/*):
 * 1. variant="pdf" — not in RNR: bg-blue-500 dark:bg-blue-600 + text-white, pressed /90.
 * 2. variant="destructive" — Lumin soft style (bg-destructive/10 + text-destructive). RNR is solid.
 * 3. loading — not in RNR: opacity-50 + Spinner before the label, onPress blocked.
 * 4. No shadow (RNR adds shadow-sm shadow-black/5).
 * Sizes follow RNR exactly: Mobile = base classes, Tablet = sm: (window ≥ 640).
 * Touch target: visual height 40/36 < 44 → hitSlop keeps the hit area at 44.
 */
import { Spinner } from '@/registry/nativewind/components/ui/spinner';
import { TextClassContext } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Pressable } from 'react-native';

const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 rounded-md shadow-none',
    Platform.select({
      web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    })
  ),
  {
    variants: {
      variant: {
        default: cn('bg-primary active:bg-primary/90', Platform.select({ web: 'hover:bg-primary/90' })),
        // ◆ Lumin
        pdf: cn(
          'bg-blue-500 active:bg-blue-500/90 dark:bg-blue-600 dark:active:bg-blue-600/90',
          Platform.select({ web: 'hover:bg-blue-500/90 dark:hover:bg-blue-600/90' })
        ),
        // ◆ Lumin soft destructive
        destructive: cn(
          'bg-destructive/10 active:bg-destructive/20 dark:bg-destructive/20 dark:active:bg-destructive/30',
          Platform.select({
            web: 'hover:bg-destructive/20 dark:hover:bg-destructive/30 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
          })
        ),
        outline: cn(
          'border-input bg-background active:bg-accent dark:bg-input/30 dark:border-input dark:active:bg-input/50 border',
          Platform.select({ web: 'hover:bg-accent dark:hover:bg-input/50' })
        ),
        secondary: cn(
          'bg-secondary active:bg-secondary/80',
          Platform.select({ web: 'hover:bg-secondary/80' })
        ),
        ghost: cn(
          'active:bg-accent dark:active:bg-accent/50',
          Platform.select({ web: 'hover:bg-accent dark:hover:bg-accent/50' })
        ),
        link: '',
      },
      size: {
        default: cn('h-10 px-4 py-2 sm:h-9', Platform.select({ web: 'has-[>svg]:px-3' })),
        sm: cn('h-9 gap-1.5 rounded-md px-3 sm:h-8', Platform.select({ web: 'has-[>svg]:px-2.5' })),
        lg: cn('h-11 rounded-md px-6 sm:h-10', Platform.select({ web: 'has-[>svg]:px-4' })),
        icon: 'h-10 w-10 sm:h-9 sm:w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva(
  cn(
    'text-foreground text-sm font-medium',
    Platform.select({ web: 'pointer-events-none transition-colors' })
  ),
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        pdf: 'text-white',
        destructive: 'text-destructive',
        outline: cn(
          'group-active:text-accent-foreground',
          Platform.select({ web: 'group-hover:text-accent-foreground' })
        ),
        secondary: 'text-secondary-foreground',
        ghost: 'group-active:text-accent-foreground',
        link: cn(
          'text-primary group-active:underline',
          Platform.select({ web: 'underline-offset-4 hover:underline group-hover:underline' })
        ),
      },
      size: {
        default: '',
        sm: '',
        lg: '',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/** 44pt touch target (5. Component › touch-target/min-size) for the 40/36/32 visual sizes. */
const HIT_SLOP: Record<NonNullable<VariantProps<typeof buttonVariants>['size']>, number> = {
  default: 2,
  sm: 4,
  lg: 0,
  icon: 2,
};

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    /** ◆ Lumin: shows a Spinner before the label and blocks onPress. */
    loading?: boolean;
  };

function Button({ className, variant, size, loading, disabled, children, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(
          (disabled || loading) && 'opacity-50',
          buttonVariants({ variant, size }),
          className
        )}
        role="button"
        hitSlop={HIT_SLOP[size ?? 'default']}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}>
        {(state) => (
          <>
            {loading ? <Spinner className="size-3.5" size={14} /> : null}
            {typeof children === 'function' ? children(state) : children}
          </>
        )}
      </Pressable>
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
