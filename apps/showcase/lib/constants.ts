/**
 * Lumin PDF Mobile DS — component index.
 * `figma` = page node id in PDF-Mobile-DS (https://www.figma.com/design/EotlK1nCd33Udubm5PcZQt/PDF-Mobile-DS).
 * `status` mirrors the Figma page header chip:
 *   RNR = straight from react-native-reusables · RNR + Custom = RNR with ◆ Lumin deltas ·
 *   Custom = not in RNR (◆, dev builds it) · New = designed fresh for mobile.
 */
export const FIGMA_FILE_URL = 'https://www.figma.com/design/EotlK1nCd33Udubm5PcZQt/PDF-Mobile-DS';

export type ComponentStatus = 'RNR' | 'RNR + Custom' | 'Custom' | 'New';

export const COMPONENTS = [
  { slug: 'accordion', name: 'Accordion', figma: '6-4', status: 'RNR + Custom' },
  { slug: 'alert', name: 'Alert', figma: '6-5', status: 'RNR + Custom' },
  { slug: 'alert-dialog', name: 'Alert Dialog', figma: '6-6', status: 'RNR + Custom' },
  { slug: 'avatar', name: 'Avatar', figma: '6-7', status: 'RNR + Custom' },
  { slug: 'badge', name: 'Badge', figma: '6-8', status: 'RNR + Custom' },
  { slug: 'button', name: 'Button', figma: '6-9', status: 'RNR + Custom' },
  { slug: 'calendar', name: 'Calendar', figma: '6-10', status: 'New' },
  { slug: 'card', name: 'Card', figma: '6-11', status: 'RNR + Custom' },
  { slug: 'checkbox', name: 'Checkbox', figma: '6-12', status: 'RNR + Custom' },
  { slug: 'collapsible', name: 'Collapsible', figma: '6-13', status: 'RNR' },
  { slug: 'context-menu', name: 'Context Menu', figma: '6-14', status: 'RNR + Custom' },
  { slug: 'date-picker', name: 'Date Picker', figma: '6-15', status: 'Custom' },
  { slug: 'dialog', name: 'Dialog', figma: '6-16', status: 'RNR + Custom' },
  { slug: 'drawer', name: 'Drawer', figma: '6-17', status: 'Custom' },
  { slug: 'dropdown-menu', name: 'Dropdown Menu', figma: '6-18', status: 'RNR + Custom' },
  { slug: 'empty', name: 'Empty', figma: '6-19', status: 'Custom' },
  { slug: 'field', name: 'Field', figma: '6-20', status: 'Custom' },
  { slug: 'fullscreen-modal', name: 'Fullscreen Modal', figma: '6-21', status: 'New' },
  { slug: 'input', name: 'Input', figma: '6-22', status: 'RNR + Custom' },
  { slug: 'input-group', name: 'Input Group', figma: '6-23', status: 'Custom' },
  { slug: 'input-otp', name: 'Input OTP', figma: '6-24', status: 'Custom' },
  { slug: 'item', name: 'Item', figma: '6-25', status: 'Custom' },
  { slug: 'label', name: 'Label', figma: '6-26', status: 'RNR + Custom' },
  { slug: 'popover', name: 'Popover', figma: '6-27', status: 'RNR' },
  { slug: 'progress', name: 'Progress', figma: '6-28', status: 'RNR' },
  { slug: 'radio-group', name: 'Radio Group', figma: '6-29', status: 'RNR + Custom' },
  { slug: 'select', name: 'Select', figma: '6-30', status: 'RNR + Custom' },
  { slug: 'separator', name: 'Separator', figma: '6-31', status: 'RNR' },
  { slug: 'sheet', name: 'Sheet', figma: '6-32', status: 'Custom' },
  { slug: 'skeleton', name: 'Skeleton', figma: '6-33', status: 'RNR' },
  { slug: 'slider', name: 'Slider', figma: '6-34', status: 'Custom' },
  { slug: 'sonner', name: 'Sonner', figma: '6-35', status: 'Custom' },
  { slug: 'spinner', name: 'Spinner', figma: '6-36', status: 'Custom' },
  { slug: 'switch', name: 'Switch', figma: '6-37', status: 'RNR + Custom' },
  { slug: 'tabs', name: 'Tabs', figma: '6-38', status: 'RNR + Custom' },
  { slug: 'textarea', name: 'Textarea', figma: '6-39', status: 'RNR + Custom' },
  { slug: 'toggle', name: 'Toggle', figma: '6-40', status: 'RNR' },
  { slug: 'toggle-group', name: 'Toggle Group', figma: '6-41', status: 'RNR + Custom' },
  { slug: 'tooltip', name: 'Tooltip', figma: '6-42', status: 'RNR' },
  { slug: 'typography', name: 'Typography', figma: '6-43', status: 'RNR + Custom' },
] as const satisfies ReadonlyArray<{
  slug: string;
  name: string;
  figma: string;
  status: ComponentStatus;
}>;

export type ComponentSlug = (typeof COMPONENTS)[number]['slug'];

export function figmaUrl(nodeId: string) {
  return `${FIGMA_FILE_URL}?node-id=${nodeId}`;
}

export function getComponent(slug: string) {
  return COMPONENTS.find((c) => c.slug === slug);
}

export const BLOCKS = [
  { slug: 'sign-in-form', name: 'Sign In Form' },
  { slug: 'sign-up-form', name: 'Sign Up Form' },
  { slug: 'forgot-password-form', name: 'Forgot Password Form' },
  { slug: 'reset-password-form', name: 'Reset Password Form' },
  { slug: 'verify-email-form', name: 'Verify Email Form' },
  { slug: 'social-connections', name: 'Social Connections' },
  { slug: 'user-menu', name: 'User Menu' },
] as const;
