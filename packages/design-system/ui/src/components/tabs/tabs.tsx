"use client"

import { Tabs as RadixTabs } from "radix-ui"
import * as React from "react"

import { clx } from "@/utils/clx"

/**
 * This component is based on the [Radix UI Tabs](https://radix-ui.com/primitives/docs/components/tabs) primitves
 */
const TabsRoot = (
  props: React.ComponentPropsWithoutRef<typeof RadixTabs.Root>
) => {
  return <RadixTabs.Root {...props} />
}
TabsRoot.displayName = "Tabs"

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>
>(({ className, children, ...props }, ref) => (
  <RadixTabs.Trigger
    ref={ref}
    className={clx(
      "txt-compact-small-plus inline-flex items-center justify-center rounded-full border border-transparent bg-transparent px-2.5 py-1 text-ui-fg-subtle outline-none transition-fg",
      "hover:text-ui-fg-base",
      "focus-visible:border-ui-border-interactive focus-visible:bg-ui-bg-base focus-visible:!shadow-borders-focus",
      "data-[state=active]:bg-ui-bg-base data-[state=active]:text-ui-fg-base data-[state=active]:shadow-elevation-card-rest",
      className
    )}
    {...props}
  >
    {children}
  </RadixTabs.Trigger>
))
TabsTrigger.displayName = "Tabs.Trigger"

const TabsList = React.forwardRef<
  React.ElementRef<typeof RadixTabs.List>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.List>
>(({ className, ...props }, ref) => (
  <RadixTabs.List
    ref={ref}
    className={clx("flex items-center gap-2", className)}
    {...props}
  />
))
TabsList.displayName = "Tabs.List"

const TabsContent = React.forwardRef<
  React.ElementRef<typeof RadixTabs.Content>,
  React.ComponentPropsWithoutRef<typeof RadixTabs.Content>
>(({ className, ...props }, ref) => (
  <RadixTabs.Content
    ref={ref}
    className={clx("outline-none", className)}
    {...props}
  />
))
TabsContent.displayName = "Tabs.Content"

const Tabs = Object.assign(TabsRoot, {
  Trigger: TabsTrigger,
  List: TabsList,
  Content: TabsContent,
})

export { Tabs }
