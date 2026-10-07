/**
 * ◆ Lumin — which OS a component should look like.
 *
 * - Native (iOS / Android): always the real `Platform.OS`. Nothing here changes device behaviour.
 * - Web (the live preview only): the preview's "iOS | Android" switch. Components with a native-only
 *   part (◆ Date Picker's system picker, liquid glass) read it to draw the web replica of that OS,
 *   so designers can check both types in a browser.
 *
 * The showcase sets the value (saved choice, `?platform=`, device default); components only read it.
 */
import * as React from 'react';
import { Platform } from 'react-native';

type PreviewOS = 'ios' | 'android';

let current: PreviewOS = 'ios';
const listeners = new Set<() => void>();

function getPreviewPlatform(): PreviewOS {
  if (Platform.OS === 'ios' || Platform.OS === 'android') return Platform.OS;
  return current;
}

/** Web only — no effect on native. */
function setPreviewPlatform(next: PreviewOS) {
  if (Platform.OS !== 'web' || next === current) return;
  current = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Static web export renders iOS; hydration starts from the same value, then follows the switch. */
function getServerSnapshot(): PreviewOS {
  return Platform.OS === 'android' ? 'android' : 'ios';
}

/** The OS to draw: real OS on device, the preview switch on web. */
function usePreviewPlatform(): PreviewOS {
  return React.useSyncExternalStore(subscribe, getPreviewPlatform, getServerSnapshot);
}

export { getPreviewPlatform, setPreviewPlatform, usePreviewPlatform };
export type { PreviewOS };
