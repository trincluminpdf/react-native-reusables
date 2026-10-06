import { Progress } from '@/registry/nativewind/components/ui/progress';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

function Example() {
  const [value, setValue] = React.useState(13);
  React.useEffect(() => {
    const t = setTimeout(() => setValue(66), 600);
    return () => clearTimeout(t);
  }, []);
  return (
    <PreviewStack>
      {[0, 25, 50, 75, 100].map((v) => (
        <Spec key={v} label={`${v}% · h-2 rounded-full`}>
          <Progress value={v} />
        </Spec>
      ))}
      <Spec label="Animated">
        <Progress value={value} />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Value', component: Example }];
