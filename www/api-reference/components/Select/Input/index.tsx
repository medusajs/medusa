import clsx from "clsx"
import IconChevronUpDown from "../../Icons/ChevronUpDown"
import { useRef, useState } from "react"
import Badge from "../../Badge"
import IconXMarkMini from "../../Icons/XMarkMini"
import useSelect from "../../../hooks/use-select"
import SelectDropdown from "../Dropdown"
import { SelectProps } from "../types"

const SelectInput = ({
  value,
  options,
  setSelected,
  addSelected,
  removeSelected,
  multiple,
  className,
  addAll = multiple,
  handleAddAll,
  showClearButton = true,
  ...props
}: SelectProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const {
    isValueSelected,
    hasSelectedValue,
    hasSelectedValues,
    selectedValues,
    isAllSelected,
    handleChange,
    handleSelectAll,
  } = useSelect({
    value,
    options,
    multiple,
    setSelected,
    removeSelected,
    addSelected,
    handleAddAll,
  })

  return (
    <div
      className={clsx(
        "px-0.75 relative py-[9px]",
        "border-medusa-border-base dark:border-medusa-border-base-dark rounded-sm border",
        "bg-medusa-bg-field dark:bg-medusa-bg-field-dark shadow-button-neutral dark:shadow-button-neutral-dark",
        "hover:bg-medusa-bg-field-hover dark:hover:bg-medusa-bg-field-hover-dark",
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
        if (!dropdownRef.current?.contains(e.target as Element)) {
          setOpen((prev) => !prev)
        }
      }}
    >
      {hasSelectedValues && (
        <Badge
          variant="neutral"
          className={clsx("flex", showClearButton && "flex-1")}
        >
          <span
            className={clsx(
              "text-compact-medium-plus inline-block",
              showClearButton && "mr-0.125"
            )}
          >
            {(value as string[]).length}
          </span>
          {showClearButton && (
            <IconXMarkMini
              iconColorClassName="stroke-medusa-tag-neutral-icon dark:stroke-medusa-tag-neutral-icon-dark"
              onClick={(e) => {
                e.stopPropagation()
                setSelected?.([])
              }}
            />
          )}
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
      <SelectDropdown
        options={options}
        open={open}
        setOpen={setOpen}
        addAll={addAll}
        multiple={multiple}
        isAllSelected={isAllSelected}
        isValueSelected={isValueSelected}
        handleSelectAll={handleSelectAll}
        handleChange={handleChange}
        parentRef={ref}
        ref={dropdownRef}
      />
    </div>
  )
}

export default SelectInput
