/**
 * ◆ Lumin custom. Figma: PDF-Mobile-DS › ◆ Date Picker. Tokens: 5. Component › date-picker/*
 *
 * Build only the Trigger — the picker itself is NATIVE (@react-native-community/datetimepicker):
 * - Android: DateTimePickerAndroid.open({ mode: 'date', design: 'material' }) → Material 3 modal date
 *   picker (Figma "Date Picker / Android (native demo)"). REQUIRES the app theme to inherit
 *   Theme.Material3.* — add the `./plugins/withLuminAndroidTheme` config plugin (showcase does) and
 *   rebuild the dev client; without it the M3 dialog crashes natively. `androidDesign="default"`
 *   falls back to the legacy framework DatePickerDialog (no theme requirement, not DS-styled).
 * - iOS: <DateTimePicker display="inline" /> inside our ◆ Drawer (Figma "Inline in Drawer").
 *   display="compact" (iOS default) shows the system pill + popover instead of our Trigger.
 * - Web (showcase only): ◆ Calendar inside the Drawer as a stand-in for the native picker.
 * Native pickers follow the OS theme/locale; only accentColor / themeVariant / locale are set on iOS.
 * Trigger mirrors the Select trigger: h-10 (Tablet sm:h-9), px-3, rounded-md, 44 hit area, focus ring.
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { Calendar } from '@/registry/nativewind/components/ui/calendar';
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
import { useFocusRing } from '@/registry/nativewind/lib/focus-ring';
import { cn } from '@/registry/nativewind/lib/utils';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useColorScheme } from 'nativewind';
import { CalendarBlankIcon, CaretDownIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';

function formatDate(date: Date, locale = 'en-US') {
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
}

type DatePickerTriggerProps = Omit<React.ComponentProps<typeof Pressable>, 'children'> & {
  value?: Date;
  placeholder?: string;
  /** Picker open → focus ring (Figma State=Focus). */
  open?: boolean;
  invalid?: boolean;
  locale?: string;
};

function DatePickerTrigger({
  value,
  placeholder = 'Pick a date',
  open = false,
  invalid = false,
  disabled,
  className,
  style,
  locale,
  ...props
}: DatePickerTriggerProps) {
  const ring = useFocusRing({ invalid, forceFocused: open });
  return (
    <Pressable
      role="button"
      accessibilityLabel={value ? `Date, ${formatDate(value, locale)}` : placeholder}
      disabled={disabled}
      hitSlop={2}
      className={cn(
        'border-input bg-background dark:bg-input/30 active:bg-accent dark:active:bg-input/50 h-10 w-full flex-row items-center gap-2 rounded-md border px-3 sm:h-9',
        Platform.select({ web: 'outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]' }),
        open && cn('border-ring', Platform.select({ web: 'ring-ring/50 ring-[3px]' })),
        invalid &&
          cn('border-destructive', Platform.select({ web: 'ring-destructive/20 dark:ring-destructive/40 ring-[3px]' })),
        disabled && 'bg-input/50 dark:bg-input/80 opacity-50',
        className
      )}
      style={[ring.style, style as object]}
      {...props}>
      <Icon as={CalendarBlankIcon} size={16} className="text-foreground size-4" />
      <Text
        className={cn('flex-1 text-sm', value ? 'text-foreground' : 'text-muted-foreground')}
        numberOfLines={1}>
        {value ? formatDate(value, locale) : placeholder}
      </Text>
      <Icon as={CaretDownIcon} size={16} className="text-muted-foreground size-4" />
    </Pressable>
  );
}

type AndroidDesign = 'material' | 'default';

function clampDate(date: Date, min?: Date, max?: Date) {
  if (min && date < min) return new Date(min);
  if (max && date > max) return new Date(max);
  return date;
}

// The typings only declare `dismiss(mode)`; the JS also takes `design` (it picks the M3 or legacy module).
const dismissAndroidPicker = DateTimePickerAndroid.dismiss as unknown as (
  mode: 'date',
  design?: AndroidDesign
) => Promise<boolean>;

type DatePickerProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  title?: string;
  invalid?: boolean;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  /** iOS / web only — Android follows the system locale. */
  locale?: string;
  /** Android dialog: 'material' (M3, default — needs the theme plugin) or 'default' (legacy). */
  androidDesign?: AndroidDesign;
  className?: string;
};

/** Trigger + platform picker (see file header). */
function DatePicker({
  value,
  onChange,
  placeholder,
  title = 'Select date',
  invalid,
  disabled,
  minimumDate,
  maximumDate,
  locale,
  androidDesign = 'material',
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Date>(value ?? new Date());
  const { colorScheme } = useColorScheme();
  // Android: the dialog lives outside React — track it so a double tap can't stack a second open()
  // (the native module never resolves the 2nd promise → focus ring stuck) and so it closes on unmount.
  const androidOpen = React.useRef(false);

  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    return () => {
      if (androidOpen.current) {
        androidOpen.current = false;
        dismissAndroidPicker('date', androidDesign).catch(() => {});
      }
    };
  }, [androidDesign]);

  function openPicker() {
    const initial = clampDate(value ?? new Date(), minimumDate, maximumDate);
    if (Platform.OS === 'android') {
      if (androidOpen.current) return;
      androidOpen.current = true;
      setOpen(true);
      const close = () => {
        androidOpen.current = false;
        setOpen(false);
      };
      // onValueChange / onDismiss / onError — `onChange` is deprecated in v9 and warns in dev.
      DateTimePickerAndroid.open({
        value: initial,
        mode: 'date',
        design: androidDesign,
        title: androidDesign === 'material' ? title : undefined,
        minimumDate,
        maximumDate,
        onValueChange: (_event, date) => {
          close();
          onChange?.(date);
        },
        onDismiss: close,
        onError: (error) => {
          close();
          console.warn('[DatePicker] Android picker failed to open:', error);
        },
      });
      return;
    }
    setDraft(initial);
    setOpen(true);
  }

  const trigger = (
    <DatePickerTrigger
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

  return (
    <>
      {trigger}
      <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {Platform.OS === 'web' ? (
            <DrawerDescription>Web preview — on device the native picker opens.</DrawerDescription>
          ) : null}
        </DrawerHeader>
        <View className="items-center px-4">
          {Platform.OS === 'ios' ? (
            <DateTimePicker
              value={draft}
              mode="date"
              display="inline"
              themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              locale={locale}
              onChange={(_e, date) => date && setDraft(date)}
              style={{ alignSelf: 'stretch' }}
            />
          ) : (
            <Calendar
              mode="single"
              selected={draft}
              onSelect={(d) => setDraft(d)}
              disabled={(d) =>
                (!!minimumDate && d < minimumDate) || (!!maximumDate && d > maximumDate)
              }
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

export { DatePicker, DatePickerTrigger, formatDate };
export type { AndroidDesign as DatePickerAndroidDesign };
export type { DatePickerProps, DatePickerTriggerProps };
