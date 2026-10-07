import { Fab, FabMenu, FabMenuItem } from '@/registry/nativewind/components/ui/fab';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { FilePlusIcon, LinkIcon, ScanIcon, UploadSimpleIcon } from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

function Variants() {
  return (
    <PreviewStack>
      <Spec label="◆ Type=Icon · Variant=Default / Secondary / Glass" row>
        <Fab icon={UploadSimpleIcon} accessibilityLabel="Upload" />
        <Fab icon={UploadSimpleIcon} variant="secondary" accessibilityLabel="Upload" />
        <Fab icon={UploadSimpleIcon} variant="glass" accessibilityLabel="Upload" />
      </Spec>
      <Spec label="◆ Size=Medium (80, icon 28)" row>
        <Fab icon={UploadSimpleIcon} size="medium" accessibilityLabel="Upload" />
        <Fab
          icon={UploadSimpleIcon}
          size="medium"
          variant="secondary"
          accessibilityLabel="Upload"
        />
      </Spec>
      <Spec label="◆ Type=Extended · Variant=Default / Secondary / Glass">
        <View className="items-start gap-3">
          <Fab icon={UploadSimpleIcon} label="Upload" />
          <Fab icon={UploadSimpleIcon} label="Upload" variant="secondary" />
          <Fab icon={UploadSimpleIcon} label="Upload" variant="glass" />
        </View>
      </Spec>
      <Text className="text-muted-foreground text-xs leading-5">
        Press and hold to see State=Pressed (primary/90 · secondary/80 · glass 70%).
      </Text>
    </PreviewStack>
  );
}

const MENU = [
  { label: 'Scan document', icon: ScanIcon },
  { label: 'Upload file', icon: UploadSimpleIcon },
  { label: 'Blank PDF', icon: FilePlusIcon },
  { label: 'From link', icon: LinkIcon },
] as const;

function Menu() {
  const [last, setLast] = React.useState<string | null>(null);
  return (
    <PreviewStack>
      <Spec label="◆ FAB Menu · Open=Off → tap the FAB">
        <View className="border-border bg-muted/40 h-[420px] overflow-hidden rounded-xl border">
          <View className="p-4">
            <Text className="text-muted-foreground text-sm">
              {last ? `Picked: ${last}` : 'Screen content…'}
            </Text>
          </View>
          <View className="absolute bottom-4 right-4">
            <FabMenu
              accessibilityLabel="Create"
              items={MENU.map((m) => ({ ...m, onPress: () => setLast(m.label) }))}
            />
          </View>
        </View>
      </Spec>
      <Spec label="◆ FAB Menu / Item · State=Default">
        <View className="items-end">
          <FabMenuItem label="Upload file" icon={UploadSimpleIcon} />
        </View>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'FAB', component: Variants },
  { name: 'FAB Menu', component: Menu },
];
