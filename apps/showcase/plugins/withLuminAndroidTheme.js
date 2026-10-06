/**
 * ◆ Lumin — Android app theme for native (system) dialogs.
 *
 * Why: the ◆ Date Picker opens the Material 3 modal date picker on Android
 * (DateTimePickerAndroid.open({ design: 'material' })). MaterialDatePicker crashes natively unless the
 * Activity theme inherits Theme.Material3.*, and Expo's template theme is Theme.AppCompat.DayNight with
 * colorPrimary #023c69 — which is also why the legacy dialog showed a blue/teal header that matched
 * nothing in the DS.
 *
 * What: AppTheme parent → Theme.Material3.DayNight.NoActionBar, and the M3 color roles the picker (and
 * other system dialogs such as Alert.alert) read are mapped to Lumin DS-shadcn-000 › 3. Mode, light in
 * values/colors.xml and dark in values-night/colors.xml (DayNight follows nativewind setColorScheme via
 * Appearance.setColorScheme → AppCompatDelegate night mode).
 *
 * Native config: needs `expo prebuild` / a new dev build — not picked up by Expo Go or OTA updates.
 */
const {
  withAndroidColors,
  withAndroidColorsNight,
  withAndroidStyles,
  withAppBuildGradle,
  AndroidConfig,
} = require('expo/config-plugins');

const PARENT = 'Theme.Material3.DayNight.NoActionBar';
// Same version @react-native-community/datetimepicker 9.1 ships; declared on :app so the theme parent
// and the surface-container attrs resolve at resource-link time even if the library changes its deps.
const MATERIAL_DEP = "implementation 'com.google.android.material:material:1.12.0'";

// [theme attr, light, dark] — values mirror global.css (:root / .dark:root).
const ROLES = [
  ['colorPrimary', '#171717', '#e5e5e5'], // --primary
  ['colorOnPrimary', '#fafafa', '#171717'], // --primary-foreground
  ['colorPrimaryContainer', '#f5f5f5', '#262626'], // --secondary
  ['colorOnPrimaryContainer', '#171717', '#fafafa'],
  ['colorSecondary', '#171717', '#e5e5e5'],
  ['colorOnSecondary', '#fafafa', '#171717'],
  ['colorSecondaryContainer', '#f5f5f5', '#262626'], // range fill / chips
  ['colorOnSecondaryContainer', '#171717', '#fafafa'],
  ['colorAccent', '#171717', '#e5e5e5'], // legacy dialogs, cursor, selection handles
  ['colorControlActivated', '#171717', '#e5e5e5'],
  ['colorSurface', '#ffffff', '#0a0a0a'], // --background
  ['colorSurfaceContainerLow', '#ffffff', '#171717'],
  ['colorSurfaceContainer', '#ffffff', '#171717'],
  ['colorSurfaceContainerHigh', '#ffffff', '#171717'], // dialog bg = --popover
  ['colorSurfaceContainerHighest', '#f5f5f5', '#262626'], // --muted
  ['colorOnSurface', '#0a0a0a', '#fafafa'], // --foreground
  ['colorOnSurfaceVariant', '#737373', '#a3a3a3'], // --muted-foreground
  ['colorOutline', '#e5e5e5', '#2f2f2f'], // --input
  ['colorOutlineVariant', '#e5e5e5', '#232323'], // --border
  ['colorError', '#dc2626', '#f87171'], // --destructive
  ['colorOnError', '#fafafa', '#fafafa'],
];

const colorName = (attr) => `lumin_${attr}`;

function setColors(colors, index) {
  for (const role of ROLES) {
    colors = AndroidConfig.Colors.assignColorValue(colors, {
      name: colorName(role[0]),
      value: role[index],
    });
  }
  return colors;
}

const withLuminAndroidTheme = (config) => {
  config = withAndroidColors(config, (c) => {
    c.modResults = setColors(c.modResults, 1);
    return c;
  });
  config = withAndroidColorsNight(config, (c) => {
    c.modResults = setColors(c.modResults, 2);
    return c;
  });
  config = withAndroidStyles(config, (c) => {
    const styles = c.modResults.resources.style ?? [];
    const appTheme = styles.find((s) => s.$.name === 'AppTheme');
    if (appTheme) appTheme.$.parent = PARENT;
    let res = c.modResults;
    for (const [attr] of ROLES) {
      res = AndroidConfig.Styles.assignStylesValue(res, {
        add: true,
        parent: { name: 'AppTheme', parent: PARENT },
        name: attr,
        value: `@color/${colorName(attr)}`,
      });
    }
    c.modResults = res;
    return c;
  });
  config = withAppBuildGradle(config, (c) => {
    if (!c.modResults.contents.includes('com.google.android.material:material')) {
      c.modResults.contents = c.modResults.contents.replace(
        /dependencies\s*\{/,
        (m) => `${m}\n    ${MATERIAL_DEP} // ◆ withLuminAndroidTheme`
      );
    }
    return c;
  });
  return config;
};

module.exports = withLuminAndroidTheme;
