"use client"

import { EllipseMiniSolid, TrianglesMini } from "@medusajs/icons"
import * as SelectPrimitive from "@radix-ui/react-select"
import { cva } from "cva"
import * as React from "react"

import { clx } from "@/utils/clx"

interface SelectProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  size?: "base" | "small"
}

type SelectContextValue = {
  size: "base" | "small"
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

const useSelectContext = () => {
  const context = React.useContext(SelectContext)

  if (context === null) {
    throw new Error("useSelectContext must be used within a SelectProvider")
  }

  return context
}

/**
 * This component is based on [Radix UI Select](https://www.radix-ui.com/primitives/docs/components/select).
 * It also accepts all props of the HTML `select` component.
 */
const Root = ({
  children,
  /**
   * The select's size.
   */
  size = "base",
  ...props
}: SelectProps) => {
  return (
    <SelectContext.Provider value={React.useMemo(() => ({ size }), [size])}>
      <SelectPrimitive.Root {...props}>{children}</SelectPrimitive.Root>
    </SelectContext.Provider>
  )
}
Root.displayName = "Select"

/**
 * Groups multiple items together.
 */
const Group = SelectPrimitive.Group
Group.displayName = "Select.Group"

/**
 * Displays the selected value, or a placeholder if no value is selected.
 * It's based on [Radix UI Select Value](https://www.radix-ui.com/primitives/docs/components/select#value).
 */
const Value = SelectPrimitive.Value
Value.displayName = "Select.Value"

const triggerVariants = cva({
  base: clx(
    "bg-ui-bg-field shadow-buttons-neutral transition-fg flex w-full select-none items-center justify-between rounded-md outline-none",
    "data-[placeholder]:text-ui-fg-muted text-ui-fg-base",
    "hover:bg-ui-bg-field-hover",
    "focus-visible:shadow-borders-interactive-with-active data-[state=open]:!shadow-borders-interactive-with-active",
    "aria-[invalid=true]:border-ui-border-error aria-[invalid=true]:shadow-borders-error",
    "invalid:border-ui-border-error invalid:shadow-borders-error",
    "disabled:!bg-ui-bg-disabled disabled:!text-ui-fg-disabled",
    "group/trigger"
  ),
  variants: {
    size: {
      base: "h-8 px-2 py-1.5 txt-compact-small",
      small: "h-7 px-2 py-1 txt-compact-small",
    },
  },
})

/**
 * The trigger that toggles the select.
 */
const Trigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const { size } = useSelectContext()

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={clx(triggerVariants({ size }), className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <TrianglesMini className="text-ui-fg-muted group-disabled/trigger:text-ui-fg-disabled" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
Trigger.displayName = "Select.Trigger"

const Content = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(
  (
    {
      className,
      children,
      position = "popper",
      sideOffset = 8,
      collisionPadding = 24,
      ...props
    },
    ref
  ) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={clx(
          "bg-ui-bg-component text-ui-fg-base shadow-elevation-flyout relative max-h-[200px] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          {
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1":
              position === "popper",
          },
          className
        )}
        position={position}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={clx(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
)
Content.displayName = "Select.Content"

/**
 * Used to label a group of items.
 */
const Label = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={clx(
      "txt-compact-xsmall-plus text-ui-fg-muted px-2 py-1.5",
      className
    )}
    {...props}
  />
))
Label.displayName = "Select.Label"

/**
 * An item in the select. It's based on [Radix UI Select Item](https://www.radix-ui.com/primitives/docs/components/select#item)
 * and accepts its props.
 */
const Item = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={clx(
        "bg-ui-bg-component grid cursor-pointer grid-cols-[15px_1fr] gap-x-2 rounded-[4px] px-2 py-1.5 outline-none transition-colors txt-compact-small items-center",
        "focus-visible:bg-ui-bg-component-hover",
        "active:bg-ui-bg-component-pressed",
        "data-[state=checked]:txt-compact-small-plus",
        "disabled:text-ui-fg-disabled",
        className
      )}
      {...props}
    >
      <span className="flex h-[15px] w-[15px] items-center justify-center">
        <SelectPrimitive.ItemIndicator className="flex items-center justify-center">
          <EllipseMiniSolid />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText className="flex-1 truncate">
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
})
Item.displayName = "Select.Item"

const Separator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={clx("bg-ui-border-component -mx-1 my-1 h-0.5 border-t border-t-ui-border-menu-top border-b border-b-ui-border-menu-bot", className)}
    {...props}
  />
))
Separator.displayName = "Select.Separator"

const Select = Object.assign(Root, {
  Group,
  Value,
  Trigger,
  Content,
  Label,
  Item,
  Separator,
})

export { Select }
