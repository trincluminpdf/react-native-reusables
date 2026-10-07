import { FRAME_MESSAGE, isShellFrame, normalizePath } from '@showcase/lib/desktop-frame';
import { applyPreviewPlatform } from '@showcase/lib/preview-platform';
import { router, usePathname, type Href } from 'expo-router';
import * as React from 'react';
import { Platform } from 'react-native';

/**
 * Child side of the desktop shell (see lib/desktop-frame.ts). Renders nothing.
 * Reports route changes to the shell and follows sidebar clicks and the iOS | Android switch.
 */
export function FrameBridge() {
  const pathname = usePathname();
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    setActive(isShellFrame());
  }, []);

  React.useEffect(() => {
    if (!active) return;
    window.parent.postMessage(
      { type: FRAME_MESSAGE.route, path: normalizePath(pathname) },
      window.location.origin
    );
  }, [active, pathname]);

  React.useEffect(() => {
    if (!active) return;
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const data = event.data as { type?: string; path?: string; platform?: string } | null;
      if (data?.type === FRAME_MESSAGE.platform) {
        // The shell already saved the choice; just redraw.
        if (data.platform === 'ios' || data.platform === 'android')
          applyPreviewPlatform(data.platform);
        return;
      }
      if (data?.type !== FRAME_MESSAGE.navigate || typeof data.path !== 'string') return;
      const target = normalizePath(data.path);
      if (target === normalizePath(window.location.pathname)) return;
      if (target === '/') {
        if (router.canDismiss()) router.dismissAll();
        else router.replace('/');
      } else {
        // Keep the stack one level deep (home → component) like tapping in the list.
        if (normalizePath(window.location.pathname) === '/') router.push(target as Href);
        else router.replace(target as Href);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [active]);

  if (Platform.OS !== 'web') return null;
  return null;
}
