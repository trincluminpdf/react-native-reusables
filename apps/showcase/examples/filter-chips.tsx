import { FilterChip, FilterChips } from '@/registry/nativewind/components/ui/filter-chip';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { DEMO_FILTERS } from '@showcase/examples/in-app-shared';
import * as React from 'react';
import { View } from 'react-native';

function Row() {
  const [value, setValue] = React.useState<(typeof DEMO_FILTERS)[number]['value']>('recent');
  const [view, setView] = React.useState<'list' | 'grid'>('list');
  return (
    <PreviewStack>
      <Spec label="◆ Filter Chips · Show view toggle=true">
        <View className="-mx-4">
          <FilterChips
            options={DEMO_FILTERS}
            value={value}
            onValueChange={setValue}
            view={view}
            onViewChange={setView}
          />
        </View>
      </Spec>
      <Spec label="◆ Filter Chips · Show view toggle=false">
        <View className="-mx-4">
          <FilterChips options={DEMO_FILTERS} value={value} onValueChange={setValue} />
        </View>
      </Spec>
    </PreviewStack>
  );
}

function States() {
  return (
    <PreviewStack>
      <Spec label="◆ Filter Chip · Active=Off / On" row>
        <FilterChip label="Recent" />
        <FilterChip label="Recent" active />
      </Spec>
      <Spec label="◆ Filter Chip · State=Disabled (Off / On)" row>
        <FilterChip label="Offline" disabled />
        <FilterChip label="Offline" active disabled />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Filter Chips', component: Row },
  { name: 'Filter Chip', component: States },
];
