# TSDoc: UI Components

UI component files live under `packages/design-system/ui/src/components/`. They export React components as named or default exports.

## Rules

- Document the exported component with a 1-sentence description
- Document props inline inside the destructured parameter list
- For Radix UI-based components: reference the Radix primitive in the component doc
- For components that fully forward props to Radix without customization, document the component only — individual props come from Radix and don't need repeating
- Do NOT add `@param`, `@returns`, or `@since` to components (use `@since` only if version is in the prompt and component is new)

## Component Description Format

**Standard component:**
```typescript
/**
 * A clickable button element with multiple visual styles and sizes.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(...)
```

**Radix UI-based component:**
```typescript
/**
 * This component is based on the [Radix UI Tabs](https://radix-ui.com/primitives/docs/components/tabs) primitive.
 */
const TabsRoot = (props: React.ComponentPropsWithoutRef<typeof RadixTabs.Root>) => {
```

## Inline Prop Documentation

Document props as inline comments inside the destructured parameter list:

```typescript
// ✅ correct — inline prop docs
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      /**
       * The button's visual style.
       */
      variant = "primary",
      /**
       * The button's size.
       */
      size = "base",
      /**
       * Whether to render as the child element instead of a `button`.
       */
      asChild = false,
      /**
       * Whether to show a loading spinner.
       */
      isLoading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
```

```typescript
// ❌ wrong — separate interface TSDoc for each prop
interface ButtonProps {
  /** The button's visual style. */
  variant?: string
  // ... (document interface props separately only if the interface itself is exported)
}
```

> **Note:** If the `Props` interface is exported, document it and its properties too. If it's internal to the file, inline documentation on destructured params is preferred.

## Props Interface (if exported)

```typescript
/**
 * The props for the Button component.
 */
export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  /**
   * Whether to show a loading spinner and disable interaction.
   */
  isLoading?: boolean
  /**
   * Whether to render as the child element instead of a `button`.
   */
  asChild?: boolean
}
```

## Full Before/After Example

**Before:**
```typescript
interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "base", asChild = false, isLoading = false, ...props }, ref) => {
    // ...
  }
)
```

**After:**
```typescript
interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  asChild?: boolean
}

/**
 * This component is based on the `button` element and supports all of its props.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      /**
       * The button's visual style.
       */
      variant = "primary",
      /**
       * The button's size.
       */
      size = "base",
      /**
       * Whether to render as the child element instead of a `button`.
       */
      asChild = false,
      /**
       * Whether to show a loading spinner.
       */
      isLoading = false,
      ...props
    },
    ref
  ) => {
    // ...
  }
)
```

## @excludeExternal — Hiding Inherited Props

When a component's `Props` interface extends a native HTML element type (e.g. `React.ComponentPropsWithoutRef<"div">`) or a third-party component type, it inherits many props (`className`, `children`, `style`, `id`, etc.) that don't need to appear in the generated docs.

Add `@excludeExternal` to the component's TSDoc block to suppress those inherited external props:

```typescript
// AlertProps extends React.ComponentPropsWithoutRef<"div">, which includes
// className, children, style, id, onClick, etc.
interface AlertProps extends React.ComponentPropsWithoutRef<"div"> {
  variant?: "error" | "success" | "warning" | "info"
  dismissible?: boolean
}

/**
 * This component is based on the div element and supports all of its props
 *
 * @excludeExternal
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      /**
       * The variant of the alert
       */
      variant = "info",
      /**
       * Whether the alert is dismissible
       */
      dismissible = false,
      className,
      children,
      ...props
    }: AlertProps,
    ref
  ) => {
```

If the component's `Props` interface only contains custom props (no `extends` of an external type), `@excludeExternal` can be omitted.

## @keep — Preserving Specific External Props

`@excludeExternal` hides ALL inherited props. Use `@keep` on individual external props that are meaningful for the user to know about — for example, `disabled` or event handlers with non-obvious behavior in this component.

Add `@keep` (and optionally `@defaultValue`) inline on the prop:

```typescript
/**
 * This component is based on the input element and supports all of its props
 *
 * @excludeExternal
 */
const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      /**
       * The input's size.
       */
      size = "base",
      /**
       * Whether the input is disabled.
       *
       * @keep
       * @defaultValue false
       */
      disabled,
      /**
       * A function that is triggered when the input is invalid.
       *
       * @keep
       */
      onInvalid,
      ...props
    }: CurrencyInputProps,
    ref
  ) => {
```

> **When to use `@keep`:** On inherited props with non-obvious behavior in this component (e.g. `disabled` triggers a custom visual state, `onInvalid` is wired to internal validation). Do NOT `@keep` generic passthrough props like `className`, `style`, or `id`.

## Radix-based Passthrough Components

For thin wrappers that only add styling and forward all Radix props:

```typescript
/**
 * This component is based on the [Radix UI Dialog](https://radix-ui.com/primitives/docs/components/dialog) primitive.
 */
const DialogRoot = (
  props: React.ComponentPropsWithoutRef<typeof RadixDialog.Root>
) => {
  return <RadixDialog.Root {...props} />
}
```

No `@excludeExternal` needed here — there are no custom props and no individual prop docs.
