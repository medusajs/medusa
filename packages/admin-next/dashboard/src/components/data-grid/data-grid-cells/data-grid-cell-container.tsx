import { ErrorMessage } from "@hookform/error-message"
import { Tooltip, clx } from "@medusajs/ui"
import { PropsWithChildren } from "react"

import { ExclamationCircle } from "@medusajs/icons"
import { get } from "react-hook-form"
import { DataGridCellContainerProps } from "../types"

export const DataGridCellContainer = ({
  isAnchor,
  isSelected,
  isDragSelected,
  isFirstColumn,
  errors,
  field,
  showOverlay,
  placeholder,
  innerProps,
  overlayProps,
  children,
}: DataGridCellContainerProps) => {
  const error = get(errors, field)

  // To get number of errors in a row, we properly need some way to figure out what segment of the error object to look at
  // e.g. errors.locations.[:id] is a row, error.locations.[:id].[:id] is a cell.
  // in this case we would then need to Object.keys(errors.locations.[:id]) to get the number of errors in a row.

  const hasError = !!error

  return (
    <div
      data-has-error={hasError}
      className={clx(
        "bg-ui-bg-base group/cell relative flex size-full items-center outline-none",
        {
          "ring-ui-fg-error ring-2 ring-inset": hasError,
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
              <Tooltip content={message}>
                <ExclamationCircle className="text-ui-fg-error z-[3]" />
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
