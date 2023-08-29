import clsx from "clsx"
import IconCheckMini from "../../Icons/CheckMini"
import IconEllipseMiniSolid from "../../Icons/EllipseMiniSolid"
import { OptionType } from "../../../hooks/use-select"
import { forwardRef, useCallback, useEffect, useRef } from "react"

type SelectDropdownProps = {
  options: OptionType[]
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  addAll?: boolean
  multiple?: boolean
  isAllSelected: boolean
  isValueSelected: (val: string) => boolean
  handleSelectAll: () => void
  handleChange?: (selectedValue: string, wasSelected: boolean) => void
  parentRef?: React.RefObject<HTMLDivElement>
  className?: string
}

const SelectDropdown = forwardRef<HTMLDivElement, SelectDropdownProps>(
  function SelectDropdown(
    {
      open,
      setOpen,
      options,
      addAll,
      multiple = false,
      isAllSelected,
      isValueSelected,
      handleSelectAll,
      handleChange: handleSelectChange,
      parentRef,
      className,
    },
    passedRef
  ) {
    const ref = useRef<HTMLDivElement | null>(null)
    const setRefs = useCallback(
      (node: HTMLDivElement) => {
        // Ref's from useRef needs to have the node assigned to `current`
        ref.current = node
        if (typeof passedRef === "function") {
          passedRef(node)
        } else if (passedRef && "current" in passedRef) {
          passedRef.current = node
        }
      },
      [passedRef]
    )

    const handleChange = (clickedValue: string, wasSelected: boolean) => {
      handleSelectChange?.(clickedValue, wasSelected)
      if (!multiple) {
        setOpen(false)
      }
    }

    const handleOutsideClick = useCallback(
      (e: MouseEvent) => {
        if (
          open &&
          !ref.current?.contains(e.target as Element) &&
          !parentRef?.current?.contains(e.target as Element)
        ) {
          setOpen(false)
        }
      },
      [open, parentRef, setOpen]
    )

    useEffect(() => {
      document.body.addEventListener("click", handleOutsideClick)

      return () => {
        document.body.removeEventListener("click", handleOutsideClick)
      }
    }, [handleOutsideClick])

    const getSelectOption = (option: OptionType, index: number) => {
      const isSelected = option.isAllOption
        ? isAllSelected
        : isValueSelected(option.value)

      return (
        <li
          key={index}
          className={clsx(
            "pr-0.75 relative rounded-sm py-0.5 pl-2.5",
            "hover:bg-medusa-bg-base-hover dark:hover:bg-medusa-bg-base-hover-dark",
            "[&>svg]:left-0.75 cursor-pointer [&>svg]:absolute [&>svg]:top-0.5",
            !isSelected && "text-compact-small",
            isSelected && "text-compact-small-plus"
          )}
          onClick={() => {
            if (option.isAllOption) {
              handleSelectAll()
            } else {
              handleChange(option.value, isSelected)
            }
          }}
        >
          {isSelected && (
            <>
              {multiple && (
                <IconCheckMini className="stroke-medusa-fg-base dark:stroke-medusa-fg-base-dark" />
              )}
              {!multiple && (
                <IconEllipseMiniSolid className="fill-medusa-fg-base dark:fill-medusa-fg-base-dark" />
              )}
            </>
          )}
          {option.label}
        </li>
      )
    }

    return (
      <div
        className={clsx(
          "absolute top-full left-0 w-full",
          "z-10 h-0 translate-y-0 overflow-hidden transition-transform",
          open && "h-auto translate-y-0.5 !overflow-visible",
          className
        )}
        ref={setRefs}
      >
        <ul
          className={clsx(
            "p-0.25 mb-0 w-full overflow-auto rounded",
            "bg-medusa-bg-base dark:bg-medusa-bg-base-dark text-medusa-fg-base dark:text-medusa-fg-base-dark",
            "shadow-flyout dark:shadow-flyout-dark list-none"
          )}
        >
          {addAll &&
            getSelectOption(
              {
                value: "all",
                label: "All Areas",
                isAllOption: true,
              },
              -1
            )}
          {options.map(getSelectOption)}
        </ul>
      </div>
    )
  }
)

export default SelectDropdown
