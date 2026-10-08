/**
 * ◆ Lumin in-app (LPM batch) — Outline Item. Figma: PDF-Mobile-DS › 🆕 Outline Item
 * (Mode=Default / Edit × Expand=None / Collapsed / Expanded × State=Default / Disabled; Title, Page, Nested).
 * Tokens: 5. Component › outline-item/*.
 * Entry of the document outline (bookmarks / TOC) in the Outline sheet.
 * Row px-4 py-4 gap-3 · [Edit: DS Checkbox] · indent pl-6 per depth (added to the 16 base padding) ·
 * expand slot size-6 (caret-right = Collapsed, caret-down = Expanded, icon size-4 text-foreground; Expand=None keeps the
 * empty slot so titles align), title-gap gap-2 · title text-sm text-foreground, wraps to 2 lines then truncates ·
 * page text-sm text-muted-foreground trailing · [Edit: drag handle ph-list size-5 text-muted-foreground] ·
 * Disabled = opacity-50. Separators belong to the list.
 * Default: tap row → go to page (onPress). Edit (select mode): tap row toggles the checkbox (onCheckedChange).
 * The caret toggles children inline (onToggleExpand), hit area 44.
 * Layout: the whole row is one Pressable laid out underneath the content (absolute fill); the content passes touches
 * through (pointerEvents none) except the caret button — so the caret is a sibling, not a button inside a button,
 * and pressed tints the whole row. The visible Checkbox is decorative (the row is the checkbox).
 * Interpretation: in Edit mode the checkbox stays in the leading column (not indented) so checkboxes align;
 * the indent applies to caret + title. Page number stays visible before the handle.
 */
import { Checkbox } from '@/registry/nativewind/components/ui/checkbox';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { CaretDownIcon, CaretRightIcon, ListIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type OutlineItemProps = {
  title: string;
  page: number | string;
  /** Nesting depth (0 = top level). Each step indents by 24 (pl-6). */
  depth?: number;
  mode?: 'default' | 'edit';
  expand?: 'none' | 'collapsed' | 'expanded';
  onToggleExpand?: () => void;
  disabled?: boolean;
  /** Mode=Edit: checkbox state. */
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Mode=Default: go to page. */
  onPress?: () => void;
  className?: string;
};

/** pl-6 per depth step. */
const INDENT = 24;
/** size-6 caret slot + 10 each side = 44 hit area. */
const CARET_HIT_SLOP = 10;

const noop = () => {};

function OutlineItem({
  title,
  page,
  depth = 0,
  mode = 'default',
  expand = 'none',
  onToggleExpand,
  disabled = false,
  checked = false,
  onCheckedChange,
  onPress,
  className,
}: OutlineItemProps) {
  const [pressed, setPressed] = React.useState(false);
  const edit = mode === 'edit';
  const expanded = expand === 'expanded';

  return (
    <View className={cn('relative', pressed && 'bg-accent', disabled && 'opacity-50', className)}>
      <Pressable
        onPress={edit ? () => onCheckedChange?.(!checked) : onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        disabled={disabled}
        accessibilityRole={edit ? 'checkbox' : 'button'}
        accessibilityLabel={`${title}, page ${page}`}
        accessibilityHint={edit ? undefined : 'Goes to page'}
        // accessibilityState for native; RN-web only reads aria-*.
        accessibilityState={edit ? { checked, disabled } : { disabled }}
        aria-checked={edit ? checked : undefined}
        aria-disabled={disabled || undefined}
        className="absolute inset-0"
      />
      <View pointerEvents="box-none" className="flex-row items-center gap-3 px-4 py-4">
        {edit ? (
          <View
            pointerEvents="none"
            aria-hidden
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants">
            <Checkbox checked={checked} onCheckedChange={noop} tabIndex={-1} />
          </View>
        ) : null}
        <View
          pointerEvents="box-none"
          className="min-w-0 flex-1 flex-row items-center gap-2"
          style={depth > 0 ? { paddingLeft: depth * INDENT } : undefined}>
          {expand === 'none' ? (
            <View pointerEvents="none" className="size-6" />
          ) : (
            <Pressable
              onPress={onToggleExpand}
              disabled={disabled}
              hitSlop={CARET_HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} ${title}`}
              accessibilityState={{ expanded, disabled }}
              aria-expanded={expanded}
              className="active:bg-accent size-6 items-center justify-center rounded-full">
              <Icon
                as={expanded ? CaretDownIcon : CaretRightIcon}
                className="text-foreground size-4"
              />
            </Pressable>
          )}
          <View
            pointerEvents="none"
            aria-hidden
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className="min-w-0 flex-1">
            <Text numberOfLines={2} className="text-foreground text-sm">
              {title}
            </Text>
          </View>
        </View>
        <View
          pointerEvents="none"
          aria-hidden
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          className="shrink-0 flex-row items-center gap-3">
          <Text className="text-muted-foreground text-sm">{page}</Text>
          {edit ? <Icon as={ListIcon} className="text-muted-foreground size-5" /> : null}
        </View>
      </View>
    </View>
  );
}

export { OutlineItem };
export type { OutlineItemProps };
