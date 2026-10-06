/**
 * Shared bits for the ◆ In-app previews: demo data (placeholders only, no real people) and a fake PDF page.
 */
import { cn } from '@/registry/nativewind/lib/utils';
import {
  ArrowSquareInIcon,
  ChatCircleDotsIcon,
  ChatCircleTextIcon,
  FilePlusIcon,
  ScanIcon,
  SignatureIcon,
  SparkleIcon,
  SpeakerHighIcon,
} from 'phosphor-react-native';
import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import type { ToolTileColor } from '@/registry/nativewind/components/ui/tool-tile';

export const DEMO_TOOLS: {
  title: string;
  description: string;
  icon: typeof ArrowSquareInIcon;
  color: ToolTileColor;
}[] = [
  {
    title: 'Merge files',
    description: 'Combine files into one PDF.',
    icon: ArrowSquareInIcon,
    color: 'red',
  },
  {
    title: 'Read aloud',
    description: 'Listen to your PDF with clear voice narration.',
    icon: SpeakerHighIcon,
    color: 'sky',
  },
  {
    title: 'AI summarize',
    description: 'Get a concise summary of your PDF in seconds.',
    icon: SparkleIcon,
    color: 'violet',
  },
  {
    title: 'Chat with PDF',
    description: 'Ask questions and get answers from your PDF.',
    icon: ChatCircleTextIcon,
    color: 'teal',
  },
  {
    title: 'Scan a document',
    description: 'Scan paper documents into PDFs.',
    icon: ScanIcon,
    color: 'orange',
  },
  {
    title: 'Create blank PDF',
    description: 'Start a new PDF from scratch.',
    icon: FilePlusIcon,
    color: 'blue',
  },
  {
    title: 'eSign PDF',
    description: 'Fill forms and sign PDFs with ease.',
    icon: SignatureIcon,
    color: 'pink',
  },
  {
    title: 'Annotate PDF',
    description: 'Mark up PDFs with notes and drawings.',
    icon: ChatCircleDotsIcon,
    color: 'green',
  },
];

export const DEMO_DOCS = [
  { title: 'Q2 Results.pdf', owner: 'Owner name', date: 'Oct 6, 2026', starred: true },
  { title: 'Sequence Data.pdf', owner: 'Owner name', date: 'Oct 6, 2026' },
  { title: 'NDA – Partner draft.pdf', owner: 'Owner name', date: 'Oct 5, 2026', starred: true },
  { title: 'Electrometer Data.pdf', owner: 'Owner name', date: 'Oct 3, 2026' },
  { title: 'Onboarding checklist.pdf', owner: 'Owner name', date: 'Sep 28, 2026' },
];

export const DEMO_FILTERS = [
  { value: 'recent', label: 'Recent' },
  { value: 'local', label: 'Local' },
  { value: 'starred', label: 'Starred' },
  { value: 'offline', label: 'Offline' },
] as const;

/** Grey-bar stand-in for a PDF page. Children are drawn on top (selection, highlights…). */
export function FakePdfPage({ className, children, ...props }: ViewProps) {
  return (
    <View
      className={cn(
        'border-border w-full gap-5 rounded-sm border bg-white p-5 shadow-sm shadow-black/10',
        className
      )}
      {...props}>
      <View className="gap-2">
        <Bar w="85%" h={10} dark />
        <Bar w="40%" h={10} dark />
      </View>
      {[6, 4, 5, 4].map((n, p) => (
        <View key={p} className="gap-2">
          {Array.from({ length: n }, (_, i) => (
            <Bar key={i} w={i === n - 1 ? '60%' : '100%'} />
          ))}
        </View>
      ))}
      {children}
    </View>
  );
}

function Bar({ w, h = 6, dark }: { w: `${number}%`; h?: number; dark?: boolean }) {
  return (
    <View
      style={{ width: w, height: h }}
      className={cn('rounded-sm', dark ? 'bg-neutral-300' : 'bg-neutral-200')}
    />
  );
}
