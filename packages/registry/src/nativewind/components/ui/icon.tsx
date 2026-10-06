import { TextClassContext } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { Platform } from 'react-native';

/**
 * ◆ Lumin: icons are Phosphor (DS-002 Assets, weight Regular) — `phosphor-react-native`.
 * Lucide icons still work (RNR examples/blocks use them); any component taking
 * `size` + `color` can be passed as `as`.
 */
type IconComponent = React.ComponentType<{
  size?: number | string;
  color?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}>;

type IconProps = {
  as: IconComponent;
  className?: string;
  size?: number;
  color?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

function IconImpl({ as: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}

cssInterop(IconImpl, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      height: 'size',
      width: 'size',
      // Phosphor reads `color` (not style.color) on native.
      color: 'color',
    },
  },
});

/**
 * A wrapper for Phosphor / Lucide icons with Nativewind `className` support via `cssInterop`.
 *
 * @example
 * ```tsx
 * import { ArrowRightIcon } from 'phosphor-react-native';
 * <Icon as={ArrowRightIcon} className="text-muted-foreground size-4" />
 * ```
 *
 * @param as - The icon component to render.
 * @param className - Utility classes (text color, size-*).
 * @param size - Icon size (defaults to 14 = RNR / Lumin Button icon size).
 */
function Icon({ as: IconComponent, className, size = 14, ...props }: IconProps) {
  const textClass = React.useContext(TextClassContext);
  return (
    <IconImpl
      as={IconComponent}
      className={cn('text-foreground', textClass, className)}
      size={size}
      // On web the svg inherits CSS `color` from className; Phosphor defaults to #000 otherwise.
      color={Platform.OS === 'web' ? 'currentColor' : undefined}
      {...props}
    />
  );
}

export { Icon };
export type { IconComponent, IconProps };
