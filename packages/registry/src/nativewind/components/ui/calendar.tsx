/**
 * ◆ Lumin NEW — not in RNR (DS-shadcn Calendar is a desktop layout). Figma: PDF-Mobile-DS › ◆ Calendar.
 * Tokens: 5. Component › calendar/*. Day cells are 44×44 (size-11) so every date meets the touch target.
 * Single and Range selection; range start/end use primary, middle uses accent.
 * Not used by Date Picker on device (that one is native) — for in-app calendar views and the web preview.
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { CaretLeftIcon, CaretRightIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type DateRange = { from?: Date; to?: Date };

type CalendarBaseProps = {
  className?: string;
  defaultMonth?: Date;
  /** Return true to disable a day. */
  disabled?: (date: Date) => boolean;
  showOutsideDays?: boolean;
  locale?: string;
};

type CalendarProps =
  | (CalendarBaseProps & { mode?: 'single'; selected?: Date; onSelect?: (date: Date) => void })
  | (CalendarBaseProps & { mode: 'range'; selected?: DateRange; onSelect?: (range: DateRange) => void });

const sameDay = (a?: Date, b?: Date) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

function buildWeeks(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(first);
  start.setDate(1 - first.getDay()); // weeks start on Sunday
  const weeks: Date[][] = [];
  const cursor = new Date(start);
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
    if (cursor.getMonth() !== month.getMonth() && w >= 3) break;
  }
  return weeks;
}

function Calendar(props: CalendarProps) {
  const { className, defaultMonth, disabled, showOutsideDays = true, locale = 'en-US' } = props;
  const initial =
    defaultMonth ??
    (props.mode === 'range' ? props.selected?.from : (props.selected as Date | undefined)) ??
    new Date();
  const [month, setMonth] = React.useState(new Date(initial.getFullYear(), initial.getMonth(), 1));
  const today = startOfDay(new Date());
  const weeks = buildWeeks(month);
  const weekdays = weeks[0]!.map((d) => d.toLocaleDateString(locale, { weekday: 'short' }).slice(0, 2));
  const title = month.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

  function onDayPress(day: Date) {
    if (props.mode === 'range') {
      const { from, to } = props.selected ?? {};
      if (!from || (from && to)) props.onSelect?.({ from: day, to: undefined });
      else if (day < from) props.onSelect?.({ from: day, to: from });
      else props.onSelect?.({ from, to: day });
    } else {
      props.onSelect?.(day);
    }
  }

  function dayState(day: Date) {
    const outside = day.getMonth() !== month.getMonth();
    const isDisabled = disabled?.(day) ?? false;
    if (props.mode === 'range') {
      const { from, to } = props.selected ?? {};
      const start = sameDay(day, from);
      const end = sameDay(day, to);
      const middle = !!from && !!to && day > from && day < to && !start && !end;
      return { outside, isDisabled, start, end, middle, selected: start || end };
    }
    const selected = sameDay(day, props.selected as Date | undefined);
    return { outside, isDisabled, start: false, end: false, middle: false, selected };
  }

  return (
    <View className={cn('bg-background gap-2 self-center p-3', className)}>
      {/* Header: Ghost icon Buttons + month label */}
      <View className="h-10 flex-row items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="size-11 sm:size-11"
          accessibilityLabel="Previous month"
          onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
          <Icon as={CaretLeftIcon} size={16} />
        </Button>
        <Text className="text-sm font-medium">{title}</Text>
        <Button
          variant="ghost"
          size="icon"
          className="size-11 sm:size-11"
          accessibilityLabel="Next month"
          onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
          <Icon as={CaretRightIcon} size={16} />
        </Button>
      </View>
      <View className="flex-row">
        {weekdays.map((w, i) => (
          <View key={i} className="h-8 w-11 items-center justify-center">
            <Text className="text-muted-foreground text-xs">{w}</Text>
          </View>
        ))}
      </View>
      {weeks.map((week, wi) => (
        <View key={wi} className="flex-row">
          {week.map((day) => {
            const s = dayState(day);
            const isToday = sameDay(day, today);
            if (s.outside && !showOutsideDays) return <View key={day.toISOString()} className="size-11" />;
            return (
              <Pressable
                key={day.toISOString()}
                disabled={s.isDisabled}
                onPress={() => onDayPress(day)}
                accessibilityRole="button"
                accessibilityState={{ selected: s.selected, disabled: s.isDisabled }}
                accessibilityLabel={day.toDateString()}
                className={cn(
                  'size-11 items-center justify-center rounded-md',
                  isToday && !s.selected && !s.middle && 'bg-accent',
                  s.selected && 'bg-primary',
                  s.middle && 'bg-accent rounded-none',
                  s.start && s.end ? 'rounded-md' : s.start ? 'rounded-r-none' : s.end ? 'rounded-l-none' : '',
                  !s.selected && !s.middle && 'active:bg-accent',
                  s.isDisabled && 'opacity-50'
                )}>
                <Text
                  className={cn(
                    'text-sm',
                    s.outside ? 'text-muted-foreground' : 'text-foreground',
                    isToday && !s.selected && 'text-accent-foreground',
                    s.selected && 'text-primary-foreground'
                  )}>
                  {day.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export { Calendar };
export type { CalendarProps, DateRange };
