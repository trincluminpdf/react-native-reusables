import { Button } from '@/registry/nativewind/components/ui/button';
import { CircularProgress } from '@/registry/nativewind/components/ui/circular-progress';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

const PERCENTS = [0, 25, 50, 75, 100];

function Sizes() {
  return (
    <PreviewStack>
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <Spec key={size} label={`◆ Size=${size} · Percent=0 / 25 / 50 / 75 / 100%`} row>
          {PERCENTS.map((p) => (
            <CircularProgress key={p} value={p} size={size} accessibilityLabel={`${p}%`} />
          ))}
        </Spec>
      ))}
      <Spec label="◆ Size=lg · Show label=false" row>
        <CircularProgress value={60} size="lg" showLabel={false} />
      </Spec>
    </PreviewStack>
  );
}

function Upload() {
  const [value, setValue] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setValue((v) => {
        const next = Math.min(100, v + 7);
        if (next === 100) setRunning(false);
        return next;
      });
    }, 300);
    return () => clearInterval(t);
  }, [running]);
  return (
    <PreviewStack>
      <Spec label="Animated · upload stand-in">
        <View className="border-border flex-row items-center gap-3 rounded-xl border p-3">
          <CircularProgress value={value} size="sm" accessibilityLabel="Uploading Contract.pdf" />
          <View className="flex-1">
            <Text className="text-foreground text-sm font-medium">Contract.pdf</Text>
            <Text className="text-muted-foreground text-xs">
              {value === 100 ? 'Uploaded' : `Uploading · ${value}%`}
            </Text>
          </View>
        </View>
        <View className="items-center py-2">
          <CircularProgress value={value} size="lg" accessibilityLabel="Upload progress" />
        </View>
        <Button
          variant="outline"
          onPress={() => {
            setValue(0);
            setRunning(true);
          }}>
          <Text>{running ? 'Uploading…' : 'Start upload'}</Text>
        </Button>
      </Spec>
      <Spec label="Tint: indicatorClassName=text-destructive (failed)" row>
        <CircularProgress value={40} indicatorClassName="text-destructive" />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Size · Percent', component: Sizes },
  { name: 'Animated', component: Upload },
];
