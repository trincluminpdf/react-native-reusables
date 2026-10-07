import {
  getPreviewPlatform,
  setPreviewPlatform,
  usePreviewPlatform,
  type PreviewOS,
} from '@/registry/nativewind/lib/preview-platform';
import { Platform } from 'react-native';

/**
 * Web preview "iOS | Android" switch (see registry lib/preview-platform.ts for what it changes).
 * Start value, first match wins:
 * 1. `?platform=ios|android` (shareable link)
 * 2. inside the desktop phone frame: what the shell shows
 * 3. the saved choice (localStorage `lumin-ds-platform`)
 * 4. the device: Android phones open as Android, everything else as iOS
 * Desktop shell ↔ phone frame: the shell posts `lumin-ds:platform` (FRAME_MESSAGE.platform).
 */
export const PLATFORM_STORAGE_KEY = 'lumin-ds-platform';
export const PLATFORM_LABEL: Record<PreviewOS, string> = { ios: 'iOS', android: 'Android' };

function isPreviewOS(value: unknown): value is PreviewOS {
  return value === 'ios' || value === 'android';
}

function readStored(): PreviewOS | null {
  try {
    const value = window.localStorage.getItem(PLATFORM_STORAGE_KEY);
    return isPreviewOS(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * Inside the desktop shell's phone frame: start with what the shell shows (it may come from a
 * `?platform=` the frame URL doesn't have). Same origin only.
 */
function readParentShell(): PreviewOS | null {
  if (window.self === window.top) return null;
  try {
    const value = window.parent.document.documentElement.dataset.platform;
    return isPreviewOS(value) ? value : null;
  } catch {
    return null;
  }
}

let initialized = false;

/** Web only, once per page. */
export function initPreviewPlatform() {
  if (Platform.OS !== 'web' || typeof window === 'undefined' || initialized) return;
  initialized = true;
  const param = new URLSearchParams(window.location.search).get('platform');
  const device = /android/i.test(window.navigator.userAgent) ? 'android' : 'ios';
  const initial = isPreviewOS(param) ? param : (readParentShell() ?? readStored() ?? device);
  applyPreviewPlatform(initial);
}

/** Show `os` without saving it (frame following the shell, or the start value). */
export function applyPreviewPlatform(os: PreviewOS) {
  setPreviewPlatform(os);
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.platform = os;
    if (os === 'android') loadRoboto();
  }
}

/** The user picked a platform: show it, remember it, drop a stale `?platform=` from the address. */
export function choosePreviewPlatform(os: PreviewOS) {
  if (Platform.OS !== 'web') return;
  applyPreviewPlatform(os);
  try {
    window.localStorage.setItem(PLATFORM_STORAGE_KEY, os);
  } catch {}
  const url = new URL(window.location.href);
  if (url.searchParams.has('platform')) {
    url.searchParams.delete('platform');
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
  }
}

/** Android replicas use Roboto (the system font there); load it only when Android is shown. */
function loadRoboto() {
  if (document.getElementById('lumin-ds-roboto')) return;
  const link = document.createElement('link');
  link.id = 'lumin-ds-roboto';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap';
  document.head.appendChild(link);
}

export { getPreviewPlatform, usePreviewPlatform };
export type { PreviewOS };
