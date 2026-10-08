/**
 * ◆ Lumin in-app (LPM batch) — Signature Item. Figma: PDF-Mobile-DS › 🆕 Signature
 * (Signature Item: Type=Draw / Type / Image / Failed × Mode=Default / Edit / Delete).
 * Tokens: 5. Component › signature-item/* — bg-muted rounded-lg h-20 px-4 py-3 gap-3 · preview h-14 flex-1
 * (object-contain, centered) · ink text-foreground · image plate bg-background rounded-sm · icon size-6 ·
 * remove text-destructive · handle text-muted-foreground · error text-destructive gap-1.
 * One saved signature in the Signature sheet: tap to place it.
 * - Draw = ink vector (◆ SignatureInk from form-field). Type = name in "Great Vibes" 36 (web: Google Font loaded
 *   once via <link>; native: italic serif fallback). Image = uploaded image on a plate (ink as stand-in when no
 *   `image`). Failed = ph-warning-circle size-6 + "Failed to load signature" text-xs, both text-destructive.
 * - Mode=Edit: leading remove (ph-minus-circle fill, text-destructive) + trailing drag handle (ph-list,
 *   text-muted-foreground), both size-6 with a 44 hit area. Mode=Delete: trailing Button destructive "Delete"
 *   replaces the handle (remove stays, tap it again to cancel). Swipe-to-reveal is the list's job.
 * The preview is the tappable area; remove / handle / Delete are siblings (no button in a button);
 * pressed tints the whole row (bg-input).
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { SignatureInk } from '@/registry/nativewind/components/ui/form-field';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { ListIcon, MinusCircleIcon, WarningCircleIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Image, Platform, Pressable, View, type ImageSourcePropType } from 'react-native';

type SignatureItemProps = {
  type: 'draw' | 'type' | 'image' | 'failed';
  /** Type=Type: the typed name. Default "Alex Morgan". */
  name?: string;
  /** Type=Image: the uploaded image (falls back to the demo ink). */
  image?: ImageSourcePropType;
  mode?: 'default' | 'edit' | 'delete';
  /** Tap the signature (place it on the page). */
  onPress?: () => void;
  /** Edit / Delete: the leading remove control (reveal / hide Delete). */
  onRemovePress?: () => void;
  /** Delete: the Delete button. */
  onDeletePress?: () => void;
  className?: string;
};

const GREAT_VIBES_ID = 'lumin-ds-great-vibes';

/** Web: load "Great Vibes" once (same pattern as loadRoboto in the showcase). */
function loadGreatVibes() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  if (document.getElementById(GREAT_VIBES_ID)) return;
  const link = document.createElement('link');
  link.id = GREAT_VIBES_ID;
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap';
  document.head.appendChild(link);
}

const SCRIPT_FONT = Platform.select({
  web: { fontFamily: "'Great Vibes', cursive" },
  ios: { fontFamily: 'Georgia', fontStyle: 'italic' as const },
  default: { fontFamily: 'serif', fontStyle: 'italic' as const },
});

const A11Y_LABEL: Record<SignatureItemProps['type'], string> = {
  draw: 'Drawn signature',
  type: 'Typed signature',
  image: 'Signature image',
  failed: 'Failed to load signature',
};

function Preview({ type, name, image }: Pick<SignatureItemProps, 'type' | 'name' | 'image'>) {
  React.useEffect(() => {
    if (type === 'type') loadGreatVibes();
  }, [type]);

  switch (type) {
    case 'draw':
      return <SignatureInk width="100%" height="100%" />;
    case 'type':
      return (
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          className="text-foreground text-[36px]"
          style={SCRIPT_FONT}>
          {name}
        </Text>
      );
    case 'image':
      return (
        <View className="bg-background h-14 w-44 max-w-full items-center justify-center overflow-hidden rounded-sm p-1">
          {image ? (
            <Image source={image} resizeMode="contain" className="size-full" />
          ) : (
            <SignatureInk width="100%" height="100%" />
          )}
        </View>
      );
    default:
      return (
        <View className="items-center gap-1">
          <Icon as={WarningCircleIcon} className="text-destructive size-6" />
          <Text className="text-destructive text-xs">Failed to load signature</Text>
        </View>
      );
  }
}

function SignatureItem({
  type,
  name = 'Alex Morgan',
  image,
  mode = 'default',
  onPress,
  onRemovePress,
  onDeletePress,
  className,
}: SignatureItemProps) {
  const [pressed, setPressed] = React.useState(false);
  const editing = mode !== 'default';

  return (
    <View
      className={cn(
        'bg-muted h-20 flex-row items-center gap-3 rounded-lg px-4 py-3',
        pressed && 'bg-input',
        className
      )}>
      {editing ? (
        <Pressable
          onPress={onRemovePress}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={mode === 'delete' ? 'Cancel delete' : 'Remove signature'}
          className="shrink-0 active:opacity-60">
          <Icon as={MinusCircleIcon} weight="fill" className="text-destructive size-6" />
        </Pressable>
      ) : null}
      <Pressable
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole="button"
        accessibilityLabel={type === 'type' ? `${A11Y_LABEL.type}, ${name}` : A11Y_LABEL[type]}
        className="h-14 min-w-0 flex-1 items-center justify-center">
        <Preview type={type} name={name} image={image} />
      </Pressable>
      {mode === 'edit' ? (
        <View
          hitSlop={10}
          accessible
          accessibilityLabel="Reorder"
          accessibilityHint="Drag to reorder"
          className="shrink-0">
          <Icon as={ListIcon} className="text-muted-foreground size-6" />
        </View>
      ) : null}
      {mode === 'delete' ? (
        <Button variant="destructive" onPress={onDeletePress} className="shrink-0">
          <Text>Delete</Text>
        </Button>
      ) : null}
    </View>
  );
}

export { SignatureItem };
export type { SignatureItemProps };
