import { SectionHeader } from '@/registry/nativewind/components/ui/section-header';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { BuildingsIcon } from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

function Variants() {
  return (
    <PreviewStack>
      <Spec label="◆ Show action=true">
        <View className="-mx-4">
          <SectionHeader title="Documents" actionLabel="View all" onActionPress={() => {}} />
        </View>
      </Spec>
      <Spec label="◆ Show icon=true · Show action=false">
        <View className="-mx-4">
          <SectionHeader title="Workspaces" icon={BuildingsIcon} />
        </View>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Variants', component: Variants }];
