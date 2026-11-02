"use client"

import {
  CheckCircleSolid,
  CircleDottedLine,
  CircleHalfSolid,
} from "@medusajs/icons"
import { Tabs as RadixTabs } from "radix-ui"
import * as React from "react"

import { ProgressStatus } from "@/types"
import { clx } from "@/utils/clx"

/**
 * This component is based on the [Radix UI Tabs](https://radix-ui.com/primitives/docs/components/tabs) primitves.
 *
 */
const ProgressTabsRoot = (props: RadixTabs.TabsProps) => {
  return <RadixTabs.Root {...props} />
}
ProgressTabsRoot.displayName = "ProgressTabs"

interface IndicatorProps extends Omit<
  React.ComponentPropsWithoutRef<"span">,
  "children"
> {
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

interface ProgressTabsTriggerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>,
  "asChild"
> {
  status?: ProgressStatus
}

const ProgressTabsTrigger = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Trigger>,
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
    <RadixTabs.Trigger
      ref={ref}
      className={clx(
        "txt-compact-small-plus inline-flex h-[52px] w-full max-w-[200px] flex-1 items-center gap-x-2 border-r border-r-ui-border-base bg-ui-bg-subtle px-4 text-left text-ui-fg-muted outline-none transition-fg",
        "group/trigger overflow-hidden text-ellipsis whitespace-nowrap",
        "disabled:bg-ui-bg-disabled disabled:text-ui-fg-muted",
        "hover:bg-ui-bg-subtle-hover",
        "focus:z-[1] focus-visible:bg-ui-bg-base",
        "data-[state=active]:bg-ui-bg-base data-[state=active]:text-ui-fg-base",
        className
      )}
      {...props}
    >
      <ProgressIndicator status={status} />
      {children}
    </RadixTabs.Trigger>
  )
)
ProgressTabsTrigger.displayName = "ProgressTabs.Trigger"

const ProgressTabsList = React.forwardRef<
  React.ElementRef<typeof RadixTabs.List>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.List>
>(({ className, ...props }, ref) => (
  <RadixTabs.List
    ref={ref}
    className={clx("flex items-center", className)}
    {...props}
  />
))
ProgressTabsList.displayName = "ProgressTabs.List"

const ProgressTabsContent = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Content>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(({ className, ...props }, ref) => {
  return (
    <RadixTabs.Content
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
