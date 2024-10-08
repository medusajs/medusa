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
  setSelectedValues?: (values: string[]) => void
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
  setSelectedValues,
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
    if (isAllSelected && setSelectedValues) {
      setSelectedValues([clickedValue])
    } else {
      handleSelectChange?.(clickedValue, wasSelected)
    }
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
    const originalIsSelected = isValueSelected(option.value)
    const isSelected = isAllSelected
      ? option.isAllOption || false
      : originalIsSelected

    return (
      <li
        key={index}
        className={clsx(
          "px-docs_0.25",
          index <= 0 && "rounded-t-docs_DEFAULT",
          index === options.length - 1 && "rounded-b-docs_DEFAULT"
        )}
        onClick={() => {
          if (option.isAllOption) {
            handleSelectAll()
          } else {
            handleChange(option.value, originalIsSelected)
          }
        }}
      >
        <div
          className={clsx(
            "px-docs_0.5 py-docs_0.25 flex-1 min-w-max rounded-docs_xs",
            "hover:bg-medusa-bg-component-hover cursor-pointer",
            "flex gap-docs_0.5 text-medusa-fg-base items-center",
            !isSelected && "text-compact-small",
            isSelected && "text-compact-small-plus"
          )}
        >
          <span>
            {isSelected && (
              <>
                {option.isAllOption && <EllipseMiniSolid />}
                {!option.isAllOption && (
                  <>
                    {multiple && <CheckMini />}
                    {!multiple && <EllipseMiniSolid />}
                  </>
                )}
              </>
            )}
            {!isSelected && <EllipseMiniSolid className="invisible" />}
          </span>
          <span className="flex-1">{option.label}</span>
        </div>
      </li>
    )
  }

  const getDivider = () => (
    <svg
      width="176"
      height="8"
      viewBox="0 0 176 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="168" height="8" transform="translate(4)" fill="#FAFAFA" />
      <rect y="4" width="176" height="1" fill="white" />
      <rect y="3" width="176" height="1" fill="#E4E4E7" />
    </svg>
  )

  return (
    <div
      className={clsx(
        "absolute left-0 md:left-docs_1",
        "z-10",
        "h-0 translate-y-0 overflow-hidden transition-transform",
        open && "h-auto translate-y-docs_0.5 !overflow-visible",
        className
      )}
      ref={setRefs}
    >
      <ul
        className={clsx(
          "mb-0 py-docs_0.25 overflow-auto rounded-docs_DEFAULT",
          "bg-medusa-bg-component text-medusa-fg-base",
          "shadow-elevation-flyout dark:shadow-elevation-flyout-dark list-none",
          "flex flex-col"
        )}
      >
        {addAll && (
          <>
            {getSelectOption(
              {
                value: "all",
                label: "All Areas",
                isAllOption: true,
              },
              -1
            )}
            {getDivider()}
          </>
        )}
        {options.map(getSelectOption)}
      </ul>
    </div>
  )
}
