import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import type { ComponentStatus } from '@showcase/lib/constants';
import * as React from 'react';
import { ScrollView, View, type ViewProps } from 'react-native';

/**
 * Doc helpers for previews. Labels use the Figma property names (e.g. "Variant=PDF") so a preview
 * can be matched 1:1 with the PDF-Mobile-DS component set. ◆ = Lumin custom (not in RNR).
 */
function Spec({
  label,
  className,
  children,
  row = false,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
  row?: boolean;
}) {
  const custom = label.includes('◆');
  return (
    <View className={cn('w-full gap-2', className)}>
      <Text className={cn('text-xs', custom ? 'text-violet-600 dark:text-violet-400' : 'text-muted-foreground')}>
        {label}
      </Text>
      <View className={cn(row ? 'flex-row flex-wrap items-center gap-2' : 'gap-2')}>{children}</View>
    </View>
  );
}

/**
 * Vertical stack that scrolls when the preview is taller than the screen.
 * The scroll view spans the whole page width and the 16px side gutter lives INSIDE it: a scroll
 * view clips on both axes, so with the gutter outside, full-width controls lost the left/right
 * edge of their focus ring (3px) and shadows.
 */
function PreviewStack({ className, children, ...props }: ViewProps) {
  return (
    <ScrollView
      className="w-full"
      contentContainerClassName="min-h-full justify-center px-4 py-6 pb-24"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      <View className={cn('mx-auto w-full max-w-sm gap-6', className)} {...props}>
        {children}
      </View>
    </ScrollView>
  );
}

const STATUS_STYLE: Record<ComponentStatus, string> = {
  RNR: 'bg-secondary',
  'RNR + Custom': 'bg-violet-500/10',
  Custom: 'bg-violet-500/15',
  New: 'bg-blue-500/15',
};

function StatusChip({ status, className }: { status: ComponentStatus; className?: string }) {
  return (
    <View className={cn('rounded-full px-2 py-0.5', STATUS_STYLE[status], className)}>
      <Text
        className={cn(
          'text-[11px] font-medium',
          status === 'RNR' ? 'text-secondary-foreground' : 'text-violet-700 dark:text-violet-300',
          status === 'New' && 'text-blue-700 dark:text-blue-300'
        )}>
        {status === 'RNR' ? 'RNR' : `◆ ${status}`}
      </Text>
    </View>
  );
}

export { PreviewStack, Spec, StatusChip };
