import { PropsWithChildren } from "react"
import { GridCellType } from "../../../constants"

export const ReadonlyCell = ({ children }: PropsWithChildren) => {
  return (
    <div
      role="cell"
      data-cell-type={GridCellType.READONLY}
      className="bg-ui-bg-base size-full cursor-not-allowed px-4 py-2.5"
    >
      {children}
    </div>
  )
}
