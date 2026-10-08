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
| iOS \| Android preview switch | `packages/registry/src/nativewind/lib/preview-platform.ts` (what components read) · `apps/showcase/lib/preview-platform.ts` (start value, saving) · `components/platform-switch.tsx` |
| Web replicas of the native date pickers | `packages/registry/src/nativewind/components/ui/date-picker-replica.tsx` |

Every component file starts with a header comment listing its ◆ Lumin deltas — the same list as the Figma page header.

## Status

The preview shows no status chips — only the ◆ prefix and a small **New** tag. `status` in `lib/constants.ts` mirrors the Figma page header chip:

- **RNR / RNR + Custom** — from the base kit (react-native-reusables), with or without Lumin deltas — no prefix.
- **◆ Custom** — not in the base kit; Lumin builds it (Drawer, Sheet, Field, Item, Empty, Input Group, Input OTP, Slider, Sonner, Spinner, Date Picker, Calendar, Fullscreen Modal, Splash Screen, all In-app ◆ components).
- **◆ New** — the latest batch only (now: the LPM source batch below; the M3 / HIG gap batch and the In-app components moved to Custom). When the next batch lands, set the previous New items to Custom here **and** in the Figma page header (Status chip), so the New tag always means "just added".

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

- **Liquid glass** (`glass/*`): iOS 26+ uses `expo-glass-effect` (native Liquid Glass), older iOS `expo-blur`, Android a translucent surface (no reliable backdrop blur). The web preview follows the iOS | Android switch: iOS = Liquid Glass look-alike (CSS blur + saturation, bright rim, no lensing), Android = the same translucent surface as on device. App Bar › "Glass · over content" shows the difference. Native glass needs a new dev build (Expo Go is fine for blur).
- **Toolbar pattern**: uniform Tool Items + a trailing Style color well; tapping the active tool again also opens the Annotation Sheet. Tool icons follow the web Tool icon table (Figma ◆ Icon Map).
- Rows with a trailing More / action button keep the button as a sibling of the tappable area (no button inside a button on web); the whole row tints while pressed.

## iOS | Android preview switch (web)

Some parts are drawn by the OS or look different per OS. On the web preview an **iOS | Android** switch picks which one you see:

- **Where**: desktop top bar (next to New tab) — also swaps the phone chrome (iPhone: Dynamic Island + home indicator · Android: punch-hole status bar + gesture handle, smaller corners, 24 vs 34 bottom inset). Phone web: at the top of pages with native parts (`native: true` in `lib/constants.ts`: Date Picker, Time Picker, App Bar, Nav Bar, Toolbar, Showcase demo).
- **What changes**: ◆ Date Picker and ◆ Time Picker (system picker replicas + per-platform previews — `platform: 'ios' | 'android'` on a `Preview` hides it on the other OS) and liquid glass.
- **Start value**: `?platform=ios|android` → (inside the desktop frame) the shell's value → saved choice (`localStorage` `lumin-ds-platform`) → the device (Android phones open as Android, everything else as iOS). Picking one saves it and drops `?platform=` from the address. The shell tells the frame with `postMessage` `lumin-ds:platform`.
- **Native**: `usePreviewPlatform()` always returns the real `Platform.OS` — the switch never changes device behaviour.

## LPM source batch (Oct 2026, ◆ New)

Components found in the LPM-xxx Lumin PDF Mobile design files (Home, Document list, Viewer, Page tool, Outline, Comments, Prepare form, Signature, Share / Workspace, Notifications), corrected for the source's visual / logic issues. Figma pages are marked 🆕 (new) / ✏️ (edited) in PDF-Mobile-DS. Listed under **In-app** with the **New** tag.

| Figma page | Code (`packages/registry/src/nativewind/components/ui/`) | Notes |
| --- | --- | --- |
| 🆕 Showcase flows | `examples/showcase-flows.tsx` | 5 interactive phone flows: F1 Open & mark up · F2 Find your way · F3 Comments · F4 Organize pages · F5 Prepare form & sign. The violet "◆ step" pill is demo chrome. |
| 🆕 Page Thumbnail | `page-thumbnail.tsx` | Page tool grid tile: Default / Current / Selected, Portrait / Landscape, select mode checkbox on a plate, bookmark. |
| 🆕 Member Item | `member-item.tsx` | People / access lists: More · Permission · Label · Actions (inline / below) · None; Selected = check circle + bg-accent. |
| 🆕 Outline Item | `outline-item.tsx` | Outline sheet row: Default / Edit (checkbox + handle), Expand None / Collapsed / Expanded, depth indent pl-6. |
| 🆕 Annotation Selection | `annotation-selection.tsx` | Selection frame (base/pdf → `pdf` color): 8 resize handles + rotate handle (Top/Right/Bottom/Left); `onChange` = drag to move / resize. |
| 🆕 Form Field | `form-field.tsx` (+ `TextTPlusIcon`, `SignatureInk`) | Fields on the page: Text / Signature / Checkbox / Radio × Build / Empty / Filled. |
| 🆕 Comment Item | `comment-item.tsx` | Card (list) / Detail (thread), Resolved, `showResolve` off on replies. |
| 🆕 Signature | `signature-item.tsx`, `signature-validation.tsx` | Saved signatures (Draw / Type / Image / Failed × Default / Edit / Delete) + certificate entries (Valid / Invalid, expandable). "Type" uses Great Vibes (web: Google Fonts). |
| 🆕 Hint | `hint.tsx` | One-line guidance under the top bar: Info / Neutral × Full / Compact, optional action + dismiss. |
| 🆕 Notification Item | `notification-item.tsx` | Unread / Read × Avatar / Icon, optional Decline / Accept. |
| ✏️ Document Item | `document-item.tsx` | + select mode (`selectable`, `selected`, `onLongPress`) and upload queue (`upload`: queued / uploading / processing / uploaded / failed). |
| ✏️ Toolbar | `toolbar.tsx` | + `ToolbarAction` (Type=Actions), `ToolbarPlayer`, `ToolbarSearch`; `ToolbarTools showClose={false}`; `styleColor={null}` = Color Swatch None (object selected). |
| ✏️ App Bar | `app-bar.tsx` | + `AppBarCentered` (title centred on the bar), `AppBarTextButton` (Leading / Trailing action = Text), `AppBarFileTitle` (Viewer title, Tablet only). |

Tokens: `page-thumbnail/*`, `member-item/*`, `outline-item/*`, `annotation-selection/*`, `form-field/*`, `comment-item/*`, `signature-item/*`, `signature-validation/*`, `hint/*`, `notification-item/*` + new `document-item/*`, `toolbar/*`, `app-bar/viewer-show-title` in 5. Component. New theme color `--pdf` (3. Mode › base/pdf, light #3b82f6 / dark #bfdbfe) for the selection frame. Status glyphs use Tailwind green-600 / amber-600 (approved exception).

## M3 / Apple HIG gap batch (Oct 2026, ◆ Custom)

Checked the Material 3 component list (m3.material.io/components) and the Apple HIG components (iOS / iPadOS) against this library. Built the 8 gaps that matter for a mobile PDF app; Button Group, Carousel, Combobox, Menubar, Sidebar and Charts stay dropped for v1, split button was rejected in the Toolbar research, and system experiences (widgets, Live Activities…) are out of scope.

| Figma page (core section) | Code (`packages/registry/src/nativewind/components/ui/`) | Notes |
| --- | --- | --- |
| ◆ FAB (FAB, FAB Menu / Item, FAB Menu) | `fab.tsx` — `Fab`, `FabMenu`, `FabMenuItem` | M3. Circle / pill (like the Nav Bar Upload FAB). Default / Secondary / Glass; Medium 80; Extended with `label`. Caller positions it. |
| ◆ Navigation Rail | `navigation-rail.tsx` — `NavigationRail`, `NavigationRailItem` | M3 collapsed rail, w-20, same tabs as Nav Bar. (recommendation) wide windows only. |
| ◆ Action Sheet | `action-sheet.tsx` — `ActionSheet`, `ActionSheetAction` | Built on Drawer. `type="confirm"` (HIG, Buttons, destructive first) / `"menu"` (M3 list, destructive last). |
| ◆ Stepper | `stepper.tsx` — `Stepper` | HIG. `type="default"` shows the value (◆), `"compact"` = UIStepper look. Long-press repeats. |
| ◆ Time Picker | `time-picker.tsx` — `TimePicker`, `TimePickerTrigger` (+ web replicas `time-picker-replica.tsx`) | Native like Date Picker: Android M3 time dialog (dial), iOS wheels (`display="spinner"`) in Drawer or `iosDisplay="compact"`. Web follows the iOS \| Android switch (`native: true`). |
| ◆ Circular Progress | `circular-progress.tsx` — `CircularProgress` | Determinate ring (react-native-svg): sm 24 / default 40 / lg 64 + label. Indeterminate stays Spinner. |
| ◆ Page Control | `page-control.tsx` — `PageControl` | HIG dots; current = pill (◆). Minimal / Prominent (glass). |
| ◆ Chip (Assist Chip, Input Chip) | `chip.tsx` — `Chip`, `ChipGroup` | M3 assist / input chips (Filter Chip already exists). Input chip remove = sibling button. |

Figma tokens: `fab/*`, `fab-menu/*`, `nav-rail/*`, `action-sheet/*`, `stepper/*`, `time-picker/*`, `circular-progress/*`, `page-control/*`, `chip/*` in 5. Component (129 new). Previews: `examples/<slug>.tsx`.

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

The picker is native (`@react-native-community/datetimepicker`): Android opens the Material 3 modal date picker (`design: 'material'`), iOS shows `display="inline"` inside the ◆ Drawer (`iosDisplay="inline"`, default) or the system pill + popover (`iosDisplay="compact"`, Figma "Display=Compact (system)"; no Trigger, always shows a date).

The web preview draws **replicas** of those system pickers (`date-picker-replica.tsx`, web only), picked by the iOS | Android switch:

- iOS — inline calendar in the Drawer (SF font, iOS colors; selected = solid label circle, today = tint on light tint, as in the Apple kit; "Month Year ›" opens the month/year wheel) and the compact pill + popover (each tap sets the value, tap outside closes).
- Android — Material 3 modal with the Lumin roles from `withLuminAndroidTheme` (not M3 purple), Roboto: Cancel / OK, "Month Year ▾" year grid, pencil → text input (mm/dd/yyyy, "Invalid format." / "Out of range.").

Previews: Trigger · State (both) · iOS · Display=Inline in Drawer · iOS · Display=Compact (system) · Android · Material 3 modal.

Android needs `plugins/withLuminAndroidTheme.js` (registered in `app.config.ts`): it switches `AppTheme` to `Theme.Material3.DayNight.NoActionBar` and maps the M3 color roles to Lumin light/dark tokens. Without it the M3 dialog crashes natively. It is native config, so run `pnpm prebuild:android` / rebuild the dev client — Expo Go and OTA updates won't pick it up. `androidDesign="default"` falls back to the legacy dialog.

## Run

```sh
pnpm install
cd apps/showcase
npx expo start --web      # local preview
npx expo export -p web    # static build (what Vercel runs)
```

Push to `main` redeploys the Vercel project `pdf-mobile-ds-preview`.
