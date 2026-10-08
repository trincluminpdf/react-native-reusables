import {
  AnnotationSelection,
  type RotateHandleSide,
  type SelectionRect,
} from '@/registry/nativewind/components/ui/annotation-selection';
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { ImageIcon } from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

/** Grey stand-in for the selected annotation. */
function GreyBox() {
  return <View className="size-full bg-neutral-200 dark:bg-neutral-700" />;
}

const SIDES: { side: RotateHandleSide; label: string }[] = [
  { side: 'top', label: 'Top' },
  { side: 'right', label: 'Right' },
  { side: 'bottom', label: 'Bottom' },
  { side: 'left', label: 'Left' },
];

/** 160×128 cell with a 96×56 selection in the middle (room for the rotate handle on every side). */
function Cell({ side, showRotate = true }: { side?: RotateHandleSide; showRotate?: boolean }) {
  return (
    <View className="h-32 w-40">
      <AnnotationSelection
        rect={{ x: 32, y: 36, width: 96, height: 56 }}
        rotateHandle={side}
        showRotate={showRotate}>
        <GreyBox />
      </AnnotationSelection>
    </View>
  );
}

function RotateHandles() {
  return (
    <PreviewStack>
      <View className="flex-row flex-wrap justify-between gap-y-6">
        {SIDES.map(({ side, label }) => (
          <Spec key={side} label={`Rotate handle=${label}`} className="w-40">
            <Cell side={side} />
          </Spec>
        ))}
      </View>
    </PreviewStack>
  );
}

function NoRotate() {
  return (
    <PreviewStack>
      <Spec label="Show rotate=false · e.g. a form field or free text that can't rotate">
        <View className="items-center">
          <Cell showRotate={false} />
        </View>
      </Spec>
    </PreviewStack>
  );
}

const AREA = { width: 320, height: 360 };
const START: SelectionRect = { x: 80, y: 110, width: 160, height: 120 };

function DragDemo() {
  const [rect, setRect] = React.useState<SelectionRect>(START);
  const [gestures, setGestures] = React.useState(0);
  return (
    <PreviewStack>
      <Spec label="◆ Drag to move / resize · body = move, handles = resize (min 24)">
        <View
          className="border-border bg-background self-center rounded-sm border"
          style={{ width: AREA.width, height: AREA.height }}>
          <AnnotationSelection
            rect={rect}
            onChange={setRect}
            onChangeEnd={() => setGestures((n) => n + 1)}
            onRotatePress={() => {}}
            bounds={AREA}>
            <View className="size-full items-center justify-center bg-blue-100 dark:bg-blue-950">
              <Icon as={ImageIcon} className="size-8 text-blue-500 dark:text-blue-400" />
            </View>
          </AnnotationSelection>
        </View>
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-muted-foreground text-xs">
            x {Math.round(rect.x)} · y {Math.round(rect.y)} · {Math.round(rect.width)}×
            {Math.round(rect.height)} · {gestures} gesture{gestures === 1 ? '' : 's'}
          </Text>
          <Button variant="outline" size="sm" onPress={() => setRect(START)}>
            <Text>Reset</Text>
          </Button>
        </View>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Rotate handle', component: RotateHandles },
  { name: '◆ Drag to move / resize', component: DragDemo },
  { name: 'Show rotate=false', component: NoRotate },
];
