import {
  TextAStrikethroughIcon,
  TextAWavyUnderlineIcon,
} from '@/registry/nativewind/components/ui/lumin-icons';
import {
  ToolItem,
  Toolbar,
  ToolbarAction,
  ToolbarPlayer,
  ToolbarSearch,
  ToolbarTools,
} from '@/registry/nativewind/components/ui/toolbar';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import {
  ArrowsOutCardinalIcon,
  ChatCircleDotsIcon,
  CheckSquareIcon,
  CloudArrowDownIcon,
  EraserIcon,
  FolderSimpleIcon,
  PlusCircleIcon,
  RadioButtonIcon,
  ShareFatIcon,
  StarIcon,
  TrashIcon,
  HighlighterCircleIcon,
  HighlighterIcon,
  ScribbleLoopIcon,
  SignatureIcon,
  SquaresFourIcon,
  TextAUnderlineIcon,
  TextTIcon,
} from 'phosphor-react-native';
import { TextTPlusIcon } from '@/registry/nativewind/components/ui/form-field';
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

/** ✏️ LPM batch — Type=Actions: bottom action bar for select / edit modes. */
function Actions() {
  const [count, setCount] = React.useState(2);
  const none = count === 0;
  return (
    <PreviewStack>
      <Spec label="◆ Type=Actions · 3 slots (Outline edit) · destructive last">
        <View className="bg-muted/60 -mx-4 pt-2">
          <Toolbar>
            <ToolbarAction label="Add" icon={PlusCircleIcon} />
            <ToolbarAction label="Move" icon={ArrowsOutCardinalIcon} />
            <ToolbarAction label="Delete" icon={TrashIcon} tone="destructive" />
          </Toolbar>
        </View>
      </Spec>
      <Spec label={`◆ Type=Actions · 5 slots (documents) · ${count} selected — tap to change`}>
        <View className="bg-muted/60 -mx-4 pt-2">
          <Toolbar>
            <ToolbarAction label="Share" icon={ShareFatIcon} disabled={none} />
            <ToolbarAction label="Move" icon={FolderSimpleIcon} disabled={none} />
            <ToolbarAction label="Offline" icon={CloudArrowDownIcon} disabled={none} />
            <ToolbarAction label="Star" icon={StarIcon} disabled={none} />
            <ToolbarAction label="Delete" icon={TrashIcon} tone="destructive" disabled={none} />
          </Toolbar>
        </View>
        <Text
          onPress={() => setCount((c) => (c === 0 ? 2 : 0))}
          className="text-primary text-xs underline">
          {none ? 'Select 2 items' : 'Clear selection (0 selected → all disabled)'}
        </Text>
      </Spec>
    </PreviewStack>
  );
}

/** ✏️ LPM batch — Type=Player (read aloud) and Type=Search / Search empty. */
function PlayerAndSearch() {
  const [playing, setPlaying] = React.useState(false);
  const speeds = ['0.75x', '1.0x', '1.25x', '1.5x', '2.0x'];
  const [speed, setSpeed] = React.useState(1);
  const [match, setMatch] = React.useState(1);
  return (
    <PreviewStack>
      <Spec label="◆ Type=Player · Play / Pause · Speed cycles">
        <View className="bg-muted/60 -mx-4 pt-2">
          <Toolbar>
            <ToolbarPlayer
              playing={playing}
              onPlayPause={() => setPlaying((p) => !p)}
              speed={speeds[speed]}
              onSpeedPress={() => setSpeed((i) => (i + 1) % speeds.length)}
            />
          </Toolbar>
        </View>
      </Spec>
      <Spec label="◆ Type=Search · ↑ / ↓ move through matches">
        <View className="bg-muted/60 -mx-4 pt-2">
          <Toolbar>
            <ToolbarSearch
              count={`${match} of 20`}
              onPrevious={() => setMatch((m) => (m === 1 ? 20 : m - 1))}
              onNext={() => setMatch((m) => (m === 20 ? 1 : m + 1))}
            />
          </Toolbar>
        </View>
      </Spec>
      <Spec label="◆ Type=Search empty">
        <View className="bg-muted/60 -mx-4 pt-2">
          <Toolbar>
            <ToolbarSearch count={null} />
          </Toolbar>
        </View>
      </Spec>
    </PreviewStack>
  );
}

/** ✏️ LPM batch — Prepare form (Show close off) and the object-selected state. */
function ToolsVariants() {
  const [field, setField] = React.useState('text');
  return (
    <PreviewStack>
      <Spec label="◆ Type=Tools · Show close=false (Prepare form — exit via App Bar Cancel / Apply)">
        <View className="bg-muted/60 -mx-4 pt-2">
          <Toolbar>
            <ToolbarTools showClose={false}>
              {[
                { key: 'text', label: 'Text field', icon: TextTPlusIcon },
                { key: 'sign', label: 'Signature field', icon: SignatureIcon },
                { key: 'check', label: 'Checkbox', icon: CheckSquareIcon },
                { key: 'radio', label: 'Radio button', icon: RadioButtonIcon },
              ].map((t) => (
                <ToolItem
                  key={t.key}
                  label={t.label}
                  icon={t.icon}
                  active={field === t.key}
                  onPress={() => setField(t.key)}
                />
              ))}
            </ToolbarTools>
          </Toolbar>
        </View>
      </Spec>
      <Spec label="◆ Object selected (image) · no active tool · style well = None">
        <View className="bg-muted/60 -mx-4 pt-2">
          <Toolbar>
            <ToolbarTools onClose={() => {}} styleColor={null}>
              {MARKUP_TOOLS.map((t) => (
                <ToolItem key={t.key} label={t.label} icon={t.icon} />
              ))}
            </ToolbarTools>
          </Toolbar>
        </View>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Type', component: Types },
  { name: 'Type=Actions', component: Actions },
  { name: 'Type=Player · Search', component: PlayerAndSearch },
  { name: 'Type=Tools · Prepare form / object selected', component: ToolsVariants },
  { name: 'Tool Item', component: ItemStates },
];

export { DemoToolbar };
