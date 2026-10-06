import { Skeleton } from '@/registry/nativewind/components/ui/skeleton';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

function Examples() {
  return (
    <PreviewStack>
      <Spec label="Text · avatar w-10 + lines h-4 gap-2">
        <View className="w-full flex-row items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </View>
        </View>
      </Spec>
      <Spec label="Card · gap-6">
        <Skeleton className="h-32 w-full rounded-md" />
        <View className="w-full gap-2">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
        </View>
      </Spec>
      <Spec label="Form · gap-3, field h-8">
        <View className="w-full gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-full" />
        </View>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Text · Card · Form', component: Examples }];
