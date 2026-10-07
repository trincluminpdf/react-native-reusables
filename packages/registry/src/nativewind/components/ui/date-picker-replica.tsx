/**
 * ◆ Lumin — WEB-ONLY replicas of the native date pickers, used by ◆ Date Picker when
 * Platform.OS === 'web' (the live preview) so the iOS | Android switch shows each OS's picker.
 * On a device the real system pickers are used (see date-picker.tsx) and nothing here renders.
 *
 * - iOS (UIDatePicker, Apple iOS kit in Figma › Date Picker / iOS (native demo)):
 *   IOSInlineCalendar = display="inline" (shown inside ◆ Drawer) · IOSCompactPicker = display="compact"
 *   (system pill + popover). SF system font, iOS label/tint colors; selected day = solid label
 *   circle, today = tint text on a light tint circle (as in the kit). Tap "Month Year ›" for the
 *   month/year wheel.
 * - Android (MaterialDatePicker, design="material"): AndroidDatePickerDialog = Material 3 modal date
 *   picker with the Lumin color roles from plugins/withLuminAndroidTheme.js (not M3 purple), Roboto,
 *   Cancel / OK, year grid (tap "Month Year ▾"), pencil → text input (mm/dd/yyyy).
 * Replicas are drawn with plain RN views + fixed system colors on purpose: they mimic the OS, not
 * the DS tokens.
 */
import { useColorScheme } from 'nativewind';
import {
  CalendarBlankIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  PencilSimpleIcon,
} from 'phosphor-react-native';
import * as React from 'react';
import {
  Modal,
  Pressable,
  Text as RNText,
  ScrollView,
  TextInput,
  View,
  useWindowDimensions,
  type LayoutRectangle,
  type TextStyle,
} from 'react-native';

type Bounds = { minimumDate?: Date; maximumDate?: Date };

// ─── Calendar math ────────────────────────────────────────────────────────────────────────────

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a?: Date, b?: Date) {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function firstOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function outOfBounds(date: Date, { minimumDate, maximumDate }: Bounds) {
  const day = startOfDay(date);
  return (
    (!!minimumDate && day < startOfDay(minimumDate)) ||
    (!!maximumDate && day > startOfDay(maximumDate))
  );
}

/** Weeks of the month (Sunday first), padded with null. Always 6 rows so the height never jumps. */
function monthWeeks(month: Date): (Date | null)[][] {
  const first = firstOfMonth(month);
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = Array.from({ length: first.getDay() }, () => null);
  for (let d = 1; d <= days; d++) cells.push(new Date(first.getFullYear(), first.getMonth(), d));
  while (cells.length < 42) cells.push(null);
  return Array.from({ length: 6 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

function weekdayLabels(locale: string, format: 'short' | 'narrow') {
  // 2023-01-01 was a Sunday.
  return Array.from({ length: 7 }, (_, i) =>
    new Date(2023, 0, 1 + i).toLocaleDateString(locale, { weekday: format })
  );
}

function monthTitle(month: Date, locale: string) {
  return month.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
}

function canGoTo(month: Date, bounds: Bounds) {
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  return !(
    (bounds.minimumDate && last < startOfDay(bounds.minimumDate)) ||
    (bounds.maximumDate && month > startOfDay(bounds.maximumDate))
  );
}

function yearRange(bounds: Bounds) {
  const from = bounds.minimumDate?.getFullYear() ?? 1900;
  const to = bounds.maximumDate?.getFullYear() ?? 2100;
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

function useScheme() {
  const { colorScheme } = useColorScheme();
  return colorScheme === 'dark' ? 'dark' : 'light';
}

// ─── iOS ──────────────────────────────────────────────────────────────────────────────────────

const IOS_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro", "Helvetica Neue", Inter, sans-serif';

const IOS = {
  light: {
    label: '#000000',
    inverse: '#ffffff',
    secondary: 'rgba(60,60,67,0.6)',
    tertiary: 'rgba(60,60,67,0.3)',
    tint: '#0088ff',
    todayBg: 'rgba(0,136,255,0.12)',
    fill: 'rgba(120,120,128,0.12)',
    popover: '#f8f8f8',
    hairline: 'rgba(0,0,0,0.08)',
  },
  dark: {
    label: '#ffffff',
    inverse: '#000000',
    secondary: 'rgba(235,235,245,0.6)',
    tertiary: 'rgba(235,235,245,0.3)',
    tint: '#0091ff',
    todayBg: 'rgba(0,145,255,0.22)',
    fill: 'rgba(120,120,128,0.24)',
    popover: '#1c1c1e',
    hairline: 'rgba(255,255,255,0.1)',
  },
} as const;

type IOSCalendarProps = Bounds & {
  value: Date;
  onChange: (date: Date) => void;
  locale?: string;
};

const IOS_ROW = 46;
const IOS_WHEEL_ROW = 34;

/** UIDatePicker display="inline" (calendar). */
function IOSInlineCalendar({
  value,
  onChange,
  minimumDate,
  maximumDate,
  locale = 'en-US',
}: IOSCalendarProps) {
  const c = IOS[useScheme()];
  const bounds = { minimumDate, maximumDate };
  const [month, setMonth] = React.useState(() => firstOfMonth(value));
  const [wheel, setWheel] = React.useState(false);
  const today = startOfDay(new Date());
  const text = (style: TextStyle): TextStyle => ({
    fontFamily: IOS_FONT,
    color: c.label,
    ...style,
  });

  return (
    <View style={{ width: '100%', maxWidth: 400, alignSelf: 'center' }}>
      <View
        style={{ height: 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 }}>
        <Pressable
          role="button"
          aria-label={wheel ? 'Hide month and year' : 'Show month and year'}
          onPress={() => setWheel((w) => !w)}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 44, flex: 1 }}>
          <RNText
            style={text({ fontSize: 17, fontWeight: '600', color: wheel ? c.tint : c.label })}>
            {monthTitle(month, locale)}
          </RNText>
          <View style={{ transform: [{ rotate: wheel ? '90deg' : '0deg' }] }}>
            <CaretRightIcon size={15} weight="bold" color={c.tint} />
          </View>
        </Pressable>
        {wheel ? null : (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <IOSArrow
              label="Previous month"
              disabled={!canGoTo(addMonths(month, -1), bounds)}
              color={c.label}
              muted={c.tertiary}
              onPress={() => setMonth((m) => addMonths(m, -1))}
              icon={CaretLeftIcon}
            />
            <IOSArrow
              label="Next month"
              disabled={!canGoTo(addMonths(month, 1), bounds)}
              color={c.label}
              muted={c.tertiary}
              onPress={() => setMonth((m) => addMonths(m, 1))}
              icon={CaretRightIcon}
            />
          </View>
        )}
      </View>

      {wheel ? (
        <IOSMonthYearWheel
          month={month}
          bounds={bounds}
          locale={locale}
          onChange={(next) => {
            setMonth(next);
            // UIDatePicker keeps the day and moves the selection with the wheel.
            const day = Math.min(
              value.getDate(),
              new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
            );
            const moved = new Date(next.getFullYear(), next.getMonth(), day);
            if (!outOfBounds(moved, bounds)) onChange(moved);
          }}
        />
      ) : (
        <View>
          <View style={{ flexDirection: 'row', paddingTop: 6, paddingBottom: 4 }}>
            {weekdayLabels(locale, 'short').map((d, i) => (
              <RNText
                key={i}
                style={text({
                  flex: 1,
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: '600',
                  color: c.tertiary,
                  textTransform: 'uppercase',
                })}>
                {d}
              </RNText>
            ))}
          </View>
          {monthWeeks(month).map((week, w) => (
            <View key={w} style={{ flexDirection: 'row', height: IOS_ROW }}>
              {week.map((day, i) => {
                if (!day) return <View key={i} style={{ flex: 1 }} />;
                const selected = sameDay(day, value);
                const isToday = sameDay(day, today);
                const disabled = outOfBounds(day, bounds);
                return (
                  <Pressable
                    key={i}
                    role="button"
                    aria-label={day.toDateString()}
                    aria-selected={selected}
                    disabled={disabled}
                    onPress={() => onChange(day)}
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: selected ? c.label : isToday ? c.todayBg : 'transparent',
                      }}>
                      <RNText
                        style={text({
                          fontSize: 20,
                          fontWeight: selected ? '600' : '400',
                          color: selected
                            ? c.inverse
                            : disabled
                              ? c.tertiary
                              : isToday
                                ? c.tint
                                : c.label,
                        })}>
                        {day.getDate()}
                      </RNText>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function IOSArrow({
  label,
  disabled,
  color,
  muted,
  onPress,
  icon: IconComponent,
}: {
  label: string;
  disabled: boolean;
  color: string;
  muted: string;
  onPress: () => void;
  icon: typeof CaretLeftIcon;
}) {
  return (
    <Pressable
      role="button"
      aria-label={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.4 : 1,
      })}>
      <IconComponent size={21} weight="bold" color={disabled ? muted : color} />
    </Pressable>
  );
}

/** Month / year wheels (UIPickerView look): 5 visible rows, gray selection band in the middle. */
function IOSMonthYearWheel({
  month,
  bounds,
  locale,
  onChange,
}: {
  month: Date;
  bounds: Bounds;
  locale: string;
  onChange: (month: Date) => void;
}) {
  const c = IOS[useScheme()];
  const months = React.useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        new Date(2023, i, 1).toLocaleDateString(locale, { month: 'long' })
      ),
    [locale]
  );
  const years = React.useMemo(() => yearRange(bounds), [bounds.minimumDate, bounds.maximumDate]);
  const height = IOS_WHEEL_ROW * 5;

  return (
    <View style={{ height: IOS_ROW * 6 + 26, justifyContent: 'center' }}>
      <View style={{ height, flexDirection: 'row' }}>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 8,
            right: 8,
            top: IOS_WHEEL_ROW * 2,
            height: IOS_WHEEL_ROW,
            borderRadius: 8,
            backgroundColor: c.fill,
          }}
        />
        <WheelColumn
          items={months}
          index={month.getMonth()}
          align="flex-end"
          onIndex={(i) => onChange(new Date(month.getFullYear(), i, 1))}
        />
        <WheelColumn
          items={years.map(String)}
          index={Math.max(0, years.indexOf(month.getFullYear()))}
          align="flex-start"
          onIndex={(i) => onChange(new Date(years[i] ?? month.getFullYear(), month.getMonth(), 1))}
        />
      </View>
    </View>
  );
}

function WheelColumn({
  items,
  index,
  align,
  onIndex,
}: {
  items: string[];
  index: number;
  align: 'flex-start' | 'flex-end';
  onIndex: (index: number) => void;
}) {
  const c = IOS[useScheme()];
  const ref = React.useRef<ScrollView>(null);
  const [offset, setOffset] = React.useState(index * IOS_WHEEL_ROW);
  const settle = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    ref.current?.scrollTo({ y: index * IOS_WHEEL_ROW, animated: false });
    // Only on mount: afterwards the wheel itself drives the index.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  React.useEffect(
    () => () => {
      if (settle.current) clearTimeout(settle.current);
    },
    []
  );

  const center = Math.round(offset / IOS_WHEEL_ROW);

  return (
    <ScrollView
      ref={ref}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingVertical: IOS_WHEEL_ROW * 2 }}
      onScroll={(e) => {
        const y = e.nativeEvent.contentOffset.y;
        setOffset(y);
        if (settle.current) clearTimeout(settle.current);
        // Snap to the nearest row once scrolling stops (web has no momentum-end event).
        settle.current = setTimeout(() => {
          const next = Math.max(0, Math.min(items.length - 1, Math.round(y / IOS_WHEEL_ROW)));
          ref.current?.scrollTo({ y: next * IOS_WHEEL_ROW, animated: true });
          if (next !== index) onIndex(next);
        }, 120);
      }}>
      {items.map((item, i) => {
        const distance = Math.abs(i - center);
        return (
          <Pressable
            key={item}
            onPress={() => ref.current?.scrollTo({ y: i * IOS_WHEEL_ROW, animated: true })}
            style={{
              height: IOS_WHEEL_ROW,
              justifyContent: 'center',
              alignItems: align,
              paddingHorizontal: 18,
            }}>
            <RNText
              style={{
                fontFamily: IOS_FONT,
                fontSize: 21,
                color: distance === 0 ? c.label : c.secondary,
                opacity: distance === 0 ? 1 : distance === 1 ? 0.75 : 0.4,
              }}>
              {item}
            </RNText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

type IOSCompactProps = Bounds & {
  value: Date;
  onChange: (date: Date) => void;
  locale?: string;
  disabled?: boolean;
};

/**
 * UIDatePicker display="compact": a gray capsule with the date; tap → popover with the inline
 * calendar. Each tap on a day changes the value at once (onChange); the popover stays open until a
 * tap outside, like on iOS.
 */
function IOSCompactPicker({
  value,
  onChange,
  minimumDate,
  maximumDate,
  locale = 'en-US',
  disabled,
}: IOSCompactProps) {
  const c = IOS[useScheme()];
  const [open, setOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<LayoutRectangle | null>(null);
  const pillRef = React.useRef<View>(null);
  const { width: screenW, height: screenH } = useWindowDimensions();

  function show() {
    pillRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  }

  const popoverW = Math.min(370, screenW - 20);
  const popoverH = 44 + 26 + IOS_ROW * 6 + 16;
  const below = anchor ? anchor.y + anchor.height + 8 : 0;
  const top = anchor
    ? below + popoverH <= screenH - 8
      ? below
      : Math.max(8, anchor.y - popoverH - 8)
    : 0;
  const left = anchor
    ? Math.min(Math.max(10, anchor.x + anchor.width / 2 - popoverW / 2), screenW - popoverW - 10)
    : 0;

  return (
    <>
      <Pressable
        ref={pillRef}
        role="button"
        aria-label={`Date, ${value.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}`}
        aria-expanded={open}
        disabled={disabled}
        onPress={show}
        style={{
          height: 34,
          paddingHorizontal: 11,
          borderRadius: 17,
          justifyContent: 'center',
          backgroundColor: c.fill,
          opacity: disabled ? 0.4 : 1,
          alignSelf: 'flex-start',
        }}>
        <RNText style={{ fontFamily: IOS_FONT, fontSize: 17, color: open ? c.tint : c.label }}>
          {value.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
        </RNText>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          aria-label="Close date picker"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          onPress={() => setOpen(false)}
        />
        <View
          style={{
            position: 'absolute',
            top,
            left,
            width: popoverW,
            borderRadius: 13,
            paddingHorizontal: 6,
            paddingBottom: 10,
            backgroundColor: c.popover,
            borderWidth: 0.5,
            borderColor: c.hairline,
            boxShadow: '0 12px 40px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.06)',
          }}>
          <IOSInlineCalendar
            value={value}
            onChange={onChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            locale={locale}
          />
        </View>
      </Modal>
    </>
  );
}

// ─── Android (Material 3) ─────────────────────────────────────────────────────────────────────

const ROBOTO = 'Roboto, "Google Sans", system-ui, -apple-system, sans-serif';

/** Lumin roles from plugins/withLuminAndroidTheme.js (values/colors.xml · values-night). */
const M3 = {
  light: {
    primary: '#171717',
    onPrimary: '#fafafa',
    surface: '#ffffff', // colorSurfaceContainerHigh = dialog
    onSurface: '#0a0a0a',
    onSurfaceVariant: '#737373',
    outline: '#e5e5e5',
    outlineVariant: '#e5e5e5',
    error: '#dc2626',
    pressed: 'rgba(23,23,23,0.1)',
  },
  dark: {
    primary: '#e5e5e5',
    onPrimary: '#171717',
    surface: '#171717',
    onSurface: '#fafafa',
    onSurfaceVariant: '#a3a3a3',
    outline: '#2f2f2f',
    outlineVariant: '#232323',
    error: '#f87171',
    pressed: 'rgba(229,229,229,0.12)',
  },
} as const;

type AndroidDialogProps = Bounds & {
  open: boolean;
  value: Date;
  title?: string;
  onConfirm: (date: Date) => void;
  onDismiss: () => void;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function toInput(date: Date) {
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;
}

function parseInput(text: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
  if (!match) return null;
  const [m, d, y] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(y, m - 1, d);
  return date.getMonth() === m - 1 && date.getDate() === d ? date : null;
}

/** Auto-inserts the slashes while typing, like MaterialDatePicker's text input. */
function formatTyping(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

const M3_CELL = 48;

/** MaterialDatePicker (design="material") — modal dialog over a 32% scrim. */
function AndroidDatePickerDialog({
  open,
  value,
  title = 'Select date',
  onConfirm,
  onDismiss,
  minimumDate,
  maximumDate,
}: AndroidDialogProps) {
  const c = M3[useScheme()];
  const bounds = { minimumDate, maximumDate };
  const { width: screenW } = useWindowDimensions();
  const [draft, setDraft] = React.useState(value);
  const [month, setMonth] = React.useState(() => firstOfMonth(value));
  const [mode, setMode] = React.useState<'calendar' | 'year' | 'input'>('calendar');
  const [input, setInput] = React.useState(toInput(value));
  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setDraft(value);
    setMonth(firstOfMonth(value));
    setMode('calendar');
    setInput(toInput(value));
  }, [open, value]);

  const typed = parseInput(input);
  const inputError =
    mode !== 'input' || input.length === 0
      ? null
      : !typed
        ? input.length === 10
          ? 'Invalid format.'
          : null
        : outOfBounds(typed, bounds)
          ? 'Out of range.'
          : null;
  const canConfirm = mode === 'input' ? !!typed && !inputError : true;
  const today = startOfDay(new Date());
  const width = Math.min(360, screenW - 30);
  const text = (style: TextStyle): TextStyle => ({
    fontFamily: ROBOTO,
    color: c.onSurface,
    ...style,
  });
  const headlineDate = mode === 'input' ? (typed && !inputError ? typed : draft) : draft;

  function toggleInput() {
    if (mode === 'input') {
      if (typed && !inputError) {
        setDraft(typed);
        setMonth(firstOfMonth(typed));
      }
      setMode('calendar');
    } else {
      setInput(toInput(draft));
      setMode('input');
    }
  }

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onDismiss}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Pressable
          aria-label="Dismiss"
          onPress={onDismiss}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.32)',
          }}
        />
        <View
          role="dialog"
          aria-label={title}
          style={{
            width,
            borderRadius: 28,
            backgroundColor: c.surface,
            overflow: 'hidden',
            boxShadow: '0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)',
          }}>
          <RNText
            style={text({
              fontSize: 14,
              fontWeight: '500',
              color: c.onSurfaceVariant,
              paddingTop: 18,
              paddingHorizontal: 24,
            })}>
            {title}
          </RNText>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 24,
              paddingRight: 12,
              paddingTop: 18,
              paddingBottom: 14,
            }}>
            <RNText style={text({ flex: 1, fontSize: 32, lineHeight: 40 })} numberOfLines={1}>
              {headlineDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </RNText>
            <M3IconButton
              label={
                mode === 'input' ? 'Switch to calendar input mode' : 'Switch to text input mode'
              }
              onPress={toggleInput}
              pressed={c.pressed}>
              {mode === 'input' ? (
                <CalendarBlankIcon size={24} weight="fill" color={c.onSurfaceVariant} />
              ) : (
                <PencilSimpleIcon size={24} weight="fill" color={c.onSurfaceVariant} />
              )}
            </M3IconButton>
          </View>
          <View style={{ height: 1, backgroundColor: c.outlineVariant }} />

          {mode === 'input' ? (
            <View style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 8 }}>
              <View
                style={{
                  height: 56,
                  borderRadius: 4,
                  borderWidth: focused ? 2 : 1,
                  borderColor: inputError ? c.error : focused ? c.primary : c.onSurfaceVariant,
                  justifyContent: 'center',
                  paddingHorizontal: focused ? 15 : 16,
                }}>
                <RNText
                  style={text({
                    position: 'absolute',
                    top: -9,
                    left: 12,
                    paddingHorizontal: 4,
                    fontSize: 12,
                    backgroundColor: c.surface,
                    color: inputError ? c.error : focused ? c.primary : c.onSurfaceVariant,
                  })}>
                  Date
                </RNText>
                <TextInput
                  value={input}
                  onChangeText={(t) => setInput(formatTyping(t))}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="mm/dd/yyyy"
                  placeholderTextColor={c.onSurfaceVariant}
                  inputMode="numeric"
                  autoFocus
                  aria-label="Date"
                  style={[text({ fontSize: 16 }), { outlineWidth: 0 }]}
                />
              </View>
              <RNText
                style={text({
                  fontSize: 12,
                  color: inputError ? c.error : c.onSurfaceVariant,
                  paddingTop: 4,
                  paddingHorizontal: 16,
                  minHeight: 20,
                })}>
                {inputError ? `${inputError} Use: mm/dd/yyyy` : 'mm/dd/yyyy'}
              </RNText>
            </View>
          ) : (
            <>
              <View
                style={{
                  height: 56,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 12,
                  paddingRight: 12,
                }}>
                <Pressable
                  role="button"
                  aria-label={mode === 'year' ? 'Hide years' : 'Choose year'}
                  onPress={() => setMode((m) => (m === 'year' ? 'calendar' : 'year'))}
                  style={({ pressed }) => ({
                    height: 40,
                    paddingHorizontal: 12,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: pressed ? c.pressed : 'transparent',
                  })}>
                  <RNText
                    style={text({ fontSize: 14, fontWeight: '500', color: c.onSurfaceVariant })}>
                    {monthTitle(month, 'en-US')}
                  </RNText>
                  <View style={{ transform: [{ rotate: mode === 'year' ? '180deg' : '0deg' }] }}>
                    <CaretDownIcon size={14} weight="fill" color={c.onSurfaceVariant} />
                  </View>
                </Pressable>
                <View style={{ flex: 1 }} />
                {mode === 'calendar' ? (
                  <>
                    <M3IconButton
                      label="Change to previous month"
                      disabled={!canGoTo(addMonths(month, -1), bounds)}
                      onPress={() => setMonth((m) => addMonths(m, -1))}
                      pressed={c.pressed}>
                      <CaretLeftIcon
                        size={20}
                        weight="bold"
                        color={
                          canGoTo(addMonths(month, -1), bounds) ? c.onSurfaceVariant : c.outline
                        }
                      />
                    </M3IconButton>
                    <M3IconButton
                      label="Change to next month"
                      disabled={!canGoTo(addMonths(month, 1), bounds)}
                      onPress={() => setMonth((m) => addMonths(m, 1))}
                      pressed={c.pressed}>
                      <CaretRightIcon
                        size={20}
                        weight="bold"
                        color={
                          canGoTo(addMonths(month, 1), bounds) ? c.onSurfaceVariant : c.outline
                        }
                      />
                    </M3IconButton>
                  </>
                ) : null}
              </View>

              {mode === 'year' ? (
                <M3YearGrid
                  selected={month.getFullYear()}
                  bounds={bounds}
                  onSelect={(year) => {
                    setMonth(new Date(year, month.getMonth(), 1));
                    setMode('calendar');
                  }}
                />
              ) : (
                <View style={{ paddingHorizontal: 12 }}>
                  <View style={{ flexDirection: 'row', height: M3_CELL, alignItems: 'center' }}>
                    {weekdayLabels('en-US', 'narrow').map((d, i) => (
                      <RNText key={i} style={text({ flex: 1, textAlign: 'center', fontSize: 16 })}>
                        {d}
                      </RNText>
                    ))}
                  </View>
                  {monthWeeks(month).map((week, w) => (
                    <View key={w} style={{ flexDirection: 'row', height: M3_CELL }}>
                      {week.map((day, i) => {
                        if (!day) return <View key={i} style={{ flex: 1 }} />;
                        const selected = sameDay(day, draft);
                        const isToday = sameDay(day, today);
                        const disabled = outOfBounds(day, bounds);
                        return (
                          <Pressable
                            key={i}
                            role="button"
                            aria-label={day.toDateString()}
                            aria-selected={selected}
                            disabled={disabled}
                            onPress={() => setDraft(day)}
                            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            {({ pressed }) => (
                              <View
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 20,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: selected
                                    ? c.primary
                                    : pressed
                                      ? c.pressed
                                      : 'transparent',
                                  borderWidth: isToday && !selected ? 1 : 0,
                                  borderColor: c.primary,
                                }}>
                                <RNText
                                  style={text({
                                    fontSize: 16,
                                    color: selected
                                      ? c.onPrimary
                                      : isToday
                                        ? c.primary
                                        : c.onSurface,
                                    opacity: disabled ? 0.38 : 1,
                                  })}>
                                  {day.getDate()}
                                </RNText>
                              </View>
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              gap: 8,
              paddingTop: 8,
              paddingBottom: 12,
              paddingHorizontal: 12,
            }}>
            <M3TextButton
              label="Cancel"
              color={c.primary}
              pressed={c.pressed}
              onPress={onDismiss}
            />
            <M3TextButton
              label="OK"
              color={c.primary}
              pressed={c.pressed}
              disabled={!canConfirm}
              onPress={() => onConfirm(mode === 'input' && typed ? typed : draft)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function M3YearGrid({
  selected,
  bounds,
  onSelect,
}: {
  selected: number;
  bounds: Bounds;
  onSelect: (year: number) => void;
}) {
  const c = M3[useScheme()];
  const years = React.useMemo(() => yearRange(bounds), [bounds.minimumDate, bounds.maximumDate]);
  const current = new Date().getFullYear();
  const ref = React.useRef<ScrollView>(null);
  const rows = Math.ceil(years.length / 3);
  const ROW = 52;

  React.useEffect(() => {
    const row = Math.floor(Math.max(0, years.indexOf(selected)) / 3);
    ref.current?.scrollTo({ y: Math.max(0, (row - 2) * ROW), animated: false });
  }, [selected, years]);

  return (
    <ScrollView
      ref={ref}
      style={{ height: M3_CELL * 7 }}
      contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 8 }}>
      {Array.from({ length: rows }, (_, r) => (
        <View key={r} style={{ flexDirection: 'row', height: ROW, alignItems: 'center' }}>
          {years.slice(r * 3, r * 3 + 3).map((year) => {
            const isSelected = year === selected;
            const isCurrent = year === current;
            return (
              <Pressable
                key={year}
                role="button"
                aria-label={`Navigate to year ${year}`}
                aria-selected={isSelected}
                onPress={() => onSelect(year)}
                style={{ flex: 1, alignItems: 'center' }}>
                {({ pressed }) => (
                  <View
                    style={{
                      width: 72,
                      height: 36,
                      borderRadius: 18,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected ? c.primary : pressed ? c.pressed : 'transparent',
                      borderWidth: isCurrent && !isSelected ? 1 : 0,
                      borderColor: c.primary,
                    }}>
                    <RNText
                      style={{
                        fontFamily: ROBOTO,
                        fontSize: 16,
                        color: isSelected
                          ? c.onPrimary
                          : isCurrent
                            ? c.primary
                            : c.onSurfaceVariant,
                      }}>
                      {year}
                    </RNText>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}

function M3IconButton({
  label,
  onPress,
  disabled,
  pressed: pressedColor,
  children,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  pressed: string;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      role="button"
      aria-label={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? pressedColor : 'transparent',
      })}>
      {children}
    </Pressable>
  );
}

function M3TextButton({
  label,
  color,
  pressed: pressedColor,
  disabled,
  onPress,
}: {
  label: string;
  color: string;
  pressed: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      role="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        height: 40,
        minWidth: 48,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? pressedColor : 'transparent',
        opacity: disabled ? 0.38 : 1,
      })}>
      <RNText
        style={{ fontFamily: ROBOTO, fontSize: 14, fontWeight: '500', letterSpacing: 0.1, color }}>
        {label}
      </RNText>
    </Pressable>
  );
}

export { AndroidDatePickerDialog, IOSCompactPicker, IOSInlineCalendar };
