import { MemberItem } from '@/registry/nativewind/components/ui/member-item';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

/** Placeholder people only. */
const PEOPLE = [
  { name: 'Alex Morgan', email: 'alex@example.com' },
  { name: 'Jordan Lee', email: 'jordan@example.com' },
  { name: 'Riley Chen', email: 'riley@example.com' },
] as const;

const [ALEX, JORDAN, RILEY] = PEOPLE;

function Status({ children }: { children: string }) {
  return <Text className="text-muted-foreground text-xs">{children}</Text>;
}

function More() {
  const [last, setLast] = React.useState<string | null>(null);
  return (
    <PreviewStack>
      <Spec label="Trailing=More · Show you · Show meta">
        <View>
          <MemberItem
            name={ALEX.name}
            you
            meta="Owner"
            email={ALEX.email}
            onPress={() => {}}
            onMorePress={() => setLast(`Actions sheet for ${ALEX.name}`)}
          />
          <MemberItem
            name={JORDAN.name}
            meta="Admin"
            email={JORDAN.email}
            onPress={() => {}}
            onMorePress={() => setLast(`Actions sheet for ${JORDAN.name}`)}
          />
          <MemberItem
            name={RILEY.name}
            email={RILEY.email}
            onPress={() => {}}
            onMorePress={() => setLast(`Actions sheet for ${RILEY.name}`)}
          />
        </View>
        {last ? <Status>{last}</Status> : null}
      </Spec>
    </PreviewStack>
  );
}

function Permission() {
  const [access, setAccess] = React.useState<Record<string, string>>({
    [JORDAN.name]: 'Can edit',
    [RILEY.name]: 'Can view',
  });
  const cycle = (name: string) =>
    setAccess((a) => ({
      ...a,
      [name]:
        a[name] === 'Can edit'
          ? 'Can comment'
          : a[name] === 'Can comment'
            ? 'Can view'
            : 'Can edit',
    }));
  return (
    <PreviewStack>
      <Spec label="Trailing=Permission · tap to cycle (stands in for the access menu)">
        <View>
          {[JORDAN, RILEY].map((p) => (
            <MemberItem
              key={p.name}
              name={p.name}
              email={p.email}
              trailing="permission"
              permission={access[p.name]}
              onPermissionPress={() => cycle(p.name)}
            />
          ))}
        </View>
      </Spec>
    </PreviewStack>
  );
}

function Label() {
  return (
    <PreviewStack>
      <Spec label="Trailing=Label · read-only access">
        <View>
          <MemberItem name={ALEX.name} you email={ALEX.email} trailing="label" label="Doc owner" />
          <MemberItem name={JORDAN.name} email={JORDAN.email} trailing="label" label="Can view" />
        </View>
      </Spec>
      <Spec label="Trailing=None · Show meta=false">
        <MemberItem name={RILEY.name} email={RILEY.email} trailing="none" />
      </Spec>
    </PreviewStack>
  );
}

function ActionsInline() {
  const [last, setLast] = React.useState<string | null>(null);
  return (
    <PreviewStack>
      <Spec label="Trailing=Actions (inline) · Tablet / wide rows">
        <View>
          {[RILEY, JORDAN].map((p, i) => (
            <MemberItem
              key={p.name}
              name={p.name}
              meta={i === 0 ? 'Wants to edit' : 'Requests to join'}
              email={p.email}
              trailing="actions-inline"
              actions={{
                secondary: { label: 'Reject', onPress: () => setLast(`Rejected ${p.name}`) },
                primary: { label: 'Accept', onPress: () => setLast(`Accepted ${p.name}`) },
              }}
            />
          ))}
        </View>
        {last ? <Status>{last}</Status> : null}
      </Spec>
    </PreviewStack>
  );
}

function ActionsBelow() {
  const [last, setLast] = React.useState<string | null>(null);
  return (
    <PreviewStack>
      <Spec label="Trailing=Actions (below) · phone rows">
        <View>
          {[RILEY, JORDAN].map((p, i) => (
            <MemberItem
              key={p.name}
              name={p.name}
              meta={i === 0 ? 'Wants to edit' : 'Requests to join'}
              email={p.email}
              trailing="actions-below"
              actions={{
                secondary: { label: 'Reject', onPress: () => setLast(`Rejected ${p.name}`) },
                primary: { label: 'Accept', onPress: () => setLast(`Accepted ${p.name}`) },
              }}
            />
          ))}
        </View>
        {last ? <Status>{last}</Status> : null}
      </Spec>
    </PreviewStack>
  );
}

function Selected() {
  const [selected, setSelected] = React.useState<string[]>([JORDAN.name]);
  const toggle = (name: string) =>
    setSelected((s) => (s.includes(name) ? s.filter((n) => n !== name) : [...s, name]));
  return (
    <PreviewStack>
      <Spec label="State=Selected (tap to toggle) · multi-select">
        <View>
          {PEOPLE.map((p, i) => (
            <MemberItem
              key={p.name}
              name={p.name}
              you={i === 0}
              meta={i === 0 ? 'Owner' : 'Member'}
              email={p.email}
              trailing="none"
              selected={selected.includes(p.name)}
              onPress={() => toggle(p.name)}
            />
          ))}
        </View>
        <Status>{`${selected.length} selected`}</Status>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Trailing=More', component: More },
  { name: 'Trailing=Permission', component: Permission },
  { name: 'Trailing=Label', component: Label },
  { name: 'Trailing=Actions (inline)', component: ActionsInline },
  { name: 'Trailing=Actions (below)', component: ActionsBelow },
  { name: 'State=Selected (tap to toggle)', component: Selected },
];
