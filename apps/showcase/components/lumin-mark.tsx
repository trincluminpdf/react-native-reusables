import { LUMIN_MARK_PATH, LUMIN_MARK_VIEWBOX } from '@showcase/lib/lumin-mark';
import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

/** ◆ Lumin mark (Figma LPA-001 › V3d). Square; `size` = width = height. */
function LuminMark({ size = 48, color = '#000000' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox={LUMIN_MARK_VIEWBOX} accessibilityLabel="Lumin">
      <Path d={LUMIN_MARK_PATH} fill={color} />
    </Svg>
  );
}

export { LuminMark };
