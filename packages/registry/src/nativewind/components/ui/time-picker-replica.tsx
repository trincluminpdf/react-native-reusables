/**
 * ◆ Lumin — WEB-ONLY replicas of the native time pickers, used by ◆ Time Picker when
 * Platform.OS === 'web' (the live preview) so the iOS | Android switch shows each OS's picker.
 * On a device the real system pickers are used (see time-picker.tsx) and nothing here renders.
 * Same approach as date-picker-replica.tsx (shares its OS colours, fonts and M3 buttons).
 *
 * - iOS (UIDatePicker mode="time"): IOSTimeWheels = display="spinner" (hour · minute · AM/PM wheels,
 *   shown inside ◆ Drawer) · IOSCompactTimePicker = display="compact" (system time pill + wheel popover).
 *   Figma › Time Picker / iOS (native demo).
 * - Android (MaterialTimePicker, design="material"): AndroidTimePickerDialog = Material 3 time picker,
 *   dial mode (hour dial → minute dial), keyboard toggle for text entry, Cancel / OK, Lumin colour roles
 *   from plugins/withLuminAndroidTheme.js. Figma › Time Picker / Android (native demo).
 * Replicas use plain RN views + fixed system colours on purpose: they mimic the OS, not the DS tokens.
 */
import {
  IOS,
  IOS_FONT,
  M3,
  M3IconButton,
  M3TextButton,
  ROBOTO,
  useScheme,
} from '@/registry/nativewind/components/ui/date-picker-replica';
import { ClockIcon, KeyboardIcon } from 'phosphor-react-native';
import * as React from 'react';
import {
  Modal,
  Pressable,
  Text as RNText,
  ScrollView,
  TextInput,
  View,
  useWindowDimensions,
  type GestureResponderEvent,
  type LayoutRectangle,
  type TextStyle,
} from 'react-native';

type TimeProps = {
  value: Date;
  onChange: (date: Date) => void;
  hour12?: boolean;
  minuteInterval?: number;
};

function withTime(date: Date, hours: number, minutes: number) {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// ─── iOS ──────────────────────────────────────────────────────────────────────────────────────

const ROW = 34;
const VISIBLE = 5;

function Wheel({
  items,
  index,
  align,
  width,
  onIndex,
  label,
}: {
  items: string[];
  index: number;
  align: 'flex-start' | 'flex-end' | 'center';
  width: number;
  onIndex: (index: number) => void;
  label: string;
}) {
  const c = IOS[useScheme()];
  const ref = React.useRef<ScrollView>(null);
  const [offset, setOffset] = React.useState(index * ROW);
  const settle = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => ref.current?.scrollTo({ y: index * ROW, animated: false }), 0);
    return () => {
      clearTimeout(t);
      if (settle.current) clearTimeout(settle.current);
    };
    // Only on mount: afterwards the wheel itself drives the index.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const center = Math.round(offset / ROW);

  return (
    <ScrollView
      ref={ref}
      aria-label={label}
      style={{ width, height: ROW * VISIBLE, flexGrow: 0 }}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingVertical: ROW * 2 }}
      onScroll={(e) => {
        const y = e.nativeEvent.contentOffset.y;
        setOffset(y);
        if (settle.current) clearTimeout(settle.current);
        // Snap to the nearest row once scrolling stops (web has no momentum-end event).
        settle.current = setTimeout(() => {
          const next = Math.max(0, Math.min(items.length - 1, Math.round(y / ROW)));
          ref.current?.scrollTo({ y: next * ROW, animated: true });
          if (next !== index) onIndex(next);
        }, 120);
      }}>
      {items.map((item, i) => {
        const distance = Math.abs(i - center);
        return (
          <Pressable
            key={item + i}
            role="button"
            aria-label={`${label} ${item}`}
            onPress={() => ref.current?.scrollTo({ y: i * ROW, animated: true })}
            style={{
              height: ROW,
              justifyContent: 'center',
              alignItems: align,
              paddingHorizontal: 10,
            }}>
            <RNText
              style={{
                fontFamily: IOS_FONT,
                fontSize: 21,
                fontVariant: ['tabular-nums'],
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

/** UIDatePicker mode="time" display="spinner" — hour · minute · AM/PM wheels. */
function IOSTimeWheels({ value, onChange, hour12 = true, minuteInterval = 1 }: TimeProps) {
  const c = IOS[useScheme()];
  const hours = hour12
    ? Array.from({ length: 12 }, (_, i) => String(i + 1))
    : Array.from({ length: 24 }, (_, i) => pad(i));
  const minutes = Array.from({ length: Math.ceil(60 / minuteInterval) }, (_, i) =>
    pad(i * minuteInterval)
  );
  const h = value.getHours();
  const pm = h >= 12;
  const hourIndex = hour12 ? (h + 11) % 12 : h;
  const minuteIndex = Math.round(value.getMinutes() / minuteInterval) % minutes.length;
  const to24 = (i: number, isPm: boolean) => (hour12 ? ((i + 1) % 12) + (isPm ? 12 : 0) : i);

  return (
    <View
      style={{
        height: ROW * VISIBLE,
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'stretch',
      }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 8,
          right: 8,
          top: ROW * 2,
          height: ROW,
          borderRadius: 8,
          backgroundColor: c.fill,
        }}
      />
      <Wheel
        label="Hour"
        items={hours}
        index={hourIndex}
        align="flex-end"
        width={72}
        onIndex={(i) => onChange(withTime(value, to24(i, pm), value.getMinutes()))}
      />
      <Wheel
        label="Minute"
        items={minutes}
        index={minuteIndex}
        align="flex-start"
        width={72}
        onIndex={(i) => onChange(withTime(value, h, i * minuteInterval))}
      />
      {hour12 ? (
        <Wheel
          label="AM / PM"
          items={['AM', 'PM']}
          index={pm ? 1 : 0}
          align="flex-start"
          width={72}
          onIndex={(i) => onChange(withTime(value, to24(hourIndex, i === 1), value.getMinutes()))}
        />
      ) : null}
    </View>
  );
}

/** UIDatePicker mode="time" display="compact" — gray time capsule; tap → wheel popover. */
function IOSCompactTimePicker({
  value,
  onChange,
  hour12 = true,
  minuteInterval = 1,
  locale = 'en-US',
  disabled,
}: TimeProps & { locale?: string; disabled?: boolean }) {
  const c = IOS[useScheme()];
  const [open, setOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState<LayoutRectangle | null>(null);
  const pillRef = React.useRef<View>(null);
  const { width: screenW, height: screenH } = useWindowDimensions();
  const label = value.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });

  function show() {
    pillRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  }

  const popoverW = Math.min(260, screenW - 20);
  const popoverH = ROW * VISIBLE + 16;
  const below = anchor ? anchor.y + anchor.height + 8 : 0;
  const top = anchor
    ? below + popoverH <= screenH - 8
      ? below
      : Math.max(8, anchor.y - popoverH - 8)
    : 0;
  const left = anchor
    ? Math.min(Math.max(10, anchor.x + anchor.width - popoverW), screenW - popoverW - 10)
    : 0;

  return (
    <>
      <Pressable
        ref={pillRef}
        role="button"
        aria-label={`Time, ${label}`}
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
          {label}
        </RNText>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          aria-label="Close time picker"
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
            paddingVertical: 8,
            backgroundColor: c.popover,
            borderWidth: 0.5,
            borderColor: c.hairline,
            boxShadow: '0 12px 40px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.06)',
          }}>
          <IOSTimeWheels
            value={value}
            onChange={onChange}
            hour12={hour12}
            minuteInterval={minuteInterval}
          />
        </View>
      </Modal>
    </>
  );
}

// ─── Android (Material 3 time picker, dial) ───────────────────────────────────────────────────

const DIAL = 256;
const DIAL_R = 100; // radius of the number ring
const KNOB = 48;

type AndroidTimeDialogProps = {
  open: boolean;
  value: Date;
  title?: string;
  hour12?: boolean;
  onConfirm: (date: Date) => void;
  onDismiss: () => void;
};

function AndroidTimePickerDialog({
  open,
  value,
  title = 'Select time',
  hour12 = true,
  onConfirm,
  onDismiss,
}: AndroidTimeDialogProps) {
  const scheme = useScheme();
  const c = M3[scheme];
  // M3 surfaceContainerHighest / primaryContainer approximations on the Lumin roles.
  const track = scheme === 'dark' ? '#262626' : '#f0f0f0';
  const selectedBox = scheme === 'dark' ? 'rgba(229,229,229,0.16)' : 'rgba(23,23,23,0.08)';
  const { width: screenW } = useWindowDimensions();
  const [draft, setDraft] = React.useState(value);
  const [field, setField] = React.useState<'hour' | 'minute'>('hour');
  const [keyboard, setKeyboard] = React.useState(false);
  const [hourText, setHourText] = React.useState('');
  const [minuteText, setMinuteText] = React.useState('');

  const h24 = draft.getHours();
  const pm = h24 >= 12;
  const hourShown = hour12 ? ((h24 + 11) % 12) + 1 : h24;

  React.useEffect(() => {
    if (!open) return;
    setDraft(value);
    setField('hour');
    setKeyboard(false);
  }, [open, value]);

  React.useEffect(() => {
    setHourText(pad(hourShown));
    setMinuteText(pad(draft.getMinutes()));
  }, [hourShown, draft]);

  const width = Math.min(328, screenW - 30);
  const text = (style: TextStyle): TextStyle => ({
    fontFamily: ROBOTO,
    color: c.onSurface,
    ...style,
  });

  function setHour(display: number) {
    const hour = hour12 ? (display % 12) + (pm ? 12 : 0) : display;
    setDraft(withTime(draft, hour, draft.getMinutes()));
  }
  function setPeriod(nextPm: boolean) {
    if (nextPm === pm) return;
    setDraft(withTime(draft, (h24 + 12) % 24, draft.getMinutes()));
  }

  // Dial numbers: hours 12,1..11 (or 00–23 inner/outer simplified to 0..11 + 12..23 rings) / minutes 00..55.
  const dialItems =
    field === 'hour'
      ? hour12
        ? Array.from({ length: 12 }, (_, i) => (i === 0 ? 12 : i))
        : Array.from({ length: 12 }, (_, i) => (pm ? i + 12 : i))
      : Array.from({ length: 12 }, (_, i) => i * 5);
  const selectedValue = field === 'hour' ? (hour12 ? hourShown : h24) : draft.getMinutes();
  const selectedIndex =
    field === 'hour'
      ? dialItems.findIndex((v) => v === selectedValue)
      : Math.round(draft.getMinutes() / 5) % 12;
  const angleOf = (i: number) => (i / 12) * 2 * Math.PI - Math.PI / 2;
  const knobAngle =
    field === 'minute'
      ? (draft.getMinutes() / 60) * 2 * Math.PI - Math.PI / 2
      : angleOf(Math.max(0, selectedIndex));

  const dialRef = React.useRef<View>(null);

  function pickAt(dx: number, dy: number) {
    let a = Math.atan2(dy, dx) + Math.PI / 2;
    if (a < 0) a += 2 * Math.PI;
    const i = Math.round((a / (2 * Math.PI)) * 12) % 12;
    if (field === 'hour') {
      setHour(dialItems[i] ?? 12);
      setField('minute');
    } else {
      setDraft(withTime(draft, h24, (dialItems[i] ?? 0) % 60));
    }
  }

  // Page coordinates minus the dial's window position (locationX is not reliable on web).
  function onDialPress(e: GestureResponderEvent) {
    const { pageX, pageY } = e.nativeEvent;
    dialRef.current?.measureInWindow((x, y) => pickAt(pageX - x - DIAL / 2, pageY - y - DIAL / 2));
  }

  const box = (active: boolean) => ({
    width: 96,
    height: 80,
    borderRadius: 8,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: active ? selectedBox : track,
    borderWidth: active ? 2 : 0,
    borderColor: c.primary,
  });

  function commitTyped() {
    const hh = Number(hourText);
    const mm = Number(minuteText);
    const validH = hour12 ? hh >= 1 && hh <= 12 : hh >= 0 && hh <= 23;
    if (!validH || !(mm >= 0 && mm <= 59)) return null;
    const hour = hour12 ? (hh % 12) + (pm ? 12 : 0) : hh;
    return withTime(draft, hour, mm);
  }

  const typed = keyboard ? commitTyped() : draft;

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
            padding: 24,
            backgroundColor: c.surface,
            boxShadow: '0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)',
          }}>
          <RNText
            style={text({
              fontSize: 12,
              fontWeight: '500',
              letterSpacing: 0.5,
              color: c.onSurfaceVariant,
            })}>
            {keyboard ? 'Enter time' : title}
          </RNText>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, gap: 0 }}>
            {keyboard ? (
              <>
                <TextInput
                  aria-label="Hour"
                  value={hourText}
                  onChangeText={(t) => setHourText(t.replace(/\D/g, '').slice(0, 2))}
                  keyboardType="number-pad"
                  style={[box(true), text({ fontSize: 45, textAlign: 'center' }) as object]}
                />
                <RNText style={text({ fontSize: 45, width: 24, textAlign: 'center' })}>:</RNText>
                <TextInput
                  aria-label="Minute"
                  value={minuteText}
                  onChangeText={(t) => setMinuteText(t.replace(/\D/g, '').slice(0, 2))}
                  keyboardType="number-pad"
                  style={[box(false), text({ fontSize: 45, textAlign: 'center' }) as object]}
                />
              </>
            ) : (
              <>
                <Pressable
                  role="button"
                  aria-label="Hour"
                  onPress={() => setField('hour')}
                  style={box(field === 'hour')}>
                  <RNText style={text({ fontSize: 45, lineHeight: 52 })}>{pad(hourShown)}</RNText>
                </Pressable>
                <RNText style={text({ fontSize: 45, width: 24, textAlign: 'center' })}>:</RNText>
                <Pressable
                  role="button"
                  aria-label="Minute"
                  onPress={() => setField('minute')}
                  style={box(field === 'minute')}>
                  <RNText style={text({ fontSize: 45, lineHeight: 52 })}>
                    {pad(draft.getMinutes())}
                  </RNText>
                </Pressable>
              </>
            )}
            {hour12 ? (
              <View
                style={{
                  marginLeft: 12,
                  width: 52,
                  height: 80,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: c.outline,
                  overflow: 'hidden',
                }}>
                {(['AM', 'PM'] as const).map((p, i) => {
                  const active = (p === 'PM') === pm;
                  return (
                    <Pressable
                      key={p}
                      role="button"
                      aria-label={p}
                      aria-selected={active}
                      onPress={() => setPeriod(p === 'PM')}
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: active ? c.primary : 'transparent',
                        borderTopWidth: i === 1 ? 1 : 0,
                        borderTopColor: c.outline,
                      }}>
                      <RNText
                        style={text({
                          fontSize: 16,
                          fontWeight: '500',
                          color: active ? c.onPrimary : c.onSurfaceVariant,
                        })}>
                        {p}
                      </RNText>
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>

          {keyboard ? (
            <View style={{ flexDirection: 'row', marginTop: 6, gap: 24 }}>
              <RNText style={text({ fontSize: 12, color: c.onSurfaceVariant, width: 96 })}>
                Hour
              </RNText>
              <RNText style={text({ fontSize: 12, color: c.onSurfaceVariant })}>Minute</RNText>
            </View>
          ) : (
            <View style={{ alignItems: 'center', marginTop: 36 }}>
              <Pressable
                ref={dialRef}
                aria-label={field === 'hour' ? 'Hour dial' : 'Minute dial'}
                onPress={onDialPress}
                style={{
                  width: DIAL,
                  height: DIAL,
                  borderRadius: DIAL / 2,
                  backgroundColor: track,
                }}>
                {/* hand */}
                <View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left: DIAL / 2,
                    top: DIAL / 2 - 1,
                    width: DIAL_R,
                    height: 2,
                    backgroundColor: c.primary,
                    transformOrigin: '0% 50%',
                    transform: [{ rotate: `${knobAngle}rad` }],
                  }}
                />
                <View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left: DIAL / 2 - 4,
                    top: DIAL / 2 - 4,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: c.primary,
                  }}
                />
                {/* knob */}
                <View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left: DIAL / 2 + DIAL_R * Math.cos(knobAngle) - KNOB / 2,
                    top: DIAL / 2 + DIAL_R * Math.sin(knobAngle) - KNOB / 2,
                    width: KNOB,
                    height: KNOB,
                    borderRadius: KNOB / 2,
                    backgroundColor: c.primary,
                  }}
                />
                {dialItems.map((v, i) => {
                  const a = angleOf(i);
                  const active = field === 'hour' ? i === selectedIndex : draft.getMinutes() === v;
                  return (
                    <RNText
                      key={v}
                      pointerEvents="none"
                      style={text({
                        position: 'absolute',
                        left: DIAL / 2 + DIAL_R * Math.cos(a) - KNOB / 2,
                        top: DIAL / 2 + DIAL_R * Math.sin(a) - 12,
                        width: KNOB,
                        textAlign: 'center',
                        fontSize: 16,
                        lineHeight: 24,
                        color: active ? c.onPrimary : c.onSurface,
                      })}>
                      {field === 'minute' ? pad(v) : String(v)}
                    </RNText>
                  );
                })}
              </Pressable>
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 24,
              marginHorizontal: -12,
              marginBottom: -12,
            }}>
            <M3IconButton
              label={keyboard ? 'Switch to clock input mode' : 'Switch to text input mode'}
              onPress={() => {
                if (keyboard) {
                  const t = commitTyped();
                  if (t) setDraft(t);
                }
                setKeyboard(!keyboard);
              }}
              pressed={c.pressed}>
              {keyboard ? (
                <ClockIcon size={24} color={c.onSurfaceVariant} />
              ) : (
                <KeyboardIcon size={24} color={c.onSurfaceVariant} />
              )}
            </M3IconButton>
            <View style={{ flex: 1 }} />
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
              disabled={!typed}
              onPress={() => typed && onConfirm(typed)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export { AndroidTimePickerDialog, IOSCompactTimePicker, IOSTimeWheels };
