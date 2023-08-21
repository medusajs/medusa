import clsx from "clsx"
import IconChevronUpDown from "../Icons/ChevronUpDown"
import { useCallback, useMemo, useRef, useState } from "react"
import IconCheckMini from "../Icons/CheckMini"
import IconEllipseSolid from "../Icons/EllipseMiniSolid"
import Badge from "../Badge"
import IconXMarkMini from "../Icons/XMarkMini"

export type OptionType = {
  value: string
  label: string
  isAllOption?: boolean
}

type SelectProps = {
  options: OptionType[]
  setSelected?: (value: string | string[]) => void
  addSelected?: (value: string) => void
  removeSelected?: (value: string) => void
  multiple?: boolean
  addAll?: boolean
} & React.ComponentProps<"input">

const Select = ({
  value,
  options,
  setSelected,
  addSelected,
  removeSelected,
  multiple,
  className,
  addAll = multiple,
  ...props
}: SelectProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const isValueSelected = useCallback(
    (val: string) => {
      return (
        (typeof value === "string" && val === value) ||
        (Array.isArray(value) && value.includes(val))
      )
    },
    [value]
  )

  // checks if there are multiple selected values
  const hasSelectedValues = useMemo(() => {
    return multiple && Array.isArray(value) && value.length > 0
  }, [value, multiple])

  // checks if there are any selected values,
  // whether multiple or one
  const hasSelectedValue = useMemo(() => {
    return hasSelectedValues || (typeof value === "string" && value.length)
  }, [hasSelectedValues, value])

  const selectedValues: OptionType[] = useMemo(() => {
    if (typeof value === "string") {
      const selectedValue = options.find((option) => option.value === value)
      return selectedValue ? [selectedValue] : []
    } else if (Array.isArray(value)) {
      return options.filter((option) => value.includes(option.value))
    }
    return []
  }, [options, value])

  const handleChange = (clickedValue: string, wasSelected: boolean) => {
    if (multiple) {
      wasSelected ? removeSelected?.(clickedValue) : addSelected?.(clickedValue)
    } else {
      setSelected?.(clickedValue)
      setOpen(false)
    }
  }

  const handleSelectAll = () => {
    setSelected?.(options.map((option) => option.value))
  }

  const isAllSelected = useMemo(() => {
    return Array.isArray(value) && value.length === options.length
  }, [options, value])

  const getSelectOption = (option: OptionType, index: number) => {
    const isSelected = option.isAllOption
      ? isAllSelected
      : isValueSelected(option.value)
    return (
      <li
        key={index}
        className={clsx(
          "pr-0.75 relative py-0.5 pl-2.5",
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
              <IconEllipseSolid className="fill-medusa-fg-base dark:fill-medusa-fg-base-dark" />
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
        "px-0.75 relative appearance-none py-[9px]",
        "border-medusa-border-base dark:border-medusa-border-base-dark rounded-sm border",
        "bg-medusa-bg-field dark:bg-medusa-bg-field-dark shadow-button-neutral dark:shadow-button-neutral-dark",
        "hover:bg-medusa-bg-field-hover dark:bg-medusa-bg-field-hover-dark",
        "active:shadow-active dark:active:shadow-active-dark",
        "focus:shadow-active dark:focus:shadow-active-dark",
        "text-medusa-fg-base dark:text-medusa-fg-base-dark text-compact-medium",
        "disabled:bg-medusa-bg-disabled dark:disabled:bg-medusa-bg-disabled-dark",
        "disabled:text-medusa-fg-disabled dark:disabled:text-medusa-fg-disabled-dark",
        "flex items-center gap-0.5",
        !hasSelectedValues &&
          "placeholder:text-medusa-fg-muted dark:placeholder:text-medusa-fg-muted-dark",
        hasSelectedValues &&
          "placeholder:text-medusa-fg-base dark:placeholder:text-medusa-fg-base-dark",
        className
      )}
      ref={ref}
      onClick={(e) => {
        if ((e.target as Element).tagName !== "LI") {
          setOpen((prev) => !prev)
        }
      }}
    >
      {hasSelectedValues && (
        <Badge variant="neutral" className="flex flex-1">
          <span
            className={clsx("text-compact-medium-plus mr-0.125 inline-block")}
          >
            {(value as string[]).length}
          </span>
          <IconXMarkMini
            iconColorClassName="stroke-medusa-tag-neutral-icon dark:stroke-medusa-tag-neutral-icon-dark"
            onClick={(e) => {
              e.stopPropagation()
              setSelected?.([])
            }}
          />
        </Badge>
      )}
      <span
        className={clsx(
          "inline-block flex-1 select-none overflow-ellipsis whitespace-nowrap break-words",
          hasSelectedValues && "max-w-1/3"
        )}
      >
        {!multiple && hasSelectedValue && selectedValues.length
          ? selectedValues[0].label
          : props.placeholder}
      </span>
      <IconChevronUpDown iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
      <input
        type="hidden"
        name={props.name}
        value={Array.isArray(value) ? value.join(",") : value}
      />
      <div
        className={clsx(
          "absolute top-full left-0 w-full",
          "z-10 h-0 overflow-hidden transition-transform",
          open && "h-auto translate-y-0.5 !overflow-visible"
        )}
      >
        <ul
          className={clsx(
            "p-0.25 absolute w-full overflow-auto rounded",
            "bg-medusa-bg-base dark:bg-medusa-bg-base-dark text-medusa-fg-base dark:text-medusa-fg-base-dark",
            "shadow-flyout dark:shadow-flyout-dark list-none"
          )}
        >
          {addAll &&
            getSelectOption(
              {
                value: "all",
                label: "All",
                isAllOption: true,
              },
              -1
            )}
          {options.map(getSelectOption)}
        </ul>
      </div>
    </div>
  )
}

export default Select
