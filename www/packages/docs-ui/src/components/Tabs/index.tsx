"use client"

import React from "react"
import { Tabs as UiTabs } from "@medusajs/ui"
import { ComponentProps } from "react"
import clsx from "clsx"
import { Key } from "types"

export const Tabs = (props: ComponentProps<typeof UiTabs> & Key) => (
  <UiTabs {...props} />
)

export const TabsList = ({
  className,
  ...props
}: ComponentProps<typeof UiTabs.List> & Key) => (
  <UiTabs.List {...props} className={clsx(className, "gap-docs_0.5")} />
)

export const TabsTrigger = ({
  className,
  ...props
}: ComponentProps<typeof UiTabs.Trigger> & Key) => (
  <UiTabs.Trigger
    {...props}
    className={clsx(
      className,
      "px-[10px] py-docs_0.25 data-[state=active]:text-ui-fg-base data-[state=active]:bg-ui-bg-base data-[state=active]:shadow-elevation-card-rest",
      "hover:text-ui-fg-base focus-visible:border-ui-border-interactive focus-visible:!shadow-borders-focus focus-visible:bg-ui-bg-base"
    )}
  />
)

type TabsContentWrapperProps = {
  className?: string
  children: React.ReactNode
}

export const TabsContentWrapper = ({
  className,
  ...props
}: TabsContentWrapperProps) => (
  <div {...props} className={clsx(className, "mt-docs_0.5")} />
)

export const TabsContent = (
  props: ComponentProps<typeof UiTabs.Content> & Key
) => <UiTabs.Content {...props} />
