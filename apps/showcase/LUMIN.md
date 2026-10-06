# Lumin PDF Mobile DS — live preview

Live: https://lumin-pdf-mobile-ds.vercel.app · Design source: [PDF-Mobile-DS (Figma)](https://www.figma.com/design/EotlK1nCd33Udubm5PcZQt/PDF-Mobile-DS)

Figma is the documentation, this app is the running preview. Every component page here links to its Figma page (top-right "Figma ↗"), and every preview is named after the Figma variant properties (e.g. `Variant=PDF`, `Size=sm ◆`).

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

## Status (same chip as Figma)

- **RNR** — straight from react-native-reusables.
- **◆ RNR + Custom** — RNR plus Lumin deltas (e.g. Button `pdf` variant, soft destructive, `loading`, no shadows, focus ring on native).
- **◆ Custom** — not in RNR; Lumin builds it (Drawer, Sheet, Field, Item, Empty, Input Group, Input OTP, Slider, Sonner, Spinner, Date Picker).
- **◆ New** — designed fresh for mobile (Calendar, Fullscreen Modal).

## Tokens

Values come from DS-shadcn-000 › `3. Mode` (Light / Dark) and `1. TailwindCSS`. The mobile component layer (`5. Component`) in Figma stores the NativeWind classes in each variable's code syntax, so a token like `button/pdf/bg` reads `bg-blue-500 dark:bg-blue-600` — the same classes used in code. Sizes follow RNR: base classes on phones, `sm:` on Tablet (window ≥ 640).

Dark `--border` / `--input` are white 10% / 15% in Figma; they are flattened over the background here because Tailwind opacity modifiers need opaque HSL variables.

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
