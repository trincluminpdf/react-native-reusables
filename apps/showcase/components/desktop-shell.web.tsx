import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Text } from '@/registry/nativewind/components/ui/text';
import { LuminLogo } from '@showcase/components/lumin-logo';
import { cn } from '@/registry/nativewind/lib/utils';
import { persistWebTheme } from '@showcase/hooks/use-web-color-scheme-sync';
import {
  FRAME_MESSAGE,
  markShellWindow,
  normalizePath,
  setLastShellPath,
} from '@showcase/lib/desktop-frame';
import { COMPONENTS, componentFigmaUrl, FIGMA_FILE_URL, getComponent } from '@showcase/lib/constants';
import { usePathname } from 'expo-router';
import { useColorScheme } from 'nativewind';
import {
  ArrowSquareOutIcon,
  CheckIcon,
  CopyIcon,
  DeviceMobileIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
} from 'phosphor-react-native';
import { QRCodeSVG } from 'qrcode.react';
import * as React from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';

/** iPhone 15/16-size viewport (pt). The iframe gets the area below the status bar. */
const SCREEN = { width: 390, height: 844, statusBar: 44 };
const BEZEL = 12;
const FRAME = { width: SCREEN.width + BEZEL * 2, height: SCREEN.height + BEZEL * 2 };
const TOP_BAR = 56;
const STAGE_PADDING = 32;

/**
 * Web ≥ 1024px: component list · phone frame (iframe of this site) · QR to open on a phone.
 * See lib/desktop-frame.ts for how the shell and the frame stay in sync.
 */
export function DesktopShell() {
  markShellWindow();
  const initialPath = normalizePath(usePathname());
  const [path, setPath] = React.useState(initialPath);
  const [frameSrc] = React.useState(initialPath);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  React.useEffect(() => {
    setLastShellPath(path);
    const target = path + window.location.search + window.location.hash;
    if (window.location.pathname !== path) window.history.replaceState(null, '', target);
    const meta = getComponent(path.split('/').pop() ?? '');
    document.title = meta ? `${meta.name} · Lumin PDF Mobile DS` : 'Lumin PDF Mobile DS';
  }, [path]);

  React.useEffect(() => {
    document.documentElement.removeAttribute('data-ds-boot');
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      const data = event.data as { type?: string; path?: string } | null;
      if (data?.type === FRAME_MESSAGE.route && typeof data.path === 'string') {
        setPath(normalizePath(data.path));
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Keep the frame's theme in step with the shell (its color-scheme observer reacts to the class).
  const syncFrameTheme = React.useCallback(() => {
    try {
      iframeRef.current?.contentDocument?.documentElement.classList.toggle('dark', isDark);
    } catch {}
  }, [isDark]);
  React.useEffect(syncFrameTheme, [syncFrameTheme]);

  function navigate(to: string) {
    const target = normalizePath(to);
    setPath(target);
    iframeRef.current?.contentWindow?.postMessage(
      { type: FRAME_MESSAGE.navigate, path: target },
      window.location.origin
    );
  }

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark';
    persistWebTheme(next);
    setColorScheme(next);
  }

  const slug = path.startsWith('/components/') ? path.split('/').pop() : undefined;
  const meta = slug ? getComponent(slug) : undefined;
  const pageUrl = `${window.location.origin}${path}`;

  return (
    <View className="bg-background absolute inset-0 flex-row">
      <Sidebar active={path} onSelect={navigate} isDark={isDark} />
      <View className="bg-muted/50 dark:bg-muted/30 min-w-0 flex-1">
        <View
          className="bg-background border-border flex-row items-center gap-2 border-b px-5"
          style={{ height: TOP_BAR }}>
          <View className="min-w-0 flex-1">
            <Text className="text-base font-semibold" numberOfLines={1}>
              {meta ? meta.name : 'All components'}
            </Text>
          </View>
          <Button
            variant="ghost"
            size="sm"
            className="flex-row gap-1.5"
            onPress={() => window.open(pageUrl, '_blank', 'noopener')}
            accessibilityLabel="Open this page in a new tab">
            <Icon as={ArrowSquareOutIcon} className="text-muted-foreground size-4" />
            <Text className="text-muted-foreground text-sm font-normal">New tab</Text>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onPress={toggleTheme}
            accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            <Icon as={isDark ? SunIcon : MoonIcon} className="size-5" />
          </Button>
        </View>
        <PhoneStage dark={isDark}>
          <iframe
            ref={iframeRef}
            src={frameSrc}
            title="Mobile preview"
            onLoad={syncFrameTheme}
            style={{
              display: 'block',
              width: SCREEN.width,
              height: SCREEN.height - SCREEN.statusBar,
              border: 0,
              background: 'transparent',
            }}
          />
        </PhoneStage>
      </View>
      <SidePanel url={pageUrl} figma={meta ? componentFigmaUrl(meta) : FIGMA_FILE_URL} />
    </View>
  );
}

function Sidebar({
  active,
  onSelect,
  isDark,
}: {
  active: string;
  onSelect: (path: string) => void;
  isDark: boolean;
}) {
  const [search, setSearch] = React.useState('');
  const query = search.trim().toLowerCase();
  const items = query ? COMPONENTS.filter((c) => c.name.toLowerCase().includes(query)) : COMPONENTS;

  return (
    <View className="bg-background border-border w-64 border-r">
      <Pressable
        onPress={() => onSelect('/')}
        className="flex-row items-center gap-3 px-4 pb-3 pt-4"
        accessibilityRole="link"
        accessibilityLabel="All components">
        <View className="min-w-0 flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            <LuminLogo height={18} color={isDark ? '#fafafa' : '#0a0a0a'} />
            <Text className="text-sm font-semibold" numberOfLines={1}>
              PDF Mobile DS
            </Text>
          </View>
          <Text className="text-muted-foreground text-xs" numberOfLines={1}>
            {COMPONENTS.length} components
          </Text>
        </View>
      </Pressable>
      <View className="px-3 pb-2">
        <View className="justify-center">
          <Icon
            as={MagnifyingGlassIcon}
            className="text-muted-foreground pointer-events-none absolute left-2.5 z-10 size-4"
          />
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Search"
            className="h-9 pl-8"
            autoCorrect={false}
            aria-label="Search components"
          />
        </View>
      </View>
      <ScrollView className="flex-1" contentContainerClassName="px-3 pb-4">
        {items.map((item) => {
          const href = `/components/${item.slug}`;
          const selected = active === href;
          const custom = item.status === 'Custom' || item.status === 'New';
          return (
            <Pressable
              key={item.slug}
              onPress={() => onSelect(href)}
              accessibilityRole="link"
              aria-current={selected ? 'page' : undefined}
              className={cn(
                'h-8 flex-row items-center rounded-md px-2.5',
                selected ? 'bg-accent' : 'web:hover:bg-accent/60'
              )}>
              <Text
                className={cn('text-sm', selected ? 'font-medium' : 'text-foreground/80')}
                numberOfLines={1}>
                {custom ? (
                  <Text className="text-xs text-violet-600 dark:text-violet-400">◆ </Text>
                ) : null}
                {item.name}
              </Text>
            </Pressable>
          );
        })}
        {items.length === 0 ? (
          <Text className="text-muted-foreground px-2.5 py-2 text-sm">No match</Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

/** Centers the phone frame and scales it down to fit short windows. */
function PhoneStage({ children, dark }: { children: React.ReactNode; dark: boolean }) {
  const { height } = useWindowDimensions();
  const available = height - TOP_BAR - STAGE_PADDING * 2;
  const scale = Math.min(1, Math.max(0.5, available / FRAME.height));

  return (
    <View className="flex-1 items-center justify-center overflow-hidden">
      <View style={{ width: FRAME.width * scale, height: FRAME.height * scale }}>
        <div
          style={{
            width: FRAME.width,
            height: FRAME.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            borderRadius: 60,
            padding: BEZEL,
            background: dark ? '#2a2a2f' : '#111113',
            boxShadow:
              '0 0 0 1px rgba(255,255,255,0.06) inset, 0 0 0 1px rgba(0,0,0,0.25), 0 24px 60px -12px rgba(0,0,0,0.35)',
            boxSizing: 'border-box',
          }}>
          <div
            style={{
              position: 'relative',
              width: SCREEN.width,
              height: SCREEN.height,
              borderRadius: 48,
              overflow: 'hidden',
              background: 'hsl(var(--background))',
            }}>
            <StatusBar />
            {children}
            {/* Home indicator */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 8,
                width: 134,
                height: 5,
                marginLeft: -67,
                borderRadius: 3,
                background: 'hsl(var(--foreground))',
                opacity: 0.35,
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </View>
    </View>
  );
}

function StatusBar() {
  const color = 'hsl(var(--foreground))';
  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        height: SCREEN.statusBar,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 30px 0 36px',
        color,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 15,
        fontWeight: 600,
        userSelect: 'none',
      }}>
      <span>9:41</span>
      {/* Dynamic Island */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 10,
          width: 120,
          height: 34,
          marginLeft: -60,
          borderRadius: 20,
          background: '#000',
        }}
      />
      <svg width="68" height="12" viewBox="0 0 68 12" fill={color}>
        <rect x="0" y="8" width="3" height="4" rx="1" />
        <rect x="4.5" y="6" width="3" height="6" rx="1" />
        <rect x="9" y="3.5" width="3" height="8.5" rx="1" />
        <rect x="13.5" y="1" width="3" height="11" rx="1" />
        <path d="M30 3.2c2.2 0 4.2.9 5.7 2.3l1.1-1.1A9.6 9.6 0 0 0 30 1.6c-2.6 0-5 1-6.8 2.8l1.1 1.1A8 8 0 0 1 30 3.2Zm0 3.2c1.3 0 2.5.5 3.4 1.4l1.1-1.1a6.4 6.4 0 0 0-9 0l1.1 1.1c.9-.9 2.1-1.4 3.4-1.4Zm0 3.2c.4 0 .8.2 1.1.5L30 11.2l-1.1-1.1c.3-.3.7-.5 1.1-.5Z" />
        <rect
          x="42.5"
          y="1"
          width="21"
          height="10"
          rx="3"
          fill="none"
          stroke={color}
          strokeOpacity="0.4"
        />
        <rect x="44.5" y="3" width="17" height="6" rx="1.6" />
        <rect x="64.5" y="4" width="1.6" height="4" rx="0.8" fillOpacity="0.4" />
      </svg>
    </div>
  );
}

function SidePanel({ url, figma }: { url: string; figma: string }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => setCopied(false), [url]);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  return (
    <ScrollView
      className="bg-background border-border w-72 flex-none border-l"
      contentContainerClassName="gap-6 p-5">
      <View className="gap-3">
        <View className="flex-row items-center gap-2">
          <Icon as={DeviceMobileIcon} className="size-4" />
          <Text className="text-sm font-semibold">Open on your phone</Text>
        </View>
        <View className="border-border items-center rounded-xl border bg-white p-4">
          {/* Always black on white so every phone camera can read it, in light and dark mode. */}
          <QRCodeSVG
            value={url}
            size={200}
            level="M"
            marginSize={0}
            bgColor="#ffffff"
            fgColor="#000000"
            title="QR code for this page"
          />
        </View>
        <Text className="text-muted-foreground text-sm">
          Scan with the phone camera to open this page. On the phone, Add to Home Screen to use it
          fullscreen like an app.
        </Text>
        <View className="border-border bg-muted/40 flex-row items-center gap-2 rounded-md border py-1 pl-3 pr-1">
          <Text className="text-muted-foreground flex-1 text-xs" numberOfLines={1}>
            {url.replace(/^https?:\/\//, '')}
          </Text>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 flex-row gap-1 px-2"
            onPress={onCopy}
            accessibilityLabel="Copy link">
            <Icon as={copied ? CheckIcon : CopyIcon} className="size-4" />
            <Text className="text-xs font-medium">{copied ? 'Copied' : 'Copy'}</Text>
          </Button>
        </View>
      </View>

      <View className="bg-border h-px" />

      <View className="gap-3">
        <Text className="text-sm font-semibold">Design</Text>
        <Button
          variant="outline"
          className="flex-row justify-between"
          onPress={() => window.open(figma, '_blank', 'noopener')}>
          <Text>Open in Figma</Text>
          <Icon as={ArrowSquareOutIcon} className="text-muted-foreground size-4" />
        </Button>
        <Text className="text-muted-foreground text-xs leading-5">
          The frame shows the phone layout (Mode = Mobile, 390 wide). Click acts as tap; scroll with
          the trackpad or mouse wheel.
        </Text>
      </View>
    </ScrollView>
  );
}
