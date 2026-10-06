/**
 * ◆ Lumin icons that Phosphor does not ship (lm-* in the web Tool icon table, LPA-001 › node 2221-2).
 * Same 256 grid and 16-unit stroke as Phosphor "regular", so they sit next to Phosphor icons.
 * Use with <Icon as={TextAStrikethroughIcon} className="size-5" />.
 */
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

type LuminIconProps = { size?: number | string; color?: string; style?: unknown };

const A_GLYPH =
  'M60.59 175.24a8 8 0 0 0 10.65-3.83L87.9 136h80.2l16.66 35.41a8 8 0 1 0 14.48-6.82l-64-136a8 8 0 0 0-14.48 0l-64 136a8 8 0 0 0 3.83 10.65M128 50.79 160.57 120H95.43Z';

/** lm-text-a-strikethrough */
function TextAStrikethroughIcon({ size = 24, color = 'currentColor', style }: LuminIconProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Svg width={size} height={size} viewBox="0 0 256 256" fill={color} style={style as any}>
      <Path d={A_GLYPH} />
      <Path d="M40 96h176" stroke={color} strokeWidth={16} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/** lm-text-a-wavy-underline */
function TextAWavyUnderlineIcon({ size = 24, color = 'currentColor', style }: LuminIconProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Svg width={size} height={size} viewBox="0 0 256 256" fill={color} style={style as any}>
      <Path d={A_GLYPH} />
      <Path
        d="M40 216c14-14 30-14 44 0s30 14 44 0 30-14 44 0 30 14 44 0"
        stroke={color}
        strokeWidth={16}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export { TextAStrikethroughIcon, TextAWavyUnderlineIcon };
