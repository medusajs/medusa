import * as RadixPopover from "@radix-ui/react-popover"
import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react"
import { useWindowDimensions } from "../../../hooks/use-window-dimensions"
import Button from "../../fundamentals/button"

type FilterDropdownContainerProps = {
  submitFilters: () => void
  clearFilters: () => void
  triggerElement: ReactNode
}

const FilterDropdownContainer = ({
  submitFilters,
  clearFilters,
  triggerElement,
  children,
}: PropsWithChildren<FilterDropdownContainerProps>) => {
  const { height } = useWindowDimensions()
  const ref = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [heightStyle, setHeightStyle] = useState({
    maxHeight: height,
  })

  useEffect(() => {
    setHeightStyle({
      maxHeight: height - (ref?.current?.getBoundingClientRect().y ?? 0) - 50,
    })
  }, [ref])

  const onSubmit = () => {
    setIsOpen(false)
    submitFilters()
  }

  const onClear = () => {
    setIsOpen(false)
    clearFilters()
  }

  return (
    <RadixPopover.Root open={isOpen} onOpenChange={setIsOpen}>
      <RadixPopover.Trigger ref={ref} asChild>
        {triggerElement}
      </RadixPopover.Trigger>
      <RadixPopover.Content
        sideOffset={8}
        style={heightStyle}
        className="bg-grey-0 rounded-rounded shadow-dropdown z-40 max-w-[272px] overflow-y-auto py-4"
      >
        <div className="border-grey-20 flex border-b px-4 pb-4">
          <Button
            size="small"
            tabIndex={-1}
            className="border-grey-20 mr-2 border"
            variant="ghost"
            onClick={() => onClear()}
          >
            Clear
          </Button>
          <Button
            tabIndex={-1}
            variant="primary"
            className="w-44 justify-center"
            size="small"
            onClick={() => onSubmit()}
          >
            Apply
          </Button>
        </div>
        {React.Children.map(children, (child) => {
          return (
            <div className="border-grey-20 border-b py-2 px-4 last:border-0 last:pb-0">
              {child}
            </div>
          )
        })}
      </RadixPopover.Content>
    </RadixPopover.Root>
  )
}

export default FilterDropdownContainer
