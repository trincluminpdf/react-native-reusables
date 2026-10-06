import {
  NavBar,
  NavBarFab,
  NavBarItem,
  NavBarTabs,
} from '@/registry/nativewind/components/ui/nav-bar';
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

function DemoNavBar({ active, onChange }: { active: TabKey; onChange?: (k: TabKey) => void }) {
  return (
    <NavBar>
      <NavBarTabs>
        {TABS.map((t) => (
          <NavBarItem
            key={t.key}
            label={t.label}
            icon={t.icon}
            active={active === t.key}
            onPress={() => onChange?.(t.key)}
          />
        ))}
      </NavBarTabs>
      <NavBarFab icon={UploadSimpleIcon} accessibilityLabel="Upload" />
    </NavBar>
  );
}

function Active() {
  const [active, setActive] = React.useState<TabKey>('home');
  return (
    <PreviewStack>
      <Spec label="◆ Nav Bar · tap a tab (Active=Home / Documents / Tools / Templates)">
        <View className="bg-muted/60 -mx-4 pt-2">
          <DemoNavBar active={active} onChange={setActive} />
        </View>
      </Spec>
      <Spec label="◆ Nav Bar / Item · Active=Off / On" row>
        <NavBarItem label="Home" icon={HouseIcon} className="flex-none" />
        <NavBarItem label="Home" icon={HouseIcon} active className="flex-none" />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Active', component: Active }];

export { DemoNavBar };
