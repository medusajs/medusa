import { clx } from "@medusajs/ui"
import { PropsWithChildren } from "react"

import { DataGridCellContainerProps } from "../types"

export const DataGridCellContainer = ({
  isAnchor,
  isSelected,
  isDragSelected,
  showOverlay,
  placeholder,
  innerProps,
  overlayProps,
  children,
}: DataGridCellContainerProps) => {
  return (
    <div
      className={clx(
        "bg-ui-bg-base relative size-full outline-none focus:bg-red-400",
        {
          "ring-ui-bg-interactive ring-2 ring-inset": isAnchor,
          "bg-ui-bg-highlight focus-within:bg-ui-bg-base":
            isSelected || isAnchor,
          "bg-ui-bg-subtle": isDragSelected && !isAnchor,
        }
      )}
      tabIndex={0}
      {...innerProps}
    >
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
