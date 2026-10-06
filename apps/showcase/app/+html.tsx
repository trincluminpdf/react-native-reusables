import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.

const THEME_STORAGE_KEY = 'lumin-ds-theme';

// Runs before React hydrates so the page never flashes the wrong theme.
// Priority: ?theme= param > saved choice > OS preference.
const themeBootScript = `
(function () {
  try {
    var p = new URLSearchParams(location.search).get('theme');
    var s = null;
    try { s = localStorage.getItem('${THEME_STORAGE_KEY}'); } catch (e) {}
    var t = p === 'dark' || p === 'light' ? p : s === 'dark' || s === 'light' ? s
      : (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var html = document.documentElement;
    if (t === 'dark') html.classList.add('dark'); else html.classList.remove('dark');
    html.style.colorScheme = t;
    var c = t === 'dark' ? '#0a0a0a' : '#ffffff';
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute('content', c); m.removeAttribute('media');
    });
  } catch (e) {}
})();
`;

// Desktop (≥ 1024, top-level window): hide the mobile layout until the 3-column shell mounts,
// so the page does not flash the phone list first. The shell removes the attribute; the
// timeout is a safety net if JS fails.
const desktopBootScript = `
(function () {
  try {
    if (window.self === window.top && window.matchMedia('(min-width: 1024px)').matches) {
      var html = document.documentElement;
      html.setAttribute('data-ds-boot', 'desktop');
      setTimeout(function () { html.removeAttribute('data-ds-boot'); }, 5000);
    }
  } catch (e) {}
})();
`;

const mobileCss = `
html[data-ds-boot="desktop"] #root { visibility: hidden; }
html, body {
  overscroll-behavior: none;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}
body { touch-action: manipulation; }
[role="button"], [role="link"], [role="tab"], [role="switch"], [role="checkbox"], [role="radio"] {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}
/* iOS Safari zooms into inputs with font-size < 16px */
@media (pointer: coarse) {
  input, textarea, select { font-size: 16px !important; }
}
`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en" className="bg-background">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <title>Lumin PDF Mobile DS</title>

        {/* Installable as an app (Add to Home Screen) -> launches fullscreen */}
        <link rel="manifest" href="/manifest.webmanifest" />
        {/* ◆ Lumin mark favicon (Figma LPA-001 › V3d). SVG for modern browsers; Expo adds /favicon.ico from web.favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Lumin DS" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />

        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script dangerouslySetInnerHTML={{ __html: desktopBootScript }} />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
        */}
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: mobileCss }} />

        {/* Lumin DS fonts on web: Inter (text styles) + JetBrains Mono (code) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=JetBrains+Mono:wght@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
