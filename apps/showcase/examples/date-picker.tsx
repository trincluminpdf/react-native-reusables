import { DatePicker, DatePickerTrigger } from '@/registry/nativewind/components/ui/date-picker';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { Platform } from 'react-native';

const SAMPLE = new Date(2026, 9, 14);

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
  return (
    <PreviewStack>
      <Spec label="Tap the trigger — native picker on device">
        <DatePicker value={date} onChange={setDate} />
      </Spec>
      <Text className="text-muted-foreground text-xs leading-5">
        {Platform.select({
          android: 'Android: DateTimePickerAndroid → Material date picker dialog.',
          ios: 'iOS: <DateTimePicker display="inline" /> inside ◆ Drawer.',
          default:
            'Web preview: ◆ Calendar inside ◆ Drawer stands in for the native picker. On Android the Material dialog opens; on iOS the inline UIDatePicker opens in a Drawer (see Figma "(native demo)" components).',
        })}
      </Text>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Trigger · State', component: Trigger },
  { name: 'Picker (native)', component: Picker },
];
