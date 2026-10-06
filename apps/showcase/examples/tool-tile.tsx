import {
  TOOL_TILE_COLORS,
  ToolTile,
  type ToolTileColor,
} from '@/registry/nativewind/components/ui/tool-tile';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { DEMO_TOOLS } from '@showcase/examples/in-app-shared';
import { ArrowSquareInIcon } from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

function Card() {
  return (
    <PreviewStack>
      <Spec label="◆ Size=Card · Tools tab grid (2 columns)">
        <View className="flex-row flex-wrap gap-3">
          {DEMO_TOOLS.map((t) => (
            <ToolTile
              key={t.title}
              title={t.title}
              description={t.description}
              icon={t.icon}
              color={t.color}
              className="min-w-[140px] flex-1 basis-[45%]"
            />
          ))}
        </View>
      </Spec>
    </PreviewStack>
  );
}

function Compact() {
  return (
    <PreviewStack>
      <Spec label="◆ Size=Compact · Home Tools row" row>
        {DEMO_TOOLS.slice(0, 6).map((t) => (
          <ToolTile key={t.title} title={t.title} icon={t.icon} color={t.color} size="compact" />
        ))}
      </Spec>
    </PreviewStack>
  );
}

function Colors() {
  return (
    <PreviewStack>
      <Spec label="◆ Color=red … rose (3. Mode › components/card-*)" row>
        {(Object.keys(TOOL_TILE_COLORS) as ToolTileColor[]).map((c) => (
          <ToolTile key={c} title={c} icon={ArrowSquareInIcon} color={c} size="compact" />
        ))}
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Size=Card', component: Card },
  { name: 'Size=Compact', component: Compact },
  { name: 'Color', component: Colors },
];
