import { clx } from "@medusajs/ui"
import { PropsWithChildren } from "react"
import { DataGridCellContainerProps } from "../types"

type ContainerProps = PropsWithChildren<DataGridCellContainerProps>

export const DataGridCellContainer = ({
  isAnchor,
  placeholder,
  overlay,
  input,
  wrapper,
  children,
}: ContainerProps) => {
  return (
    <div className="static size-full" {...wrapper}>
      <div
        className={clx({
          "ring-ui-bg-interactive ring-2 ring-inset": isAnchor,
        })}
      >
        <div
          className="relative flex size-full items-start outline-none"
          tabIndex={-1}
        >
          <div className="relative size-full min-w-0 flex-1">
            <div
              className="relative z-[1] flex size-full items-center justify-center"
              onMouseDown={input.onMouseDown}
            >
              <RenderChildren isAnchor={isAnchor} placeholder={placeholder}>
                {children}
              </RenderChildren>
            </div>
            {!isAnchor && (
              <div
                {...overlay}
                data-cell-overlay="true"
                tabIndex={-1}
                className="absolute inset-0 z-[2] size-full"
              />
            )}
          </div>
        </div>
        {/* {showDragHandle && (
        <div className="bg-ui-bg-interactive absolute -bottom-[1.5px] -right-[1.5px] size-[3px]" />
      )} */}
      </div>
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
