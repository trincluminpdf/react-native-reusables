import {
  DocumentItem,
  type DocumentUpload,
} from '@/registry/nativewind/components/ui/document-item';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { DEMO_DOCS } from '@showcase/examples/in-app-shared';
import * as React from 'react';
import { View } from 'react-native';

function List() {
  return (
    <PreviewStack>
      <Spec label="◆ Layout=List · Starred / not starred · press = State=Pressed">
        <View className="-mx-4">
          {DEMO_DOCS.slice(0, 4).map((d, i, a) => (
            <DocumentItem key={d.title} {...d} last={i === a.length - 1} onPress={() => {}} />
          ))}
        </View>
      </Spec>
    </PreviewStack>
  );
}

function Grid() {
  return (
    <PreviewStack>
      <Spec label="◆ Layout=Grid · 2 columns, meta = date only">
        <View className="gap-4">
          {[0, 2].map((start) => (
            <View key={start} className="flex-row gap-3">
              {DEMO_DOCS.slice(start, start + 2).map((d) => (
                <DocumentItem key={d.title} {...d} layout="grid" onPress={() => {}} />
              ))}
            </View>
          ))}
        </View>
      </Spec>
    </PreviewStack>
  );
}

/** ✏️ LPM batch — State=Selectable / Selected (long-press a row to enter, tap toggles). */
function SelectMode() {
  const [selecting, setSelecting] = React.useState(true);
  const [picked, setPicked] = React.useState<string[]>([DEMO_DOCS[1]?.title ?? '']);
  const toggle = (t: string) =>
    setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));
  const props = (title: string) =>
    selecting
      ? { selectable: true, selected: picked.includes(title), onPress: () => toggle(title) }
      : { onPress: () => {}, onLongPress: () => setSelecting(true) };
  return (
    <PreviewStack>
      <Spec
        label={
          selecting
            ? `◆ State=Selectable / Selected · ${picked.length} selected`
            : '◆ Long-press a row to select'
        }>
        <View className="-mx-4">
          {DEMO_DOCS.slice(0, 3).map((d, i, a) => (
            <DocumentItem key={d.title} {...d} {...props(d.title)} last={i === a.length - 1} />
          ))}
        </View>
      </Spec>
      <Spec label="◆ Layout=Grid · checkbox on a plate, Selected = border-2 primary">
        <View className="flex-row gap-3">
          {DEMO_DOCS.slice(0, 2).map((d) => (
            <DocumentItem key={d.title} {...d} layout="grid" {...props(d.title)} />
          ))}
        </View>
      </Spec>
      <Text
        onPress={() => setSelecting((s) => !s)}
        className="text-primary self-start text-xs underline">
        {selecting ? 'Exit select mode (X in the App Bar)' : 'Enter select mode'}
      </Text>
    </PreviewStack>
  );
}

const UPLOADS: { title: string; upload: DocumentUpload }[] = [
  { title: 'Lease agreement.pdf', upload: { state: 'queued' } },
  {
    title: 'Q2 Results.pdf',
    upload: { state: 'uploading', progress: 50, status: '3 MB of 6 MB · 50%' },
  },
  { title: 'Scan 2026-10-08.pdf', upload: { state: 'processing' } },
  { title: 'NDA – Partner draft.pdf', upload: { state: 'uploaded' } },
  {
    title: 'Invoice 1042.pdf',
    upload: { state: 'failed', error: 'Upload failed. Check your connection.', retryable: true },
  },
  { title: 'Site photos.pdf', upload: { state: 'failed', error: 'Too large — max 10 MB' } },
];

/** ✏️ LPM batch — upload queue states (List). Retry restarts the failed upload. */
function UploadQueue() {
  const [items, setItems] = React.useState(UPLOADS);
  const set = (title: string, upload: DocumentUpload) =>
    setItems((list) => list.map((x) => (x.title === title ? { ...x, upload } : x)));
  const remove = (title: string) => setItems((list) => list.filter((x) => x.title !== title));

  // Uploading row advances; Uploaded is transient (~2 s) and then becomes a normal row (removed here).
  React.useEffect(() => {
    const id = setInterval(() => {
      setItems((list) =>
        list.map((x) => {
          if (x.upload.state !== 'uploading') return x;
          const p = Math.min(100, x.upload.progress + 10);
          return p >= 100
            ? { ...x, upload: { state: 'uploaded' } }
            : {
                ...x,
                upload: {
                  ...x.upload,
                  progress: p,
                  status: `${Math.round((p / 100) * 6)} MB of 6 MB · ${p}%`,
                },
              };
        })
      );
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <PreviewStack>
      <Spec label="◆ State=Queued · Uploading · Processing · Uploaded · Failed (Show retry on / off)">
        <View className="-mx-4">
          {items.map((x, i) => {
            const u = x.upload;
            const upload: DocumentUpload =
              u.state === 'failed'
                ? {
                    ...u,
                    onRetry: () =>
                      set(x.title, {
                        state: 'uploading',
                        progress: 0,
                        status: '0 MB of 6 MB · 0%',
                      }),
                    onRemove: () => remove(x.title),
                  }
                : u.state === 'uploaded'
                  ? u
                  : { ...u, onCancel: () => remove(x.title) };
            return (
              <DocumentItem
                key={x.title}
                title={x.title}
                upload={upload}
                last={i === items.length - 1}
              />
            );
          })}
        </View>
      </Spec>
      <Text onPress={() => setItems(UPLOADS)} className="text-primary self-start text-xs underline">
        Reset queue
      </Text>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Layout=List', component: List },
  { name: 'Layout=Grid', component: Grid },
  { name: 'State=Selectable / Selected', component: SelectMode },
  { name: 'Upload queue', component: UploadQueue },
];
