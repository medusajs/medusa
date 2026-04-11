import { clx, Textarea } from "@medusajs/ui"
import { Popover as RadixPopover } from "radix-ui"
import { useCallback, useEffect, useRef, useState } from "react"
import { Controller, ControllerRenderProps } from "react-hook-form"

import { useCombinedRefs } from "../../../hooks/use-combined-refs"
import { useDataGridCell, useDataGridCellError } from "../hooks"
import { useDataGridContext } from "../context"
import { DataGridCellProps, InputProps, DataGridCellContext } from "../types"
import { DataGridCellContainer } from "./data-grid-cell-container"

type DataGridExpandableTextCellProps<TData, TValue = any> = DataGridCellProps<
  TData,
  TValue
> & {
  fieldLabel?: string
}

export const DataGridExpandableTextCell = <TData, TValue = any>({
  context,
  fieldLabel,
}: DataGridExpandableTextCellProps<TData, TValue>) => {
  const { field, control, renderProps } = useDataGridCell({
    context,
  })
  const errorProps = useDataGridCellError({ context })

  const { container, input } = renderProps

  return (
    <Controller
      control={control}
      name={field}
      render={({ field }) => {
        return (
          <Inner
            field={field}
            inputProps={input}
            fieldLabel={fieldLabel}
            container={container}
            errorProps={errorProps}
          />
        )
      }}
    />
  )
}

const Inner = ({
  field,
  inputProps,
  fieldLabel: _fieldLabel,
  container,
  errorProps,
}: {
  field: ControllerRenderProps<any, string>
  inputProps: InputProps
  fieldLabel?: string
  container: any
  errorProps: any
}) => {
  const { onChange: _, onBlur, ref, value, ...rest } = field
  const { ref: inputRef, onBlur: onInputBlur, onChange, ...input } = inputProps
  const { setSingleRange, anchor } = useDataGridContext()
  const { row, col } = anchor || { row: 0, col: 0 }

  const [localValue, setLocalValue] = useState(value || "")
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [popoverValue, setPopoverValue] = useState(value || "")
  const popoverContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocalValue(value || "")
  }, [value])

  useEffect(() => {
    if (isPopoverOpen) {
      setPopoverValue(value || "")
    }
  }, [isPopoverOpen, value])

  // Prevent DataGrid keyboard handlers from intercepting keys when popover is open
  useEffect(() => {
    if (!isPopoverOpen || !popoverContentRef.current) {
      return
    }

    const handleKeyDownCapture = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isTextarea = target.tagName === "TEXTAREA"
      const isInPopover =
        popoverContentRef.current && popoverContentRef.current.contains(target)

      if (isTextarea || isInPopover) {
        const dataGridKeys = [
          "Enter",
          "Delete",
          "Backspace",
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
          " ",
        ]

        // Stop the keys from reaching DataGrid, so the textarea can handle them
        if (dataGridKeys.includes(e.key) && e.key !== "Escape") {
          e.stopImmediatePropagation()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDownCapture, true)

    return () => {
      window.removeEventListener("keydown", handleKeyDownCapture, true)
    }
  }, [isPopoverOpen])

  const combinedRefs = useCombinedRefs(inputRef, ref)

  const handleOverlayMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.detail === 2) {
        e.preventDefault()
        e.stopPropagation()
        setSingleRange({ row, col })
        setIsPopoverOpen(true)
        return
      }
      // For single clicks, use the normal handler which sets anchor and focuses container
      container.overlayProps.onMouseDown?.(e)
    },
    [container.overlayProps, setSingleRange, row, col]
  )

  const customContainer = {
    ...container,
    overlayProps: {
      ...container.overlayProps,
      onMouseDown: handleOverlayMouseDown,
    },
  }

  const handlePopoverSave = () => {
    onChange(popoverValue, value)
    setLocalValue(popoverValue)
    setIsPopoverOpen(false)
    onBlur()
    onInputBlur()
  }

  const handlePopoverKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Escape") {
      e.stopPropagation()
    }
  }, [])

  const displayValue = localValue || ""
  const truncatedValue =
    displayValue.length > 50
      ? `${displayValue.substring(0, 50)}...`
      : displayValue

  return (
    <RadixPopover.Root
      open={isPopoverOpen}
      onOpenChange={(open) => {
        if (!open) {
          handlePopoverSave()
        } else {
          setIsPopoverOpen(true)
        }
      }}
    >
      <DataGridCellContainer {...customContainer} {...errorProps}>
        <RadixPopover.Anchor asChild>
          <div
            className={clx(
              "txt-compact-small text-ui-fg-subtle flex size-full cursor-pointer items-center justify-center bg-transparent outline-none",
              "focus:cursor-text"
            )}
          >
            <span className="w-full truncate text-center">
              {truncatedValue}
            </span>
          </div>
        </RadixPopover.Anchor>
        <input
          className="sr-only"
          autoComplete="off"
          tabIndex={-1}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          ref={combinedRefs}
          onBlur={() => {
            onBlur()
            onInputBlur()
            onChange(localValue, value)
          }}
          {...input}
          {...rest}
        />
      </DataGridCellContainer>
      <RadixPopover.Portal>
        <RadixPopover.Content
          className={clx(
            "bg-ui-bg-base shadow-elevation-flyout flex max-h-[80vh] w-[600px] overflow-hidden p-0 outline-none"
          )}
          align="start"
          side="bottom"
          sideOffset={-29}
          alignOffset={-16}
          collisionPadding={24}
          onEscapeKeyDown={handlePopoverSave}
          onKeyDown={handlePopoverKeyDown}
        >
          <div ref={popoverContentRef} className="h-full w-full">
            <Textarea
              value={popoverValue}
              onChange={(e) => setPopoverValue(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation()
              }}
              className="!bg-ui-bg-base h-full min-h-[300px] w-full resize-none border-0 p-4 !shadow-none focus-visible:!shadow-none"
            />
          </div>
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  )
}
