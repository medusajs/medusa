import * as RadixCollapsible from "@radix-ui/react-collapsible"

import React, { useState } from "react"

import Switch from "../../atoms/switch"
import clsx from "clsx"

const CollapsibleWrapper = ({
  onOpenChange,
  defaultOpen,
  title,
  children,
}: {
  onOpenChange: (boolean: boolean) => void
  defaultOpen: boolean
  title: string
} & React.HTMLAttributes<HTMLDivElement>) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className={clsx("border-grey-5 w-full border-b")}>
      <RadixCollapsible.Root
        defaultOpen={defaultOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          onOpenChange(open)
        }}
        className="w-full"
      >
        <RadixCollapsible.Trigger
          className={clsx(
            "text-grey-50 flex w-full cursor-pointer items-center justify-between rounded py-1.5 px-3"
          )}
        >
          <p>{title}</p>
          <Switch checked={isOpen} type="button" className="cursor-pointer" />
        </RadixCollapsible.Trigger>
        <RadixCollapsible.Content className="flex w-full flex-col px-2">
          <div className="w-full  overflow-x-hidden">{children}</div>
        </RadixCollapsible.Content>
      </RadixCollapsible.Root>
    </div>
  )
}

export default CollapsibleWrapper
