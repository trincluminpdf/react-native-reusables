import { Fab } from '@/registry/nativewind/components/ui/fab';
import {
  NavigationRail,
  NavigationRailItem,
} from '@/registry/nativewind/components/ui/navigation-rail';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import {
  FileTextIcon,
  HouseIcon,
  LayoutIcon,
  UploadSimpleIcon,
  WrenchIcon,
} from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

const TABS = [
  { key: 'home', label: 'Home', icon: HouseIcon },
  { key: 'documents', label: 'Documents', icon: FileTextIcon },
  { key: 'tools', label: 'Tools', icon: WrenchIcon },
  { key: 'templates', label: 'Templates', icon: LayoutIcon },
] as const;

type TabKey = (typeof TABS)[number]['key'];

function Rail({ showFab = true }: { showFab?: boolean }) {
  const [active, setActive] = React.useState<TabKey>('home');
  const current = TABS.find((t) => t.key === active)!;
  return (
    <View className="border-border h-[440px] flex-row overflow-hidden rounded-xl border">
      <NavigationRail
        fab={
          showFab ? (
            <Fab
              icon={UploadSimpleIcon}
              variant="secondary"
              accessibilityLabel="Upload"
              className="shadow-none"
              style={{ elevation: 0 }}
            />
          ) : undefined
        }>
        {TABS.map((t) => (
          <NavigationRailItem
            key={t.key}
            label={t.label}
            icon={t.icon}
            active={active === t.key}
            onPress={() => setActive(t.key)}
          />
        ))}
      </NavigationRail>
      <View className="bg-muted/30 flex-1 p-4">
        <Text className="text-foreground text-lg font-semibold">{current.label}</Text>
        <Text className="text-muted-foreground mt-1 text-sm">
          Tablet content area (inset = 80 + safe-area left).
        </Text>
      </View>
    </View>
  );
}

function Default() {
  return (
    <PreviewStack>
      <Spec label="◆ Navigation Rail · Show FAB=true (tap the items)">
        <Rail />
      </Spec>
      <Text className="text-muted-foreground text-xs leading-5">
        (recommendation) Tablet landscape / windows ≥ 840 use the rail; phones and Tablet portrait
        keep the bottom ◆ Nav Bar.
      </Text>
    </PreviewStack>
  );
}

function Items() {
  return (
    <PreviewStack>
      <Spec label="◆ Navigation Rail / Item · Active=Off / On" row>
        <NavigationRailItem label="Home" icon={HouseIcon} />
        <NavigationRailItem label="Home" icon={HouseIcon} active />
      </Spec>
      <Spec label="◆ Navigation Rail · Show FAB=false">
        <Rail showFab={false} />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Navigation Rail', component: Default },
  { name: 'Item · Show FAB', component: Items },
];
