/**
 * ◆ Lumin custom — not in RNR. Figma: PDF-Mobile-DS › ◆ Sonner. Tokens: 5. Component › sonner/*
 * Toast with icon (Success / Error / Info / Warning / Loading), title, description, action / cancel.
 * Mount <Toaster /> once near the app root, then call toast('Title', { description, action }).
 * sonner-native is a drop-in alternative with the same API shape.
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon, type IconComponent } from '@/registry/nativewind/components/ui/icon';
import { Spinner } from '@/registry/nativewind/components/ui/spinner';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
} from 'phosphor-react-native';
import * as React from 'react';
import { Animated, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'default' | 'success' | 'error' | 'info' | 'warning' | 'loading';
type ToastAction = { label: string; onPress?: () => void };
type ToastOptions = {
  description?: string;
  action?: ToastAction;
  cancel?: ToastAction;
  duration?: number;
  id?: string;
};
type ToastItem = ToastOptions & { id: string; title: string; type: ToastType };

let items: ToastItem[] = [];
const listeners = new Set<(t: ToastItem[]) => void>();
const emit = () => listeners.forEach((l) => l(items));
let counter = 0;

function show(type: ToastType, title: string, opts: ToastOptions = {}) {
  const id = opts.id ?? String(++counter);
  items = [{ ...opts, id, title, type }, ...items.filter((t) => t.id !== id)].slice(0, 3);
  emit();
  return id;
}

function dismiss(id?: string) {
  items = id ? items.filter((t) => t.id !== id) : [];
  emit();
}

const toast = Object.assign((title: string, opts?: ToastOptions) => show('default', title, opts), {
  success: (title: string, opts?: ToastOptions) => show('success', title, opts),
  error: (title: string, opts?: ToastOptions) => show('error', title, opts),
  info: (title: string, opts?: ToastOptions) => show('info', title, opts),
  warning: (title: string, opts?: ToastOptions) => show('warning', title, opts),
  loading: (title: string, opts?: ToastOptions) => show('loading', title, opts),
  dismiss,
});

const ICONS: Partial<Record<ToastType, IconComponent>> = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InfoIcon,
  warning: WarningIcon,
};

/** Static toast surface (also used by the Toaster). p-4 gap-2 rounded-md border bg-popover. */
function Toast({
  title,
  description,
  type = 'default',
  action,
  cancel,
  onDismiss,
  className,
}: Omit<ToastItem, 'id' | 'type'> & { type?: ToastType; onDismiss?: () => void; className?: string }) {
  const icon = ICONS[type];
  return (
    <View
      role="status"
      className={cn(
        'bg-popover border-border w-full max-w-sm flex-row items-center gap-2 rounded-md border p-4 shadow-lg shadow-black/10',
        className
      )}>
      {type === 'loading' ? (
        <Spinner size={16} />
      ) : icon ? (
        <Icon as={icon} size={16} className="text-foreground" />
      ) : null}
      <View className="flex-1 gap-0.5">
        <Text className="text-popover-foreground text-sm font-medium">{title}</Text>
        {description ? <Text className="text-muted-foreground text-sm">{description}</Text> : null}
      </View>
      {cancel ? (
        <Button
          variant="secondary"
          size="sm"
          className="h-6 rounded-sm px-2 sm:h-6"
          onPress={() => {
            cancel.onPress?.();
            onDismiss?.();
          }}>
          <Text className="text-xs">{cancel.label}</Text>
        </Button>
      ) : null}
      {action ? (
        <Button
          size="sm"
          className="h-6 rounded-sm px-2 sm:h-6"
          onPress={() => {
            action.onPress?.();
            onDismiss?.();
          }}>
          <Text className="text-xs">{action.label}</Text>
        </Button>
      ) : null}
    </View>
  );
}

function AnimatedToast({ item }: { item: ToastItem }) {
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: Platform.OS !== 'web' }).start();
    if (item.type === 'loading') return;
    const t = setTimeout(() => dismiss(item.id), item.duration ?? 4000);
    return () => clearTimeout(t);
  }, [anim, item.id, item.type, item.duration]);
  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] }) }],
      }}
      className="w-full items-center">
      <Toast {...item} onDismiss={() => dismiss(item.id)} />
    </Animated.View>
  );
}

/** Mount once (e.g. in the root layout). Toasts stack at the top, under the status bar. */
function Toaster() {
  const [list, setList] = React.useState<ToastItem[]>(items);
  const insets = useSafeAreaInsets();
  React.useEffect(() => {
    listeners.add(setList);
    return () => {
      listeners.delete(setList);
    };
  }, []);
  if (!list.length) return null;
  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0 top-0 z-50 items-center gap-2 px-4"
      style={{ paddingTop: insets.top + 8 }}>
      {list.map((item) => (
        <AnimatedToast key={item.id} item={item} />
      ))}
    </View>
  );
}

export { Toast, Toaster, toast };
export type { ToastOptions, ToastType };
