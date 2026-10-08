import { OutlineItem } from '@/registry/nativewind/components/ui/outline-item';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

type OutlineNode = { id: string; title: string; page: number; children?: OutlineNode[] };

/** Demo outline (TOC) of a generic user guide. */
const TREE: OutlineNode[] = [
  { id: '1', title: 'Introduction', page: 1 },
  {
    id: '2',
    title: 'Getting started',
    page: 3,
    children: [
      { id: '2.1', title: 'Install the app', page: 3 },
      {
        id: '2.2',
        title: 'Open your first document',
        page: 5,
        children: [
          { id: '2.2.1', title: 'From device storage', page: 5 },
          { id: '2.2.2', title: 'From cloud storage', page: 6 },
        ],
      },
    ],
  },
  {
    id: '3',
    title: 'Annotate, fill in forms and sign documents on the go with your team',
    page: 12,
    children: [
      { id: '3.1', title: 'Highlight and comment', page: 12 },
      { id: '3.2', title: 'Request signatures', page: 18 },
    ],
  },
  { id: '4', title: 'Appendix', page: 40 },
];

type Row = { node: OutlineNode; depth: number };

function flatten(nodes: OutlineNode[], open: Set<string> | 'all', depth = 0): Row[] {
  return nodes.flatMap((node) => [
    { node, depth },
    ...(node.children && (open === 'all' || open.has(node.id))
      ? flatten(node.children, open, depth + 1)
      : []),
  ]);
}

function expandOf(node: OutlineNode, open: Set<string> | 'all') {
  if (!node.children?.length) return 'none' as const;
  return open === 'all' || open.has(node.id) ? ('expanded' as const) : ('collapsed' as const);
}

function DefaultMode() {
  const [open, setOpen] = React.useState<Set<string>>(() => new Set(['2']));
  const [page, setPage] = React.useState<number | null>(null);
  const toggle = (id: string) =>
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  return (
    <PreviewStack>
      <Spec label="Mode=Default · tap caret = expand / collapse · tap row = go to page">
        <View className="-mx-4">
          {flatten(TREE, open).map(({ node, depth }) => (
            <OutlineItem
              key={node.id}
              title={node.title}
              page={node.page}
              depth={depth}
              expand={expandOf(node, open)}
              onToggleExpand={() => toggle(node.id)}
              onPress={() => setPage(node.page)}
            />
          ))}
        </View>
        <Text className="text-muted-foreground text-xs">
          {page ? `Went to page ${page}` : 'Expand=None keeps the caret slot so titles align'}
        </Text>
      </Spec>
    </PreviewStack>
  );
}

function EditMode() {
  const [checked, setChecked] = React.useState<Set<string>>(() => new Set(['2.1', '2.2']));
  const set = (id: string, on: boolean) =>
    setChecked((s) => {
      const next = new Set(s);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  return (
    <PreviewStack>
      <Spec label="Mode=Edit · checkbox + drag handle · tap row to select">
        <View className="-mx-4">
          {flatten(TREE.slice(0, 3), 'all').map(({ node, depth }) => (
            <OutlineItem
              key={node.id}
              mode="edit"
              title={node.title}
              page={node.page}
              depth={depth}
              expand={expandOf(node, 'all')}
              checked={checked.has(node.id)}
              onCheckedChange={(on) => set(node.id, on)}
            />
          ))}
        </View>
        <Text className="text-muted-foreground text-xs">{`${checked.size} selected`}</Text>
      </Spec>
    </PreviewStack>
  );
}

function Disabled() {
  return (
    <PreviewStack>
      <Spec label="State=Default · Disabled (Mode=Default)">
        <View className="-mx-4">
          <OutlineItem title="Getting started" page={3} expand="collapsed" onPress={() => {}} />
          <OutlineItem title="Removed section" page="–" disabled onPress={() => {}} />
        </View>
      </Spec>
      <Spec label="State=Disabled · Mode=Edit">
        <View className="-mx-4">
          <OutlineItem mode="edit" title="Install the app" page={3} depth={1} checked />
          <OutlineItem mode="edit" title="Removed section" page="–" depth={1} disabled />
        </View>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Mode=Default', component: DefaultMode },
  { name: 'Mode=Edit', component: EditMode },
  { name: 'State=Disabled', component: Disabled },
];
