import * as RadixTooltip from "@radix-ui/react-tooltip"
import clsx from "clsx"
import React from "react"

export type TooltipProps = RadixTooltip.TooltipContentProps &
  Pick<
    RadixTooltip.TooltipProps,
    "open" | "defaultOpen" | "onOpenChange" | "delayDuration"
  > & {
    content: React.ReactNode
    side?: "bottom" | "left" | "top" | "right"
    onClick?: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
  }

const Tooltip = ({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  delayDuration,
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
            "z-10 inter-small-regular text-grey-90",
            "bg-grey-0 py-2 px-3 shadow-dropdown rounded-rounded",
            "border border-solid border-grey-20",
            "max-w-[220px] whitespace-normal",
            className
          )}
          {...props}
        >
          {content}
        </RadixTooltip.Content>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}

export default Tooltip
