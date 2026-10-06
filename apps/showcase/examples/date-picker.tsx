import { DatePicker, DatePickerTrigger } from '@/registry/nativewind/components/ui/date-picker';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { Platform } from 'react-native';

const SAMPLE = new Date(2026, 9, 14);
const TODAY = new Date(new Date().setHours(0, 0, 0, 0));
const IN_30_DAYS = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 30);

function Trigger() {
  return (
    <PreviewStack>
      <Spec label="State=Default">
        <DatePickerTrigger />
      </Spec>
      <Spec label="State=Filled">
        <DatePickerTrigger value={SAMPLE} />
      </Spec>
      <Spec label="State=Focus (picker open) ◆ ring on native too">
        <DatePickerTrigger value={SAMPLE} open />
      </Spec>
      <Spec label="State=Disabled">
        <DatePickerTrigger disabled />
      </Spec>
      <Spec label="State=Invalid">
        <DatePickerTrigger invalid />
      </Spec>
    </PreviewStack>
  );
}

function Picker() {
  const [date, setDate] = React.useState<Date | undefined>();
  const [bounded, setBounded] = React.useState<Date | undefined>();
  return (
    <PreviewStack>
      <Spec label="Tap the trigger — native picker on device">
        <DatePicker value={date} onChange={setDate} />
      </Spec>
      <Spec label="Min / max (today → +30 days)">
        <DatePicker
          value={bounded}
          onChange={setBounded}
          minimumDate={TODAY}
          maximumDate={IN_30_DAYS}
          placeholder="Due date"
        />
      </Spec>
      <Spec label="Disabled">
        <DatePicker disabled />
      </Spec>
      <Text className="text-muted-foreground text-xs leading-5">
        {Platform.select({
          android:
            'Android: DateTimePickerAndroid (design="material") → Material 3 modal date picker, Lumin colors via plugins/withLuminAndroidTheme.',
          ios: 'iOS: <DateTimePicker display="inline" /> inside ◆ Drawer.',
          default:
            'Web preview: ◆ Calendar inside ◆ Drawer stands in for the native picker. On Android the Material 3 dialog opens; on iOS the inline UIDatePicker opens in a Drawer (see Figma "(native demo)" components).',
        })}
      </Text>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Trigger · State', component: Trigger },
  { name: 'Picker (native)', component: Picker },
];
