/**
 * ◆ Showcase demo — the Figma "◆ Showcase demo" screens rebuilt from the In-app components, interactive:
 * Home (workspace switcher, filters, list/grid), Tools, Search, Viewer → Mark up → select text → Quick Menu →
 * Annotation Sheet → Color Picker.
 */
import { AnnotationDrawer } from '@showcase/examples/annotation-sheet';
import { DEFAULT_VIEWER } from '@showcase/examples/banner';
import { DEMO_DOCS, DEMO_FILTERS, DEMO_TOOLS, FakePdfPage } from '@showcase/examples/in-app-shared';
import { DemoNavBar } from '@showcase/examples/nav-bar';
import { DemoToolbar } from '@showcase/examples/toolbar';
import { Avatar, AvatarFallback } from '@/registry/nativewind/components/ui/avatar';
import {
  AppBar,
  AppBarButton,
  AppBarGroup,
  AppBarSearchField,
  AppBarTitle,
  AppBarWorkspace,
} from '@/registry/nativewind/components/ui/app-bar';
import { Banner } from '@/registry/nativewind/components/ui/banner';
import { Button } from '@/registry/nativewind/components/ui/button';
import { DocumentItem } from '@/registry/nativewind/components/ui/document-item';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/registry/nativewind/components/ui/drawer';
import { FilterChips } from '@/registry/nativewind/components/ui/filter-chip';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { PageIndicator } from '@/registry/nativewind/components/ui/page-indicator';
import { QuickMenu } from '@/registry/nativewind/components/ui/quick-menu';
import { SectionHeader } from '@/registry/nativewind/components/ui/section-header';
import { Text } from '@/registry/nativewind/components/ui/text';
import { TextSelection } from '@/registry/nativewind/components/ui/text-selection';
import { ToolTile } from '@/registry/nativewind/components/ui/tool-tile';
import { WorkspaceItem } from '@/registry/nativewind/components/ui/workspace-item';
import type { Preview } from '@showcase/components/component-page';
import {
  ArrowLeftIcon,
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  DotsThreeIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  SparkleIcon,
  SpeakerHighIcon,
  UserPlusIcon,
} from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

/**
 * The demo screen, edge to edge (previews are `fullBleed`): its App Bar sits right under the page
 * header, no card-in-a-phone. The carousel reserves the variant bar's height below it.
 */
function Screen({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <View
      className={
        'border-border w-full max-w-[640px] flex-1 self-center overflow-hidden border-b ' +
        (muted ? 'bg-muted' : 'bg-background')
      }>
      {children}
    </View>
  );
}

const WORKSPACES = [
  { name: 'Lumin PDF', plan: 'Free', trailing: 'more' as const },
  { name: 'Design team', plan: 'Free', trailing: 'more' as const },
  { name: 'Marketing', trailing: 'join' as const },
  { name: 'Partner workspace', trailing: 'accept-invite' as const },
];

function Home() {
  const [filter, setFilter] = React.useState<(typeof DEMO_FILTERS)[number]['value']>('recent');
  const [view, setView] = React.useState<'list' | 'grid'>('list');
  const [banner, setBanner] = React.useState(true);
  const [switcher, setSwitcher] = React.useState(false);
  const [workspace, setWorkspace] = React.useState('Lumin workspace');
  const docs = filter === 'starred' ? DEMO_DOCS.filter((d) => d.starred) : DEMO_DOCS;

  return (
    <Screen>
      <ScrollView contentContainerClassName="pb-28 pt-16" showsVerticalScrollIndicator={false}>
        {banner ? (
          <View className="px-4 pb-4">
            <Banner
              {...DEFAULT_VIEWER}
              actionLabel="Set as default"
              onDismiss={() => setBanner(false)}
            />
          </View>
        ) : null}
        <SectionHeader title="Tools" actionLabel="View all" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-4 pb-4 pt-1">
          {DEMO_TOOLS.slice(0, 6).map((t) => (
            <ToolTile key={t.title} title={t.title} icon={t.icon} color={t.color} size="compact" />
          ))}
        </ScrollView>
        <SectionHeader title="Documents" actionLabel="View all" />
        <FilterChips
          options={DEMO_FILTERS}
          value={filter}
          onValueChange={setFilter}
          view={view}
          onViewChange={setView}
        />
        {view === 'list' ? (
          docs.map((d, i) => (
            <DocumentItem key={d.title} {...d} last={i === docs.length - 1} onPress={() => {}} />
          ))
        ) : (
          <View className="flex-row flex-wrap gap-x-3 gap-y-4 px-4 pt-2">
            {docs.map((d) => (
              <View key={d.title} className="w-[47%]">
                <DocumentItem {...d} layout="grid" onPress={() => {}} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <View className="absolute left-0 right-0 top-0">
        <AppBar>
          <AppBarWorkspace name={workspace} onPress={() => setSwitcher(true)} />
          <HomeBarActions />
        </AppBar>
      </View>
      <View className="absolute bottom-0 left-0 right-0">
        <DemoNavBar active="home" />
      </View>
      <Drawer open={switcher} onOpenChange={setSwitcher}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Workspaces</DrawerTitle>
            <DrawerDescription>Switch, join or invite people</DrawerDescription>
          </DrawerHeader>
          <View className="gap-2 px-4">
            {WORKSPACES.map((w) => (
              <WorkspaceItem
                key={w.name}
                name={w.name}
                plan={w.plan}
                trailing={w.trailing}
                onPress={
                  w.trailing === 'more'
                    ? () => {
                        setWorkspace(w.name);
                        setSwitcher(false);
                      }
                    : undefined
                }
              />
            ))}
          </View>
          <DrawerFooter>
            <Button variant="outline">
              <Icon as={UserPlusIcon} className="text-foreground size-4" />
              <Text>Invite members</Text>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Screen>
  );
}

/** Right side of Type=Home: search + account. */
function HomeBarActions() {
  return (
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
  );
}

function Tools() {
  return (
    <Screen>
      <ScrollView
        contentContainerClassName="gap-3 px-4 pb-28 pt-16"
        showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap gap-3">
          {DEMO_TOOLS.map((t) => (
            <ToolTile
              key={t.title}
              title={t.title}
              description={t.description}
              icon={t.icon}
              color={t.color}
              className="flex-1 basis-[45%]"
            />
          ))}
        </View>
      </ScrollView>
      <View className="absolute left-0 right-0 top-0">
        <AppBar>
          <AppBarGroup>
            <AppBarButton icon={ArrowLeftIcon} accessibilityLabel="Back" />
          </AppBarGroup>
          <AppBarTitle>Tools</AppBarTitle>
          <AppBarGroup>
            <AppBarButton icon={DotsThreeIcon} accessibilityLabel="More" />
          </AppBarGroup>
        </AppBar>
      </View>
      <View className="absolute bottom-0 left-0 right-0">
        <DemoNavBar active="tools" />
      </View>
    </Screen>
  );
}

function Search() {
  const [q, setQ] = React.useState('Q');
  const results = DEMO_DOCS.filter((d) => d.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen>
      <View className="pt-16">
        <SectionHeader title={q ? 'Results' : 'Recent'} />
        {results.map((d, i) => (
          <DocumentItem key={d.title} {...d} last={i === results.length - 1} />
        ))}
        {results.length === 0 ? (
          <Text className="text-muted-foreground px-4 py-6 text-center text-sm">
            No documents match "{q}"
          </Text>
        ) : null}
      </View>
      <View className="absolute left-0 right-0 top-0">
        <AppBar>
          <AppBarGroup>
            <AppBarButton icon={ArrowLeftIcon} accessibilityLabel="Back" />
          </AppBarGroup>
          <AppBarSearchField value={q} onChangeText={setQ} />
        </AppBar>
      </View>
    </Screen>
  );
}

function Viewer() {
  const [editing, setEditing] = React.useState(false);
  const [selected, setSelected] = React.useState(false);
  const [highlighted, setHighlighted] = React.useState(false);
  const [sheet, setSheet] = React.useState(false);
  const [color, setColor] = React.useState<string | null>('#fee08b');
  const [opacity, setOpacity] = React.useState(40);

  return (
    <Screen muted>
      <ScrollView contentContainerClassName="px-4 pb-28 pt-16" showsVerticalScrollIndicator={false}>
        <PageIndicator page={1} total={20} className="mb-2" />
        <Pressable
          onPress={() => {
            if (!editing) return;
            setSelected((s) => !s);
            setHighlighted(true);
          }}
          accessibilityRole="button"
          accessibilityLabel={editing ? 'Select text' : 'PDF page'}>
          <FakePdfPage>
            {highlighted && color ? (
              <View
                pointerEvents="none"
                className="absolute"
                style={{
                  left: 20,
                  top: 18,
                  width: 268,
                  height: 32,
                  backgroundColor: color,
                  opacity: opacity / 100,
                }}
              />
            ) : null}
            {selected ? (
              <TextSelection
                rects={[
                  { x: 20, y: 18, width: 268, height: 14 },
                  { x: 20, y: 36, width: 126, height: 14 },
                ]}
              />
            ) : null}
          </FakePdfPage>
        </Pressable>
        {selected ? (
          <View className="absolute left-8 top-[150px]">
            <QuickMenu
              color={color ?? undefined}
              onColorPress={() => setSheet(true)}
              onDeletePress={() => {
                setHighlighted(false);
                setSelected(false);
              }}
            />
          </View>
        ) : null}
        {editing && !selected ? (
          <Text className="text-muted-foreground pt-3 text-center text-xs">
            Tap the page to select text
          </Text>
        ) : null}
      </ScrollView>
      <View className="absolute left-0 right-0 top-0">
        {editing ? (
          <AppBar>
            <AppBarGroup>
              <AppBarButton
                icon={ArrowLeftIcon}
                accessibilityLabel="Done editing"
                onPress={() => {
                  setEditing(false);
                  setSelected(false);
                }}
              />
            </AppBarGroup>
            <AppBarGroup>
              <AppBarButton
                icon={ArrowUUpLeftIcon}
                accessibilityLabel="Undo"
                disabled={!highlighted}
              />
              <AppBarButton icon={ArrowUUpRightIcon} accessibilityLabel="Redo" disabled />
            </AppBarGroup>
          </AppBar>
        ) : (
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
        )}
      </View>
      <View className="absolute bottom-0 left-0 right-0">
        <DemoToolbar
          key={editing ? 'tools' : 'groups'}
          initialMode={editing ? 'tools' : 'groups'}
          onModeChange={(m) => {
            setEditing(m === 'tools');
            if (m === 'groups') setSelected(false);
          }}
          onOpenStyle={() => setSheet(true)}
          color={color ?? undefined}
        />
      </View>
      <AnnotationDrawer
        open={sheet}
        onOpenChange={setSheet}
        color={color}
        onColorChange={setColor}
        opacity={opacity}
        onOpacityChange={setOpacity}
      />
    </Screen>
  );
}

export const previews: Preview[] = [
  { name: 'Viewer → Mark up → Text highlight', component: Viewer, fullBleed: true },
  { name: 'Home', component: Home, fullBleed: true },
  { name: 'Tools', component: Tools, fullBleed: true },
  { name: 'Search', component: Search, fullBleed: true },
];
