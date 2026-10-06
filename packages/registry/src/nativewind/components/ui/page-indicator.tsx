/**
 * ◆ Lumin in-app — Page Indicator ("1 of 20" over the PDF). Figma: PDF-Mobile-DS › ◆ Page Indicator.
 * Tokens: 5. Component › page-indicator/* — bg-secondary rounded-full px-2.5 py-1, text-xs font-medium
 * text-secondary-foreground. Announced as a live region so page changes are read out.
 */
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { View } from 'react-native';

function PageIndicator({
  page,
  total,
  className,
}: {
  page: number;
  total: number;
  className?: string;
}) {
  return (
    <View
      accessibilityLiveRegion="polite"
      aria-live="polite"
      className={cn('bg-secondary self-start rounded-full px-2.5 py-1', className)}>
      <Text className="text-secondary-foreground text-xs font-medium">
        {page} of {total}
      </Text>
    </View>
  );
}

export { PageIndicator };
