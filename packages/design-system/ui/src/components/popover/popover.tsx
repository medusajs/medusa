import { Popover as RadixPopover } from "radix-ui"
import * as React from "react"

import { clx } from "@/utils/clx"

/**
 * This component is based on the [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover) primitves.
 */
const Root = (
  props: React.ComponentPropsWithoutRef<typeof RadixPopover.Root>
) => {
  return <RadixPopover.Root {...props} />
}
Root.displayName = "Popover"

const Trigger = React.forwardRef<
  React.ElementRef<typeof RadixPopover.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixPopover.Trigger>
>((props, ref) => {
  return <RadixPopover.Trigger ref={ref} {...props} />
})
Trigger.displayName = "Popover.Trigger"

const Anchor = React.forwardRef<
  React.ElementRef<typeof RadixPopover.Anchor>,
  React.ComponentPropsWithoutRef<typeof RadixPopover.Anchor>
>((props, ref) => {
  return <RadixPopover.Anchor ref={ref} {...props} />
})
Anchor.displayName = "Popover.Anchor"

const Close = React.forwardRef<
  React.ElementRef<typeof RadixPopover.Close>,
  React.ComponentPropsWithoutRef<typeof RadixPopover.Close>
>((props, ref) => {
  return <RadixPopover.Close ref={ref} {...props} />
})
Close.displayName = "Popover.Close"

interface ContentProps extends React.ComponentPropsWithoutRef<
  typeof RadixPopover.Content
> {}

/**
 * @excludeExternal
 */
const Content = React.forwardRef<
  React.ElementRef<typeof RadixPopover.Content>,
  ContentProps
>(
  (
    {
      className,
      /**
       * The distance in pixels from the anchor.
       */
      sideOffset = 8,
      /**
       * The preferred side of the anchor to render against when open.
       * Will be reversed when collisions occur and `avoidCollisions` is enabled.
       */
      side = "bottom",
      /**
       * The preferred alignment against the anchor. May change when collisions occur.
       */
      align = "start",
      collisionPadding,
      ...props
    }: ContentProps,
    ref
  ) => {
    return (
      <RadixPopover.Portal>
        <RadixPopover.Content
          ref={ref}
          sideOffset={sideOffset}
          side={side}
          align={align}
          collisionPadding={collisionPadding}
          className={clx(
            "max-h-[var(--radix-popper-available-height)] min-w-[220px] overflow-hidden rounded-lg bg-ui-bg-base p-1 text-ui-fg-base shadow-elevation-flyout",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          {...props}
        />
      </RadixPopover.Portal>
    )
  }
)
Content.displayName = "Popover.Content"

const Seperator = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clx("-mx-1 my-1 h-px bg-ui-border-base", className)}
      {...props}
    />
  )
})
Seperator.displayName = "Popover.Seperator"

const Popover = Object.assign(Root, {
  Trigger,
  Anchor,
  Close,
  Content,
  Seperator,
})

export { Popover }
