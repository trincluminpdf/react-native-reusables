import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/registry/nativewind/components/ui/accordion';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

const ITEMS = [
  { value: 'a', q: 'What file types can I open?', a: 'PDF, Word, Excel, PowerPoint and images.' },
  { value: 'b', q: 'Can I sign documents offline?', a: 'Yes. Signatures sync when you are back online.' },
  { value: 'c', q: 'Is my document shared automatically?', a: 'No. Only people you invite can see it.' },
];

function Items({ border }: { border?: boolean }) {
  return (
    <Accordion type="single" collapsible defaultValue="a" variant={border ? 'border' : 'basic'} className="w-full">
      {ITEMS.map((item, i) => (
        <AccordionItem key={item.value} value={item.value} className={i === ITEMS.length - 1 ? 'border-b-0' : undefined}>
          <AccordionTrigger>
            <Text>{item.q}</Text>
          </AccordionTrigger>
          <AccordionContent>
            <Text>{item.a}</Text>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export const previews: Preview[] = [
  {
    name: 'Variant=Basic',
    component: () => (
      <PreviewStack>
        <Spec label="Variant=Basic (base kit)">
          <Items />
        </Spec>
      </PreviewStack>
    ),
  },
  {
    name: 'Variant=Border ◆',
    component: () => (
      <PreviewStack>
        <Spec label="Variant=Border ◆ · rounded-lg border px-4">
          <Items border />
        </Spec>
      </PreviewStack>
    ),
  },
];
