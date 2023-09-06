import * as RadixTooltip from "@radix-ui/react-tooltip"

import React from "react"
import clsx from "clsx"

export type TooltipProps = RadixTooltip.TooltipContentProps &
  Pick<
    RadixTooltip.TooltipProps,
    "open" | "defaultOpen" | "onOpenChange" | "delayDuration"
  > & {
    content: React.ReactNode
    side?: "bottom" | "left" | "top" | "right"
    onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
    maxWidth?: number
  }

const Tooltip = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
  maxWidth = 220,
  className,
  side,
  onClick,
  ...props
}: TooltipProps) => {
  return (
    <RadixTooltip.Provider delayDuration={100}>
      <RadixTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        delayDuration={delayDuration}
      >
        <RadixTooltip.Trigger onClick={onClick} asChild={true}>
          <span>{children}</span>
        </RadixTooltip.Trigger>
        <RadixTooltip.Content
          side={side ?? "bottom"}
          sideOffset={8}
          align="center"
          className={clsx(
            "inter-small-semibold text-grey-50 z-[999]",
            "bg-grey-0 shadow-dropdown rounded-rounded py-2 px-3",
            "border-grey-20 border border-solid",
            className
          )}
          {...props}
          style={{ ...props.style, maxWidth }}
        >
          {content}
        </RadixTooltip.Content>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}

export default Tooltip
