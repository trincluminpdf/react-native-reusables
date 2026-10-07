import '../global.css';

import { Text } from '@/registry/nativewind/components/ui/text';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { Toaster } from '@/registry/nativewind/components/ui/sonner';
import { DesktopShell } from '@showcase/components/desktop-shell';
import { FrameBridge } from '@showcase/components/frame-bridge';
import { HeaderRightView } from '@showcase/components/header-right-view';
import { WebMobileBar } from '@showcase/components/web-mobile-bar';
import { useLuminFont } from '@showcase/hooks/use-lumin-font';
import { useWebColorSchemeSync } from '@showcase/hooks/use-web-color-scheme-sync';
import { getLastShellPath, useIsDesktopWeb } from '@showcase/lib/desktop-frame';
import { initPreviewPlatform } from '@showcase/lib/preview-platform';
import { NAV_THEME } from '@showcase/lib/theme';
import { router, Stack, type Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

SplashScreen.preventAutoHideAsync();
// Web: iOS | Android preview switch — start value before the first render (no-op on native).
initPreviewPlatform();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [loaded, error] = useLuminFont();
  const { colorScheme } = useColorScheme();
  const isDesktop = useIsDesktopWeb();
  const wasDesktop = React.useRef(false);
  useWebColorSchemeSync();

  // Window shrank below desktop width: show the page the phone frame was on.
  React.useEffect(() => {
    if (wasDesktop.current && !isDesktop) {
      router.replace(getLastShellPath() as Href);
    }
    wasDesktop.current = isDesktop;
  }, [isDesktop]);

  React.useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
      // Web: fade out the HTML boot screen from app/+html.tsx (same look as the native splash).
      if (Platform.OS === 'web') {
        (window as Window & { __luminBootDone?: () => void }).__luminBootDone?.();
      }
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider value={NAV_THEME[colorScheme]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <GestureHandlerRootView
        style={{ flex: 1, backgroundColor: NAV_THEME[colorScheme].colors.background }}>
        <KeyboardProvider>
          {Platform.OS === 'web' && !isDesktop && <WebMobileBar />}
          {/* Desktop web keeps the Stack mounted (routing) but shows the 3-column shell instead. */}
          <View style={isDesktop ? { display: 'none' } : { flex: 1 }}>
            <Stack
              screenOptions={{
                headerBackTitle: 'Back',
                headerTitle(props) {
                  return (
                    <Text className="ios:font-medium android:mt-1.5 text-xl">
                      {toOptions(props.children.split('/').pop())}
                    </Text>
                  );
                },
                headerRight: () => <HeaderRightView />,
                headerShown: Platform.OS !== 'web',
              }}>
              <Stack.Screen
                name="index"
                options={{
                  headerLargeTitle: true,
                  headerTitle: 'Lumin DS',
                  headerLargeTitleShadowVisible: false,
                  headerShadowVisible: false,
                  headerTransparent: Platform.OS === 'ios',
                }}
              />
            </Stack>
          </View>
          {isDesktop && <DesktopShell />}
          <FrameBridge />
          <PortalHost />
          <Toaster />
        </KeyboardProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

function toOptions(name: string) {
  const title = name
    .split('-')
    .map(function (str: string) {
      return str.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
      });
    })
    .join(' ');
  return title;
}
