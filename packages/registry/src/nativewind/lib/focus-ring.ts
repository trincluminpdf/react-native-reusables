/**
 * ◆ Lumin: focus ring on native, same as web (Figma: Input / Textarea / Select / Date Picker
 * "State=Focus"). RNR only draws rings on web (focus-visible:ring-[3px]).
 * Native uses the RN `outline*` style props (new architecture); web keeps the CSS classes.
 * Colors = ring/50 and destructive/20 (dark /40) from DS-shadcn-000 › 3. Mode.
 */
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform, type ViewStyle } from 'react-native';

const RING = { light: 'rgba(163,163,163,0.5)', dark: 'rgba(115,115,115,0.5)' } as const;
const RING_INVALID = { light: 'rgba(220,38,38,0.2)', dark: 'rgba(248,113,113,0.4)' } as const;

type FocusRingOptions = { invalid?: boolean; forceFocused?: boolean };

function useFocusRing({ invalid = false, forceFocused = false }: FocusRingOptions = {}) {
  const [focused, setFocused] = React.useState(false);
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'dark' : 'light';
  const isFocused = focused || forceFocused;

  const style: ViewStyle | undefined =
    Platform.OS !== 'web' && (isFocused || invalid)
      ? ({
          outlineWidth: 3,
          outlineStyle: 'solid',
          outlineOffset: 0,
          outlineColor: invalid ? RING_INVALID[scheme] : RING[scheme],
        } as ViewStyle)
      : undefined;

  const onFocus = React.useCallback(() => setFocused(true), []);
  const onBlur = React.useCallback(() => setFocused(false), []);

  return { focused: isFocused, style, onFocus, onBlur };
}

export { useFocusRing };
