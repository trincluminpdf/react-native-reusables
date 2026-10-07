import { Tabs, TabsList, TabsTrigger } from '@/registry/nativewind/components/ui/tabs';
import { Text } from '@/registry/nativewind/components/ui/text';
import { PLATFORM_LABEL, type PreviewOS } from '@showcase/lib/preview-platform';
import * as React from 'react';

const OPTIONS: PreviewOS[] = ['ios', 'android'];

/**
 * "iOS | Android" segmented switch (the DS Tabs, default variant). Web preview only: picks which
 * OS the native parts are drawn as (◆ Date Picker system picker, liquid glass, desktop phone frame).
 */
function PlatformSwitch({
  value,
  onChange,
  className,
}: {
  value: PreviewOS;
  onChange: (os: PreviewOS) => void;
  className?: string;
}) {
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as PreviewOS)}>
      <TabsList className={className} aria-label="Preview platform">
        {OPTIONS.map((os) => (
          <TabsTrigger
            key={os}
            value={os}
            className="px-3"
            aria-label={`Show as ${PLATFORM_LABEL[os]}`}>
            <Text>{PLATFORM_LABEL[os]}</Text>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export { PlatformSwitch };
