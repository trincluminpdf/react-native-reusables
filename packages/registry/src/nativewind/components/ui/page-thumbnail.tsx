/**
 * ◆ Lumin in-app (LPM batch) — Page Thumbnail. Figma: PDF-Mobile-DS › 🆕 Page Thumbnail
 * (State=Default / Current / Selected × Orientation=Portrait / Landscape; Page number, Show checkbox, Show bookmark).
 * Tokens: 5. Component › page-thumbnail/*.
 * One page of the open document in Page tool / Organize / Extract pages. Width fills the grid column
 * (w-28 sm:w-40, override with className) · A4 aspect (portrait aspect-[1/1.414], landscape aspect-[1.414/1]) ·
 * frame p-1 rounded-sm border border-border bg-muted · active (Current / Selected) border-2 border-primary ·
 * page content = children, fills the page · number pill h-4 sm:h-5 px-1.5 rounded-sm bg-background, text-xs muted,
 * centered at the bottom inside the page (Current: bg-primary text-primary-foreground) · bookmark ph-bookmark-simple
 * fill size-4 text-primary top-right · select plate bg-background rounded-sm p-0.5 with DS Checkbox top-left.
 * The whole thumbnail is ONE tap target: in select mode it is the checkbox (role checkbox, checked = Selected),
 * otherwise a button "Page N". The visible Checkbox is decorative (pointer-events off, hidden from a11y) and sits
 * outside the Pressable, so there is no control inside a control on web.
 * Deltas: active state uses p-[3px] so the 2px border does not shift the page by 1px; State=Selected always shows
 * the checkbox (Show checkbox is only a choice on Default / Current).
 */
import { Checkbox } from '@/registry/nativewind/components/ui/checkbox';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { BookmarkSimpleIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type PageThumbnailState = 'default' | 'current' | 'selected';

type PageThumbnailProps = {
  /** 1-based page number (pill + spoken label "Page N"). */
  page: number;
  state?: PageThumbnailState;
  /** Follows the page. */
  orientation?: 'portrait' | 'landscape';
  /** Select mode: show the checkbox (Show checkbox). */
  selectable?: boolean;
  /** Bookmarked page (Show bookmark). */
  bookmarked?: boolean;
  /** Page image / content; fills the page area. */
  children?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  className?: string;
};

const noop = () => {};

function PageThumbnail({
  page,
  state = 'default',
  orientation = 'portrait',
  selectable = false,
  bookmarked = false,
  children,
  onPress,
  onLongPress,
  className,
}: PageThumbnailProps) {
  const current = state === 'current';
  const checked = state === 'selected';
  const active = current || checked;
  const selectMode = selectable || checked;

  return (
    <View className={cn('relative w-28 sm:w-40', className)}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole={selectMode ? 'checkbox' : 'button'}
        accessibilityLabel={`Page ${page}`}
        accessibilityHint={
          [current ? 'Current page' : null, bookmarked ? 'Bookmarked' : null]
            .filter(Boolean)
            .join(', ') || undefined
        }
        // accessibilityState for native; RN-web only reads aria-*.
        accessibilityState={selectMode ? { checked } : { selected: current }}
        aria-checked={selectMode ? checked : undefined}
        className={cn(
          'bg-muted w-full rounded-sm active:opacity-80',
          orientation === 'landscape' ? 'aspect-[1.414/1]' : 'aspect-[1/1.414]',
          active ? 'border-primary border-2 p-[3px]' : 'border-border border p-1'
        )}>
        <View className="flex-1 overflow-hidden rounded-[2px]">{children}</View>
      </Pressable>

      {/* Decorative overlay inside the page: checkbox plate · bookmark · number pill. */}
      <View
        pointerEvents="none"
        aria-hidden
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="absolute inset-0 justify-between p-2">
        <View className="flex-row items-start justify-between">
          {selectMode ? (
            <View className="bg-background rounded-sm p-0.5">
              <Checkbox checked={checked} onCheckedChange={noop} tabIndex={-1} />
            </View>
          ) : (
            <View />
          )}
          {bookmarked ? (
            <Icon as={BookmarkSimpleIcon} weight="fill" className="text-primary size-4" />
          ) : null}
        </View>
        <View className="items-center">
          <View
            className={cn(
              'h-4 items-center justify-center rounded-sm px-1.5 sm:h-5',
              current ? 'bg-primary' : 'bg-background'
            )}>
            <Text
              className={cn(
                'text-xs',
                current ? 'text-primary-foreground' : 'text-muted-foreground'
              )}>
              {page}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export { PageThumbnail };
export type { PageThumbnailProps, PageThumbnailState };
