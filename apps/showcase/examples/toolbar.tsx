import {
  TextAStrikethroughIcon,
  TextAWavyUnderlineIcon,
} from '@/registry/nativewind/components/ui/lumin-icons';
import { ToolItem, Toolbar, ToolbarTools } from '@/registry/nativewind/components/ui/toolbar';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import {
  ChatCircleDotsIcon,
  EraserIcon,
  HighlighterCircleIcon,
  HighlighterIcon,
  ScribbleLoopIcon,
  SignatureIcon,
  SquaresFourIcon,
  TextAUnderlineIcon,
  TextTIcon,
} from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

/** Web Tool icon table (LPA-001 › 2221-2) → mobile. */
const GROUPS = [
  { key: 'markup', label: 'Mark up', icon: ChatCircleDotsIcon },
  { key: 'draw', label: 'Draw', icon: ScribbleLoopIcon },
  { key: 'sign', label: 'Sign', icon: SignatureIcon },
  { key: 'text', label: 'Text', icon: TextTIcon },
  { key: 'more', label: 'More', icon: SquaresFourIcon },
] as const;

const MARKUP_TOOLS = [
  { key: 'eraser', label: 'Eraser', icon: EraserIcon, color: undefined },
  { key: 'text-highlight', label: 'Text highlight', icon: HighlighterCircleIcon, color: '#fee08b' },
  { key: 'highlight', label: 'Highlight', icon: HighlighterIcon, color: '#fc8d59' },
  { key: 'underline', label: 'Underline', icon: TextAUnderlineIcon, color: '#4575b4' },
  { key: 'strikethrough', label: 'Strikethrough', icon: TextAStrikethroughIcon, color: '#d73027' },
  { key: 'squiggly', label: 'Squiggly', icon: TextAWavyUnderlineIcon, color: '#5ab4ac' },
] as const;

type ToolKey = (typeof MARKUP_TOOLS)[number]['key'];

/** Interactive toolbar: Groups → Mark up opens Tools; X closes; Style / tap-again opens the sheet. */
function DemoToolbar({
  onOpenStyle,
  color,
  initialMode = 'groups',
  onModeChange,
}: {
  onOpenStyle?: () => void;
  color?: string;
  initialMode?: 'groups' | 'tools';
  onModeChange?: (mode: 'groups' | 'tools') => void;
}) {
  const [mode, setModeState] = React.useState<'groups' | 'tools'>(initialMode);
  const setMode = (m: 'groups' | 'tools') => {
    setModeState(m);
    onModeChange?.(m);
  };
  const [tool, setTool] = React.useState<ToolKey>('text-highlight');
  const active = MARKUP_TOOLS.find((t) => t.key === tool)!;

  if (mode === 'groups') {
    return (
      <Toolbar>
        {GROUPS.map((g) => (
          <ToolItem
            key={g.key}
            label={g.label}
            icon={g.icon}
            fill
            onPress={g.key === 'markup' ? () => setMode('tools') : undefined}
          />
        ))}
      </Toolbar>
    );
  }
  return (
    <Toolbar>
      <ToolbarTools
        onClose={() => setMode('groups')}
        styleColor={active.color ? (color ?? active.color) : undefined}
        onStylePress={onOpenStyle}>
        {MARKUP_TOOLS.map((t) => (
          <ToolItem
            key={t.key}
            label={t.label}
            icon={t.icon}
            active={t.key === tool}
            onPress={() => (t.key === tool && t.color ? onOpenStyle?.() : setTool(t.key))}
          />
        ))}
      </ToolbarTools>
    </Toolbar>
  );
}

function Types() {
  const [opened, setOpened] = React.useState(0);
  return (
    <PreviewStack>
      <Spec label="◆ Type=Groups · tap Mark up">
        <View className="bg-muted/60 -mx-4 pt-2">
          <DemoToolbar onOpenStyle={() => setOpened((n) => n + 1)} />
        </View>
      </Spec>
      <Spec label="◆ Type=Tools · X closes · Style well / tap active tool = open sheet">
        <View className="bg-muted/60 -mx-4 pt-2">
          <DemoToolbar initialMode="tools" onOpenStyle={() => setOpened((n) => n + 1)} />
        </View>
        <Text className="text-muted-foreground text-xs">Sheet opened {opened}×</Text>
      </Spec>
    </PreviewStack>
  );
}

function ItemStates() {
  return (
    <PreviewStack>
      <Spec label="◆ Tool Item · State=Default / Active / Disabled" row>
        <ToolItem label="Text highlight" icon={HighlighterCircleIcon} />
        <ToolItem label="Text highlight" icon={HighlighterCircleIcon} active />
        <ToolItem label="Text highlight" icon={HighlighterCircleIcon} disabled />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Type', component: Types },
  { name: 'Tool Item', component: ItemStates },
];

export { DemoToolbar };
