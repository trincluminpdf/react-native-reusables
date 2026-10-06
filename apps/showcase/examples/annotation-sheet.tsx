import { AnnotationProperties } from '@/registry/nativewind/components/ui/annotation-sheet';
import { Button } from '@/registry/nativewind/components/ui/button';
import { ColorPicker } from '@/registry/nativewind/components/ui/color-picker';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/registry/nativewind/components/ui/drawer';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

/**
 * Drawer hosting the Annotation Sheet; "+" swaps the content to the Color Picker (Back returns).
 * Exported for the Toolbar / Showcase demo.
 */
function AnnotationDrawer({
  open,
  onOpenChange,
  tool = 'Text highlight',
  color,
  onColorChange,
  opacity,
  onOpacityChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  tool?: string;
  color: string | null;
  onColorChange: (c: string | null) => void;
  opacity: number;
  onOpacityChange: (o: number) => void;
}) {
  const [picker, setPicker] = React.useState(false);
  React.useEffect(() => {
    if (!open) setPicker(false);
  }, [open]);
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        {picker ? (
          <View className="pt-2">
            <ColorPicker
              value={color}
              onValueChange={onColorChange}
              opacity={opacity}
              onOpacityChange={onOpacityChange}
              onBack={() => setPicker(false)}
              onClose={() => onOpenChange(false)}
            />
          </View>
        ) : (
          <>
            <DrawerHeader>
              <DrawerTitle>{tool}</DrawerTitle>
              <DrawerDescription>Color and opacity</DrawerDescription>
            </DrawerHeader>
            <AnnotationProperties
              color={color}
              onColorChange={onColorChange}
              opacity={opacity}
              onOpacityChange={onOpacityChange}
              onCustomColorPress={() => setPicker(true)}
            />
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

function Inline() {
  const [color, setColor] = React.useState<string | null>('#fee08b');
  const [opacity, setOpacity] = React.useState(40);
  return (
    <PreviewStack>
      <Spec label="◆ Annotation Properties · Show opacity=true (Text highlight)">
        <View className="border-border rounded-xl border pt-4">
          <AnnotationProperties
            color={color}
            onColorChange={setColor}
            opacity={opacity}
            onOpacityChange={setOpacity}
          />
        </View>
      </Spec>
    </PreviewStack>
  );
}

function InDrawer() {
  const [open, setOpen] = React.useState(false);
  const [color, setColor] = React.useState<string | null>('#fee08b');
  const [opacity, setOpacity] = React.useState(40);
  return (
    <PreviewStack>
      <Spec label="◆ In Drawer · tap + for the Color Picker" row>
        <Button variant="outline" onPress={() => setOpen(true)}>
          <Text>Open Annotation Sheet</Text>
        </Button>
      </Spec>
      <AnnotationDrawer
        open={open}
        onOpenChange={setOpen}
        color={color}
        onColorChange={setColor}
        opacity={opacity}
        onOpacityChange={setOpacity}
      />
    </PreviewStack>
  );
}

function TextColor() {
  const [color, setColor] = React.useState<string | null>('#a12214');
  return (
    <PreviewStack>
      <Spec label="◆ Show opacity=false · Type=TextStamp · text color preview">
        <View className="border-border rounded-xl border pt-4">
          <AnnotationProperties
            color={color}
            onColorChange={setColor}
            opacity={100}
            paletteType="textStamp"
            preview="text"
          />
        </View>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Annotation Properties', component: Inline },
  { name: 'In Drawer', component: InDrawer },
  { name: 'Show opacity=false', component: TextColor },
];

export { AnnotationDrawer };
