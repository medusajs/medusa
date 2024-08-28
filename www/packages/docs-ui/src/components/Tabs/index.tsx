"use client"

import React, { useMemo } from "react"
import { Tabs as UiTabs } from "@medusajs/ui"
import { ComponentProps } from "react"
import clsx from "clsx"
import { EllipseMiniSolid } from "@medusajs/icons"
import { useMobile } from "../.."

type TabsProps = ComponentProps<typeof UiTabs> & {
  layoutType?: "horizontal" | "vertical"
}

export const Tabs = ({
  layoutType = "horizontal",
  className,
  ...props
}: TabsProps) => {
  const { isMobile } = useMobile()

  const layout = useMemo(() => {
    return isMobile ? "horizontal" : layoutType
  }, [layoutType, isMobile])

  return (
    <UiTabs
      {...props}
      className={clsx(
        className,
        layout === "vertical" && [
          "flex gap-docs_1",
          "[&_[role=tablist]]:flex-col [&_[role=tablist]]:items-start",
          "[&_[role=tablist]+*]:flex-1 [&_[role=tablist]+*]:!mt-0",
          "[&_[role=tablist]+*]:w-3/4 [&_[role=tablist]]:w-1/4",
        ]
      )}
    />
  )
}

export const TabsList = ({
  className,
  ...props
}: ComponentProps<typeof UiTabs.List>) => (
  <UiTabs.List {...props} className={clsx(className, "gap-docs_0.5")} />
)

export const TabsTrigger = ({
  className,
  ...props
}: ComponentProps<typeof UiTabs.Trigger>) => (
  <UiTabs.Trigger
    {...props}
    className={clsx(
      className,
      "px-[10px] py-docs_0.25 data-[state=active]:text-ui-fg-base data-[state=active]:bg-ui-bg-base data-[state=active]:shadow-elevation-card-rest",
      "hover:text-ui-fg-base focus-visible:border-ui-border-interactive focus-visible:!shadow-borders-focus focus-visible:bg-ui-bg-base"
    )}
  />
)

export const TabsTriggerVertical = ({
  className,
  children,
  ...props
}: ComponentProps<typeof UiTabs.Trigger>) => {
  const { isMobile } = useMobile()

  if (isMobile) {
    return (
      <TabsTrigger className={className} {...props}>
        {children}
      </TabsTrigger>
    )
  }

  return (
    <UiTabs.Trigger
      {...props}
      className={clsx(
        className,
        "px-docs_0.5 py-docs_0.25 !text-medusa-fg-base text-compact-small data-[state=active]:!text-compact-small-plus",
        "[&[data-state=active]_svg]:!visible hover:!bg-medusa-bg-base-hover rounded-docs_DEFAULT",
        "!shadow-none"
      )}
    >
      <EllipseMiniSolid className="invisible" />
      {children}
    </UiTabs.Trigger>
  )
}

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

export const TabsContent = (props: ComponentProps<typeof UiTabs.Content>) => (
  <UiTabs.Content {...props} />
)
