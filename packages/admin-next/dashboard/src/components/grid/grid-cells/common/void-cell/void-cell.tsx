import { PropsWithChildren } from "react"
import { GridCellType } from "../../../constants"

export const VoidCell = ({ children }: PropsWithChildren) => {
  return (
    <div
      role="cell"
      data-cell-type={GridCellType.VOID}
      className="bg-ui-bg-subtle size-full cursor-not-allowed px-4 py-2.5"
    >
      {children}
    </div>
  )
}
