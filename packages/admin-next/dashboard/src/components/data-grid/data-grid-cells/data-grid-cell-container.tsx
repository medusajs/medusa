import { ErrorMessage } from "@hookform/error-message"
import { Badge, Tooltip, clx } from "@medusajs/ui"
import { PropsWithChildren } from "react"

import { ExclamationCircle } from "@medusajs/icons"
import { get } from "react-hook-form"
import { DataGridCellContainerProps, DataGridErrorRenderProps } from "../types"
import { countFieldErrors } from "../utils"

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
  cellError,
  rowErrors,
}: DataGridCellContainerProps & DataGridErrorRenderProps<any>) => {
  const error = get(errors, field)
  const rowErrorCount = rowErrors ? countFieldErrors(rowErrors) : 0

  const hasError = !!error

  return (
    <div
      data-has-error={hasError}
      className={clx(
        "bg-ui-bg-base group/cell relative flex size-full items-center outline-none",
        {
          "bg-ui-tag-red-bg text-ui-tag-red-text":
            hasError && !isAnchor && !isSelected && !isDragSelected,
          "ring-ui-bg-interactive ring-2 ring-inset": isAnchor,
          "bg-ui-bg-highlight [&:has([data-field]:focus)]:bg-ui-bg-base":
            isSelected || isAnchor,
          "bg-ui-bg-subtle": isDragSelected && !isAnchor,
        }
      )}
      tabIndex={0}
      {...innerProps}
    >
      <ErrorMessage
        name={field}
        errors={errors}
        render={({ message }) => {
          return (
            <div className="flex items-center justify-center pl-4 pr-2">
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
      {rowErrorCount > 0 && <Badge>{rowErrorCount}</Badge>}
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
