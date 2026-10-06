/**
 * RNR Badge + ◆ Lumin deltas (Figma: PDF-Mobile-DS › Badge, tokens badge/*, badge-number/*):
 * 1. variant="verified" and "ghost" — not in RNR.
 * 2. destructive is the Lumin soft style (bg-destructive/10 + text-destructive).
 * 3. Icons: compose <Icon size={12} /> inside (left/right).
 * 4. ◆ BadgeNumber — count pill (h-5, min-w-5, px-1) used in Tabs.
 * Badges are not pressable on mobile (no hover/focus states).
 */
import { TextClassContext } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { Slot } from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Platform, View } from 'react-native';

const badgeVariants = cva(
  cn(
    'border-border group shrink-0 flex-row items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5',
    Platform.select({
      web: 'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-fit whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3',
    })
  ),
  {
    variants: {
      variant: {
        default: 'bg-primary border-transparent',
        secondary: 'bg-secondary border-transparent',
        destructive: 'bg-destructive/10 dark:bg-destructive/20 border-transparent',
        outline: 'bg-background border-border',
        // ◆ Lumin
        verified: 'border-transparent bg-blue-500 dark:bg-blue-600',
        // ◆ Lumin
        ghost: 'border-transparent bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const badgeTextVariants = cva('text-xs font-medium', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive',
      outline: 'text-foreground',
      verified: 'text-white',
      ghost: 'text-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type BadgeProps = React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    asChild?: boolean;
  } & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
  const Component = asChild ? Slot : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component className={cn(badgeVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

type BadgeNumberProps = Omit<BadgeProps, 'variant'> & {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
};

/** ◆ Lumin: count pill (badge-number/*): h-5 min-w-5 px-1 rounded-full. */
function BadgeNumber({ className, variant, ...props }: BadgeNumberProps) {
  return <Badge variant={variant} className={cn('h-5 min-w-5 px-1 py-0', className)} {...props} />;
}

export { Badge, BadgeNumber, badgeTextVariants, badgeVariants };
export type { BadgeNumberProps, BadgeProps };
