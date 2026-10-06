import * as React from 'react';
import { Platform, useWindowDimensions } from 'react-native';

/**
 * Desktop web preview (≥ 1024px): the page becomes a 3-column shell
 * (component list · phone frame · QR panel). The phone frame is an <iframe> of this same
 * site, so the preview inside renders exactly like on a real phone.
 *
 * Shell (parent) and frame (child) talk with postMessage on the same origin:
 * - child → parent `route`: the frame navigated (tap in the list, Back) → parent updates
 *   the sidebar, address bar and QR code.
 * - parent → child `navigate`: a sidebar click → the frame pushes that route.
 * Theme: the parent toggles the `dark` class on the frame's <html>; the frame's
 * useWebColorSchemeSync observer picks it up.
 */
export const DESKTOP_MIN_WIDTH = 1024;

/**
 * Bottom safe area of the phone frame (iPhone home indicator, pt). The iframe has no real
 * safe area — env(safe-area-inset-bottom) is 0 inside it — so bottom-anchored UI uses this.
 */
export const SHELL_SAFE_BOTTOM = 34;

export const FRAME_MESSAGE = {
  route: 'lumin-ds:route',
  navigate: 'lumin-ds:navigate',
} as const;

type ShellWindow = Window & { __LUMIN_DS_SHELL__?: boolean };

/** Parent side: mark this window as the desktop shell so the iframe can recognise it. */
export function markShellWindow() {
  if (typeof window !== 'undefined') (window as ShellWindow).__LUMIN_DS_SHELL__ = true;
}

/** Child side: true when this page runs inside the desktop shell's phone frame. */
export function isShellFrame() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  if (window.self === window.top) return false;
  try {
    return !!(window.parent as ShellWindow).__LUMIN_DS_SHELL__;
  } catch {
    // Cross-origin parent (e.g. docs embeds) → not our shell.
    return false;
  }
}

/** True on desktop-sized web windows that are not themselves inside an iframe. */
export function useIsDesktopWeb() {
  const { width } = useWindowDimensions();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (Platform.OS !== 'web' || !mounted) return false;
  if (window.self !== window.top) return false;
  return width >= DESKTOP_MIN_WIDTH;
}

/** Normalises a router pathname for comparison ('' → '/', no trailing slash). */
export function normalizePath(path: string | null | undefined) {
  if (!path) return '/';
  const clean = path.split('?')[0].split('#')[0];
  if (clean.length > 1 && clean.endsWith('/')) return clean.slice(0, -1);
  return clean || '/';
}

let lastShellPath = '/';
/** Last route shown in the phone frame — the layout restores it when the window shrinks below desktop. */
export function setLastShellPath(path: string) {
  lastShellPath = path;
}
export function getLastShellPath() {
  return lastShellPath;
}
