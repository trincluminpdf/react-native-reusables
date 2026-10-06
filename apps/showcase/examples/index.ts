import type { Preview } from '@showcase/components/component-page';

import { previews as accordion } from './accordion';
import { previews as alertDialog } from './alert-dialog';
import { previews as alert } from './alert';
import { previews as avatar } from './avatar';
import { previews as badge } from './badge';
import { previews as button } from './button';
import { previews as calendar } from './calendar';
import { previews as card } from './card';
import { previews as checkbox } from './checkbox';
import { previews as collapsible } from './collapsible';
import { previews as contextMenu } from './context-menu';
import { previews as datePicker } from './date-picker';
import { previews as dialog } from './dialog';
import { previews as drawer } from './drawer';
import { previews as dropdownMenu } from './dropdown-menu';
import { previews as empty } from './empty';
import { previews as field } from './field';
import { previews as fullscreenModal } from './fullscreen-modal';
import { previews as inputGroup } from './input-group';
import { previews as inputOtp } from './input-otp';
import { previews as input } from './input';
import { previews as item } from './item';
import { previews as label } from './label';
import { previews as popover } from './popover';
import { previews as progress } from './progress';
import { previews as radioGroup } from './radio-group';
import { previews as select } from './select';
import { previews as separator } from './separator';
import { previews as sheet } from './sheet';
import { previews as skeleton } from './skeleton';
import { previews as slider } from './slider';
import { previews as sonner } from './sonner';
import { previews as spinner } from './spinner';
import { previews as splashScreen } from './splash-screen';
import { previews as switchPreviews } from './switch';
import { previews as tabs } from './tabs';
import { previews as textarea } from './textarea';
import { previews as toggleGroup } from './toggle-group';
import { previews as toggle } from './toggle';
import { previews as tooltip } from './tooltip';
import { previews as typography } from './typography';

/** slug (lib/constants COMPONENTS) → previews. One file per Figma page. */
export const PREVIEWS: Record<string, Preview[]> = {
  'accordion': accordion,
  'alert-dialog': alertDialog,
  'alert': alert,
  'avatar': avatar,
  'badge': badge,
  'button': button,
  'calendar': calendar,
  'card': card,
  'checkbox': checkbox,
  'collapsible': collapsible,
  'context-menu': contextMenu,
  'date-picker': datePicker,
  'dialog': dialog,
  'drawer': drawer,
  'dropdown-menu': dropdownMenu,
  'empty': empty,
  'field': field,
  'fullscreen-modal': fullscreenModal,
  'input-group': inputGroup,
  'input-otp': inputOtp,
  'input': input,
  'item': item,
  'label': label,
  'popover': popover,
  'progress': progress,
  'radio-group': radioGroup,
  'select': select,
  'separator': separator,
  'sheet': sheet,
  'skeleton': skeleton,
  'slider': slider,
  'sonner': sonner,
  'spinner': spinner,
  'splash-screen': splashScreen,
  switch: switchPreviews,
  'tabs': tabs,
  'textarea': textarea,
  'toggle-group': toggleGroup,
  'toggle': toggle,
  'tooltip': tooltip,
  'typography': typography,
};
