import { DatePicker } from '@/registry/nativewind/components/ui/date-picker';
import { Text } from '@/registry/nativewind/components/ui/text';
import { TimePicker, TimePickerTrigger } from '@/registry/nativewind/components/ui/time-picker';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { Platform, View } from 'react-native';

const SAMPLE = new Date(2026, 9, 14, 9, 41);

/** Interactive in every state that can open. */
function LivePicker(
  props: Omit<React.ComponentProps<typeof TimePicker>, 'value' | 'onChange'> & { initial?: Date }
) {
  const { initial, ...rest } = props;
  const [time, setTime] = React.useState<Date | undefined>(initial);
  return <TimePicker {...rest} value={time} onChange={setTime} />;
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
          <TimePickerTrigger value={SAMPLE} open />
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

/** Caption under the platform demos: what runs on the device. */
function Note({ children }: { children: string }) {
  return <Text className="text-muted-foreground text-xs leading-5">{children}</Text>;
}

function DateAndTime() {
  const [date, setDate] = React.useState<Date | undefined>(SAMPLE);
  const [time, setTime] = React.useState<Date | undefined>(SAMPLE);
  return (
    <Spec label="Date + time = two triggers side by side">
      <View className="flex-row gap-2">
        <View className="flex-1">
          <DatePicker value={date} onChange={setDate} />
        </View>
        <View className="flex-1">
          <TimePicker value={time} onChange={setTime} />
        </View>
      </View>
    </Spec>
  );
}

function IOSWheels() {
  return (
    <PreviewStack>
      <Spec label="Tap the trigger → Drawer with the time wheels">
        <LivePicker initial={SAMPLE} />
      </Spec>
      <Spec label="minuteInterval=15">
        <LivePicker minuteInterval={15} placeholder="Reminder" />
      </Spec>
      <DateAndTime />
      <Note>
        {Platform.OS === 'web'
          ? 'Web replica of iOS <DateTimePicker mode="time" display="spinner" /> inside ◆ Drawer (Done / Cancel). Scroll or tap the wheels. On iPhone the system wheels open.'
          : 'iOS: <DateTimePicker mode="time" display="spinner" /> inside ◆ Drawer.'}
      </Note>
    </PreviewStack>
  );
}

function IOSCompact() {
  return (
    <PreviewStack>
      <Spec label="Display=Compact (system) — no Trigger, tap the pill">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-base">Start time</Text>
          <LivePicker iosDisplay="compact" initial={SAMPLE} />
        </View>
      </Spec>
      <Spec label="Disabled">
        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-muted-foreground text-base">Start time</Text>
          <LivePicker iosDisplay="compact" initial={SAMPLE} disabled />
        </View>
      </Spec>
      <Note>
        {
          'iosDisplay="compact" → <DateTimePicker mode="time" display="compact" /> (iOS default style). The pill always shows a time (now when empty); the wheel popover sets the value as you scroll, tap outside to close. Android ignores it and opens the Material 3 dialog.'
        }
      </Note>
    </PreviewStack>
  );
}

function AndroidM3() {
  return (
    <PreviewStack>
      <Spec label="Tap the trigger → Material 3 time picker (dial)">
        <LivePicker initial={SAMPLE} />
      </Spec>
      <Spec label="State=Default (empty → opens at the current time)">
        <LivePicker />
      </Spec>
      <DateAndTime />
      <Note>
        {Platform.OS === 'web'
          ? 'Web replica of DateTimePickerAndroid (mode="time", design="material") with the Lumin colors from plugins/withLuminAndroidTheme: hour dial → minute dial, AM / PM, keyboard icon for text entry, Cancel / OK. On Android the system dialog opens.'
          : 'Android: DateTimePickerAndroid (mode="time", design="material") → Material 3 time picker, Lumin colors via plugins/withLuminAndroidTheme.'}
      </Note>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Trigger · State', component: Trigger },
  { name: 'iOS · Display=Wheels in Drawer', component: IOSWheels, platform: 'ios' },
  { name: 'iOS · Display=Compact (system)', component: IOSCompact, platform: 'ios' },
  { name: 'Android · Material 3 dial', component: AndroidM3, platform: 'android' },
];
