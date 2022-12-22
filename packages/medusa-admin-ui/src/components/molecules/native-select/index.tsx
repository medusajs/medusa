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
        className="flex items-center inter-base-semibold gap-3 px-2"
        {...triggerProps}
      >
        <RadixSelect.Value />
        <RadixSelect.Icon>
          <ChevronDownIcon size={ICON_SIZE} />
        </RadixSelect.Icon>
      </RadixSelect.SelectTrigger>
      <RadixSelect.Content className="rounded-rounded scrollbar-hide border px-2 py-2 border-grey-20 bg-grey-0 w-full flex shadow-dropdown">
        <RadixSelect.ScrollUpButton className="h-[25px] flex items-center justify-center bg-gradient-to-b from-transparent to-grey-0">
          <ChevronUpIcon size={ICON_SIZE} />
        </RadixSelect.ScrollUpButton>
        <RadixSelect.Viewport className="p-2">{children}</RadixSelect.Viewport>
        <RadixSelect.ScrollDownButton className="h-[25px] flex items-center justify-center bg-gradient-to-b from-transparent to-grey-0">
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
      "flex relative justify-start py-1.5 px-9 items-center inter-base-regular rounded hover:bg-grey-10"
    )}
    {...props}
  >
    <RadixSelect.ItemIndicator className="bold-active-item absolute left-2.5 flex items-center justify-center pr-2.5">
      <CheckIcon size={ICON_SIZE} />
    </RadixSelect.ItemIndicator>
    <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
  </RadixSelect.Item>
)

NativeSelect.Item = Item

export default NativeSelect
