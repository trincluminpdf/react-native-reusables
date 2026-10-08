/**
 * 🆕 ◆ Showcase flows — the Figma page "🆕 Showcase flows" (271:6) rebuilt from the components, interactive.
 * Five phone flows from the document list into the viewer and its tools (LPM source batch):
 *   F1 Open & mark up · F2 Find your way · F3 Comments · F4 Organize pages · F5 Prepare form & sign.
 * Each preview is one flow (edge to edge, like ◆ Showcase demo). A violet "◆ step" pill under the App Bar is
 * demo chrome only (it tells you what to tap next) — it is not a product component.
 * Device chrome (status bar / home indicator) is drawn by the desktop phone frame or the real phone.
 */
import { AnnotationDrawer } from '@showcase/examples/annotation-sheet';
import { DEFAULT_VIEWER } from '@showcase/examples/banner';
import { DEMO_FILTERS, DEMO_TOOLS } from '@showcase/examples/in-app-shared';
import { DemoNavBar } from '@showcase/examples/nav-bar';
import { ActionSheet } from '@/registry/nativewind/components/ui/action-sheet';
import {
  AnnotationSelection,
  type SelectionRect,
} from '@/registry/nativewind/components/ui/annotation-selection';
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
import { Avatar, AvatarFallback } from '@/registry/nativewind/components/ui/avatar';
import { Banner } from '@/registry/nativewind/components/ui/banner';
import { Button } from '@/registry/nativewind/components/ui/button';
import { CommentItem } from '@/registry/nativewind/components/ui/comment-item';
import { DocumentItem } from '@/registry/nativewind/components/ui/document-item';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/registry/nativewind/components/ui/drawer';
import { FilterChips } from '@/registry/nativewind/components/ui/filter-chip';
import { FormField, TextTPlusIcon } from '@/registry/nativewind/components/ui/form-field';
import { Hint } from '@/registry/nativewind/components/ui/hint';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/registry/nativewind/components/ui/input-group';
import {
  TextAStrikethroughIcon,
  TextAWavyUnderlineIcon,
} from '@/registry/nativewind/components/ui/lumin-icons';
import { OutlineItem } from '@/registry/nativewind/components/ui/outline-item';
import { PageIndicator } from '@/registry/nativewind/components/ui/page-indicator';
import { PageThumbnail } from '@/registry/nativewind/components/ui/page-thumbnail';
import { QuickMenu } from '@/registry/nativewind/components/ui/quick-menu';
import { SectionHeader } from '@/registry/nativewind/components/ui/section-header';
import { Separator } from '@/registry/nativewind/components/ui/separator';
import { SignatureItem } from '@/registry/nativewind/components/ui/signature-item';
import { toast } from '@/registry/nativewind/components/ui/sonner';
import { Text } from '@/registry/nativewind/components/ui/text';
import { TextSelection } from '@/registry/nativewind/components/ui/text-selection';
import {
  ToolItem,
  Toolbar,
  ToolbarAction,
  ToolbarSearch,
  ToolbarTools,
} from '@/registry/nativewind/components/ui/toolbar';
import { ToolTile } from '@/registry/nativewind/components/ui/tool-tile';
import { cn } from '@/registry/nativewind/lib/utils';
import type { Preview } from '@showcase/components/component-page';
import {
  ArrowClockwiseIcon,
  ArrowLeftIcon,
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  BookmarkSimpleIcon,
  ChatCircleDotsIcon,
  ChatTextIcon,
  CheckSquareIcon,
  DotsThreeIcon,
  EraserIcon,
  FilePlusIcon,
  HighlighterCircleIcon,
  HighlighterIcon,
  HouseIcon,
  ImageIcon,
  ListBulletsIcon,
  MagnifyingGlassIcon,
  PaperPlaneRightIcon,
  RadioButtonIcon,
  ScissorsIcon,
  ScribbleLoopIcon,
  SignatureIcon,
  SparkleIcon,
  SpeakerHighIcon,
  SquaresFourIcon,
  TextAUnderlineIcon,
  TextboxIcon,
  TextTIcon,
  TrashIcon,
  XIcon,
} from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

// ─── Shared demo chrome ──────────────────────────────────────────────────────────────────────────

/** Edge-to-edge flow screen (previews are fullBleed), same as ◆ Showcase demo. */
function Screen({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <View
      className={cn(
        'border-border w-full max-w-[640px] flex-1 self-center overflow-hidden border-b',
        muted ? 'bg-muted' : 'bg-background'
      )}>
      {children}
    </View>
  );
}

/** Top overlay: the App Bar + the demo-only step pill. Content scrolls under it (pt-24). */
function Top({
  bar,
  step,
  onRestart,
}: {
  bar: React.ReactNode;
  step: string;
  onRestart?: () => void;
}) {
  return (
    <View className="absolute left-0 right-0 top-0" pointerEvents="box-none">
      {bar}
      <View className="items-center" pointerEvents="box-none">
        <View className="flex-row items-center gap-2 rounded-full bg-violet-500/10 px-3 py-1">
          <Text className="text-[11px] font-medium text-violet-700 dark:text-violet-300">
            ◆ {step}
          </Text>
          {onRestart ? (
            <Text
              onPress={onRestart}
              accessibilityRole="button"
              className="text-[11px] text-violet-700 underline dark:text-violet-300">
              Restart
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function Bottom({ children }: { children: React.ReactNode }) {
  return (
    <View className="absolute bottom-0 left-0 right-0" pointerEvents="box-none">
      {children}
    </View>
  );
}

function Bar({ w, h = 6, dark }: { w: `${number}%`; h?: number; dark?: boolean }) {
  return (
    <View
      style={{ width: w, height: h }}
      className={cn('rounded-sm', dark ? 'bg-neutral-300' : 'bg-neutral-200')}
    />
  );
}

function Lines({ n, last = '60%' }: { n: number; last?: `${number}%` }) {
  return (
    <View className="gap-2">
      {Array.from({ length: n }, (_, i) => (
        <Bar key={i} w={i === n - 1 ? last : '100%'} />
      ))}
    </View>
  );
}

/** White PDF page (stays white in dark mode, like a real page). */
function PdfPage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <View
      className={cn(
        'border-border w-full gap-5 rounded-sm border bg-white p-5 shadow-sm shadow-black/10',
        className
      )}>
      {children}
    </View>
  );
}

function PageHeading() {
  return (
    <View className="gap-2">
      <Bar w="85%" h={10} dark />
      <Bar w="40%" h={10} dark />
    </View>
  );
}

function ViewerBar({
  title,
  onHome,
  onSearch,
}: {
  title: string;
  onHome?: () => void;
  onSearch?: () => void;
}) {
  return (
    <AppBar>
      <AppBarGroup>
        <AppBarButton icon={HouseIcon} accessibilityLabel="Home" onPress={onHome} />
      </AppBarGroup>
      <AppBarFileTitle>{title}</AppBarFileTitle>
      <AppBarGroup>
        <AppBarButton
          icon={MagnifyingGlassIcon}
          accessibilityLabel="Search in document"
          onPress={onSearch}
        />
        <AppBarButton icon={SparkleIcon} accessibilityLabel="Lumin AI" />
        <AppBarButton icon={SpeakerHighIcon} accessibilityLabel="Read aloud" />
        <AppBarButton icon={DotsThreeIcon} accessibilityLabel="More" />
      </AppBarGroup>
    </AppBar>
  );
}

const GROUPS = [
  { key: 'markup', label: 'Mark up', icon: ChatCircleDotsIcon },
  { key: 'draw', label: 'Draw', icon: ScribbleLoopIcon },
  { key: 'sign', label: 'Sign', icon: SignatureIcon },
  { key: 'text', label: 'Text', icon: TextTIcon },
  { key: 'more', label: 'More', icon: SquaresFourIcon },
] as const;
type GroupKey = (typeof GROUPS)[number]['key'];

function GroupsToolbar({ onPress }: { onPress?: (k: GroupKey) => void }) {
  return (
    <Toolbar>
      {GROUPS.map((g) => (
        <ToolItem key={g.key} label={g.label} icon={g.icon} fill onPress={() => onPress?.(g.key)} />
      ))}
    </Toolbar>
  );
}

const MARKUP_TOOLS = [
  { key: 'eraser', label: 'Eraser', icon: EraserIcon, color: undefined },
  { key: 'text-highlight', label: 'Text highlight', icon: HighlighterCircleIcon, color: '#fee08b' },
  { key: 'highlight', label: 'Highlight', icon: HighlighterIcon, color: '#fc8d59' },
  { key: 'underline', label: 'Underline', icon: TextAUnderlineIcon, color: '#4575b4' },
  { key: 'strikethrough', label: 'Strikethrough', icon: TextAStrikethroughIcon, color: '#d73027' },
  { key: 'squiggly', label: 'Squiggly', icon: TextAWavyUnderlineIcon, color: '#5ab4ac' },
] as const;
type ToolKey = (typeof MARKUP_TOOLS)[number]['key'];

const FLOW_DOCS = [
  { title: 'Lease agreement.pdf', owner: 'Alex Morgan', date: 'Oct 6, 2026', starred: true },
  { title: 'Q3 report.pdf', owner: 'Jordan Lee', date: 'Oct 2, 2026' },
  { title: 'NDA – Partner draft.pdf', owner: 'Riley Chen', date: 'Sep 28, 2026', starred: true },
  { title: 'Invoice 1042.pdf', owner: 'Jordan Lee', date: 'Sep 15, 2026' },
  { title: 'Onboarding checklist.pdf', owner: 'Alex Morgan', date: 'Sep 12, 2026' },
];

// ─── F1 · Open & mark up ─────────────────────────────────────────────────────────────────────────

const IMAGE_START: SelectionRect = { x: 0, y: 0, width: 150, height: 104 };

function F1OpenAndMarkUp() {
  const [screen, setScreen] = React.useState<'docs' | 'viewer'>('docs');
  const [markup, setMarkup] = React.useState(false);
  const [tool, setTool] = React.useState<ToolKey>('text-highlight');
  const [selection, setSelection] = React.useState<'none' | 'text' | 'image'>('none');
  const [highlighted, setHighlighted] = React.useState(false);
  const [color, setColor] = React.useState<string | null>('#fee08b');
  const [opacity, setOpacity] = React.useState(40);
  const [sheet, setSheet] = React.useState(false);
  const [image, setImage] = React.useState<SelectionRect>(IMAGE_START);
  const [imageGone, setImageGone] = React.useState(false);
  const [paraW, setParaW] = React.useState(0);
  const [filter, setFilter] = React.useState<(typeof DEMO_FILTERS)[number]['value']>('recent');

  const restart = () => {
    setScreen('docs');
    setMarkup(false);
    setSelection('none');
    setHighlighted(false);
    setImage(IMAGE_START);
    setImageGone(false);
    setColor('#fee08b');
  };
  const changed = highlighted || imageGone || image !== IMAGE_START;
  const undo = () => {
    setSelection('none');
    setHighlighted(false);
    setImageGone(false);
    setImage(IMAGE_START);
  };

  if (screen === 'docs') {
    return (
      <Screen>
        <ScrollView contentContainerClassName="pb-28 pt-24" showsVerticalScrollIndicator={false}>
          <View className="px-4 pb-4">
            <Banner {...DEFAULT_VIEWER} actionLabel="Set as default" />
          </View>
          <SectionHeader title="Tools" actionLabel="View all" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2 px-4 pb-4 pt-1">
            {DEMO_TOOLS.slice(0, 6).map((t) => (
              <ToolTile
                key={t.title}
                title={t.title}
                icon={t.icon}
                color={t.color}
                size="compact"
              />
            ))}
          </ScrollView>
          <SectionHeader title="Documents" actionLabel="View all" />
          <FilterChips options={DEMO_FILTERS} value={filter} onValueChange={setFilter} />
          {FLOW_DOCS.map((d, i) => (
            <DocumentItem
              key={d.title}
              {...d}
              last={i === FLOW_DOCS.length - 1}
              onPress={i === 0 ? () => setScreen('viewer') : undefined}
            />
          ))}
        </ScrollView>
        <Top
          step="1/4 · Tap Lease agreement.pdf"
          bar={
            <AppBar>
              <AppBarWorkspace name="Lumin workspace" />
              <AppBarGroup>
                <AppBarButton icon={MagnifyingGlassIcon} accessibilityLabel="Search" />
                <View className="size-10 items-center justify-center">
                  <Avatar alt="Account" size="sm">
                    <AvatarFallback>
                      <Text>AM</Text>
                    </AvatarFallback>
                  </Avatar>
                </View>
              </AppBarGroup>
            </AppBar>
          }
        />
        <Bottom>
          <DemoNavBar active="home" />
        </Bottom>
      </Screen>
    );
  }

  const active = MARKUP_TOOLS.find((t) => t.key === tool) ?? MARKUP_TOOLS[1];
  const step = !markup
    ? '2/4 · Tap Mark up'
    : selection === 'image'
      ? '4/4 · Drag the frame to move, a handle to resize'
      : highlighted
        ? '4/4 · Now tap the image'
        : '3/4 · Tap the first paragraph, or the image';

  return (
    <Screen muted>
      <ScrollView
        contentContainerClassName="px-4 pb-28 pt-24"
        showsVerticalScrollIndicator={false}
        scrollEnabled={selection !== 'image'}>
        <PageIndicator page={1} total={20} className="mb-2" />
        <PdfPage>
          <PageHeading />
          {/* Paragraph 1 — text highlight target (Quick Menu is a sibling: no button inside a button) */}
          <View style={{ zIndex: 10 }}>
            <Pressable
              disabled={!markup}
              onPress={() => {
                setSelection('text');
                setHighlighted(true);
              }}
              accessibilityRole="button"
              accessibilityLabel={markup ? 'Select text' : 'Paragraph'}
              onLayout={(e) => setParaW(e.nativeEvent.layout.width)}>
              <Lines n={5} />
              {highlighted && color ? (
                <>
                  <View
                    pointerEvents="none"
                    className="absolute left-0"
                    style={{
                      top: -4,
                      width: paraW,
                      height: 14,
                      backgroundColor: color,
                      opacity: opacity / 100,
                    }}
                  />
                  <View
                    pointerEvents="none"
                    className="absolute left-0"
                    style={{
                      top: 10,
                      width: paraW * 0.55,
                      height: 14,
                      backgroundColor: color,
                      opacity: opacity / 100,
                    }}
                  />
                </>
              ) : null}
              {selection === 'text' ? (
                <TextSelection
                  rects={[
                    { x: 0, y: -4, width: paraW, height: 14 },
                    { x: 0, y: 10, width: paraW * 0.55, height: 14 },
                  ]}
                />
              ) : null}
            </Pressable>
            {selection === 'text' ? (
              <View className="absolute left-0" style={{ top: 36 }}>
                <QuickMenu
                  color={color ?? undefined}
                  onColorPress={() => setSheet(true)}
                  onDeletePress={() => {
                    setHighlighted(false);
                    setSelection('none');
                  }}
                />
              </View>
            ) : null}
          </View>
          {/* Image annotation */}
          <View style={{ height: 150, zIndex: 5 }}>
            {!imageGone ? (
              <Pressable
                disabled={!markup || selection === 'image'}
                onPress={() => setSelection('image')}
                accessibilityRole="button"
                accessibilityLabel="Image"
                className="absolute items-center justify-center rounded-sm bg-neutral-200"
                style={{ left: image.x, top: image.y, width: image.width, height: image.height }}>
                <Icon as={ImageIcon} className="size-6 text-neutral-500" />
              </Pressable>
            ) : null}
            {selection === 'image' && !imageGone ? (
              <>
                <AnnotationSelection
                  rect={image}
                  onChange={setImage}
                  bounds={{ width: paraW, height: 150 }}
                />
                <View
                  className="absolute"
                  style={{ left: image.x, top: image.y + image.height + 14 }}>
                  <QuickMenu
                    onCommentPress={() => toast('Comment added to the image')}
                    onDeletePress={() => {
                      setImageGone(true);
                      setSelection('none');
                    }}
                  />
                </View>
              </>
            ) : null}
          </View>
          <Lines n={4} />
          <Lines n={3} last="40%" />
        </PdfPage>
      </ScrollView>
      <Top
        step={step}
        onRestart={restart}
        bar={
          markup ? (
            <AppBar>
              <AppBarGroup>
                <AppBarButton
                  icon={ArrowLeftIcon}
                  accessibilityLabel="Done editing"
                  onPress={() => {
                    setMarkup(false);
                    setSelection('none');
                  }}
                />
              </AppBarGroup>
              <AppBarGroup>
                <AppBarButton
                  icon={ArrowUUpLeftIcon}
                  accessibilityLabel="Undo"
                  disabled={!changed}
                  onPress={undo}
                />
                <AppBarButton icon={ArrowUUpRightIcon} accessibilityLabel="Redo" disabled />
              </AppBarGroup>
            </AppBar>
          ) : (
            <ViewerBar title="Lease agreement.pdf" onHome={() => setScreen('docs')} />
          )
        }
      />
      <Bottom>
        {markup ? (
          <Toolbar>
            <ToolbarTools
              onClose={() => {
                setMarkup(false);
                setSelection('none');
              }}
              styleColor={
                selection === 'image' ? null : active.color ? (color ?? active.color) : undefined
              }
              onStylePress={selection === 'image' ? undefined : () => setSheet(true)}>
              {MARKUP_TOOLS.map((t) => (
                <ToolItem
                  key={t.key}
                  label={t.label}
                  icon={t.icon}
                  // Object selected → no active tool (the Quick Menu owns the actions).
                  active={selection !== 'image' && t.key === tool}
                  onPress={() => {
                    setSelection('none');
                    if (t.key === tool && t.color) setSheet(true);
                    else setTool(t.key);
                  }}
                />
              ))}
            </ToolbarTools>
          </Toolbar>
        ) : (
          <GroupsToolbar onPress={(k) => (k === 'markup' ? setMarkup(true) : undefined)} />
        )}
      </Bottom>
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

// ─── F2 · Find your way ──────────────────────────────────────────────────────────────────────────

const MORE_TOOLS = [
  { key: 'outline', title: 'Outline', icon: ListBulletsIcon, color: 'blue' },
  { key: 'comments', title: 'Comments', icon: ChatTextIcon, color: 'yellow' },
  { key: 'pages', title: 'Page tool', icon: SquaresFourIcon, color: 'violet' },
  { key: 'form', title: 'Prepare form', icon: TextboxIcon, color: 'teal' },
  { key: 'search', title: 'Search', icon: MagnifyingGlassIcon, color: 'sky' },
  { key: 'bookmarks', title: 'Bookmarks', icon: BookmarkSimpleIcon, color: 'red' },
] as const;

type OutlineNode = { id: string; title: string; page: number; children?: OutlineNode[] };
const OUTLINE: OutlineNode[] = [
  { id: 'start', title: 'Start', page: 1 },
  {
    id: 'contents',
    title: 'Contents',
    page: 2,
    children: [{ id: 'parties', title: 'Parties', page: 2 }],
  },
  {
    id: 'see',
    title: 'How people see',
    page: 3,
    children: [
      { id: 'eye', title: 'Eye movement', page: 3 },
      { id: 'patterns', title: 'Reading patterns', page: 4 },
    ],
  },
  { id: 'read', title: 'How people read', page: 5 },
  { id: 'mistakes', title: 'People make mistakes', page: 7 },
];

/** Word counts for the fake document — drives "n of N" in the search toolbar. */
const WORDS: Record<string, number> = { agreement: 12, lease: 5, tenant: 8, rent: 6, landlord: 4 };
function countMatches(q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return 0;
  return Object.entries(WORDS)
    .filter(([w]) => w.startsWith(s))
    .reduce((n, [, c]) => n + c, 0);
}

function F2FindYourWay() {
  const [sheet, setSheet] = React.useState<'none' | 'tools' | 'outline'>('none');
  const [page, setPage] = React.useState(1);
  const [expanded, setExpanded] = React.useState<string[]>(['see']);
  const [searching, setSearching] = React.useState(false);
  const [q, setQ] = React.useState('agreement');
  const [match, setMatch] = React.useState(1);
  const total = countMatches(q);
  const scrollRef = React.useRef<ScrollView>(null);

  const restart = () => {
    setSheet('none');
    setPage(1);
    setSearching(false);
    setQ('agreement');
    setMatch(1);
  };
  const step = searching
    ? total
      ? `3/3 · ↑ / ↓ move through matches · try "invoice"`
      : '3/3 · No results — edit the query'
    : sheet === 'tools'
      ? '1/3 · Tap Outline (or Search)'
      : sheet === 'outline'
        ? '2/3 · Tap a heading to jump'
        : page === 1
          ? '1/3 · Tap More in the toolbar'
          : '3/3 · Now More › Search';

  const outlineRows = (nodes: OutlineNode[], depth = 0): React.ReactNode[] =>
    nodes.flatMap((n) => {
      const open = expanded.includes(n.id);
      const row = (
        <View key={n.id}>
          <OutlineItem
            title={n.title}
            page={n.page}
            depth={depth}
            expand={n.children ? (open ? 'expanded' : 'collapsed') : 'none'}
            onToggleExpand={() =>
              setExpanded((e) => (open ? e.filter((x) => x !== n.id) : [...e, n.id]))
            }
            onPress={() => {
              setPage(n.page);
              setSheet('none');
              scrollRef.current?.scrollTo({ y: 0, animated: true });
            }}
          />
          {depth === 0 ? <Separator /> : null}
        </View>
      );
      return [row, ...(n.children && open ? outlineRows(n.children, depth + 1) : [])];
    });

  // Three visible match boxes on the page; the current one is outlined.
  const boxes = [
    { left: '20%', top: 0, width: '26%' },
    { left: '52%', top: 28, width: '22%' },
    { left: '30%', top: 42, width: '24%' },
  ] as const;
  const currentBox = (match - 1) % boxes.length;

  return (
    <Screen muted>
      <ScrollView
        ref={scrollRef}
        contentContainerClassName="px-4 pb-28 pt-24"
        showsVerticalScrollIndicator={false}>
        <PageIndicator page={page} total={20} className="mb-2" />
        <PdfPage>
          <PageHeading />
          <View>
            <Lines n={5} />
            {searching && total
              ? boxes.map((b, i) => (
                  <View
                    key={i}
                    pointerEvents="none"
                    className={cn(
                      'absolute rounded-[2px] bg-yellow-300/60',
                      i === currentBox && 'border-pdf border-2 bg-yellow-300/30'
                    )}
                    style={{ left: b.left, top: b.top - 4, width: b.width, height: 14 }}
                  />
                ))
              : null}
          </View>
          <Lines n={4} />
          <Lines n={5} />
          <Lines n={3} last="40%" />
        </PdfPage>
      </ScrollView>
      <Top
        step={step}
        onRestart={restart}
        bar={
          searching ? (
            <AppBar>
              <AppBarGroup>
                <AppBarButton
                  icon={ArrowLeftIcon}
                  accessibilityLabel="Close search"
                  onPress={() => setSearching(false)}
                />
              </AppBarGroup>
              <AppBarSearchField
                value={q}
                onChangeText={(v) => {
                  setQ(v);
                  setMatch(1);
                }}
                placeholder="Search in document"
              />
            </AppBar>
          ) : (
            <ViewerBar
              title="Lease agreement.pdf"
              onSearch={() => {
                setSearching(true);
                setMatch(1);
              }}
            />
          )
        }
      />
      <Bottom>
        {searching ? (
          q.trim() ? (
            <Toolbar>
              <ToolbarSearch
                count={total ? `${match} of ${total}` : null}
                onPrevious={() => setMatch((m) => (m <= 1 ? total : m - 1))}
                onNext={() => setMatch((m) => (m >= total ? 1 : m + 1))}
                onResults={() => toast(`${total} results for "${q.trim()}"`)}
              />
            </Toolbar>
          ) : null
        ) : (
          <GroupsToolbar onPress={(k) => (k === 'more' ? setSheet('tools') : undefined)} />
        )}
      </Bottom>
      <Drawer open={sheet === 'tools'} onOpenChange={(o) => setSheet(o ? 'tools' : 'none')}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>More tools</DrawerTitle>
            <DrawerDescription>Tools for this document.</DrawerDescription>
          </DrawerHeader>
          <View className="flex-row flex-wrap gap-2 px-4 pb-4">
            {MORE_TOOLS.map((t) => (
              <ToolTile
                key={t.key}
                title={t.title}
                icon={t.icon}
                color={t.color}
                size="compact"
                className="min-w-0 flex-1 basis-[30%]"
                onPress={() => {
                  if (t.key === 'outline') setSheet('outline');
                  else if (t.key === 'search') {
                    setSheet('none');
                    setSearching(true);
                    setMatch(1);
                  } else toast(`${t.title} — not part of this flow`);
                }}
              />
            ))}
          </View>
        </DrawerContent>
      </Drawer>
      <Drawer open={sheet === 'outline'} onOpenChange={(o) => setSheet(o ? 'outline' : 'none')}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Outline</DrawerTitle>
            <DrawerDescription>Jump to a section of the document.</DrawerDescription>
          </DrawerHeader>
          <ScrollView className="pb-2">{outlineRows(OUTLINE)}</ScrollView>
        </DrawerContent>
      </Drawer>
    </Screen>
  );
}

// ─── F3 · Comments ───────────────────────────────────────────────────────────────────────────────

type Reply = { name: string; date: string; comment: string };
const ROOT = {
  name: 'Jordan Lee',
  date: 'Oct 6',
  comment: 'Can we move the payment terms to section 3?',
};
const REPLIES: Reply[] = [
  { name: 'Alex Morgan', date: 'Oct 6', comment: 'Sure — moved it. Can you check page 3?' },
  { name: 'Riley Chen', date: 'Oct 7', comment: 'Looks good to me.' },
];

function F3Comments() {
  const [screen, setScreen] = React.useState<'list' | 'thread'>('list');
  const [replies, setReplies] = React.useState(REPLIES);
  const [resolved, setResolved] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const restart = () => {
    setScreen('list');
    setReplies(REPLIES);
    setResolved(false);
    setDraft('');
  };
  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setReplies((r) => [...r, { name: 'Alex Morgan', date: 'Now', comment: text }]);
    setDraft('');
  };
  const count = `${replies.length} replies`;

  if (screen === 'list') {
    return (
      <Screen>
        <ScrollView
          contentContainerClassName="gap-3 px-4 pb-10 pt-24"
          showsVerticalScrollIndicator={false}>
          <Text className="text-foreground text-base font-semibold">Page 1</Text>
          <CommentItem
            {...ROOT}
            replies={count}
            resolved={resolved}
            resolvedBy={resolved ? 'Alex Morgan' : undefined}
            onPress={() => setScreen('thread')}
          />
          <CommentItem
            name="Riley Chen"
            date="Oct 5"
            comment="Please confirm the start date before we sign."
            onPress={() => toast('Only Jordan Lee’s comment is part of this flow')}
          />
          <Text className="text-foreground pt-2 text-base font-semibold">Page 3</Text>
          <CommentItem
            name="Alex Morgan"
            date="Oct 2"
            comment="Typo in the tenant’s name — fixed."
            resolved
            resolvedBy="Alex Morgan"
          />
        </ScrollView>
        <Top
          step={
            resolved
              ? 'Resolved — the card shows who resolved it'
              : '1/2 · Tap Jordan Lee’s comment'
          }
          onRestart={restart}
          bar={
            <AppBarCentered
              title="All comments"
              leading={
                <AppBarGroup>
                  <AppBarButton icon={XIcon} accessibilityLabel="Close comments" />
                </AppBarGroup>
              }
              trailing={
                <AppBarGroup>
                  <AppBarButton icon={DotsThreeIcon} accessibilityLabel="More" />
                </AppBarGroup>
              }
            />
          }
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerClassName="pb-24 pt-24" showsVerticalScrollIndicator={false}>
        <CommentItem
          type="detail"
          {...ROOT}
          resolved={resolved}
          onResolvePress={() => setResolved((r) => !r)}
        />
        <Separator className="mx-4 w-auto" />
        {replies.map((r, i) => (
          <CommentItem key={i} type="detail" {...r} showResolve={false} />
        ))}
      </ScrollView>
      <Top
        step="2/2 · Type a reply and tap Send · ✓ resolves the thread"
        onRestart={restart}
        bar={
          <AppBarCentered
            title="Comment"
            leading={
              <AppBarGroup>
                <AppBarButton
                  icon={ArrowLeftIcon}
                  accessibilityLabel="Back"
                  onPress={() => setScreen('list')}
                />
              </AppBarGroup>
            }
            trailing={
              <AppBarGroup>
                <AppBarButton icon={DotsThreeIcon} accessibilityLabel="More" />
              </AppBarGroup>
            }
          />
        }
      />
      <Bottom>
        <View className="bg-background px-4 pb-4 pt-2">
          <InputGroup>
            <InputGroupInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Reply…"
              accessibilityLabel="Reply"
              onSubmitEditing={send}
              enterKeyHint="send"
            />
            <InputGroupAddon align="inline-end">
              {/* Icon-only Send, disabled while empty; 44 hit area via hitSlop. */}
              <Button
                size="icon"
                disabled={!draft.trim()}
                onPress={send}
                accessibilityLabel="Send reply"
                hitSlop={4}
                className={cn('-mr-2 size-8 rounded-md sm:size-8', !draft.trim() && 'opacity-50')}>
                <Icon
                  as={PaperPlaneRightIcon}
                  weight="fill"
                  className="text-primary-foreground size-4"
                />
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </View>
      </Bottom>
    </Screen>
  );
}

// ─── F4 · Organize pages ─────────────────────────────────────────────────────────────────────────

type PageRow = { n: number; landscape?: boolean };
const PAGES: PageRow[] = Array.from({ length: 9 }, (_, i) => ({ n: i + 1 }));

function MiniPage() {
  return (
    <View className="flex-1 gap-1.5 rounded-[2px] bg-white p-1.5">
      <Bar w="80%" h={4} dark />
      <Bar w="100%" h={3} />
      <Bar w="100%" h={3} />
      <Bar w="60%" h={3} />
    </View>
  );
}

function F4OrganizePages() {
  const [pages, setPages] = React.useState(PAGES);
  const [selecting, setSelecting] = React.useState(false);
  const [picked, setPicked] = React.useState<number[]>([]);
  const [confirm, setConfirm] = React.useState(false);
  const [current, setCurrent] = React.useState(1);
  const restart = () => {
    setPages(PAGES);
    setSelecting(false);
    setPicked([]);
  };
  const toggle = (n: number) =>
    setPicked((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));
  const none = picked.length === 0;
  const allPicked = picked.length === pages.length;
  const label = `${picked.length} page${picked.length === 1 ? '' : 's'}`;

  const del = () => {
    const before = pages;
    const removed = picked.length;
    setPages((p) => p.filter((x) => !picked.includes(x.n)));
    setPicked([]);
    setSelecting(false);
    toast(`${removed} page${removed === 1 ? '' : 's'} deleted`, {
      action: { label: 'Undo', onPress: () => setPages(before) },
    });
  };

  const step = !selecting
    ? pages.length < 9
      ? 'Tap Undo on the toast to restore'
      : '1/3 · Tap Select (or long-press a page)'
    : none
      ? '2/3 · Tap pages to select them'
      : '3/3 · Delete, Rotate or Extract';

  return (
    <Screen>
      <ScrollView contentContainerClassName="px-4 pb-28 pt-24" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap gap-3">
          {pages.map((p, i) => (
            <PageThumbnail
              key={p.n}
              page={i + 1 /* numbers follow the position, so they update after a delete */}
              orientation={p.landscape ? 'landscape' : 'portrait'}
              bookmarked={p.n === 4}
              selectable={selecting}
              state={
                selecting && picked.includes(p.n)
                  ? 'selected'
                  : !selecting && p.n === current
                    ? 'current'
                    : 'default'
              }
              onPress={() => (selecting ? toggle(p.n) : setCurrent(p.n))}
              onLongPress={() => {
                setSelecting(true);
                setPicked([p.n]);
              }}
              className="w-[30%] sm:w-[30%]">
              <MiniPage />
            </PageThumbnail>
          ))}
        </View>
      </ScrollView>
      <Top
        step={step}
        onRestart={restart}
        bar={
          selecting ? (
            <AppBarCentered
              title={`${picked.length} selected`}
              leading={
                <AppBarGroup>
                  <AppBarButton
                    icon={XIcon}
                    accessibilityLabel="Exit select mode"
                    onPress={() => {
                      setSelecting(false);
                      setPicked([]);
                    }}
                  />
                </AppBarGroup>
              }
              trailing={
                <AppBarTextButton
                  label={allPicked ? 'Deselect all' : 'Select all'}
                  onPress={() => setPicked(allPicked ? [] : pages.map((p) => p.n))}
                />
              }
            />
          ) : (
            <AppBarCentered
              title="Pages"
              leading={
                <AppBarGroup>
                  <AppBarButton icon={ArrowLeftIcon} accessibilityLabel="Back" />
                </AppBarGroup>
              }
              trailing={<AppBarTextButton label="Select" onPress={() => setSelecting(true)} />}
            />
          )
        }
      />
      {selecting ? (
        <Bottom>
          <Toolbar>
            <ToolbarAction
              label="Add"
              icon={FilePlusIcon}
              onPress={() => toast('Add pages — not part of this flow')}
            />
            <ToolbarAction
              label="Extract"
              icon={ScissorsIcon}
              disabled={none}
              onPress={() => toast(`Extracted ${label} to a new PDF`)}
            />
            <ToolbarAction
              label="Rotate"
              icon={ArrowClockwiseIcon}
              disabled={none}
              onPress={() =>
                setPages((ps) =>
                  ps.map((p) => (picked.includes(p.n) ? { ...p, landscape: !p.landscape } : p))
                )
              }
            />
            <ToolbarAction
              label="Delete"
              icon={TrashIcon}
              tone="destructive"
              disabled={none}
              onPress={() => setConfirm(true)}
            />
          </Toolbar>
        </Bottom>
      ) : null}
      <ActionSheet
        open={confirm}
        onOpenChange={setConfirm}
        type="confirm"
        title={`Delete ${label}?`}
        description="You can undo this right after.">
        <Button
          variant="destructive"
          onPress={() => {
            setConfirm(false);
            del();
          }}>
          <Text>Delete pages</Text>
        </Button>
      </ActionSheet>
    </Screen>
  );
}

// ─── F5 · Prepare form & sign ────────────────────────────────────────────────────────────────────

type FieldType = 'text' | 'signature' | 'checkbox' | 'radio';
type Field = {
  id: string;
  type: FieldType;
  label: string;
  value?: string;
  checked?: boolean;
  signed?: boolean;
};
const FIELDS: Field[] = [
  { id: 'name', type: 'text', label: 'Full name' },
  { id: 'date', type: 'text', label: 'Date' },
  { id: 'sign', type: 'signature', label: 'Sign here' },
  { id: 'agree', type: 'checkbox', label: 'I agree' },
];
const FIELD_TOOLS = [
  { key: 'text', label: 'Text field', icon: TextTPlusIcon },
  { key: 'signature', label: 'Signature field', icon: SignatureIcon },
  { key: 'checkbox', label: 'Checkbox', icon: CheckSquareIcon },
  { key: 'radio', label: 'Radio button', icon: RadioButtonIcon },
] as const;
const FILL_VALUES: Record<string, string> = { name: 'Alex Morgan', date: 'Oct 8, 2026' };

function F5PrepareFormAndSign() {
  const [mode, setMode] = React.useState<'build' | 'fill'>('build');
  const [fields, setFields] = React.useState(FIELDS);
  const [tool, setTool] = React.useState<FieldType>('text');
  const [selected, setSelected] = React.useState<string | null>(null);
  const [sheet, setSheet] = React.useState(false);
  const [hint, setHint] = React.useState(true);
  const [saved, setSaved] = React.useState(false);
  const [sizes, setSizes] = React.useState<Record<string, { width: number; height: number }>>({});
  const restart = () => {
    setMode('build');
    setFields(FIELDS);
    setSelected(null);
    setHint(true);
    setSaved(false);
  };
  const update = (id: string, patch: Partial<Field>) =>
    setFields((fs) => fs.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const filled = (f: Field) =>
    f.type === 'signature' ? !!f.signed : f.type === 'text' ? !!f.value : !!f.checked;
  const done = fields.every(filled);

  React.useEffect(() => {
    if (mode === 'fill' && done && !saved) {
      setSaved(true);
      toast.success('Form saved');
    }
  }, [mode, done, saved]);

  const addField = () => {
    const n = fields.length + 1;
    const t = FIELD_TOOLS.find((x) => x.key === tool);
    setFields((fs) => [
      ...fs,
      {
        id: `f${n}`,
        type: tool,
        label: tool === 'signature' ? 'Sign here' : `${t?.label ?? 'Field'} ${n}`,
      },
    ]);
  };

  const step =
    mode === 'build'
      ? '1/3 · Pick a field tool, tap “+ Add field”, then Apply'
      : sheet
        ? '3/3 · Tap a saved signature'
        : done
          ? 'Done — the form is saved'
          : '2/3 · Tap each field to fill it in';

  return (
    <Screen muted>
      <ScrollView contentContainerClassName="px-4 pb-28 pt-24" showsVerticalScrollIndicator={false}>
        {mode === 'build' && hint ? (
          <Hint onDismiss={() => setHint(false)} className="mb-3">
            To fill in the fields, tap Apply to leave form building.
          </Hint>
        ) : null}
        <PageIndicator page={1} total={20} className="mb-2" />
        <PdfPage>
          <PageHeading />
          <Lines n={3} />
          <View className="gap-3">
            {fields.map((f) => {
              const state = mode === 'build' ? 'build' : filled(f) ? 'filled' : 'empty';
              const onPress =
                mode === 'build'
                  ? () => setSelected((s) => (s === f.id ? null : f.id))
                  : f.type === 'signature'
                    ? () => setSheet(true)
                    : f.type === 'text'
                      ? () =>
                          update(f.id, {
                            value: f.value ? undefined : (FILL_VALUES[f.id] ?? 'Alex Morgan'),
                          })
                      : () => update(f.id, { checked: !f.checked });
              const box = f.type === 'checkbox' || f.type === 'radio';
              return (
                <View key={f.id} className={cn(box && 'flex-row items-center gap-2')}>
                  <View
                    className={cn(box ? 'self-start' : 'w-[70%]')}
                    onLayout={(e) => {
                      const { width, height } = e.nativeEvent.layout;
                      setSizes((m) =>
                        m[f.id]?.width === width ? m : { ...m, [f.id]: { width, height } }
                      );
                    }}>
                    <FormField
                      type={f.type}
                      state={state}
                      placeholder={f.label}
                      value={f.value}
                      checked={f.checked}
                      onPress={onPress}
                    />
                    {mode === 'build' && selected === f.id && sizes[f.id] ? (
                      <AnnotationSelection
                        rect={{
                          x: -3,
                          y: -3,
                          width: sizes[f.id]!.width + 6,
                          height: sizes[f.id]!.height + 6,
                        }}
                        showRotate={false}
                      />
                    ) : null}
                  </View>
                  {box ? <Text className="text-xs text-neutral-600">{f.label}</Text> : null}
                </View>
              );
            })}
          </View>
          {mode === 'build' ? (
            <Text
              onPress={addField}
              accessibilityRole="button"
              className="self-start text-xs font-medium text-blue-600 underline">
              + Add field ({FIELD_TOOLS.find((t) => t.key === tool)?.label})
            </Text>
          ) : null}
          <Lines n={3} last="40%" />
        </PdfPage>
      </ScrollView>
      <Top
        step={step}
        onRestart={restart}
        bar={
          mode === 'build' ? (
            <AppBarCentered
              title="Prepare form"
              leading={<AppBarTextButton label="Cancel" onPress={restart} />}
              trailing={
                <AppBarTextButton
                  label="Apply"
                  onPress={() => {
                    setMode('fill');
                    setSelected(null);
                  }}
                />
              }
            />
          ) : (
            <ViewerBar title="Lease agreement.pdf" />
          )
        }
      />
      {mode === 'build' ? (
        <Bottom>
          <Toolbar>
            <ToolbarTools showClose={false}>
              {FIELD_TOOLS.map((t) => (
                <ToolItem
                  key={t.key}
                  label={t.label}
                  icon={t.icon}
                  active={tool === t.key}
                  onPress={() => setTool(t.key)}
                />
              ))}
            </ToolbarTools>
          </Toolbar>
        </Bottom>
      ) : null}
      <Drawer open={sheet} onOpenChange={setSheet}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Signatures</DrawerTitle>
            <DrawerDescription>Choose a signature to place, or create a new one.</DrawerDescription>
          </DrawerHeader>
          <View className="gap-2 px-4 pb-4">
            {(['draw', 'type'] as const).map((t) => (
              <SignatureItem
                key={t}
                type={t}
                name="Alex Morgan"
                onPress={() => {
                  const sig = fields.find((f) => f.type === 'signature' && !f.signed);
                  if (sig) update(sig.id, { signed: true });
                  setSheet(false);
                }}
              />
            ))}
            <Button
              variant="outline"
              onPress={() => toast('Create signature — not part of this flow')}>
              <Text>Create signature</Text>
            </Button>
          </View>
        </DrawerContent>
      </Drawer>
    </Screen>
  );
}

export const previews: Preview[] = [
  { name: 'F1 · Open & mark up', component: F1OpenAndMarkUp, fullBleed: true },
  { name: 'F2 · Find your way', component: F2FindYourWay, fullBleed: true },
  { name: 'F3 · Comments', component: F3Comments, fullBleed: true },
  { name: 'F4 · Organize pages', component: F4OrganizePages, fullBleed: true },
  { name: 'F5 · Prepare form & sign', component: F5PrepareFormAndSign, fullBleed: true },
];
