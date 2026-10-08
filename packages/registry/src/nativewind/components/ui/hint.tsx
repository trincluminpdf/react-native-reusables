/**
 * ◆ Lumin in-app (LPM batch) — Hint. Figma: PDF-Mobile-DS › 🆕 Hint
 * (Tone=Info / Neutral × Size=Full / Compact; Text, Show icon, Icon, Show action, Action, Show dismiss).
 * Tokens: 5. Component › hint/*.
 * One line of guidance for the current mode (reorder, form build, place signature), placed under the top bar.
 * Not for status feedback (→ Sonner).
 * px-4 py-2 gap-2 → 36 tall · optional leading icon size-4 (default ph-info fill; icon={null} hides it) ·
 * text text-sm font-medium · optional underlined text action (text-sm font-medium underline, 44 hit area) ·
 * optional dismiss ph-x size-4 (44 hit area; shown when onDismiss is set — the caller hides the hint).
 * Tone: Info = bg-card-blue + text-card-blue-foreground (default) · Neutral = bg-muted + text-foreground.
 * Size: Full = w-full rounded-xl, text may wrap to 2 lines · Compact = hugs the content, rounded-full, self-center,
 * one line that truncates, max width = container (screen − 32 inside the 16 gutter).
 * a11y: polite live region; the text is announced when the hint appears or changes.
 */
import { Icon, type IconComponent } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { InfoIcon, XIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type HintTone = 'info' | 'neutral';
type HintSize = 'full' | 'compact';

type HintProps = {
  /** The hint text. */
  children: React.ReactNode;
  /** Leading icon (rendered weight="fill"). Default ph-info; null = Show icon off. */
  icon?: IconComponent | null;
  tone?: HintTone;
  size?: HintSize;
  /** Show action: underlined text action, e.g. "Learn more". */
  actionLabel?: string;
  onActionPress?: () => void;
  /** Show dismiss: renders the X; the caller hides the hint. */
  onDismiss?: () => void;
  className?: string;
};

const TONE: Record<HintTone, { root: string; fg: string }> = {
  info: { root: 'bg-card-blue', fg: 'text-card-blue-foreground' },
  neutral: { root: 'bg-muted', fg: 'text-foreground' },
};

/** 20px text line + 12 top/bottom = 44. */
const ACTION_HIT_SLOP = { top: 12, bottom: 12, left: 8, right: 8 };
/** 16px icon + 14 each side = 44. */
const DISMISS_HIT_SLOP = 14;

function Hint({
  children,
  icon = InfoIcon,
  tone = 'info',
  size = 'full',
  actionLabel,
  onActionPress,
  onDismiss,
  className,
}: HintProps) {
  const t = TONE[tone];
  const compact = size === 'compact';
  return (
    <View
      aria-live="polite"
      className={cn(
        'flex-row items-center gap-2 px-4 py-2',
        t.root,
        compact ? 'max-w-full self-center rounded-full' : 'w-full rounded-xl',
        className
      )}>
      {icon ? <Icon as={icon} weight="fill" className={cn('size-4 shrink-0', t.fg)} /> : null}
      <Text
        accessibilityRole="text"
        numberOfLines={compact ? 1 : 2}
        className={cn('min-w-0 text-sm font-medium', compact ? 'shrink' : 'flex-1', t.fg)}>
        {children}
      </Text>
      {actionLabel ? (
        <Pressable
          onPress={onActionPress}
          hitSlop={ACTION_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          className="shrink-0 active:opacity-70">
          <Text numberOfLines={1} className={cn('text-sm font-medium underline', t.fg)}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
      {onDismiss ? (
        <Pressable
          onPress={onDismiss}
          hitSlop={DISMISS_HIT_SLOP}
          accessibilityRole="button"
          accessibilityLabel="Dismiss hint"
          className="shrink-0 rounded-full active:opacity-70">
          <Icon as={XIcon} className={cn('size-4', t.fg)} />
        </Pressable>
      ) : null}
    </View>
  );
}

export { Hint };
export type { HintProps, HintSize, HintTone };
