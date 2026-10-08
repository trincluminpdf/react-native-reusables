import { Button } from '@/registry/nativewind/components/ui/button';
import { Hint } from '@/registry/nativewind/components/ui/hint';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { HandGrabbingIcon, SignatureIcon } from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

function InfoTone() {
  return (
    <PreviewStack>
      <Spec label="Tone=Info · Size=Full · Show icon (default ph-info fill)">
        <Hint>Hold and drag to reorder</Hint>
      </Spec>
      <Spec label="Tone=Info · Icon swap · wraps to 2 lines">
        <Hint icon={SignatureIcon}>
          Tap where you want to place your signature, then drag to adjust its size
        </Hint>
      </Spec>
      <Spec label="Tone=Info · Show icon=false">
        <Hint icon={null}>Tap a field to edit its properties</Hint>
      </Spec>
    </PreviewStack>
  );
}

function NeutralTone() {
  return (
    <PreviewStack>
      <Spec label="Tone=Neutral · Size=Full">
        <Hint tone="neutral">Hold and drag to reorder</Hint>
      </Spec>
      <Spec label="Tone=Neutral · Icon swap · Show dismiss">
        <Hint tone="neutral" icon={HandGrabbingIcon} onDismiss={() => {}}>
          Drag pages to change their order
        </Hint>
      </Spec>
    </PreviewStack>
  );
}

function Compact() {
  return (
    <PreviewStack>
      <Spec label="Size=Compact · Tone=Info · hugs, centered">
        <Hint size="compact">Hold and drag to reorder</Hint>
      </Spec>
      <Spec label="Size=Compact · Tone=Neutral">
        <Hint size="compact" tone="neutral" icon={SignatureIcon}>
          Tap to place signature
        </Hint>
      </Spec>
      <Spec label="Size=Compact · long text truncates (max width = screen − 32)">
        <Hint size="compact" onDismiss={() => {}}>
          Tap where you want to place your signature, then drag to adjust its size
        </Hint>
      </Spec>
    </PreviewStack>
  );
}

function WithAction() {
  const [opened, setOpened] = React.useState(0);
  return (
    <PreviewStack>
      <Spec label="◆ With action · Show action · Size=Full">
        <Hint actionLabel="Learn more" onActionPress={() => setOpened((n) => n + 1)}>
          Hold and drag to reorder
        </Hint>
      </Spec>
      <Spec label="◆ With action · Show dismiss · Tone=Neutral">
        <Hint
          tone="neutral"
          actionLabel="Learn more"
          onActionPress={() => setOpened((n) => n + 1)}
          onDismiss={() => {}}>
          Hold and drag to reorder
        </Hint>
      </Spec>
      <Spec label="◆ With action · Size=Compact">
        <Hint size="compact" actionLabel="Learn more" onActionPress={() => setOpened((n) => n + 1)}>
          Hold and drag to reorder
        </Hint>
      </Spec>
      <Text className="text-muted-foreground text-xs">{`Learn more tapped ${opened}×`}</Text>
    </PreviewStack>
  );
}

function Dismiss() {
  const [full, setFull] = React.useState(true);
  const [compact, setCompact] = React.useState(true);
  return (
    <PreviewStack>
      <Spec label="◆ Dismiss (tap X) · Size=Full">
        <View className="min-h-9 justify-center">
          {full ? (
            <Hint onDismiss={() => setFull(false)}>Hold and drag to reorder</Hint>
          ) : (
            <Text className="text-muted-foreground text-center text-xs">Hint dismissed</Text>
          )}
        </View>
      </Spec>
      <Spec label="◆ Dismiss (tap X) · Size=Compact · Tone=Neutral">
        <View className="min-h-9 justify-center">
          {compact ? (
            <Hint size="compact" tone="neutral" onDismiss={() => setCompact(false)}>
              Tap to place signature
            </Hint>
          ) : (
            <Text className="text-muted-foreground text-center text-xs">Hint dismissed</Text>
          )}
        </View>
      </Spec>
      <Button
        variant="outline"
        disabled={full && compact}
        onPress={() => {
          setFull(true);
          setCompact(true);
        }}>
        <Text>Show again</Text>
      </Button>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Tone=Info', component: InfoTone },
  { name: 'Tone=Neutral', component: NeutralTone },
  { name: 'Size=Compact', component: Compact },
  { name: '◆ With action', component: WithAction },
  { name: '◆ Dismiss (tap X)', component: Dismiss },
];
