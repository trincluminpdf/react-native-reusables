import { Calendar, type DateRange } from '@/registry/nativewind/components/ui/calendar';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

function Single() {
  const [date, setDate] = React.useState<Date>(new Date());
  return (
    <PreviewStack>
      <Spec label="Type=Single · day cells 44×44">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </Spec>
    </PreviewStack>
  );
}

function Range() {
  const today = new Date();
  const [range, setRange] = React.useState<DateRange>({
    from: new Date(today.getFullYear(), today.getMonth(), 8),
    to: new Date(today.getFullYear(), today.getMonth(), 13),
  });
  return (
    <PreviewStack>
      <Spec label="Type=Range · start/end primary, middle accent">
        <Calendar mode="range" selected={range} onSelect={setRange} />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Type=Single', component: Single },
  { name: 'Type=Range', component: Range },
];
