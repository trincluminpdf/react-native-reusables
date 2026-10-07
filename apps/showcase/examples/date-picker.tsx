import { DatePicker, DatePickerTrigger } from '@/registry/nativewind/components/ui/date-picker';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { Platform, View } from 'react-native';

const SAMPLE = new Date(2026, 9, 14);
const TODAY = new Date(new Date().setHours(0, 0, 0, 0));
const IN_30_DAYS = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 30);

/** Interactive in every state that can open (tapping a static trigger did nothing on phones). */
function LivePicker(
  props: Omit<React.ComponentProps<typeof DatePicker>, 'value' | 'onChange'> & { initial?: Date }
) {
  const { initial, ...rest } = props;
  const [date, setDate] = React.useState<Date | undefined>(initial);
  return <DatePicker {...rest} value={date} onChange={setDate} />;
}

function Trigger() {
  return (
    <PreviewStack>
      <Spec label="State=Default">
        <LivePicker />
      </Spec>
      <Spec label="State=Filled">
        <LivePicker initial={SAMPLE} />
      </Spec>
      <Spec label="State=Focus (picker open) ◆ ring on native too — static">
        <View pointerEvents="none">
          <DatePickerTrigger value={SAMPLE} open />
        </View>
      </Spec>
      <Spec label="State=Disabled">
        <LivePicker disabled />
      </Spec>
      <Spec label="State=Invalid">
        <LivePicker invalid />
      </Spec>
    </PreviewStack>
  );
}

function Bounded(props: Omit<React.ComponentProps<typeof DatePicker>, 'value' | 'onChange'>) {
  return (
    <LivePicker {...props} minimumDate={TODAY} maximumDate={IN_30_DAYS} placeholder="Due date" />
  );
}

/** Caption under the platform demos: what runs on the device. */
function Note({ children }: { children: string }) {
  return <Text className="text-muted-foreground text-xs leading-5">{children}</Text>;
}

function IOSInline() {
  return (
    <PreviewStack>
      <Spec label="Tap the trigger → Drawer with the inline calendar">
        <LivePicker />
      </Spec>
      <Spec label="Min / max (today → +30 days)">
        <Bounded />
      </Spec>
      <Spec label="Disabled">
        <LivePicker disabled />
      </Spec>
      <Note>
        {Platform.OS === 'web'
          ? 'Web replica of iOS <DateTimePicker display="inline" /> inside ◆ Drawer (Done / Cancel). Tap "Month Year ›" for the wheel. On iPhone the system picker opens.'
          : 'iOS: <DateTimePicker display="inline" /> inside ◆ Drawer.'}
      </Note>
    </PreviewStack>
  );
}

function IOSCompact() {
  return (
    <PreviewStack>
      <Spec label="Display=Compact (system) — no Trigger, tap the pill">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-base">Due date</Text>
          <LivePicker iosDisplay="compact" initial={SAMPLE} />
        </View>
      </Spec>
      <Spec label="Min / max (today → +30 days)">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-base">Reminder</Text>
          <Bounded iosDisplay="compact" />
        </View>
      </Spec>
      <Spec label="Disabled">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-muted-foreground text-base">Due date</Text>
          <LivePicker iosDisplay="compact" initial={SAMPLE} disabled />
        </View>
      </Spec>
      <Note>
        {
          'iosDisplay="compact" → <DateTimePicker display="compact" /> (iOS default style). The pill always shows a date (today when empty), each tap in the popover sets the value, tap outside to close. Android ignores it and opens the Material 3 dialog.'
        }
      </Note>
    </PreviewStack>
  );
}

function AndroidM3() {
  return (
    <PreviewStack>
      <Spec label="Tap the trigger → Material 3 modal date picker">
        <LivePicker />
      </Spec>
      <Spec label="Min / max (today → +30 days)">
        <Bounded />
      </Spec>
      <Spec label="Disabled">
        <LivePicker disabled />
      </Spec>
      <Note>
        {Platform.OS === 'web'
          ? 'Web replica of DateTimePickerAndroid (design="material") with the Lumin colors from plugins/withLuminAndroidTheme: Cancel / OK, tap "Month Year ▾" for years, pencil for text input. On Android the system dialog opens.'
          : 'Android: DateTimePickerAndroid (design="material") → Material 3 modal date picker, Lumin colors via plugins/withLuminAndroidTheme.'}
      </Note>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Trigger · State', component: Trigger },
  { name: 'iOS · Display=Inline in Drawer', component: IOSInline, platform: 'ios' },
  { name: 'iOS · Display=Compact (system)', component: IOSCompact, platform: 'ios' },
  { name: 'Android · Material 3 modal', component: AndroidM3, platform: 'android' },
];
