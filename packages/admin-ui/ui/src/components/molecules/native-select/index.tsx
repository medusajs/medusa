import * as RadixSelect from "@radix-ui/react-select"
import clsx from "clsx"
import React from "react"
import CheckIcon from "../../fundamentals/icons/check-icon"
import ChevronDownIcon from "../../fundamentals/icons/chevron-down"
import ChevronUpIcon from "../../fundamentals/icons/chevron-up"

type NativeSelectType = React.FC<NativeSelectProps> & {
  Item: React.FC<ItemProps>
}

type NativeSelectProps = {
  triggerProps?: RadixSelect.SelectTriggerProps
} & RadixSelect.SelectProps

const ICON_SIZE = 16

const NativeSelect: NativeSelectType = ({
  children,
  triggerProps,
  ...props
}) => {
  return (
    <RadixSelect.Root {...props}>
      <RadixSelect.SelectTrigger
        className="inter-base-semibold flex items-center gap-3 px-2"
        {...triggerProps}
      >
        <RadixSelect.Value />
        <RadixSelect.Icon>
          <ChevronDownIcon size={ICON_SIZE} />
        </RadixSelect.Icon>
      </RadixSelect.SelectTrigger>
      <RadixSelect.Content
        position="popper"
        className="rounded-rounded scrollbar-hide border-grey-20 bg-grey-0 shadow-dropdown z-[9999] flex max-h-[305px] w-full overflow-y-auto border px-2 py-2"
      >
        <RadixSelect.ScrollUpButton className="to-grey-0 flex h-[25px] items-center justify-center bg-gradient-to-b from-transparent">
          <ChevronUpIcon size={ICON_SIZE} />
        </RadixSelect.ScrollUpButton>
        <RadixSelect.Viewport className="p-2">{children}</RadixSelect.Viewport>
        <RadixSelect.ScrollDownButton className="to-grey-0 flex h-[25px] items-center justify-center bg-gradient-to-b from-transparent">
          <ChevronDownIcon size={ICON_SIZE} />
        </RadixSelect.ScrollDownButton>
      </RadixSelect.Content>
    </RadixSelect.Root>
  )
}

type ItemProps = RadixSelect.SelectItemProps

const Item: React.FC<ItemProps> = ({ children, ...props }) => (
  <RadixSelect.Item
    className={clsx(
      "inter-base-regular hover:bg-grey-10 relative flex items-center justify-start rounded px-9 py-1.5"
    )}
    {...props}
  >
    <RadixSelect.ItemIndicator className="bold-active-item absolute left-2.5 flex items-center justify-center pe-2.5">
      <CheckIcon size={ICON_SIZE} />
    </RadixSelect.ItemIndicator>
    <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
  </RadixSelect.Item>
)

NativeSelect.Item = Item

export default NativeSelect
