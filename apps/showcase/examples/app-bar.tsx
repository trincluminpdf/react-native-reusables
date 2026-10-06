import { Avatar, AvatarFallback } from '@/registry/nativewind/components/ui/avatar';
import {
  AppBar,
  AppBarButton,
  AppBarGroup,
  AppBarSearchField,
  AppBarTitle,
  AppBarWorkspace,
} from '@/registry/nativewind/components/ui/app-bar';
import { LuminLogo } from '@/registry/nativewind/components/ui/lumin-logo';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import {
  ArrowLeftIcon,
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  DotsThreeIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  SparkleIcon,
  SpeakerHighIcon,
} from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

/** App bars float over content — show them on a muted backdrop like the app. */
function Backdrop({ children }: { children: React.ReactNode }) {
  return <View className="bg-muted/60 -mx-4 py-1">{children}</View>;
}

function HomeBar() {
  return (
    <AppBar>
      <AppBarWorkspace name="Lumin workspace" />
      <AppBarGroup>
        <AppBarButton icon={MagnifyingGlassIcon} accessibilityLabel="Search" />
        <View className="size-10 items-center justify-center">
          <Avatar alt="Account" size="sm">
            <AvatarFallback>
              <Text>AB</Text>
            </AvatarFallback>
          </Avatar>
        </View>
      </AppBarGroup>
    </AppBar>
  );
}

function Types() {
  const [q, setQ] = React.useState('Q2');
  return (
    <PreviewStack>
      <Spec label="◆ Type=Home">
        <Backdrop>
          <HomeBar />
        </Backdrop>
      </Spec>
      <Spec label="◆ Type=Title">
        <Backdrop>
          <AppBar>
            <AppBarGroup>
              <AppBarButton icon={ArrowLeftIcon} accessibilityLabel="Back" />
            </AppBarGroup>
            <AppBarTitle>Settings</AppBarTitle>
            <AppBarGroup>
              <AppBarButton icon={DotsThreeIcon} accessibilityLabel="More" />
            </AppBarGroup>
          </AppBar>
        </Backdrop>
      </Spec>
      <Spec label="◆ Type=Search">
        <Backdrop>
          <AppBar>
            <AppBarGroup>
              <AppBarButton icon={ArrowLeftIcon} accessibilityLabel="Back" />
            </AppBarGroup>
            <AppBarSearchField value={q} onChangeText={setQ} />
            <AppBarGroup>
              <AppBarButton icon={DotsThreeIcon} accessibilityLabel="More" />
            </AppBarGroup>
          </AppBar>
        </Backdrop>
      </Spec>
      <Spec label="◆ Type=Viewer">
        <Backdrop>
          <AppBar>
            <AppBarGroup>
              <AppBarButton icon={HouseIcon} accessibilityLabel="Home" />
            </AppBarGroup>
            <AppBarGroup>
              <AppBarButton icon={MagnifyingGlassIcon} accessibilityLabel="Search in document" />
              <AppBarButton icon={SparkleIcon} accessibilityLabel="Lumin AI" />
              <AppBarButton icon={SpeakerHighIcon} accessibilityLabel="Read aloud" />
              <AppBarButton icon={DotsThreeIcon} accessibilityLabel="More" />
            </AppBarGroup>
          </AppBar>
        </Backdrop>
      </Spec>
      <Spec label="◆ Type=Editor · Undo enabled, Redo disabled">
        <Backdrop>
          <AppBar>
            <AppBarGroup>
              <AppBarButton icon={ArrowLeftIcon} accessibilityLabel="Done editing" />
            </AppBarGroup>
            <AppBarGroup>
              <AppBarButton icon={ArrowUUpLeftIcon} accessibilityLabel="Undo" />
              <AppBarButton icon={ArrowUUpRightIcon} accessibilityLabel="Redo" disabled />
            </AppBarGroup>
          </AppBar>
        </Backdrop>
      </Spec>
    </PreviewStack>
  );
}

function Logo() {
  return (
    <PreviewStack>
      <Spec label="◆ Lumin Logo · Type=Mark (logo/fg = text-foreground)" row>
        <LuminLogo type="mark" height={24} />
        <LuminLogo type="mark" height={32} />
      </Spec>
      <Spec label="◆ Lumin Logo · Type=Lockup" row>
        <LuminLogo type="lockup" height={24} />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Type', component: Types },
  { name: 'Lumin Logo', component: Logo },
];

export { HomeBar };
