import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const { NAME, SLUG } = getConfig();

  return {
    ...config,
    name: NAME,
    slug: SLUG,
    version: '0.0.3',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      url: 'https://u.expo.dev/ceb86f7d-1fed-4feb-98cb-2f2ba6223741',
    },
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#0A0A0A',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      scheme: SLUG,
      supportsTablet: true,
      bundleIdentifier: 'com.reactnativereusables.app',
      associatedDomains: ['applinks:reactnativereusables.com'],
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      scheme: `${SLUG}android`,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#0A0A0A',
      },
      package: 'com.reactnativereusables.android',
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: 'reactnativereusables.com',
              pathPrefix: '/showcase/links',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      // ◆ Material 3 app theme + Lumin colors for native dialogs (Date Picker). Rebuild dev client.
      './plugins/withLuminAndroidTheme',
      [
        'expo-font',
        {
          fonts: [
            '../../node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf',
            '../../node_modules/@expo-google-fonts/inter/800ExtraBold/Inter_800ExtraBold.ttf',
            '../../node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf',
            '../../node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf',
            '../../node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf',
            '../../node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf',
            '../../node_modules/@expo-google-fonts/inter/300Light/Inter_300Light.ttf',
            '../../node_modules/@expo-google-fonts/inter/200ExtraLight/Inter_200ExtraLight.ttf',
            '../../node_modules/@expo-google-fonts/inter/100Thin/Inter_100Thin.ttf',
            '../../node_modules/@expo-google-fonts/jetbrains-mono/400Regular/JetBrainsMono_400Regular.ttf',
          ],
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: 'ceb86f7d-1fed-4feb-98cb-2f2ba6223741',
      },
    },
  };
};

function getConfig() {
  const IS_DEV = process.env.ENV === 'development';

  const NAME = IS_DEV ? 'Dev React Native Reusables' : 'React Native Reusables';
  const SLUG = IS_DEV ? 'devreactnativereusablesshowcase' : 'reactnativereusablesshowcase';

  return { NAME, SLUG };
}
