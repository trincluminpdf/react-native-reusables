import { Button } from '@/registry/nativewind/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/registry/nativewind/components/ui/dropdown-menu';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { DotsThreeIcon, TrashIcon, UserIcon } from 'phosphor-react-native';
import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FILE_MENU } from './menu-items';

function Menu() {
  const insets = useSafeAreaInsets();
  return (
    <PreviewStack>
      <Spec row label="Item (Default / Destructive) · Label · Separator · SubTrigger — no Shortcut on mobile ◆">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" accessibilityLabel="More">
              <Icon as={DotsThreeIcon} size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            insets={{ top: insets.top, bottom: insets.bottom, left: 4, right: 4 }}
            sideOffset={4}
            className="w-56"
            align="start">
            <DropdownMenuLabel>{FILE_MENU.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {FILE_MENU.items.map((i) => (
                <DropdownMenuItem key={i}>
                  <Text>{i}</Text>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Icon as={UserIcon} className="text-muted-foreground size-4" />
                  <Text>Share</Text>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {FILE_MENU.share.map((i) => (
                    <DropdownMenuItem key={i}>
                      <Text>{i}</Text>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Icon as={TrashIcon} className="text-destructive size-4" />
              <Text>{FILE_MENU.destructive}</Text>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Text>Move (disabled)</Text>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Menu', component: Menu }];
