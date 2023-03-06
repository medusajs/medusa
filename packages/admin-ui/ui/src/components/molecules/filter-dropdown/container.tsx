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
        className="bg-grey-0 overflow-y-auto rounded-rounded shadow-dropdown max-w-[272px] py-4 z-40"
      >
        <div className="flex px-4 pb-4 border-b border-grey-20">
          <Button
            size="small"
            tabIndex={-1}
            className="mr-2 border border-grey-20"
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
            <div className="border-b border-grey-20 py-2 px-4 last:pb-0 last:border-0">
              {child}
            </div>
          )
        })}
      </RadixPopover.Content>
    </RadixPopover.Root>
  )
}

export default FilterDropdownContainer
