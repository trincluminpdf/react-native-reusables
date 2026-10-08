import { Button } from '@/registry/nativewind/components/ui/button';
import { FormField, type FormFieldState } from '@/registry/nativewind/components/ui/form-field';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

const STATES: { state: FormFieldState; label: string }[] = [
  { state: 'build', label: 'State=Build' },
  { state: 'empty', label: 'State=Empty' },
  { state: 'filled', label: 'State=Filled' },
];

function TextType() {
  return (
    <PreviewStack>
      {STATES.map(({ state, label }) => (
        <Spec key={state} label={label}>
          <FormField
            type="text"
            state={state}
            placeholder="Full name"
            value="Alex Morgan"
            width={240}
          />
        </Spec>
      ))}
    </PreviewStack>
  );
}

function SignatureType() {
  return (
    <PreviewStack>
      {STATES.map(({ state, label }) => (
        <Spec key={state} label={label}>
          <FormField type="signature" state={state} width={240} />
        </Spec>
      ))}
    </PreviewStack>
  );
}

function ControlType({ type }: { type: 'checkbox' | 'radio' }) {
  return (
    <PreviewStack>
      <Spec label="State=Build / Empty / Filled">
        <View className="flex-row gap-8">
          {STATES.map(({ state, label }) => (
            <View key={state} className="items-center gap-2">
              <FormField type={type} state={state} placeholder={label} />
              <Text className="text-muted-foreground text-xs">{label.replace('State=', '')}</Text>
            </View>
          ))}
        </View>
      </Spec>
    </PreviewStack>
  );
}

function CheckboxType() {
  return <ControlType type="checkbox" />;
}

function RadioType() {
  return <ControlType type="radio" />;
}

const PLANS = ['Monthly', 'Yearly'] as const;

/** Page text next to a control; also toggles it (sibling, not a wrapper — no button in a button). */
function FieldLabel({ children, onPress }: { children: string; onPress: () => void }) {
  return (
    <Text
      onPress={onPress}
      suppressHighlighting
      importantForAccessibility="no"
      accessibilityElementsHidden
      className="text-foreground text-sm">
      {children}
    </Text>
  );
}

/** A form page in fill-in mode: every field starts Empty, tap fills it. */
function FillIn() {
  const [name, setName] = React.useState(false);
  const [signed, setSigned] = React.useState(false);
  const [agree, setAgree] = React.useState(false);
  const [plan, setPlan] = React.useState<(typeof PLANS)[number] | null>(null);
  const reset = () => {
    setName(false);
    setSigned(false);
    setAgree(false);
    setPlan(null);
  };
  return (
    <PreviewStack>
      <Spec label="◆ Fill in (tap) · text → value, signature → ink, checkbox / radio toggle">
        <View className="border-border bg-background gap-4 rounded-sm border p-5">
          <View className="gap-1.5">
            <Text className="text-muted-foreground text-xs">Name</Text>
            <FormField
              type="text"
              state={name ? 'filled' : 'empty'}
              placeholder="Full name"
              value="Alex Morgan"
              onPress={() => setName((v) => !v)}
            />
          </View>
          <View className="gap-1.5">
            <Text className="text-muted-foreground text-xs">Plan</Text>
            <View className="flex-row gap-6">
              {PLANS.map((p) => (
                <View key={p} className="flex-row items-center gap-2">
                  <FormField
                    type="radio"
                    state={plan === p ? 'filled' : 'empty'}
                    placeholder={p}
                    onPress={() => setPlan(p)}
                  />
                  <FieldLabel onPress={() => setPlan(p)}>{p}</FieldLabel>
                </View>
              ))}
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <FormField
              type="checkbox"
              state={agree ? 'filled' : 'empty'}
              placeholder="I agree to the terms"
              onPress={() => setAgree((v) => !v)}
            />
            <FieldLabel onPress={() => setAgree((v) => !v)}>I agree to the terms</FieldLabel>
          </View>
          <View className="gap-1.5">
            <Text className="text-muted-foreground text-xs">Signature</Text>
            <FormField
              type="signature"
              state={signed ? 'filled' : 'empty'}
              width={200}
              onPress={() => setSigned((v) => !v)}
            />
          </View>
        </View>
        <Button variant="outline" size="sm" className="self-start" onPress={reset}>
          <Text>Reset</Text>
        </Button>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Type=Text', component: TextType },
  { name: 'Type=Signature', component: SignatureType },
  { name: 'Type=Checkbox', component: CheckboxType },
  { name: 'Type=Radio', component: RadioType },
  { name: '◆ Fill in (tap)', component: FillIn },
];
