/**
 * RNR Card + ◆ Lumin deltas (Figma: PDF-Mobile-DS › Card, tokens card/*):
 * 1. size="sm" — Lumin-only: py-4 gap-4, sections px-4.
 * 2. CardAction (header action slot) and CardImage (top image) — Lumin-only.
 * 3. Spacing follows RNR: py-6 gap-6 rounded-xl, sections px-6.
 * 4. No shadow (RNR adds shadow-sm shadow-black/5).
 */
import { Text, TextClassContext } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { Image, View } from 'react-native';

type CardSize = 'default' | 'sm';
const CardSizeContext = React.createContext<CardSize>('default');
const px = (size: CardSize) => (size === 'sm' ? 'px-4' : 'px-6');

function Card({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View> & { size?: CardSize }) {
  return (
    <CardSizeContext.Provider value={size}>
      <TextClassContext.Provider value="text-card-foreground">
        <View
          className={cn(
            'bg-card border-border flex flex-col overflow-hidden rounded-xl border',
            size === 'sm' ? 'gap-4 py-4' : 'gap-6 py-6',
            className
          )}
          {...props}
        />
      </TextClassContext.Provider>
    </CardSizeContext.Provider>
  );
}

/** ◆ Lumin: full-bleed top image. Put it first; pass className="-mt-6" (sm: "-mt-4") to touch the top edge. */
function CardImage({ className, ...props }: React.ComponentProps<typeof Image>) {
  return <Image className={cn('aspect-video w-full', className)} resizeMode="cover" {...props} />;
}

function CardHeader({ className, children, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  const size = React.useContext(CardSizeContext);
  const items = React.Children.toArray(children);
  const action = items.find((c) => React.isValidElement(c) && c.type === CardAction);
  if (!action) {
    return (
      <View className={cn('flex flex-col gap-1.5', px(size), className)} {...props}>
        {children}
      </View>
    );
  }
  // ◆ Lumin: title/description column + action on the right (card/card-header/gap = gap-2)
  return (
    <View className={cn('flex flex-row items-start gap-2', px(size), className)} {...props}>
      <View className="flex flex-1 flex-col gap-1.5">{items.filter((c) => c !== action)}</View>
      {action}
    </View>
  );
}

/** ◆ Lumin: header action slot (top-right). */
function CardAction({ className, ...props }: React.ComponentProps<typeof View>) {
  return <View className={cn('shrink-0 self-start', className)} {...props} />;
}

function CardTitle({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  return (
    <Text
      ref={ref}
      role="heading"
      aria-level={3}
      className={cn('font-semibold leading-none', className)}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  return <Text className={cn('text-muted-foreground text-sm', className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  const size = React.useContext(CardSizeContext);
  return <View className={cn(px(size), className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  const size = React.useContext(CardSizeContext);
  return <View className={cn('flex flex-row items-center gap-2', px(size), className)} {...props} />;
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
};
