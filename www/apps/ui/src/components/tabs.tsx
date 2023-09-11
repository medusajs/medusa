"use client"

import { clx } from "@medusajs/ui"
import * as Primitives from "@radix-ui/react-tabs"
import * as React from "react"

const Tabs = Primitives.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof Primitives.List>,
  React.ComponentPropsWithoutRef<typeof Primitives.List>
  // eslint-disable-next-line react/prop-types
>(({ className, ...props }, ref) => (
  <Primitives.List
    ref={ref}
    className={clx(
      "inline-flex h-10 w-full items-end justify-start rounded-none bg-transparent p-0",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof Primitives.Trigger>,
  React.ComponentPropsWithoutRef<typeof Primitives.Trigger>
  // eslint-disable-next-line react/prop-types
>(({ className, ...props }, ref) => (
  <Primitives.Trigger
    ref={ref}
    className={clx(
      "text-ui-fg-subtle txt-compact-small-plus rounded-full px-3 py-1.5 transition-all",
      "data-[state=active]:shadow-elevation-card-rest data-[state=active]:text-ui-fg-base",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  React.ElementRef<typeof Primitives.Content>,
  React.ComponentPropsWithoutRef<typeof Primitives.Content>
  // eslint-disable-next-line react/prop-types
>(({ className, ...props }, ref) => (
  <Primitives.Content
    ref={ref}
    className={clx(
      "w-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[state=active]:mt-4",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = "TabsContent"

export { Tabs, TabsContent, TabsList, TabsTrigger }
