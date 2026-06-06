"use client"

import {
  CheckCircleSolid,
  CircleDottedLine,
  CircleHalfSolid,
  Plus,
} from "@zjedene-medusa/icons"
import { Accordion as RadixAccordion } from "radix-ui"
import * as React from "react"

import { ProgressStatus } from "@/types"
import { clx } from "@/utils/clx"
import { IconButton } from "../icon-button"

/**
 * This component is based on the [Radix UI Accordion](https://radix-ui.com/primitives/docs/components/accordion) primitves.
 */
const Root = (props: React.ComponentPropsWithoutRef<typeof RadixAccordion.Root>) => {
  return <RadixAccordion.Root {...props} />
}
Root.displayName = "ProgressAccordion"

const Item = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Item>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadixAccordion.Item
      ref={ref}
      className={clx(
        "border-ui-border-base border-b last-of-type:border-b-0",
        className
      )}
      {...props}
    />
  )
})
Item.displayName = "ProgressAccordion.Item"

interface HeaderProps
  extends React.ComponentPropsWithoutRef<typeof RadixAccordion.Header> {
  status?: ProgressStatus
}

interface StatusIndicatorProps extends React.ComponentPropsWithoutRef<"span"> {
  status: ProgressStatus
}

const ProgressIndicator = ({
  /**
   * The current status.
   */
  status,
  ...props
}: StatusIndicatorProps) => {
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
      className="text-ui-fg-muted group-data-[state=open]:text-ui-fg-interactive flex h-12 w-12 items-center justify-center"
      {...props}
    >
      <Icon />
    </span>
  )
}
ProgressIndicator.displayName = "ProgressAccordion.ProgressIndicator"

const Header = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Header>,
  HeaderProps
>(
  (
    {
      className,
      /**
       * The current status.
       */
      status = "not-started",
      children,
      ...props
    }: HeaderProps,
    ref
  ) => {
    return (
      <RadixAccordion.Header
        ref={ref}
        className={clx(
          "h3-core text-ui-fg-base group flex w-full flex-1 items-center gap-4 px-6",
          className
        )}
        {...props}
      >
        <ProgressIndicator status={status} />
        {children}
        <RadixAccordion.Trigger asChild className="ml-auto">
          <IconButton variant="transparent">
            <Plus className="transform transition-transform group-data-[state=open]:rotate-45" />
          </IconButton>
        </RadixAccordion.Trigger>
      </RadixAccordion.Header>
    )
  }
)
Header.displayName = "ProgressAccordion.Header"

const Content = React.forwardRef<
  React.ElementRef<typeof RadixAccordion.Content>,
  React.ComponentPropsWithoutRef<typeof RadixAccordion.Content>
>(({ className, ...props }, ref) => {
  return (
    <RadixAccordion.Content
      ref={ref}
      className={clx(
        "overflow-hidden",
        "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pl-[88px] pr-6",
        className
      )}
      {...props}
    />
  )
})
Content.displayName = "ProgressAccordion.Content"

const ProgressAccordion = Object.assign(Root, {
  Item,
  Header,
  Content,
})

export { ProgressAccordion }
