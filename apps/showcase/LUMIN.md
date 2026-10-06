# Lumin PDF Mobile DS — live preview

Live: https://lumin-pdf-mobile-ds.vercel.app · Design source: [PDF-Mobile-DS (Figma)](https://www.figma.com/design/EotlK1nCd33Udubm5PcZQt/PDF-Mobile-DS)

Figma is the documentation, this app is the running preview. Every component page here links to its Figma page (top-right "Figma ↗" on phones, "Open in Figma" in the desktop panel), and every preview is named after the Figma variant properties (e.g. `Variant=PDF`, `Size=sm ◆`).

## Where things live

| What | Where |
| --- | --- |
| Components (RNR + Lumin deltas, and ◆ custom ones) | `packages/registry/src/nativewind/components/ui/*.tsx` |
| Native focus ring helper | `packages/registry/src/nativewind/lib/focus-ring.ts` |
| Colors (light/dark), radius | `apps/showcase/global.css` (+ `lib/theme.ts` for navigation colors) |
| Android system-dialog theme (Date Picker) | `plugins/withLuminAndroidTheme.js` |
| Font (Inter, JetBrains Mono) | `tailwind.config.js`, `plugins/interFontPlugin.js`, `hooks/use-lumin-font.tsx` |
| Component index (status + Figma page id) | `apps/showcase/lib/constants.ts` |
| Previews (one file per Figma page) | `apps/showcase/examples/*.tsx` |

Every component file starts with a header comment listing its ◆ Lumin deltas — the same list as the Figma page header.

## Status

The preview shows no status chips — only the ◆ prefix and a small **New** tag. `status` in `lib/constants.ts` mirrors the Figma page header chip:

- **RNR / RNR + Custom** — from the base kit (react-native-reusables), with or without Lumin deltas — no prefix.
- **◆ Custom** — not in the base kit; Lumin builds it (Drawer, Sheet, Field, Item, Empty, Input Group, Input OTP, Slider, Sonner, Spinner, Date Picker, Calendar, Fullscreen Modal, Splash Screen).
- **◆ New** — the latest batch only (now: the In-app components). When the next batch lands, set the previous New items to Custom here **and** in the Figma page header (Status chip), so the New tag always means "just added".

## In-app ◆ (Oct 2026)

Figma section `--- In-app ◆` (pages after Typography) = app-screen components from LPM-101 Home and LPM-1301 Viewer, corrected for the source's visual/logic issues. Listed under **In-app** on Home and in the desktop sidebar (`group: 'in-app'`).

| Figma page | Code (`packages/registry/src/nativewind/components/ui/`) |
| --- | --- |
| ◆ App Bar (+ Lumin Logo) | `app-bar.tsx`, `lumin-logo.tsx`, shared glass pill `glass.tsx` |
| ◆ Nav Bar | `nav-bar.tsx` |
| ◆ Tool Tile | `tool-tile.tsx` (colors = `components/card-*` in `global.css` / `tailwind.config.js`) |
| ◆ Section Header · ◆ Filter Chips · ◆ Document Item · ◆ Banner · ◆ Workspace Item | `section-header.tsx` · `filter-chip.tsx` · `document-item.tsx` · `banner.tsx` · `workspace-item.tsx` |
| ◆ Toolbar (+ Tool Item) | `toolbar.tsx`, Lumin-only tool icons in `lumin-icons.tsx` |
| ◆ Page Indicator · ◆ Quick Menu · ◆ Text Selection | `page-indicator.tsx` · `quick-menu.tsx` · `text-selection.tsx` |
| ◆ Color Swatch (+ Color Palette) | `color-swatch.tsx` — `ANNOTATION_PALETTES` = the web hex presets (LPA-001 › color_palette) |
| ◆ Annotation Sheet · ◆ Color Picker | `annotation-sheet.tsx` · `color-picker.tsx` |
| ◆ Showcase demo | `examples/showcase-demo.tsx` (interactive: Viewer → Mark up → select text → Quick Menu → sheet → Color Picker; Home; Tools; Search) |

- **Liquid glass** (`glass/*`): iOS 26+ uses `expo-glass-effect` (native Liquid Glass), older iOS `expo-blur`, Android a translucent surface (no reliable backdrop blur), web CSS `backdrop-blur-xl`. Native glass needs a new dev build (Expo Go is fine for blur).
- **Toolbar pattern**: uniform Tool Items + a trailing Style color well; tapping the active tool again also opens the Annotation Sheet. Tool icons follow the web Tool icon table (Figma ◆ Icon Map).
- Rows with a trailing More / action button keep the button as a sibling of the tappable area (no button inside a button on web); the whole row tints while pressed.

## Desktop preview (web ≥ 1024px)

Big screens get a 3-column shell (`components/desktop-shell.web.tsx`): component list · phone frame · "Open on your phone" QR panel (+ copy link, Open in Figma).

- The phone frame is an `<iframe>` of this same site (390 × 844, status bar drawn outside the iframe), so the preview inside renders exactly like a phone. Short windows scale the frame down.
- Shell ↔ frame sync is in `lib/desktop-frame.ts` + `components/frame-bridge.tsx` (same-origin `postMessage`): taps/Back in the frame update the sidebar, address bar and QR; sidebar clicks navigate the frame. The theme toggle sets the frame's `dark` class.
- Inside the frame the web top bar shows Back + title only, and the component page hides its own Figma link (the panel has it).
- Below 1024px (or when embedded by another site) nothing changes: the phone layout is shown as before. Shrinking the window keeps the page that was in the frame.

## Tokens

Values come from DS-shadcn-000 › `3. Mode` (Light / Dark) and `1. TailwindCSS`. The mobile component layer (`5. Component`) in Figma stores the NativeWind classes in each variable's code syntax, so a token like `button/pdf/bg` reads `bg-blue-500 dark:bg-blue-600` — the same classes used in code. Sizes follow RNR: base classes on phones, `sm:` on Tablet (window ≥ 640).

Dark `--border` / `--input` are white 10% / 15% in Figma; they are flattened over the background here because Tailwind opacity modifiers need opaque HSL variables.

## Loader (code only)

◆ Loader is the Lumin brand loader, variant **Lumin** only (source: "Lumin animated loaders 2" › `snippets/lumin-loader.html`). It has no PDF-Mobile-DS page, so its `figma` is empty in `lib/constants.ts` and the page shows "Code only" instead of a Figma link.

- `packages/registry/src/nativewind/components/ui/loader.tsx` — `Loader` (default 48px, #191C1D / foreground in dark, `className` or `color` to tint) and `LoaderScreen` (fills its parent on bg-background, optional `label`, fades in after 150ms).
- `packages/registry/src/nativewind/lib/lumin-loader-motion.ts` — path + keyframes **generated** from the snippet; regenerate rather than hand-edit.
- Web renders the snippet SVG + CSS as-is; native animates the same stops with Reanimated. Reduced motion shows the static mark.
- The web boot screen (`app/+html.tsx`) uses the same loader (64px) on the saved theme's background until the app is ready.
- Use it for app launch / opening a whole file; inline and button loading stay on ◆ Spinner.

## Date Picker

The picker is native (`@react-native-community/datetimepicker`): Android opens the Material 3 modal date picker (`design: 'material'`), iOS shows `display="inline"` inside the ◆ Drawer. The web preview shows ◆ Calendar in the Drawer as a stand-in.

Android needs `plugins/withLuminAndroidTheme.js` (registered in `app.config.ts`): it switches `AppTheme` to `Theme.Material3.DayNight.NoActionBar` and maps the M3 color roles to Lumin light/dark tokens. Without it the M3 dialog crashes natively. It is native config, so run `pnpm prebuild:android` / rebuild the dev client — Expo Go and OTA updates won't pick it up. `androidDesign="default"` falls back to the legacy dialog.

## Run

```sh
pnpm install
cd apps/showcase
npx expo start --web      # local preview
npx expo export -p web    # static build (what Vercel runs)
```

Push to `main` redeploys the Vercel project `pdf-mobile-ds-preview`.
