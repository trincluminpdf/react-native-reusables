import type { Preview } from '@showcase/components/component-page';

import { previews as accordion } from './accordion';
import { previews as actionSheet } from './action-sheet';
import { previews as alertDialog } from './alert-dialog';
import { previews as alert } from './alert';
import { previews as avatar } from './avatar';
import { previews as badge } from './badge';
import { previews as button } from './button';
import { previews as calendar } from './calendar';
import { previews as card } from './card';
import { previews as checkbox } from './checkbox';
import { previews as chip } from './chip';
import { previews as circularProgress } from './circular-progress';
import { previews as collapsible } from './collapsible';
import { previews as contextMenu } from './context-menu';
import { previews as datePicker } from './date-picker';
import { previews as dialog } from './dialog';
import { previews as drawer } from './drawer';
import { previews as dropdownMenu } from './dropdown-menu';
import { previews as empty } from './empty';
import { previews as fab } from './fab';
import { previews as field } from './field';
import { previews as fullscreenModal } from './fullscreen-modal';
import { previews as inputGroup } from './input-group';
import { previews as inputOtp } from './input-otp';
import { previews as input } from './input';
import { previews as item } from './item';
import { previews as label } from './label';
import { previews as navigationRail } from './navigation-rail';
import { previews as pageControl } from './page-control';
import { previews as loader } from './loader';
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
import { previews as stepper } from './stepper';
import { previews as switchPreviews } from './switch';
import { previews as tabs } from './tabs';
import { previews as textarea } from './textarea';
import { previews as timePicker } from './time-picker';
import { previews as toggleGroup } from './toggle-group';
import { previews as toggle } from './toggle';
import { previews as tooltip } from './tooltip';
import { previews as typography } from './typography';
// ◆ In-app
import { previews as showcaseDemo } from './showcase-demo';
import { previews as appBar } from './app-bar';
import { previews as navBar } from './nav-bar';
import { previews as toolTile } from './tool-tile';
import { previews as sectionHeader } from './section-header';
import { previews as filterChips } from './filter-chips';
import { previews as documentItem } from './document-item';
import { previews as banner } from './banner';
import { previews as workspaceItem } from './workspace-item';
import { previews as toolbar } from './toolbar';
import { previews as pageIndicator } from './page-indicator';
import { previews as quickMenu } from './quick-menu';
import { previews as textSelection } from './text-selection';
import { previews as colorSwatch } from './color-swatch';
import { previews as annotationSheet } from './annotation-sheet';
import { previews as colorPicker } from './color-picker';
// ◆ In-app · LPM source batch (New)
import { previews as pageThumbnail } from './page-thumbnail';
import { previews as memberItem } from './member-item';
import { previews as outlineItem } from './outline-item';
import { previews as annotationSelection } from './annotation-selection';
import { previews as formField } from './form-field';
import { previews as commentItem } from './comment-item';
import { previews as signature } from './signature';
import { previews as hint } from './hint';
import { previews as notificationItem } from './notification-item';
import { previews as showcaseFlows } from './showcase-flows';

/** slug (lib/constants COMPONENTS) → previews. One file per Figma page. */
export const PREVIEWS: Record<string, Preview[]> = {
  accordion: accordion,
  'action-sheet': actionSheet,
  'alert-dialog': alertDialog,
  alert: alert,
  avatar: avatar,
  badge: badge,
  button: button,
  calendar: calendar,
  card: card,
  checkbox: checkbox,
  chip: chip,
  'circular-progress': circularProgress,
  collapsible: collapsible,
  'context-menu': contextMenu,
  'date-picker': datePicker,
  dialog: dialog,
  drawer: drawer,
  'dropdown-menu': dropdownMenu,
  empty: empty,
  fab: fab,
  field: field,
  'fullscreen-modal': fullscreenModal,
  'input-group': inputGroup,
  'input-otp': inputOtp,
  'input': input,
  'item': item,
  'label': label,
  'navigation-rail': navigationRail,
  'page-control': pageControl,
  'loader': loader,
  'popover': popover,
  'progress': progress,
  'radio-group': radioGroup,
  select: select,
  separator: separator,
  sheet: sheet,
  skeleton: skeleton,
  slider: slider,
  sonner: sonner,
  spinner: spinner,
  'splash-screen': splashScreen,
  stepper: stepper,
  switch: switchPreviews,
  tabs: tabs,
  textarea: textarea,
  'time-picker': timePicker,
  'toggle-group': toggleGroup,
  toggle: toggle,
  tooltip: tooltip,
  typography: typography,
  // ◆ In-app
  'showcase-demo': showcaseDemo,
  'app-bar': appBar,
  'nav-bar': navBar,
  'tool-tile': toolTile,
  'section-header': sectionHeader,
  'filter-chips': filterChips,
  'document-item': documentItem,
  banner: banner,
  'workspace-item': workspaceItem,
  toolbar: toolbar,
  'page-indicator': pageIndicator,
  'quick-menu': quickMenu,
  'text-selection': textSelection,
  'color-swatch': colorSwatch,
  'annotation-sheet': annotationSheet,
  'color-picker': colorPicker,
  'page-thumbnail': pageThumbnail,
  'member-item': memberItem,
  'outline-item': outlineItem,
  'annotation-selection': annotationSelection,
  'form-field': formField,
  'comment-item': commentItem,
  'signature': signature,
  'hint': hint,
  'notification-item': notificationItem,
  'showcase-flows': showcaseFlows,
};
