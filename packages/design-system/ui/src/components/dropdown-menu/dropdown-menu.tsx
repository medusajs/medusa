"use client"

import { CheckMini, ChevronRightMini, EllipseMiniSolid } from "@zjedene-medusa/icons"
import { DropdownMenu as RadixDropdownMenu } from "radix-ui"
import * as React from "react"

import { clx } from "@/utils/clx"

/**
 * This component is based on the [Radix UI Dropdown Menu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) primitive.
 */
const Root = RadixDropdownMenu.Root
Root.displayName = "DropdownMenu"

/**
 * This component is based on the [Radix UI Dropdown Menu Trigger](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#trigger) primitive.
 */
const Trigger = RadixDropdownMenu.Trigger
Trigger.displayName = "DropdownMenu.Trigger"

/**
 * This component is based on the [Radix UI Dropdown Menu Group](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#group) primitive.
 */
const Group = RadixDropdownMenu.Group
Group.displayName = "DropdownMenu.Group"

/**
 * This component is based on the [Radix UI Dropdown Menu Sub](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#sub) primitive.
 */
const SubMenu = RadixDropdownMenu.Sub
SubMenu.displayName = "DropdownMenu.SubMenu"

/**
 * This component is based on the [Radix UI Dropdown Menu RadioGroup](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#radiogroup) primitive.
 */
const RadioGroup = RadixDropdownMenu.RadioGroup
RadioGroup.displayName = "DropdownMenu.RadioGroup"

/**
 * This component is based on the [Radix UI Dropdown Menu SubTrigger](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#subtrigger) primitive.
 */
const SubMenuTrigger = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.SubTrigger>
>(({ className, children, ...props }, ref) => (
  <RadixDropdownMenu.SubTrigger
    ref={ref}
    className={clx(
      "bg-ui-bg-component text-ui-fg-base txt-compact-small relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 outline-none transition-colors",
      "focus-visible:bg-ui-bg-component-hover focus:bg-ui-bg-component-hover",
      "active:bg-ui-bg-component-hover",
      "data-[disabled]:text-ui-fg-disabled data-[disabled]:pointer-events-none",
      "data-[state=open]:!bg-ui-bg-component-hover",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightMini className="text-ui-fg-muted ml-auto" />
  </RadixDropdownMenu.SubTrigger>
))
SubMenuTrigger.displayName = "DropdownMenu.SubMenuTrigger"

/**
 * This component is based on the [Radix UI Dropdown Menu SubContent](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#subcontent) primitive.
 */
const SubMenuContent = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.SubContent>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.SubContent>
>(({ className, collisionPadding = 8, ...props }, ref) => (
  <RadixDropdownMenu.Portal>
    <RadixDropdownMenu.SubContent
      ref={ref}
      collisionPadding={collisionPadding}
      className={clx(
        "bg-ui-bg-component text-ui-fg-base shadow-elevation-flyout max-h-[var(--radix-popper-available-height)] min-w-[220px] overflow-hidden rounded-lg p-1",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </RadixDropdownMenu.Portal>
))
SubMenuContent.displayName = "DropdownMenu.SubMenuContent"

/**
 * This component is based on the [Radix UI Dropdown Menu Content](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#content) primitive.
 */
const Content = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Content>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Content>
>(
  (
    {
      className,
      /**
       * The space in pixels between the dropdown menu and its trigger element.
       */
      sideOffset = 8,
      /**
       * The distance in pixels from the boundary edges where collision detection should occur.
       */
      collisionPadding = 8,
      /**
       * The alignment of the dropdown menu relative to its trigger element.
       * 
       * @defaultValue center
       */
      align = "center",
      ...props
    },
    ref
  ) => (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content
        ref={ref}
        sideOffset={sideOffset}
        align={align}
        collisionPadding={collisionPadding}
        className={clx(
          "bg-ui-bg-component text-ui-fg-base shadow-elevation-flyout max-h-[var(--radix-popper-available-height)] min-w-[220px] overflow-hidden rounded-lg p-1",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </RadixDropdownMenu.Portal>
  )
)
Content.displayName = "DropdownMenu.Content"

/**
 * This component is based on the [Radix UI Dropdown Menu Item](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#item) primitive.
 */
const Item = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Item>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Item>
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.Item
    ref={ref}
    className={clx(
      "bg-ui-bg-component text-ui-fg-base txt-compact-small relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 outline-none transition-colors",
      "focus-visible:bg-ui-bg-component-hover focus:bg-ui-bg-component-hover",
      "active:bg-ui-bg-component-hover",
      "data-[disabled]:text-ui-fg-disabled data-[disabled]:pointer-events-none",
      className
    )}
    {...props}
  />
))
Item.displayName = "DropdownMenu.Item"

/**
 * This component is based on the [Radix UI Dropdown Menu CheckboxItem](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#checkboxitem) primitive.
 */
const CheckboxItem = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <RadixDropdownMenu.CheckboxItem
    ref={ref}
    className={clx(
      "bg-ui-bg-component text-ui-fg-base txt-compact-small relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-[31px] pr-2 outline-none transition-colors",
      "focus-visible:bg-ui-bg-component-hover focus:bg-ui-bg-component-hover",
      "active:bg-ui-bg-component-hover",
      "data-[disabled]:text-ui-fg-disabled data-[disabled]:pointer-events-none",
      "data-[state=checked]:txt-compact-small-plus",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex size-[15px] items-center justify-center">
      <RadixDropdownMenu.ItemIndicator>
        <CheckMini />
      </RadixDropdownMenu.ItemIndicator>
    </span>
    {children}
  </RadixDropdownMenu.CheckboxItem>
))
CheckboxItem.displayName = "DropdownMenu.CheckboxItem"

/**
 * This component is based on the [Radix UI Dropdown Menu RadioItem](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#radioitem) primitive.
 */
const RadioItem = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.RadioItem>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <RadixDropdownMenu.RadioItem
    ref={ref}
    className={clx(
      "bg-ui-bg-component txt-compact-small relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-[31px] pr-2 outline-none transition-colors",
      "focus-visible:bg-ui-bg-component-hover focus:bg-ui-bg-component-hover",
      "active:bg-ui-bg-component-hover",
      "data-[disabled]:text-ui-fg-disabled data-[disabled]:pointer-events-none",
      "data-[state=checked]:txt-compact-small-plus",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-[15px] items-center justify-center">
      <RadixDropdownMenu.ItemIndicator>
        <EllipseMiniSolid className="text-ui-fg-base" />
      </RadixDropdownMenu.ItemIndicator>
    </span>
    {children}
  </RadixDropdownMenu.RadioItem>
))
RadioItem.displayName = "DropdownMenu.RadioItem"

/**
 * This component is based on the [Radix UI Dropdown Menu Label](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#label) primitive.
 */
const Label = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Label>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Label>
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.Label
    ref={ref}
    className={clx("text-ui-fg-subtle txt-compact-xsmall-plus", className)}
    {...props}
  />
))
Label.displayName = "DropdownMenu.Label"

/**
 * This component is based on the [Radix UI Dropdown Menu Separator](https://www.radix-ui.com/primitives/docs/components/dropdown-menu#separator) primitive.
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof RadixDropdownMenu.Separator>,
  React.ComponentPropsWithoutRef<typeof RadixDropdownMenu.Separator>
>(({ className, ...props }, ref) => (
  <RadixDropdownMenu.Separator
    ref={ref}
    className={clx(
      "bg-ui-border-component border-t-ui-border-menu-top border-b-ui-border-menu-bot -mx-1 my-1 h-0.5 border-b border-t",
      className
    )}
    {...props}
  />
))
Separator.displayName = "DropdownMenu.Separator"

/**
 * This component is based on the `span` element and supports all of its props
 */
const Shortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={clx(
        "text-ui-fg-subtle txt-compact-small ml-auto tracking-widest",
        className
      )}
      {...props}
    />
  )
}
Shortcut.displayName = "DropdownMenu.Shortcut"

/**
 * This component is based on the `span` element and supports all of its props
 */
const Hint = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={clx(
        "text-ui-fg-subtle txt-compact-small ml-auto tracking-widest",
        className
      )}
      {...props}
    />
  )
}
Hint.displayName = "DropdownMenu.Hint"

const DropdownMenu = Object.assign(Root, {
  Trigger,
  Group,
  SubMenu,
  SubMenuContent,
  SubMenuTrigger,
  Content,
  Item,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  Label,
  Separator,
  Shortcut,
  Hint,
})

export { DropdownMenu }
