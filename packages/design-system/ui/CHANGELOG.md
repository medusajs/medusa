# @medusajs/ui

## 3.0.1

### Patch Changes

- [`52520d9080`](https://github.com/medusajs/medusa/commit/52520d90800e473e89254c4a424d5dffc6edfc30) Thanks [@olivermrbl](https://github.com/olivermrbl)! - chore: Add missing changeset

- Updated dependencies [[`52520d9080`](https://github.com/medusajs/medusa/commit/52520d90800e473e89254c4a424d5dffc6edfc30)]:
  - @medusajs/icons@1.2.2

## 3.0.0

### Major Changes

- [#7076](https://github.com/medusajs/medusa/pull/7076) [`c3260a2c5a`](https://github.com/medusajs/medusa/commit/c3260a2c5add86ada641db91e834d9f9de62ed14) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(ui): Re-work `<Toaster />` and `<Toast />` based on `sonner`.

  This update contains breaking changes to how toasts work in `@medusajs/ui`. This update has been made to provide a better user experience and to make it easier to use toasts in your Medusa application.

  ### BREAKING CHANGES

  The `useToast` hook has been removed. Users should instead use the `toast` function that is exported from the `@medusajs/ui` package. This function can be used to show toasts in your application. For more information on how to use the `toast` function, please refer to the documentation.

  The `Toaster` component is still available but the options for the component have changed. The default position has been changed to `bottom-right`. For more information on the `Toaster` component, please refer to the documentation.

## 2.4.3

### Patch Changes

- [#6779](https://github.com/medusajs/medusa/pull/6779) [`247ca3c3fa`](https://github.com/medusajs/medusa/commit/247ca3c3fadd69a1e90415041643727b53458e41) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(ui): Ensure that Hint's with variant 'error' are not squished when constrained.

- [#6680](https://github.com/medusajs/medusa/pull/6680) [`26531c5a38`](https://github.com/medusajs/medusa/commit/26531c5a38bf09ab3e77a1444cefd65a073ae713) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(ui-preset): Pull latest styles from Figma.
  fix(ui): Fix invalid state styling of Select, so it correctly shows when aria-invalid is true.
  fix(medusa): Align query params between `/admin/products/:id/variants` and `/admin/variants`.
  chore(client-types): Update `medusa` client types to reflect changes to the API.

## 2.4.2

### Patch Changes

- [#6347](https://github.com/medusajs/medusa/pull/6347) [`869dc751a0`](https://github.com/medusajs/medusa/commit/869dc751a041abc70b2eb9acb36e147d7fd4fd62) Thanks [@github-actions](https://github.com/apps/github-actions)! - fix(ui): explicitly specify props type

- [#6564](https://github.com/medusajs/medusa/pull/6564) [`2d00625729`](https://github.com/medusajs/medusa/commit/2d00625729e7dab02149751327239992dea3a8e1) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa,ui) Export param types for workflow endpoints. Add support for JSON to CodeBlock component.

- [#6380](https://github.com/medusajs/medusa/pull/6380) [`d37ff8024d`](https://github.com/medusajs/medusa/commit/d37ff8024d8affbe84db3c0b6d79cd41016bfac4) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(medusa,ui): Fixes list query params for the following endpoints: "/admin/customers", "/admin/customer-groups", "/admin/gift-cards", and "/admin/collections".

- [#6534](https://github.com/medusajs/medusa/pull/6534) [`44a5567d0d`](https://github.com/medusajs/medusa/commit/44a5567d0df71fb85a566e29748a6c8e21272163) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(ui): Left aligns text in RadioGroup.Choicebox component.

- Updated dependencies [[`44d43e8155`](https://github.com/medusajs/medusa/commit/44d43e8155d1b1ca0af5e900787411c7d0b027c0)]:
  - @medusajs/icons@1.2.1

## 2.4.1

### Patch Changes

- [#6357](https://github.com/medusajs/medusa/pull/6357) [`85a44dfd0`](https://github.com/medusajs/medusa/commit/85a44dfd017ab53b539bcfca04a32f1a0786a23c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(ui,ui-preset): Fixes an issue where the color styles of two code components was broken

## 2.4.0

### Minor Changes

- [#6310](https://github.com/medusajs/medusa/pull/6310) [`73fd92a1a`](https://github.com/medusajs/medusa/commit/73fd92a1afdec88c0d5f4aeed16349f2bd62cfa2) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(ui): Add Alert component.

### Patch Changes

- [#6297](https://github.com/medusajs/medusa/pull/6297) [`8cbf6c60f`](https://github.com/medusajs/medusa/commit/8cbf6c60fec7fe8ddf59dcf420b9339f84b8636c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(ui,ui-preset): Update to latest version of TailwindCSS. Increase spacing between columns in <Table /> component.

## 2.3.0

### Minor Changes

- [#6061](https://github.com/medusajs/medusa/pull/6061) [`a2c149e7e5`](https://github.com/medusajs/medusa/commit/a2c149e7e588a9ebf080b4b43472bdb5126ed981) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feat(ui): Updates spacing and sizing of components. Introduces new `size` variants for some components, such as `Button`, `IconButton`, and `Avatar`. Change most `:focus` styles to `:focus-visible` styles, to prevenent focus styles from being visible when not needed, such as on button clicks.
  feat(ui-preset): Publishes latest updates to our design system styles, as well as adding new colors. Noticable changes include changing `ui-code-text-*` styles to `ui-code-fg-*` for better consistency.
  feat(icons): Updates the `LockClosedSolid` and `LockOpenSolid` icons, and introduces four new icons: `LockClosedSolidMini`, `TriangleLeftMini`, `TriangleRightMini`, and `TriangleMini`.

### Patch Changes

- [#6162](https://github.com/medusajs/medusa/pull/6162) [`c37c82c5b`](https://github.com/medusajs/medusa/commit/c37c82c5b5c046124b82750530d555b2996147cc) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - feature(ui): Adds a `size` variant to `<Copy />` component, and prevent clicks from propigating to parent elements". Also adds additional sizes to the `<Avatar />` component.

- [#6120](https://github.com/medusajs/medusa/pull/6120) [`e49b6944e3`](https://github.com/medusajs/medusa/commit/e49b6944e3380a4ee0de086e173901d643ec800c) Thanks [@kasperkristensen](https://github.com/kasperkristensen)! - fix(ui): Fix broken responsive style of Drawer between `sm` and `md`.

- Updated dependencies [[`a2c149e7e5`](https://github.com/medusajs/medusa/commit/a2c149e7e588a9ebf080b4b43472bdb5126ed981)]:
  - @medusajs/icons@1.2.0

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
