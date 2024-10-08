"use client"

import * as Primitives from "@radix-ui/react-tooltip"
import * as React from "react"

import { clx } from "@/utils/clx"

interface TooltipProps
  extends Omit<Primitives.TooltipContentProps, "content" | "onClick">,
    Pick<
      Primitives.TooltipProps,
      "open" | "defaultOpen" | "onOpenChange" | "delayDuration"
    > {
  content: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  side?: "bottom" | "left" | "top" | "right"
  maxWidth?: number
}

/**
 * This component is based on the [Radix UI Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip) primitive.
 *
 * @excludeExternal
 */
const Tooltip = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
  /**
   * The maximum width of the tooltip.
   */
  maxWidth = 220,
  className,
  side,
  sideOffset = 8,
  onClick,
  ...props
}: TooltipProps) => {
  return (
      <Primitives.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        delayDuration={delayDuration}
      >
        <Primitives.Trigger onClick={onClick} asChild>
          {children}
        </Primitives.Trigger>
        <Primitives.Portal>
          <Primitives.Content
            side={side}
            sideOffset={sideOffset}
            align="center"
            className={clx(
              "txt-compact-xsmall text-ui-fg-subtle bg-ui-bg-base shadow-elevation-tooltip rounded-lg px-2.5 py-1",
              "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              className
            )}
            {...props}
            style={{ ...props.style, maxWidth }}
          >
            {content}
          </Primitives.Content>
        </Primitives.Portal>
      </Primitives.Root>
  )
}

interface TooltipProviderProps extends Primitives.TooltipProviderProps {}

const TooltipProvider = ({ children, delayDuration = 100, skipDelayDuration = 300, ...props }: TooltipProviderProps) => {
  return (
    <Primitives.TooltipProvider delayDuration={delayDuration} skipDelayDuration={skipDelayDuration} {...props}>
      {children}
    </Primitives.TooltipProvider>
  )
}


export { Tooltip, TooltipProvider }
