import { Avatar, AvatarFallback } from '@/registry/nativewind/components/ui/avatar';
import {
  AppBar,
  AppBarButton,
  AppBarCentered,
  AppBarFileTitle,
  AppBarGroup,
  AppBarSearchField,
  AppBarTextButton,
  AppBarWorkspace,
} from '@/registry/nativewind/components/ui/app-bar';
import { LuminLogo } from '@/registry/nativewind/components/ui/lumin-logo';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { usePreviewPlatform } from '@showcase/lib/preview-platform';
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
  XIcon,
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
      <Spec label="◆ Type=Title · title centred on the bar">
        <Backdrop>
          <AppBarCentered
            title="Settings"
            leading={
              <AppBarGroup>
                <AppBarButton icon={ArrowLeftIcon} accessibilityLabel="Back" />
              </AppBarGroup>
            }
            trailing={
              <AppBarGroup>
                <AppBarButton icon={DotsThreeIcon} accessibilityLabel="More" />
              </AppBarGroup>
            }
          />
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
      <Spec label="◆ Type=Viewer · file title on Tablet only (window ≥ 640)">
        <Backdrop>
          <AppBar>
            <AppBarGroup>
              <AppBarButton icon={HouseIcon} accessibilityLabel="Home" />
            </AppBarGroup>
            <AppBarFileTitle>Lease agreement.pdf</AppBarFileTitle>
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

/** ✏️ LPM batch: Leading / Trailing action = Text (Type=Title). */
function TextActions() {
  return (
    <PreviewStack>
      <Spec label="◆ Trailing action=Text · select mode (X · 2 selected · Select all)">
        <Backdrop>
          <AppBarCentered
            title="2 selected"
            leading={
              <AppBarGroup>
                <AppBarButton icon={XIcon} accessibilityLabel="Exit select mode" />
              </AppBarGroup>
            }
            trailing={<AppBarTextButton label="Select all" />}
          />
        </Backdrop>
      </Spec>
      <Spec label="◆ Leading action=Text · Trailing action=Text · task flow (Prepare form)">
        <Backdrop>
          <AppBarCentered
            title="Prepare form"
            leading={<AppBarTextButton label="Cancel" />}
            trailing={<AppBarTextButton label="Apply" />}
          />
        </Backdrop>
      </Spec>
      <Spec label="◆ Leading action=Text · Trailing action=Icon · long title truncates">
        <Backdrop>
          <AppBarCentered
            title="Q3 Vendor Agreement — signed copy final v2.pdf"
            leading={<AppBarTextButton label="Cancel" />}
            trailing={
              <AppBarGroup>
                <AppBarButton icon={DotsThreeIcon} accessibilityLabel="More" />
              </AppBarGroup>
            }
          />
        </Backdrop>
      </Spec>
    </PreviewStack>
  );
}

/** Busy content under the bar so the glass material is visible (blur on iOS, none on Android). */
function ContentUnder({ children }: { children: React.ReactNode }) {
  return (
    <View className="-mx-4 overflow-hidden">
      <View className="gap-2 bg-white px-4 pb-3 pt-2" aria-hidden>
        <View className="h-8 flex-row gap-2">
          <View className="w-20 rounded-sm bg-yellow-300" />
          <View className="flex-1 rounded-sm bg-blue-500" />
          <View className="w-14 rounded-sm bg-rose-400" />
        </View>
        <View className="h-8 flex-row gap-2">
          <View className="w-8 rounded-full bg-emerald-400" />
          <View className="flex-1 rounded-sm bg-neutral-800" />
          <View className="w-24 rounded-sm bg-yellow-300" />
        </View>
        <Text className="pt-1 text-sm text-neutral-700">
          Revenue grew in every region. Sign the summary page before Friday.
        </Text>
      </View>
      <View className="absolute left-0 right-0 top-[10px]">{children}</View>
    </View>
  );
}

function GlassOverContent() {
  const os = usePreviewPlatform();
  return (
    <PreviewStack>
      <Spec label="◆ Type=Viewer · over content">
        <ContentUnder>
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
        </ContentUnder>
      </Spec>
      <Spec label="◆ Type=Editor · over content">
        <ContentUnder>
          <AppBar>
            <AppBarGroup>
              <AppBarButton icon={ArrowLeftIcon} accessibilityLabel="Done editing" />
            </AppBarGroup>
            <AppBarGroup>
              <AppBarButton icon={ArrowUUpLeftIcon} accessibilityLabel="Undo" />
              <AppBarButton icon={ArrowUUpRightIcon} accessibilityLabel="Redo" disabled />
            </AppBarGroup>
          </AppBar>
        </ContentUnder>
      </Spec>
      <Text className="text-muted-foreground text-xs leading-5">
        {os === 'ios'
          ? 'iOS 26+: native Liquid Glass (expo-glass-effect GlassView); iOS < 26: expo-blur. The web replica is CSS blur + saturation with a bright rim — no lensing.'
          : 'Android: no reliable backdrop blur → translucent bg-background/90 + border + shadow. The web preview draws exactly that.'}
      </Text>
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
  { name: 'Leading / Trailing action=Text', component: TextActions },
  { name: 'Glass · over content', component: GlassOverContent },
  { name: 'Lumin Logo', component: Logo },
];

export { HomeBar };
