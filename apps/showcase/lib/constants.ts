/**
 * Lumin PDF Mobile DS — component index.
 * `figma` = page node id in PDF-Mobile-DS (https://www.figma.com/design/EotlK1nCd33Udubm5PcZQt/PDF-Mobile-DS).
 * `status` mirrors the Figma page header chip:
 *   RNR = straight from react-native-reusables · RNR + Custom = RNR with ◆ Lumin deltas ·
 *   Custom = not in RNR (◆, dev builds it) · New = the latest batch designed fresh for mobile
 *   (now: the LPM source batch — Page Thumbnail, Member Item, Outline Item, Annotation Selection,
 *   Form Field, Comment Item, Signature, Hint, Notification Item + Showcase flows; the M3 / Apple HIG
 *   gap batch moved to Custom).
 *   When a newer batch lands, the previous New items move to Custom (Figma page header chip too).
 * `group: 'in-app'` = Figma section "--- In-app ◆" (app screens: Home, Viewer, annotation tools).
 */
export const FIGMA_FILE_URL = 'https://www.figma.com/design/EotlK1nCd33Udubm5PcZQt/PDF-Mobile-DS';

export type ComponentStatus = 'RNR' | 'RNR + Custom' | 'Custom' | 'New';

export const COMPONENTS = [
  { slug: 'accordion', name: 'Accordion', figma: '6-4', status: 'RNR + Custom' },
  { slug: 'action-sheet', name: 'Action Sheet', figma: '155-6', status: 'Custom' },
  { slug: 'alert', name: 'Alert', figma: '6-5', status: 'RNR + Custom' },
  { slug: 'alert-dialog', name: 'Alert Dialog', figma: '6-6', status: 'RNR + Custom' },
  { slug: 'avatar', name: 'Avatar', figma: '6-7', status: 'RNR + Custom' },
  { slug: 'badge', name: 'Badge', figma: '6-8', status: 'RNR + Custom' },
  { slug: 'button', name: 'Button', figma: '6-9', status: 'RNR + Custom' },
  { slug: 'calendar', name: 'Calendar', figma: '6-10', status: 'Custom' },
  { slug: 'card', name: 'Card', figma: '6-11', status: 'RNR + Custom' },
  { slug: 'checkbox', name: 'Checkbox', figma: '6-12', status: 'RNR + Custom' },
  { slug: 'chip', name: 'Chip', figma: '155-7', status: 'Custom' },
  { slug: 'circular-progress', name: 'Circular Progress', figma: '155-8', status: 'Custom' },
  { slug: 'collapsible', name: 'Collapsible', figma: '6-13', status: 'RNR' },
  { slug: 'context-menu', name: 'Context Menu', figma: '6-14', status: 'RNR + Custom' },
  { slug: 'date-picker', name: 'Date Picker', figma: '6-15', status: 'Custom', native: true },
  { slug: 'dialog', name: 'Dialog', figma: '6-16', status: 'RNR + Custom' },
  { slug: 'drawer', name: 'Drawer', figma: '6-17', status: 'Custom' },
  { slug: 'dropdown-menu', name: 'Dropdown Menu', figma: '6-18', status: 'RNR + Custom' },
  { slug: 'empty', name: 'Empty', figma: '6-19', status: 'Custom' },
  { slug: 'fab', name: 'FAB', figma: '155-9', status: 'Custom' },
  { slug: 'field', name: 'Field', figma: '6-20', status: 'Custom' },
  { slug: 'fullscreen-modal', name: 'Fullscreen Modal', figma: '6-21', status: 'Custom' },
  { slug: 'input', name: 'Input', figma: '6-22', status: 'RNR + Custom' },
  { slug: 'input-group', name: 'Input Group', figma: '6-23', status: 'Custom' },
  { slug: 'input-otp', name: 'Input OTP', figma: '6-24', status: 'Custom' },
  { slug: 'item', name: 'Item', figma: '6-25', status: 'Custom' },
  { slug: 'label', name: 'Label', figma: '6-26', status: 'RNR + Custom' },
  // ◆ Code only: Lumin brand loader (variant Lumin) — no PDF-Mobile-DS page, `figma` stays empty.
  { slug: 'loader', name: 'Loader', figma: '', status: 'Custom' },
  { slug: 'navigation-rail', name: 'Navigation Rail', figma: '155-10', status: 'Custom' },
  { slug: 'page-control', name: 'Page Control', figma: '155-11', status: 'Custom' },
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
  // ◆ Code-side page: the mark lives in Figma LPA-001 App component (not a PDF-Mobile-DS page).
  {
    slug: 'splash-screen',
    name: 'Splash Screen',
    figma: '1278-2687',
    figmaFile: 'https://www.figma.com/design/58565Ulu9KCUG3L89AwX8g/LPA-001---App-component',
    status: 'Custom',
  },
  { slug: 'stepper', name: 'Stepper', figma: '155-12', status: 'Custom' },
  { slug: 'switch', name: 'Switch', figma: '6-37', status: 'RNR + Custom' },
  { slug: 'tabs', name: 'Tabs', figma: '6-38', status: 'RNR + Custom' },
  { slug: 'textarea', name: 'Textarea', figma: '6-39', status: 'RNR + Custom' },
  { slug: 'time-picker', name: 'Time Picker', figma: '155-13', status: 'Custom', native: true },
  { slug: 'toggle', name: 'Toggle', figma: '6-40', status: 'RNR' },
  { slug: 'toggle-group', name: 'Toggle Group', figma: '6-41', status: 'RNR + Custom' },
  { slug: 'tooltip', name: 'Tooltip', figma: '6-42', status: 'RNR' },
  { slug: 'typography', name: 'Typography', figma: '6-43', status: 'RNR + Custom' },
  // ◆ In-app (Figma section "--- In-app ◆"), in Figma page order.
  {
    slug: 'showcase-demo',
    name: 'Showcase demo',
    figma: '75-2933',
    status: 'Custom',
    group: 'in-app',
    native: true,
  },
  {
    slug: 'app-bar',
    name: 'App Bar',
    figma: '75-2918',
    status: 'Custom',
    group: 'in-app',
    native: true,
  },
  {
    slug: 'nav-bar',
    name: 'Nav Bar',
    figma: '75-2919',
    status: 'Custom',
    group: 'in-app',
    native: true,
  },
  { slug: 'tool-tile', name: 'Tool Tile', figma: '75-2920', status: 'Custom', group: 'in-app' },
  {
    slug: 'section-header',
    name: 'Section Header',
    figma: '75-2921',
    status: 'Custom',
    group: 'in-app',
  },
  {
    slug: 'filter-chips',
    name: 'Filter Chips',
    figma: '75-2922',
    status: 'Custom',
    group: 'in-app',
  },
  {
    slug: 'document-item',
    name: 'Document Item',
    figma: '75-2923',
    status: 'Custom',
    group: 'in-app',
  },
  { slug: 'banner', name: 'Banner', figma: '75-2924', status: 'Custom', group: 'in-app' },
  {
    slug: 'workspace-item',
    name: 'Workspace Item',
    figma: '75-2925',
    status: 'Custom',
    group: 'in-app',
  },
  {
    slug: 'toolbar',
    name: 'Toolbar',
    figma: '75-2926',
    status: 'Custom',
    group: 'in-app',
    native: true,
  },
  {
    slug: 'page-indicator',
    name: 'Page Indicator',
    figma: '75-2927',
    status: 'Custom',
    group: 'in-app',
  },
  { slug: 'quick-menu', name: 'Quick Menu', figma: '75-2928', status: 'Custom', group: 'in-app' },
  {
    slug: 'text-selection',
    name: 'Text Selection',
    figma: '75-2929',
    status: 'Custom',
    group: 'in-app',
  },
  {
    slug: 'color-swatch',
    name: 'Color Swatch',
    figma: '75-2930',
    status: 'Custom',
    group: 'in-app',
  },
  {
    slug: 'annotation-sheet',
    name: 'Annotation Sheet',
    figma: '75-2931',
    status: 'Custom',
    group: 'in-app',
  },
  {
    slug: 'color-picker',
    name: 'Color Picker',
    figma: '75-2932',
    status: 'Custom',
    group: 'in-app',
  },
  // ◆ In-app · LPM source batch (Oct 2026, New) — Figma 🆕 pages.
  {
    slug: 'showcase-flows',
    name: 'Showcase flows',
    figma: '271-6',
    status: 'New',
    group: 'in-app',
    native: true,
  },
  { slug: 'page-thumbnail', name: 'Page Thumbnail', figma: '197-31', status: 'New', group: 'in-app' },
  { slug: 'member-item', name: 'Member Item', figma: '205-24', status: 'New', group: 'in-app' },
  { slug: 'outline-item', name: 'Outline Item', figma: '212-19', status: 'New', group: 'in-app' },
  {
    slug: 'annotation-selection',
    name: 'Annotation Selection',
    figma: '216-18',
    status: 'New',
    group: 'in-app',
  },
  { slug: 'form-field', name: 'Form Field', figma: '219-23', status: 'New', group: 'in-app' },
  { slug: 'comment-item', name: 'Comment Item', figma: '225-26', status: 'New', group: 'in-app' },
  { slug: 'signature', name: 'Signature', figma: '230-21', status: 'New', group: 'in-app' },
  { slug: 'hint', name: 'Hint', figma: '239-6', status: 'New', group: 'in-app' },
  {
    slug: 'notification-item',
    name: 'Notification Item',
    figma: '240-6',
    status: 'New',
    group: 'in-app',
  },
] as const satisfies ReadonlyArray<{
  slug: string;
  name: string;
  /** Figma node id; '' = code-only component (no Figma page). */
  figma: string;
  /** Figma file the `figma` node lives in, when it is not PDF-Mobile-DS. */
  figmaFile?: string;
  status: ComponentStatus;
  group?: 'in-app';
  /**
   * Has a part the OS draws (◆ Date Picker system picker) or that looks different per OS (liquid
   * glass) → the page shows the iOS | Android switch on web.
   */
  native?: true;
}>;

export type ComponentSlug = (typeof COMPONENTS)[number]['slug'];

export function figmaUrl(nodeId: string, file: string = FIGMA_FILE_URL) {
  return `${file}?node-id=${nodeId}`;
}

/** Figma link for a component entry (handles entries that live outside PDF-Mobile-DS). */
export function componentFigmaUrl(meta: { figma: string; figmaFile?: string }) {
  return meta.figma ? figmaUrl(meta.figma, meta.figmaFile) : null;
}

/** Base kit components (Figma pages before "--- In-app ◆"). */
export const BASE_COMPONENTS = COMPONENTS.filter((c) => !('group' in c));
/** ◆ In-app components + Showcase demo. */
export const IN_APP_COMPONENTS = COMPONENTS.filter((c) => 'group' in c && c.group === 'in-app');

export function getComponent(slug: string) {
  return COMPONENTS.find((c) => c.slug === slug);
}

/** True for pages whose previews change with the iOS | Android switch. */
export function hasNativeParts(meta: (typeof COMPONENTS)[number] | undefined) {
  return !!meta && 'native' in meta && meta.native === true;
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
