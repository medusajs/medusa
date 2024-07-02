import * as Primitives from "@radix-ui/react-popover"
import * as React from "react"

import { clx } from "@/utils/clx"

/**
 * This component is based on the [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover) primitves.
 */
const Root = (
  props: React.ComponentPropsWithoutRef<typeof Primitives.Root>
) => {
  return <Primitives.Root {...props} />
}
Root.displayName = "Popover"

const Trigger = React.forwardRef<
  React.ElementRef<typeof Primitives.Trigger>,
  React.ComponentPropsWithoutRef<typeof Primitives.Trigger>
>((props, ref) => {
  return <Primitives.Trigger ref={ref} {...props} />
})
Trigger.displayName = "Popover.Trigger"

const Anchor = React.forwardRef<
  React.ElementRef<typeof Primitives.Anchor>,
  React.ComponentPropsWithoutRef<typeof Primitives.Anchor>
>((props, ref) => {
  return <Primitives.Anchor ref={ref} {...props} />
})
Anchor.displayName = "Popover.Anchor"

const Close = React.forwardRef<
  React.ElementRef<typeof Primitives.Close>,
  React.ComponentPropsWithoutRef<typeof Primitives.Close>
>((props, ref) => {
  return <Primitives.Close ref={ref} {...props} />
})
Close.displayName = "Popover.Close"

interface ContentProps
  extends React.ComponentPropsWithoutRef<typeof Primitives.Content> {}

/**
 * @excludeExternal
 */
const Content = React.forwardRef<
  React.ElementRef<typeof Primitives.Content>,
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
      <Primitives.Portal>
        <Primitives.Content
          ref={ref}
          sideOffset={sideOffset}
          side={side}
          align={align}
          collisionPadding={collisionPadding}
          className={clx(
            "bg-ui-bg-base text-ui-fg-base shadow-elevation-flyout max-h-[var(--radix-popper-available-height)] min-w-[220px] overflow-hidden rounded-lg p-1",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          {...props}
        />
      </Primitives.Portal>
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
      className={clx("bg-ui-border-base -mx-1 my-1 h-px", className)}
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
