/**
 * ◆ Lumin in-app — Document Item. Figma: PDF-Mobile-DS › ◆ Document Item (Layout=List / Grid × State=Default /
 * Pressed / Selectable / Selected / Queued / Uploading / Processing / Uploaded / Failed; Starred, Show date,
 * Source icon, Upload status, Error message, Show retry).
 * Tokens: 5. Component › document-item/*.
 * List: px-4 py-3 gap-3, bottom border · thumb size-10 rounded-md bg-muted border, file icon size-5 ·
 *   text gap-0.5: title text-base font-medium (1 line), meta gap-1: source icon size-4 · owner · "·" · date (text-xs muted) ·
 *   More = Button Ghost icon.
 * Grid: column gap-2 · thumb aspect 4:3 rounded-xl · title text-sm font-medium + date only (owner hidden so the meta never wraps).
 * Pressed tints the whole row (bg-accent); More is a sibling button (no button inside a button). Starred = ph-star-fill size-4 text-yellow-400 on the thumb corner.
 * ✏️ LPM source batch (Oct 2026):
 * - Select mode (`selectable`): long-press enters it (caller), then a tap anywhere toggles (`onPress`). List = Checkbox
 *   leads the row, trailing slot empty (actions live in Toolbar Type=Actions), Selected row = bg-accent. Grid = Checkbox
 *   on a bg-background plate (rounded-sm p-0.5) inset p-2 over the thumbnail, Selected = thumbnail border-2 primary.
 *   Each row / tile is a checkbox for assistive tech; the count + Select all + X live in the App Bar.
 * - Upload queue (List, `upload`): Queued "Waiting…" + empty track + Cancel · Uploading determinate Progress h-2 +
 *   "3 MB of 6 MB · 50%" + Cancel · Processing "Compressing…" + indeterminate bar (a 30% segment through the same
 *   track) · Uploaded = transient green-600 check in a size-6 green-500/10 chip + "Uploaded" · Failed = error text-xs
 *   text-destructive + Retry (only when retryable) + Remove. Status changes are a polite live region.
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { Checkbox } from '@/registry/nativewind/components/ui/checkbox';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Progress } from '@/registry/nativewind/components/ui/progress';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import {
  ArrowClockwiseIcon,
  CheckIcon,
  DotsThreeIcon,
  FileTextIcon,
  StarIcon,
  UserIcon,
  XIcon,
} from 'phosphor-react-native';
import * as React from 'react';
import {
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  View,
  type ImageSourcePropType,
} from 'react-native';

type DocumentUpload =
  | { state: 'queued'; offline?: boolean; onCancel?: () => void }
  | { state: 'uploading'; progress: number; status: string; onCancel?: () => void }
  | { state: 'processing'; status?: string; onCancel?: () => void }
  | { state: 'uploaded' }
  | {
      state: 'failed';
      error: string;
      /** Show retry — only when the error is retryable (network), not for too large / unsupported. */
      retryable?: boolean;
      onRetry?: () => void;
      onRemove?: () => void;
    };

type DocumentItemProps = {
  title: string;
  owner?: string;
  date?: string;
  starred?: boolean;
  layout?: 'list' | 'grid';
  /** Source of the file (owner / Drive / Dropbox …). Default ph-user. */
  sourceIcon?: React.ComponentProps<typeof Icon>['as'];
  thumbnail?: ImageSourcePropType;
  onPress?: () => void;
  /** Long-press enters select mode (caller sets `selectable`). */
  onLongPress?: () => void;
  onMorePress?: () => void;
  /** Select mode: State=Selectable / Selected. A tap (`onPress`) toggles. */
  selectable?: boolean;
  selected?: boolean;
  /** Upload queue state (List only). */
  upload?: DocumentUpload;
  /** Hide the bottom divider (last row). List only. */
  last?: boolean;
  className?: string;
};

/** Visible checkbox is decoration — the row / tile itself is the checkbox (no control inside a control). */
function SelectMark({ checked }: { checked: boolean }) {
  return (
    <View
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden>
      <Checkbox checked={checked} onCheckedChange={() => {}} tabIndex={-1} />
    </View>
  );
}

function Thumb({
  thumbnail,
  starred,
  grid,
  selectable,
  selected,
}: {
  thumbnail?: ImageSourcePropType;
  starred?: boolean;
  grid?: boolean;
  selectable?: boolean;
  selected?: boolean;
}) {
  return (
    <View
      className={cn(
        'bg-muted border-border items-center justify-center overflow-visible border',
        grid ? 'aspect-[4/3] w-full rounded-xl' : 'size-10 rounded-md',
        grid && selected && 'border-primary border-2'
      )}>
      {thumbnail ? (
        <Image
          source={thumbnail}
          className={cn('size-full', grid ? 'rounded-xl' : 'rounded-md')}
          resizeMode="cover"
        />
      ) : (
        <Icon as={FileTextIcon} className="text-muted-foreground size-5" />
      )}
      {starred && !(grid && selectable) ? (
        <View className={cn('absolute', grid ? 'left-2 top-2' : '-left-1 -top-1')}>
          <Icon as={StarIcon} weight="fill" className="size-4 text-yellow-400" />
        </View>
      ) : null}
      {grid && selectable ? (
        <View className="bg-background absolute left-2 top-2 rounded-sm p-0.5">
          <SelectMark checked={!!selected} />
        </View>
      ) : null}
    </View>
  );
}

/** Indeterminate bar: a 30% segment moving through the Progress track (State=Processing). */
function IndeterminateBar() {
  const [width, setWidth] = React.useState(0);
  const t = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    loop.start();
    return () => loop.stop();
  }, [t]);
  const seg = width * 0.3;
  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      className="bg-primary/20 h-2 w-full overflow-hidden rounded-full">
      {width ? (
        <Animated.View
          className="bg-primary h-full rounded-full"
          style={{
            width: seg,
            transform: [
              { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [-seg, width] }) },
            ],
          }}
        />
      ) : null}
    </View>
  );
}

function UploadBody({ upload }: { upload: DocumentUpload }) {
  switch (upload.state) {
    case 'queued':
      return (
        <>
          <Progress value={0} className="h-2" />
          <Text className="text-muted-foreground text-xs">
            {upload.offline ? 'Waiting for connection' : 'Waiting…'}
          </Text>
        </>
      );
    case 'uploading':
      return (
        <>
          <Progress value={upload.progress} className="h-2" />
          <Text numberOfLines={1} className="text-muted-foreground text-xs">
            {upload.status}
          </Text>
        </>
      );
    case 'processing':
      return (
        <>
          <IndeterminateBar />
          <Text className="text-muted-foreground text-xs">{upload.status ?? 'Compressing…'}</Text>
        </>
      );
    case 'uploaded':
      return <Text className="text-muted-foreground text-xs">Uploaded</Text>;
    case 'failed':
      return (
        <Text numberOfLines={2} className="text-destructive text-xs">
          {upload.error}
        </Text>
      );
  }
}

function uploadLabel(upload: DocumentUpload) {
  switch (upload.state) {
    case 'queued':
      return upload.offline ? 'waiting for connection' : 'waiting to upload';
    case 'uploading':
      return `uploading, ${upload.status}`;
    case 'processing':
      return upload.status ?? 'compressing';
    case 'uploaded':
      return 'uploaded';
    case 'failed':
      return `upload failed. ${upload.error}`;
  }
}

function GhostIcon({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Icon>['as'];
  label: string;
  onPress?: () => void;
}) {
  return (
    <Button variant="ghost" size="icon" onPress={onPress} accessibilityLabel={label}>
      <Icon as={icon} className="text-foreground size-5" />
    </Button>
  );
}

function UploadTrailing({ upload, title }: { upload: DocumentUpload; title: string }) {
  if (upload.state === 'uploaded') {
    return (
      <View className="size-10 items-center justify-center">
        <View className="size-6 items-center justify-center rounded-full bg-green-500/10">
          <Icon as={CheckIcon} weight="bold" className="size-4 text-green-600" />
        </View>
      </View>
    );
  }
  if (upload.state === 'failed') {
    return (
      <View className="flex-row">
        {upload.retryable ? (
          <GhostIcon icon={ArrowClockwiseIcon} label={`Retry ${title}`} onPress={upload.onRetry} />
        ) : null}
        <GhostIcon icon={XIcon} label={`Remove ${title}`} onPress={upload.onRemove} />
      </View>
    );
  }
  return <GhostIcon icon={XIcon} label={`Cancel upload of ${title}`} onPress={upload.onCancel} />;
}

function DocumentItem({
  title,
  owner,
  date,
  starred,
  layout = 'list',
  sourceIcon = UserIcon,
  thumbnail,
  onPress,
  onLongPress,
  onMorePress,
  selectable,
  selected,
  upload,
  last,
  className,
}: DocumentItemProps) {
  // Row = tappable area + separate More button (no button-in-button); pressed tints the whole row.
  const [pressed, setPressed] = React.useState(false);
  const pressHandlers = {
    onPress,
    onLongPress,
    // Select mode has no Pressed state (a tap toggles, the selected fill is the feedback).
    onPressIn: selectable ? undefined : () => setPressed(true),
    onPressOut: selectable ? undefined : () => setPressed(false),
  };
  const checkboxA11y = selectable
    ? ({
        accessibilityRole: 'checkbox',
        accessibilityState: { checked: !!selected },
        'aria-checked': !!selected,
      } as const)
    : ({ accessibilityRole: 'button' } as const);
  const more = (
    <Button
      variant="ghost"
      size="icon"
      onPress={onMorePress}
      accessibilityLabel={`More actions for ${title}`}>
      <Icon as={DotsThreeIcon} weight="bold" className="text-foreground size-5" />
    </Button>
  );

  if (layout === 'grid') {
    return (
      <View className={cn('flex-1 gap-2 rounded-xl', pressed && 'bg-accent', className)}>
        <Pressable
          {...pressHandlers}
          {...checkboxA11y}
          accessibilityLabel={[title, starred ? 'starred' : null, date].filter(Boolean).join(', ')}>
          <Thumb
            thumbnail={thumbnail}
            starred={starred}
            grid
            selectable={selectable}
            selected={selected}
          />
        </Pressable>
        <View className="min-h-10 flex-row items-center gap-1">
          <Pressable
            {...pressHandlers}
            importantForAccessibility="no"
            accessibilityElementsHidden
            className="min-w-0 flex-1 gap-0.5 pl-0.5">
            <Text numberOfLines={1} className="text-foreground text-sm font-medium">
              {title}
            </Text>
            {date ? (
              <Text numberOfLines={1} className="text-muted-foreground text-xs">
                {date}
              </Text>
            ) : null}
          </Pressable>
          {selectable ? null : more}
        </View>
      </View>
    );
  }

  return (
    <View
      className={cn(
        'flex-row items-center gap-3 pr-4',
        (pressed || (selectable && selected)) && 'bg-accent',
        !last && 'border-border border-b',
        className
      )}>
      <Pressable
        {...pressHandlers}
        {...checkboxA11y}
        disabled={!!upload && !onPress}
        accessibilityLabel={[
          title,
          starred ? 'starred' : null,
          upload ? uploadLabel(upload) : owner,
          upload ? null : date,
        ]
          .filter(Boolean)
          .join(', ')}
        className="min-w-0 flex-1 flex-row items-center gap-3 py-3 pl-4">
        {selectable ? <SelectMark checked={!!selected} /> : null}
        <Thumb thumbnail={thumbnail} starred={starred} />
        <View className={cn('min-w-0 flex-1', upload ? 'gap-1.5' : 'gap-0.5')}>
          <Text numberOfLines={1} className="text-foreground text-base font-medium">
            {title}
          </Text>
          {upload ? (
            <View className="gap-1.5" aria-live="polite" accessibilityLiveRegion="polite">
              <UploadBody upload={upload} />
            </View>
          ) : (
            <View className="flex-row items-center gap-1">
              <Icon as={sourceIcon} className="text-muted-foreground size-4 shrink-0" />
              {owner ? (
                <Text numberOfLines={1} className="text-muted-foreground shrink text-xs">
                  {owner}
                </Text>
              ) : null}
              {owner && date ? <Text className="text-muted-foreground text-xs">·</Text> : null}
              {date ? (
                <Text numberOfLines={1} className="text-muted-foreground text-xs">
                  {date}
                </Text>
              ) : null}
            </View>
          )}
        </View>
      </Pressable>
      {upload ? <UploadTrailing upload={upload} title={title} /> : selectable ? null : more}
    </View>
  );
}

export { DocumentItem };
export type { DocumentItemProps, DocumentUpload };
