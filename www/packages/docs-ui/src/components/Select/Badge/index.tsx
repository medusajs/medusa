"use client"

import React, { useCallback, useRef, useState } from "react"
import { useSelect } from "@/hooks"
import clsx from "clsx"
import { SelectDropdown, SelectProps } from ".."
import { TriangleDownMini } from "@medusajs/icons"

export const SelectBadge = ({
  value,
  options,
  setSelected,
  addSelected,
  removeSelected,
  multiple,
  className,
  addAll = multiple,
  handleAddAll,
  ...props
}: SelectProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const {
    isValueSelected,
    isAllSelected,
    handleChange,
    handleSelectAll,
    setSelectedValues,
  } = useSelect({
    value,
    options,
    multiple,
    setSelected,
    removeSelected,
    addSelected,
    handleAddAll,
  })

  const getSelectedText = useCallback(() => {
    let str = ""
    const selectedOptions = options.filter((option) =>
      value.includes(option.value)
    )

    if (isAllSelected) {
      str = "All areas"
    } else {
      if (
        (!Array.isArray(value) && !value) ||
        (Array.isArray(value) && !value.length)
      ) {
        str = "None selected"
      } else {
        str = selectedOptions[0].label
      }
    }

    return (
      <>
        <span
          className={clsx(
            "text-compact-x-small-plus text-medusa-tag-neutral-text"
          )}
        >
          {str}
          {!isAllSelected && selectedOptions.length > 1 && (
            <> + {selectedOptions.length - 1}</>
          )}
        </span>
      </>
    )
  }, [isAllSelected, options, value])

  return (
    <div className={clsx("relative w-fit", className)}>
      <div
        className={clsx(
          "border-medusa-tag-neutral-border rounded-docs_sm border border-solid",
          "h-fit cursor-pointer pl-docs_0.25 pr-[3px] text-medusa-tag-neutral-text",
          "bg-medusa-tag-neutral-bg",
          "flex items-center gap-[3px] whitespace-nowrap",
          "text-medusa-fg-subtle",
          open && "bg-medusa-tag-neutral-bg-hover"
        )}
        ref={ref}
        onClick={(e) => {
          if (!dropdownRef.current?.contains(e.target as Element)) {
            setOpen((prev) => !prev)
          }
        }}
      >
        {getSelectedText()}
        <TriangleDownMini className="text-medusa-tag-neutral-icon" />
      </div>
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
        passedRef={dropdownRef}
        setSelectedValues={setSelectedValues}
      />
    </div>
  )
}

export default SelectBadge
