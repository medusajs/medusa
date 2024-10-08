"use client"

import {
  CheckCircleSolid,
  CircleDottedLine,
  CircleHalfSolid,
} from "@medusajs/icons"
import * as ProgressTabsPrimitives from "@radix-ui/react-tabs"
import * as React from "react"

import { ProgressStatus } from "@/types"
import { clx } from "@/utils/clx"

/**
 * This component is based on the [Radix UI Tabs](https://radix-ui.com/primitives/docs/components/tabs) primitves.
 *
 * @excludeExternal
 */
const ProgressTabsRoot = (props: ProgressTabsPrimitives.TabsProps) => {
  return <ProgressTabsPrimitives.Root {...props} />
}
ProgressTabsRoot.displayName = "ProgressTabs"

interface IndicatorProps
  extends Omit<React.ComponentPropsWithoutRef<"span">, "children"> {
  /**
   * The current status.
   */
  status?: ProgressStatus
}

const ProgressIndicator = ({ status, className, ...props }: IndicatorProps) => {
  const Icon = React.useMemo(() => {
    switch (status) {
      case "not-started":
        return CircleDottedLine
      case "in-progress":
        return CircleHalfSolid
      case "completed":
        return CheckCircleSolid
      default:
        return CircleDottedLine
    }
  }, [status])

  return (
    <span
      className={clx(
        "text-ui-fg-muted group-data-[state=active]/trigger:text-ui-fg-interactive",
        className
      )}
      {...props}
    >
      <Icon />
    </span>
  )
}
ProgressIndicator.displayName = "ProgressTabs.ProgressIndicator"

interface ProgressTabsTriggerProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof ProgressTabsPrimitives.Trigger>,
    "asChild"
  > {
  status?: ProgressStatus
}

const ProgressTabsTrigger = React.forwardRef<
  React.ElementRef<typeof ProgressTabsPrimitives.Trigger>,
  ProgressTabsTriggerProps
>(
  (
    {
      className,
      children,
      status = "not-started",
      ...props
    }: ProgressTabsTriggerProps,
    ref
  ) => (
    <ProgressTabsPrimitives.Trigger
      ref={ref}
      className={clx(
        "txt-compact-small-plus transition-fg text-ui-fg-muted bg-ui-bg-subtle border-r-ui-border-base inline-flex h-[52px] w-full max-w-[200px] flex-1 items-center gap-x-2 border-r px-4 text-left outline-none",
        "group/trigger overflow-hidden text-ellipsis whitespace-nowrap",
        "disabled:bg-ui-bg-disabled disabled:text-ui-fg-muted",
        "hover:bg-ui-bg-subtle-hover",
        "focus-visible:bg-ui-bg-base focus:z-[1]",
        "data-[state=active]:text-ui-fg-base data-[state=active]:bg-ui-bg-base",
        className
      )}
      {...props}
    >
      <ProgressIndicator status={status} />
      {children}
    </ProgressTabsPrimitives.Trigger>
  )
)
ProgressTabsTrigger.displayName = "ProgressTabs.Trigger"

const ProgressTabsList = React.forwardRef<
  React.ElementRef<typeof ProgressTabsPrimitives.List>,
  React.ComponentPropsWithoutRef<typeof ProgressTabsPrimitives.List>
>(({ className, ...props }, ref) => (
  <ProgressTabsPrimitives.List
    ref={ref}
    className={clx("flex items-center", className)}
    {...props}
  />
))
ProgressTabsList.displayName = "ProgressTabs.List"

const ProgressTabsContent = React.forwardRef<
  React.ElementRef<typeof ProgressTabsPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof ProgressTabsPrimitives.Content>
>(({ className, ...props }, ref) => {
  return (
    <ProgressTabsPrimitives.Content
      ref={ref}
      className={clx("outline-none", className)}
      {...props}
    />
  )
})
ProgressTabsContent.displayName = "ProgressTabs.Content"

const ProgressTabs = Object.assign(ProgressTabsRoot, {
  Trigger: ProgressTabsTrigger,
  List: ProgressTabsList,
  Content: ProgressTabsContent,
})

export { ProgressTabs }
