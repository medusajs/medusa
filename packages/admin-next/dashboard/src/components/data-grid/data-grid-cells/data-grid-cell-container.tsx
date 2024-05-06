import { PropsWithChildren } from "react"
import { DataGridCellContainerProps } from "../types"

type ContainerProps = PropsWithChildren<DataGridCellContainerProps>

export const DataGridCellContainer = ({
  isAnchor,
  overlay,
  children,
}: ContainerProps) => {
  return (
    <div className="static size-full">
      <div className="flex size-full items-start outline-none" tabIndex={-1}>
        <div className="relative min-w-0 flex-1">
          <div className="relative z-[1]">{children}</div>
          {!isAnchor && (
            <div {...overlay} className="absolute inset-0 z-[2] size-full" />
          )}
        </div>
      </div>
      {/* {showDragHandle && (
        <div className="bg-ui-bg-interactive absolute -bottom-[1.5px] -right-[1.5px] size-[3px]" />
      )} */}
    </div>
  )
}
