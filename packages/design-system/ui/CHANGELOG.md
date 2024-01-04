# @medusajs/ui

## 2.2.4

### Patch Changes

- [#5818](https://github.com/medusajs/medusa/pull/5818) [`591ba2388`](https://github.com/medusajs/medusa/commit/591ba2388d9768f70ca2faf48d353e5a65e4e123) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(ui): Bump 'class-variance-authority' to 'cva@beta' and update usage to new API. Also fix the naming of usePrompt types

## 2.2.3

### Patch Changes

- [#5692](https://github.com/medusajs/medusa/pull/5692) [`b25b29fe7`](https://github.com/medusajs/medusa/commit/b25b29fe7ba3bc9fca8da7a6b10461437a3e4d2d) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(ui): Update the styling of CodeBlock

## 2.2.2

### Patch Changes

- [#5640](https://github.com/medusajs/medusa/pull/5640) [`a67a8e7e9`](https://github.com/medusajs/medusa/commit/a67a8e7e90f35636c8d99858fc5b19358df4c174) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(ui): Fix the width of line numbers in the CodeBlock component, such that they are always the same width as the widest line number.

## 2.2.1

### Patch Changes

- [#5596](https://github.com/medusajs/medusa/pull/5596) [`e3f1da92d`](https://github.com/medusajs/medusa/commit/e3f1da92db1a5bb07ae8d79a90f0d1d04f9bfee3) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(admin-ui,ui): Align @types/react versions

## 2.2.0

### Minor Changes

- 7f58964: fix(ui): 2.2.0

  # Changelog

  ## `@medusajs/ui`

  This minor release contains a few bug fixes and improvements, as well as a new primitive component.

  ### Fixes

  - Fixes an issue that was preventing the onChange event from firing for the `DatePicker` component when `showTimePicker` was false.
  - Fixes an issue where the `DatePicker` component would fire the onChange event when clicking outside of the component. It now only fires the event when the "Apply" button is clicked.

  ### New Components

  - Adds a new `Popover` component. This component is a primitive component that can be used to create popovers. It shares much of the same styling as the `DropdownMenu` component, and can be used as a replacement when building highly customized dropdowns where the `DropdownMenu` component is not flexible enough.

## 2.1.0

### Minor Changes

- 035fa72: feat(ui,ui-preset): Release 2.1.0

  ## `@medusajs/ui`

  - The styling of buttons, inputs, and the CommandBar has been adjusted to have a more consistent look and feel.
  - Fixed an issue that caused DropdownMenu.Content to overflow the viewport.
  - Fixed an issue with the DatePicker component where deleting a time segment would throw an error.
  - The Text component now accepts a `leading` prop to adjust the line height. It can be set to `normal` (default) or `compact`. This change in the API is fully backwards compatible.
  - Adds a new subcomponent to RadioGroup called RadioGroup.ChoiceBox. This component wraps the RadioGroup.Item component with a mandatory label and description.

  ## `@medusajs/ui-preset`

  - Updated several colors, shadows, and gradient effects.

  ## `@medusajs/icons`

  - Introduces 6 new icons: QuestionMark, SparklesMiniSolid, SparklesMini, ThumbDown, ThumbUp, and UserCircleMini.
  - There have been slight adjustments made to ArrowPathMini, EllipseBlueSolid, EllipseGreenSolid, EllipseGreySolid, EllipseOrangeSolid, EllipsePurpleSolid, and EllipseRedSolid.

### Patch Changes

- Updated dependencies [035fa72]
  - @medusajs/icons@1.1.0

## 2.0.0

### Major Changes

- ef98084: feat(ui,icons,ui-preset): Update to Medusa UI, including new components, icons, and preset styles.

  # Changes in `@medusajs/ui`

  ## New components

  - `IconButton` - A button that only contains an icon.
  - `IconBadge` - A badge that only contains an icon.
  - `StatusBadge` - A badge component specifically designed to be used for displaying statuses.
  - `Tabs` - A tab component that can be used to switch between different views.
  - `ProgressTabs` - A tab component specifically designed to be used for building multi-step tasks.
  - `ProgressAccordion` - An accordion component specifically designed to be used for building multi-step tasks.
  - `CurrencyInput` - An input component that can be used to input currency values.
  - `CommandBar` - A component that can be used to display a list of keyboard commands omn the screen.
  - `CurrencyInput` - An input component that can be used to input currency values, such as prices.

  ## Breaking changes

  Several components have been reorganized to streamline their API. The following components have breaking changes:

  - Button - The `format` property has been removed. To create a Icon only button, use the new `IconButton` component.
  - Badge - The `format` property has been removed. To create a Icon only badge, use the new `IconBadge` component. The border radius of the component is now controlled using the new `rounded` property.
  - CodeBlock - The `hideLineNumbers` property has been moved to the `snippets` property. This allows users to control the visibility of line numbers on a per snippet basis.

  ## Other changes

  - The `z-index`'s of all components have been cleaned up to to make stacking portalled components easier.
  - `Table.Pagination` has been tweaked to ensure that it displays the correct number of pages when there is no data.
  - `Calendar` has been tweaked to prevent clicking a date from submitting any forms that precede it in the DOM.

  # Changes in `@medusajs/icons`

  ## New icons

  - `X`
  - `AcademicCap`
  - `Figma`
  - `Photo`
  - `PuzzleSolid`
  - `Text`

  # Changes in `@medusajs/ui-preset`

  Minor tweaks to colors, typography, and animations.

### Patch Changes

- Updated dependencies [ef98084]
  - @medusajs/icons@1.0.1

## 1.0.0

### Major Changes

- 8d31ce6: Release of the Medusa UI design system, includes three new packages: `@medusajs/ui` a set of React components, hooks, and utils; `@medusajs/icons` a set of React icons; `@medusajs/ui-preset` a Tailwind CSS preset containing Medusa UI design tokens.

### Patch Changes

- Updated dependencies [8d31ce6]
  - @medusajs/icons@1.0.0
