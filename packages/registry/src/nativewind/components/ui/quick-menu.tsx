/**
 * ◆ Lumin in-app — Quick Menu (floating actions on a selected annotation). Figma: PDF-Mobile-DS › ◆ Quick Menu (Show color).
 * Tokens: 5. Component › quick-menu/* — bg-popover border border-border rounded-xl p-1 gap-1 shadow-md ·
 * [Color 44 (swatch → Annotation Sheet)] | Comment | Delete (Button Ghost icon), vertical separators h-6.
 * Position it above the selection (below if no room); keep 8px from the screen edges.
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { ColorSwatch } from '@/registry/nativewind/components/ui/color-swatch';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Separator } from '@/registry/nativewind/components/ui/separator';
import { cn } from '@/registry/nativewind/lib/utils';
import { ChatCircleIcon, TrashIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type QuickMenuProps = {
  color?: string;
  onColorPress?: () => void;
  onCommentPress?: () => void;
  onDeletePress?: () => void;
  className?: string;
};

function QuickMenu({
  color,
  onColorPress,
  onCommentPress,
  onDeletePress,
  className,
}: QuickMenuProps) {
  return (
    <View
      role="menu"
      className={cn(
        'bg-popover border-border flex-row items-center gap-1 self-start rounded-xl border p-1 shadow-md shadow-black/10',
        className
      )}>
      {color ? (
        <>
          <Pressable
            onPress={onColorPress}
            accessibilityRole="button"
            accessibilityLabel="Color and opacity"
            className="size-11 items-center justify-center rounded-full active:opacity-70">
            <ColorSwatch color={color} scale={0.75} />
          </Pressable>
          <Separator orientation="vertical" className="h-6" />
        </>
      ) : null}
      <Button variant="ghost" size="icon" onPress={onCommentPress} accessibilityLabel="Add comment">
        <Icon as={ChatCircleIcon} className="text-foreground size-5" />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button variant="ghost" size="icon" onPress={onDeletePress} accessibilityLabel="Delete">
        <Icon as={TrashIcon} className="text-foreground size-5" />
      </Button>
    </View>
  );
}

export { QuickMenu };
export type { QuickMenuProps };
