/**
 * ◆ Lumin custom. Figma: PDF-Mobile-DS › ◆ Time Picker. Tokens: 5. Component › time-picker/*
 * (same values as date-picker/* — the Trigger mirrors the Select trigger).
 *
 * Same pattern as ◆ Date Picker: build only the Trigger — the picker is NATIVE
 * (@react-native-community/datetimepicker, mode="time"):
 * - Android: DateTimePickerAndroid.open({ mode: 'time', design: 'material' }) → Material 3 time picker
 *   dialog (dial; keyboard entry via its own toggle). Needs the `withLuminAndroidTheme` config plugin like
 *   Date Picker. Figma "Time Picker / Android (native demo)".
 * - iOS: <DateTimePicker mode="time" display="spinner" /> (wheels) inside our ◆ Drawer
 *   (Figma "Wheels in Drawer"). display="compact" (iOS default) = system pill + wheel popover instead.
 * - Web (live preview only): replicas of the OS picker chosen by the preview's iOS | Android switch
 *   (lib/preview-platform + time-picker-replica.tsx) — never used on a device.
 * 12/24-hour follows the locale (Android: the device setting). minuteInterval works on iOS (+ iOS replica).
 * Trigger: h-10 (Tablet sm:h-9), px-3, rounded-md, clock icon, 44 hit area, focus ring like web.
 * Date + time: put a Date Picker and a Time Picker side by side — no combined field.
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/registry/nativewind/components/ui/drawer';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import {
  AndroidTimePickerDialog,
  IOSCompactTimePicker,
  IOSTimeWheels,
} from '@/registry/nativewind/components/ui/time-picker-replica';
import { useFocusRing } from '@/registry/nativewind/lib/focus-ring';
import { usePreviewPlatform } from '@/registry/nativewind/lib/preview-platform';
import { cn } from '@/registry/nativewind/lib/utils';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useColorScheme } from 'nativewind';
import { CaretDownIcon, ClockIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';

function formatTime(date: Date, locale = 'en-US') {
  return date.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
}

function uses12Hour(locale = 'en-US') {
  try {
    return new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hour12 ?? true;
  } catch {
    return true;
  }
}

type TimePickerTriggerProps = Omit<React.ComponentProps<typeof Pressable>, 'children'> & {
  value?: Date;
  placeholder?: string;
  /** Picker open → focus ring (Figma State=Focus). */
  open?: boolean;
  invalid?: boolean;
  locale?: string;
};

function TimePickerTrigger({
  value,
  placeholder = 'Pick a time',
  open = false,
  invalid = false,
  disabled,
  className,
  style,
  locale,
  ...props
}: TimePickerTriggerProps) {
  const ring = useFocusRing({ invalid, forceFocused: open });
  return (
    <Pressable
      role="button"
      accessibilityLabel={value ? `Time, ${formatTime(value, locale)}` : placeholder}
      disabled={disabled}
      hitSlop={2}
      className={cn(
        'border-input bg-background dark:bg-input/30 active:bg-accent dark:active:bg-input/50 h-10 w-full flex-row items-center gap-2 rounded-md border px-3 sm:h-9',
        Platform.select({
          web: 'focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
        }),
        open && cn('border-ring', Platform.select({ web: 'ring-ring/50 ring-[3px]' })),
        invalid &&
          cn(
            'border-destructive',
            Platform.select({ web: 'ring-destructive/20 dark:ring-destructive/40 ring-[3px]' })
          ),
        disabled && 'bg-input/50 dark:bg-input/80 opacity-50',
        className
      )}
      style={[ring.style, style as object]}
      {...props}>
      <Icon as={ClockIcon} size={16} className="text-foreground size-4" />
      <Text
        className={cn('flex-1 text-sm', value ? 'text-foreground' : 'text-muted-foreground')}
        numberOfLines={1}>
        {value ? formatTime(value, locale) : placeholder}
      </Text>
      <Icon as={CaretDownIcon} size={16} className="text-muted-foreground size-4" />
    </Pressable>
  );
}

type AndroidDesign = 'material' | 'default';
type IOSDisplay = 'spinner' | 'compact';

// The typings only declare `dismiss(mode)`; the JS also takes `design` (it picks the M3 or legacy module).
const dismissAndroidPicker = DateTimePickerAndroid.dismiss as unknown as (
  mode: 'time',
  design?: AndroidDesign
) => Promise<boolean>;

type MinuteInterval = 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;

type TimePickerProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  title?: string;
  invalid?: boolean;
  disabled?: boolean;
  /** iOS / web only — Android follows the device locale and 12/24-hour setting. */
  locale?: string;
  /** iOS (+ iOS replica); Android ignores it. */
  minuteInterval?: MinuteInterval;
  /** Android dialog: 'material' (M3, default — needs the theme plugin) or 'default' (legacy). */
  androidDesign?: AndroidDesign;
  /** iOS: 'spinner' (default — wheels in ◆ Drawer, our Trigger) or 'compact' (system time pill + popover). */
  iosDisplay?: IOSDisplay;
  className?: string;
};

/** Trigger + platform picker (see file header). */
function TimePicker({
  value,
  onChange,
  placeholder,
  title = 'Select time',
  invalid,
  disabled,
  locale,
  minuteInterval = 1,
  androidDesign = 'material',
  iosDisplay = 'spinner',
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  // Device: the real OS. Web preview: the iOS | Android switch.
  const os = usePreviewPlatform();
  const web = Platform.OS === 'web';
  const [draft, setDraft] = React.useState<Date>(value ?? new Date());
  const { colorScheme } = useColorScheme();
  const hour12 = uses12Hour(locale);
  // Android: the dialog lives outside React — guard double taps and close it on unmount.
  const androidOpen = React.useRef(false);

  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    return () => {
      if (androidOpen.current) {
        androidOpen.current = false;
        dismissAndroidPicker('time', androidDesign).catch(() => {});
      }
    };
  }, [androidDesign]);

  function openPicker() {
    const initial = value ?? new Date();
    if (Platform.OS === 'android') {
      if (androidOpen.current) return;
      androidOpen.current = true;
      setOpen(true);
      const close = () => {
        androidOpen.current = false;
        setOpen(false);
      };
      DateTimePickerAndroid.open({
        value: initial,
        mode: 'time',
        design: androidDesign,
        title: androidDesign === 'material' ? title : undefined,
        onValueChange: (_event, date) => {
          close();
          onChange?.(date);
        },
        onDismiss: close,
        onError: (error) => {
          close();
          console.warn('[TimePicker] Android picker failed to open:', error);
        },
      });
      return;
    }
    setDraft(initial);
    setOpen(true);
  }

  const trigger = (
    <TimePickerTrigger
      value={value}
      placeholder={placeholder}
      open={open}
      invalid={invalid}
      disabled={disabled}
      locale={locale}
      className={className}
      onPress={openPicker}
    />
  );

  if (Platform.OS === 'android') return trigger;

  if (os === 'ios' && iosDisplay === 'compact') {
    const shown = value ?? new Date();
    return web ? (
      <IOSCompactTimePicker
        value={shown}
        onChange={(d) => onChange?.(d)}
        hour12={hour12}
        minuteInterval={minuteInterval}
        locale={locale}
        disabled={disabled}
      />
    ) : (
      <DateTimePicker
        value={shown}
        mode="time"
        display="compact"
        disabled={disabled}
        minuteInterval={minuteInterval}
        themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
        locale={locale}
        onChange={(_e, d) => d && onChange?.(d)}
        style={{ alignSelf: 'flex-start' }}
      />
    );
  }

  if (web && os === 'android') {
    return (
      <>
        {trigger}
        <AndroidTimePickerDialog
          open={open}
          value={draft}
          title={title}
          hour12={hour12}
          onConfirm={(d) => {
            setOpen(false);
            onChange?.(d);
          }}
          onDismiss={() => setOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      {trigger}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {web ? (
              <DrawerDescription>
                Native iOS picker (display="spinner") · web replica
              </DrawerDescription>
            ) : null}
          </DrawerHeader>
          <View className="items-center px-4">
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={draft}
                mode="time"
                display="spinner"
                minuteInterval={minuteInterval}
                themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
                locale={locale}
                onChange={(_e, date) => date && setDraft(date)}
                style={{ alignSelf: 'stretch' }}
              />
            ) : (
              <IOSTimeWheels
                value={draft}
                onChange={setDraft}
                hour12={hour12}
                minuteInterval={minuteInterval}
              />
            )}
          </View>
          <DrawerFooter>
            <Button
              onPress={() => {
                onChange?.(draft);
                setOpen(false);
              }}>
              <Text>Done</Text>
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">
                <Text>Cancel</Text>
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export { formatTime, TimePicker, TimePickerTrigger };
export type { AndroidDesign as TimePickerAndroidDesign, IOSDisplay as TimePickerIOSDisplay };
export type { TimePickerProps, TimePickerTriggerProps };
