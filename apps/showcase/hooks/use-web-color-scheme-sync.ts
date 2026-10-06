import { colorScheme, useColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform } from 'react-native';

export const THEME_STORAGE_KEY = 'lumin-ds-theme';

const THEME_COLOR = { light: '#ffffff', dark: '#0a0a0a' } as const;

function readStoredTheme(): 'light' | 'dark' | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

/** Web only. Saves an explicit theme choice so it survives reloads / home-screen launches. */
export function persistWebTheme(theme: 'light' | 'dark') {
  if (Platform.OS !== 'web') return;
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
}

/**
 * Web only. Keeps NativeWind's color scheme (and everything derived from it, like the
 * navigation theme) in sync with the page:
 * 1. `?theme=dark|light` query param (what a host page can pass to an iframe)
 * 2. the user's saved choice (theme toggle)
 * 3. the `dark` class on <html> (set before hydration by +html.tsx, or by a host page)
 * 4. otherwise the OS `prefers-color-scheme`, kept in sync when it changes
 * Also updates the browser chrome color (`theme-color`) to match.
 */
function useWebColorSchemeSync() {
  const { colorScheme: current } = useColorScheme();

  React.useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const html = document.documentElement;
    const param = new URLSearchParams(window.location.search).get('theme');
    const hasThemeParam = param === 'dark' || param === 'light';
    const stored = readStoredTheme();
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');

    const initial: 'light' | 'dark' = hasThemeParam
      ? (param as 'light' | 'dark')
      : stored
        ? stored
        : html.classList.contains('dark') || media?.matches
          ? 'dark'
          : 'light';
    colorScheme.set(initial);

    const observer = new MutationObserver(() => {
      const next = html.classList.contains('dark') ? 'dark' : 'light';
      // NativeWind rewrites the class attribute when set, which fires this observer again.
      // Only update on a real change to avoid an infinite loop.
      if (colorScheme.get() !== next) {
        colorScheme.set(next);
      }
    });
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });

    function onMediaChange(event: MediaQueryListEvent) {
      // An explicit choice (param or saved toggle) wins over the OS setting.
      if (hasThemeParam || readStoredTheme()) return;
      colorScheme.set(event.matches ? 'dark' : 'light');
    }
    media?.addEventListener('change', onMediaChange);

    return () => {
      observer.disconnect();
      media?.removeEventListener('change', onMediaChange);
    };
  }, []);

  React.useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const theme = current === 'dark' ? 'dark' : 'light';
    document.documentElement.style.colorScheme = theme;
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute('content', THEME_COLOR[theme]);
      meta.removeAttribute('media');
    });
  }, [current]);
}

export { useWebColorSchemeSync };
