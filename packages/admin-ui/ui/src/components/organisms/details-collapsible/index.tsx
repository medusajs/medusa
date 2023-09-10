import * as RadixCollapsible from "@radix-ui/react-collapsible"
import clsx from "clsx"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import ArrowDownIcon from "../../fundamentals/icons/arrow-down-icon"
import ArrowUpIcon from "../../fundamentals/icons/arrow-up-icon"

type DetailsCollapsibleProps = {
  rootProps?: RadixCollapsible.CollapsibleProps
  triggerProps?: RadixCollapsible.CollapsibleTriggerProps
  contentProps?: RadixCollapsible.CollapsibleContentProps
  children: React.ReactNode
}

const DetailsCollapsible = ({
  rootProps,
  triggerProps,
  contentProps,
  children,
}: DetailsCollapsibleProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const Icon = open ? ArrowUpIcon : ArrowDownIcon
  const label = open
    ? t(
        "details-collapsible-hide-additional-details",
        "Hide additional details"
      )
    : t(
        "details-collapsible-show-additional-details",
        "Show additional details"
      )

  return (
    <RadixCollapsible.Root
      {...rootProps}
      onOpenChange={(state) => setOpen(state)}
    >
      <RadixCollapsible.Trigger
        {...triggerProps}
        type="button" // needed to prevent from tampering with form submission
        className={clsx({ ["mb-6"]: open }, triggerProps?.className)}
      >
        <div className="flex items-center">
          <Icon size={"20"} />
          <div className="ml-1">{label}</div>
        </div>
      </RadixCollapsible.Trigger>
      <RadixCollapsible.Content
        {...contentProps}
        className={clsx({ hidden: contentProps?.forceMount && !open })}
      >
        {children}
      </RadixCollapsible.Content>
    </RadixCollapsible.Root>
  )
}

export default DetailsCollapsible
