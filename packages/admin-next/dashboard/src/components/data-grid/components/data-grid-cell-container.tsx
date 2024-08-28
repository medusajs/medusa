import { ErrorMessage } from "@hookform/error-message"
import { ExclamationCircle } from "@medusajs/icons"
import { Tooltip, clx } from "@medusajs/ui"
import { PropsWithChildren } from "react"
import { get } from "react-hook-form"

import { DataGridCellContainerProps, DataGridErrorRenderProps } from "../types"
import { DataGridRowErrorIndicator } from "./data-grid-row-error-indicator"

export const DataGridCellContainer = ({
  isAnchor,
  isSelected,
  isDragSelected,
  field,
  showOverlay,
  placeholder,
  innerProps,
  overlayProps,
  children,
  errors,
  rowErrors,
}: DataGridCellContainerProps & DataGridErrorRenderProps<any>) => {
  const error = get(errors, field)
  const hasError = !!error

  return (
    <div
      className={clx(
        "bg-ui-bg-base group/cell relative flex size-full items-center gap-x-2 px-4 py-2.5 outline-none",
        {
          "bg-ui-tag-red-bg text-ui-tag-red-text":
            hasError && !isAnchor && !isSelected && !isDragSelected,
          "ring-ui-bg-interactive ring-2 ring-inset": isAnchor,
          "bg-ui-bg-highlight [&:has([data-field]:focus)]:bg-ui-bg-base":
            isSelected || isAnchor,
          "bg-ui-bg-subtle": isDragSelected && !isAnchor,
        }
      )}
      tabIndex={-1}
      {...innerProps}
    >
      <ErrorMessage
        name={field}
        errors={errors}
        render={({ message }) => {
          return (
            <div className="flex items-center justify-center">
              <Tooltip content={message} delayDuration={0}>
                <ExclamationCircle className="text-ui-tag-red-icon z-[3]" />
              </Tooltip>
            </div>
          )
        }}
      />
      <div className="relative z-[1] flex size-full items-center justify-center">
        <RenderChildren isAnchor={isAnchor} placeholder={placeholder}>
          {children}
        </RenderChildren>
      </div>
      <DataGridRowErrorIndicator rowErrors={rowErrors} />
      {showOverlay && (
        <div
          {...overlayProps}
          data-cell-overlay="true"
          className="absolute inset-0 z-[2] size-full"
        />
      )}
    </div>
  )
}

const RenderChildren = ({
  isAnchor,
  placeholder,
  children,
}: PropsWithChildren<
  Pick<DataGridCellContainerProps, "isAnchor" | "placeholder">
>) => {
  if (!isAnchor && placeholder) {
    return placeholder
  }

  return children
}
