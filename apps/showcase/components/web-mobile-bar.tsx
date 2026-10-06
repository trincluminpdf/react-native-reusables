import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { LuminLogo } from '@showcase/components/lumin-logo';
import { persistWebTheme } from '@showcase/hooks/use-web-color-scheme-sync';
import { getComponent } from '@showcase/lib/constants';
import { isShellFrame } from '@showcase/lib/desktop-frame';
import { router, usePathname } from 'expo-router';
import {
  ChevronLeftIcon,
  MaximizeIcon,
  MinimizeIcon,
  MoonIcon,
  SunIcon,
  XIcon,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Fallback title; on Home the bar shows only the Lumin logo (title is in the page). */
const APP_TITLE = 'PDF Mobile DS';
const INSTALL_HINT_KEY = 'lumin-ds-install-hint-dismissed';

type FullscreenDoc = Document & {
  webkitFullscreenEnabled?: boolean;
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
};
type FullscreenEl = HTMLElement & { webkitRequestFullscreen?: () => Promise<void> };

function vibrate() {
  try {
    navigator.vibrate?.(10);
  } catch {}
}

function toTitle(pathname: string) {
  const last = pathname.split('/').filter(Boolean).pop();
  if (!last) return APP_TITLE;
  const meta = getComponent(last);
  if (meta) return meta.name;
  return last
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function useClientState() {
  const [state, setState] = React.useState({
    ready: false,
    inIframe: false,
    inShellFrame: false,
    standalone: false,
    canFullscreen: false,
    isIOS: false,
    isTouch: false,
  });

  React.useEffect(() => {
    const doc = document as FullscreenDoc;
    const ua = navigator.userAgent;
    setState({
      ready: true,
      inIframe: window.self !== window.top,
      inShellFrame: isShellFrame(),
      standalone:
        window.matchMedia?.('(display-mode: standalone)').matches ||
        window.matchMedia?.('(display-mode: fullscreen)').matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true,
      canFullscreen: !!(doc.fullscreenEnabled || doc.webkitFullscreenEnabled),
      isIOS: /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && navigator.maxTouchPoints > 1),
      isTouch: window.matchMedia?.('(pointer: coarse)').matches ?? false,
    });
  }, []);

  return state;
}

function useIsFullscreen() {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  React.useEffect(() => {
    const doc = document as FullscreenDoc;
    const update = () => setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
    document.addEventListener('fullscreenchange', update);
    document.addEventListener('webkitfullscreenchange', update);
    return () => {
      document.removeEventListener('fullscreenchange', update);
      document.removeEventListener('webkitfullscreenchange', update);
    };
  }, []);
  return isFullscreen;
}

async function toggleFullscreen() {
  const doc = document as FullscreenDoc;
  const el = document.documentElement as FullscreenEl;
  try {
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      await (doc.exitFullscreen?.() ?? doc.webkitExitFullscreen?.());
    } else {
      await (el.requestFullscreen?.({ navigationUI: 'hide' }) ?? el.webkitRequestFullscreen?.());
    }
  } catch (error) {
    console.warn('Fullscreen not available', error);
  }
}

/**
 * Web-only top bar for testing the showcase on a real phone browser:
 * Home: Lumin logo (tap = reload home) — the page title sits below the bar; other pages: Back +
 * component name.
 * Right side: fullscreen toggle and light/dark toggle.
 * Hidden when embedded in an iframe (docs previews) — except inside the desktop shell's phone
 * frame, where it acts as the app's nav bar (Back + title; theme is driven by the shell).
 */
export function WebMobileBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { colorScheme, setColorScheme } = useColorScheme();
  const client = useClientState();
  const isFullscreen = useIsFullscreen();
  const isHome = pathname === '/' || pathname === '';

  if (Platform.OS !== 'web' || !client.ready || (client.inIframe && !client.inShellFrame))
    return null;
  const chrome = !client.inShellFrame;

  function onBack() {
    vibrate();
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  // Logo = home, with a fresh page load (also resets the list to the top).
  function onLogo() {
    vibrate();
    window.location.assign('/');
  }

  function onToggleTheme() {
    vibrate();
    const next = colorScheme === 'dark' ? 'light' : 'dark';
    persistWebTheme(next);
    setColorScheme(next);
  }

  return (
    <View>
      <View
        className="bg-background border-border flex-row items-center border-b px-2"
        style={{ paddingTop: insets.top, minHeight: 52 + insets.top }}>
        {isHome ? (
          <View className="min-w-0 flex-1 flex-row items-center gap-2 pl-2">
            <Pressable
              onPress={onLogo}
              accessibilityRole="link"
              accessibilityLabel="Lumin — reload home"
              hitSlop={8}
              className="web:cursor-pointer active:opacity-60">
              <LuminLogo height={18} color={colorScheme === 'dark' ? '#fafafa' : '#0a0a0a'} />
            </Pressable>
          </View>
        ) : (
          <>
            <View className="w-24 flex-row items-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 flex-row gap-0.5 px-2"
                onPress={onBack}
                accessibilityLabel="Back">
                <Icon as={ChevronLeftIcon} className="size-5" />
                <Text className="text-base font-normal">Back</Text>
              </Button>
            </View>
            <Text className="flex-1 text-center text-base font-semibold" numberOfLines={1}>
              {toTitle(pathname)}
            </Text>
          </>
        )}
        <View className="w-24 flex-row items-center justify-end">
          {chrome && client.canFullscreen && !client.standalone && (
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-full"
              onPress={() => {
                vibrate();
                toggleFullscreen();
              }}
              accessibilityLabel={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
              <Icon as={isFullscreen ? MinimizeIcon : MaximizeIcon} className="size-5" />
            </Button>
          )}
          {chrome && (
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-full"
              onPress={onToggleTheme}
              accessibilityLabel="Toggle dark mode">
              <Icon as={colorScheme === 'dark' ? SunIcon : MoonIcon} className="size-5" />
            </Button>
          )}
        </View>
      </View>
      {chrome && isHome && client.isTouch && !client.standalone && (
        <InstallHint isIOS={client.isIOS} canFullscreen={client.canFullscreen} />
      )}
    </View>
  );
}

function InstallHint({ isIOS, canFullscreen }: { isIOS: boolean; canFullscreen: boolean }) {
  const [dismissed, setDismissed] = React.useState(() => {
    try {
      return window.localStorage.getItem(INSTALL_HINT_KEY) === '1';
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  function onDismiss() {
    try {
      window.localStorage.setItem(INSTALL_HINT_KEY, '1');
    } catch {}
    setDismissed(true);
  }

  const message = isIOS
    ? 'For fullscreen like a real app: tap Share, then "Add to Home Screen" and open it from there.'
    : canFullscreen
      ? 'Tap the fullscreen icon above, or use the browser menu, then "Add to Home screen" to open it like an app.'
      : 'Use the browser menu, then "Add to Home screen" to open it fullscreen like an app.';

  return (
    <View className="bg-muted border-border flex-row items-start gap-2 border-b px-4 py-3">
      <Text className="text-muted-foreground flex-1 text-sm">{message}</Text>
      <Button
        variant="ghost"
        size="icon"
        className="-mr-2 -mt-1 size-8 rounded-full"
        onPress={onDismiss}
        accessibilityLabel="Dismiss">
        <Icon as={XIcon} className="text-muted-foreground size-4" />
      </Button>
    </View>
  );
}
