import * as RadixCollapsible from "@radix-ui/react-collapsible"
import React from "react"
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"
import ChevronUpIcon from "../../fundamentals/icons/chevron-up"

const SectionCollapsible = ({ title, length, children, ...props }) => {
  const [open, setOpen] = React.useState(true)
  return (
    <RadixCollapsible.Root open={open} onOpenChange={setOpen} {...props}>
      <RadixCollapsible.Trigger asChild>
        <button className="px-base py-small bg-grey-10 rounded-rounded flex w-full items-center justify-between">
          <h6 className="inter-base-semibold text-grey-90">
            {title}
            <span className="inter-base-regular text-grey-40"> ({length})</span>
          </h6>
          {open ? (
            <ChevronDownIcon className="text-grey-40" />
          ) : (
            <ChevronUpIcon className="text-grey-40" />
          )}
        </button>
      </RadixCollapsible.Trigger>
      <RadixCollapsible.Content>{children}</RadixCollapsible.Content>
    </RadixCollapsible.Root>
  )
}

export default SectionCollapsible
