import { Button } from '@/registry/nativewind/components/ui/button';
import {
  SignatureItem,
  type SignatureItemProps,
} from '@/registry/nativewind/components/ui/signature-item';
import { SignatureValidation } from '@/registry/nativewind/components/ui/signature-validation';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

const TYPES: { type: SignatureItemProps['type']; label: string }[] = [
  { type: 'draw', label: 'Type=Draw' },
  { type: 'type', label: 'Type=Type' },
  { type: 'image', label: 'Type=Image' },
  { type: 'failed', label: 'Type=Failed' },
];

function ItemTypes() {
  return (
    <PreviewStack>
      {TYPES.map(({ type, label }) => (
        <Spec key={type} label={label}>
          <SignatureItem type={type} name="Alex Morgan" onPress={() => {}} />
        </Spec>
      ))}
    </PreviewStack>
  );
}

type Saved = { id: string; type: SignatureItemProps['type']; name?: string };

const SAVED: Saved[] = [
  { id: 'draw', type: 'draw' },
  { id: 'type', type: 'type', name: 'Alex Morgan' },
  { id: 'image', type: 'image' },
];

/** Signature sheet list: Edit → tap − reveals Delete (Mode=Delete) → Delete removes; − again cancels. */
function EditDelete() {
  const [items, setItems] = React.useState(SAVED);
  const [editing, setEditing] = React.useState(false);
  const [revealed, setRevealed] = React.useState<string | null>(null);
  const [placed, setPlaced] = React.useState<string | null>(null);

  const mode = (id: string): SignatureItemProps['mode'] =>
    !editing ? 'default' : revealed === id ? 'delete' : 'edit';

  return (
    <PreviewStack>
      <Spec label="◆ Mode=Edit → Delete (tap −) · Mode=Default: tap to place">
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground text-base font-semibold">Signatures</Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              setEditing((v) => !v);
              setRevealed(null);
            }}>
            <Text>{editing ? 'Done' : 'Edit'}</Text>
          </Button>
        </View>
        <View className="gap-2">
          {items.map((s) => (
            <SignatureItem
              key={s.id}
              type={s.type}
              name={s.name}
              mode={mode(s.id)}
              onPress={() =>
                editing
                  ? setRevealed(null)
                  : setPlaced(TYPES.find((t) => t.type === s.type)?.label ?? s.type)
              }
              onRemovePress={() => setRevealed((r) => (r === s.id ? null : s.id))}
              onDeletePress={() => {
                setItems((list) => list.filter((x) => x.id !== s.id));
                setRevealed(null);
              }}
            />
          ))}
        </View>
        {items.length === 0 ? (
          <Button
            variant="outline"
            size="sm"
            className="self-start"
            onPress={() => {
              setItems(SAVED);
              setEditing(false);
            }}>
            <Text>Restore signatures</Text>
          </Button>
        ) : null}
        <Text className="text-muted-foreground text-xs">
          {editing
            ? 'Tap − to reveal Delete, tap − again to cancel.'
            : placed
              ? `Placed: ${placed}`
              : 'Tap a signature to place it.'}
        </Text>
      </Spec>
    </PreviewStack>
  );
}

const SIGNER = { signer: 'Signed by Alex Morgan', email: 'alex@example.com' };

function ValidationValid() {
  return (
    <PreviewStack>
      <Spec label="Status=Valid · Expanded=No">
        <SignatureValidation {...SIGNER} status="valid" />
      </Spec>
      <Spec label="Status=Valid · Expanded=Yes">
        <SignatureValidation {...SIGNER} status="valid" defaultExpanded onLinkPress={() => {}} />
      </Spec>
    </PreviewStack>
  );
}

function ValidationInvalid() {
  return (
    <PreviewStack>
      <Spec label="Status=Invalid · Expanded=No">
        <SignatureValidation {...SIGNER} status="invalid" />
      </Spec>
      <Spec label="Status=Invalid · Expanded=Yes">
        <SignatureValidation {...SIGNER} status="invalid" defaultExpanded onLinkPress={() => {}} />
      </Spec>
    </PreviewStack>
  );
}

const SIGNERS = [
  { signer: 'Signed by Alex Morgan', email: 'alex@example.com', status: 'valid' as const },
  { signer: 'Signed by Jordan Lee', email: 'jordan@example.com', status: 'valid' as const },
  { signer: 'Signed by Riley Chen', email: 'riley@example.com', status: 'invalid' as const },
];

/** Signature certificate sheet content: one row open at a time (controlled). */
function CertificateSheet() {
  const [open, setOpen] = React.useState<string | null>(SIGNERS[0]?.email ?? null);
  const [linked, setLinked] = React.useState<string | null>(null);
  return (
    <PreviewStack>
      <Spec label="◆ Certificate sheet (tap to expand) · one open at a time">
        <View className="border-border bg-background gap-4 rounded-t-xl border px-4 pb-6 pt-2">
          <View className="bg-muted h-1.5 w-10 self-center rounded-full" />
          <View className="gap-1">
            <Text className="text-foreground text-lg font-semibold">Signature certificate</Text>
            <Text className="text-muted-foreground text-sm">
              2 of 3 signatures are valid. The document changed after the last signature.
            </Text>
          </View>
          <View className="gap-2">
            {SIGNERS.map((s) => (
              <SignatureValidation
                key={s.email}
                {...s}
                expanded={open === s.email}
                onExpandedChange={(next) => setOpen(next ? s.email : null)}
                onLinkPress={() =>
                  setLinked(s.status === 'valid' ? 'Certificate details' : 'Certified version')
                }
              />
            ))}
          </View>
        </View>
        <Text className="text-muted-foreground text-xs">
          {linked ? `Opened: ${linked}` : 'Tap a link to open it.'}
        </Text>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Signature Item · Type', component: ItemTypes },
  { name: '◆ Mode=Edit → Delete (tap −)', component: EditDelete },
  { name: 'Signature Validation · Status=Valid', component: ValidationValid },
  { name: 'Signature Validation · Status=Invalid', component: ValidationInvalid },
  { name: '◆ Certificate sheet (tap to expand)', component: CertificateSheet },
];
