"use client"

import React, { useCallback, useEffect, useRef } from "react"
import clsx from "clsx"
import { OptionType } from "@/hooks"
import { Ref } from "types"
import { CheckMini, EllipseMiniSolid } from "@medusajs/icons"

export type SelectDropdownProps = {
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
  passedRef?: Ref<HTMLDivElement>
}

export const SelectDropdown = ({
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
  passedRef,
}: SelectDropdownProps) => {
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
          "pr-docs_0.75 relative rounded-docs_sm py-docs_0.5 pl-docs_2.5",
          "hover:bg-medusa-bg-base-hover",
          "[&>svg]:left-docs_0.75 cursor-pointer [&>svg]:absolute [&>svg]:top-docs_0.5",
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
            {multiple && <CheckMini className="text-medusa-fg-base" />}
            {!multiple && <EllipseMiniSolid className="text-medusa-fg-base" />}
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
        "h-0 translate-y-0 overflow-hidden transition-transform",
        open && "h-auto translate-y-docs_0.5 !overflow-visible",
        className
      )}
      ref={setRefs}
    >
      <ul
        className={clsx(
          "p-docs_0.25 mb-0 w-full overflow-auto rounded-docs_DEFAULT",
          "bg-medusa-bg-base text-medusa-fg-base",
          "shadow-elevation-flyout dark:shadow-elevation-flyout-dark list-none"
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
