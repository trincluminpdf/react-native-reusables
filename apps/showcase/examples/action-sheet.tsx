import { ActionSheet, ActionSheetAction } from '@/registry/nativewind/components/ui/action-sheet';
import { Button } from '@/registry/nativewind/components/ui/button';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as DialogPrimitive from '@rn-primitives/dialog';
import {
  CopySimpleIcon,
  DownloadSimpleIcon,
  ExportIcon,
  FolderSimpleIcon,
  PencilSimpleIcon,
  TrashIcon,
} from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

function Confirm() {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const pick = (r: string) => {
    setResult(r);
    setOpen(false);
  };
  return (
    <PreviewStack>
      <Spec label="◆ Action Sheet · Type=Confirm (HIG: destructive first, Cancel last)">
        <Button variant="outline" onPress={() => setOpen(true)}>
          <Text>Close the editor…</Text>
        </Button>
        {result ? <Text className="text-muted-foreground text-sm">Chose: {result}</Text> : null}
      </Spec>
      <ActionSheet
        type="confirm"
        open={open}
        onOpenChange={setOpen}
        title="Save changes to “Contract.pdf”?"
        description="Your edits will be lost if you don’t save them.">
        <Button variant="destructive" onPress={() => pick('Discard changes')}>
          <Text>Discard changes</Text>
        </Button>
        <Button variant="outline" onPress={() => pick('Save as a copy')}>
          <Text>Save as a copy</Text>
        </Button>
        <Button onPress={() => pick('Save')}>
          <Text>Save</Text>
        </Button>
      </ActionSheet>
    </PreviewStack>
  );
}

function Menu() {
  const [open, setOpen] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);
  const actions = [
    { label: 'Share', icon: ExportIcon },
    { label: 'Download', icon: DownloadSimpleIcon },
    { label: 'Rename', icon: PencilSimpleIcon },
    { label: 'Duplicate', icon: CopySimpleIcon },
    { label: 'Move to folder', icon: FolderSimpleIcon },
  ];
  return (
    <PreviewStack>
      <Spec label="◆ Action Sheet · Type=Menu (M3 bottom sheet list, destructive last)">
        <Button variant="outline" onPress={() => setOpen(true)}>
          <Text>Document actions…</Text>
        </Button>
        {result ? <Text className="text-muted-foreground text-sm">Chose: {result}</Text> : null}
      </Spec>
      <ActionSheet
        open={open}
        onOpenChange={setOpen}
        title="Contract.pdf"
        description="2.4 MB · Edited today">
        {actions.map((a) => (
          <ActionSheetAction
            key={a.label}
            label={a.label}
            icon={a.icon}
            onPress={() => setResult(a.label)}
          />
        ))}
        <ActionSheetAction
          label="Delete"
          icon={TrashIcon}
          destructive
          onPress={() => setResult('Delete')}
        />
      </ActionSheet>
    </PreviewStack>
  );
}

/** Static rows need the Drawer (Dialog) context that ActionSheetAction reads. */
function Rows() {
  return (
    <PreviewStack>
      <DialogPrimitive.Root open={false} onOpenChange={() => {}}>
        <Spec label="◆ Action Sheet / Action · Variant=Default">
          <View className="border-border rounded-xl border p-2">
            <ActionSheetAction label="Share" icon={ExportIcon} />
            <ActionSheetAction
              label="Download (State=Disabled)"
              icon={DownloadSimpleIcon}
              disabled
            />
          </View>
        </Spec>
        <Spec label="◆ Action Sheet / Action · Variant=Destructive">
          <View className="border-border rounded-xl border p-2">
            <ActionSheetAction label="Delete" icon={TrashIcon} destructive />
          </View>
        </Spec>
      </DialogPrimitive.Root>
      <Text className="text-muted-foreground text-xs leading-5">
        Press and hold a row to see State=Pressed (accent fill).
      </Text>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Type=Confirm', component: Confirm },
  { name: 'Type=Menu', component: Menu },
  { name: 'Action', component: Rows },
];
