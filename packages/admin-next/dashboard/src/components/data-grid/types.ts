import { CellContext } from "@tanstack/react-table"
import { MouseEvent, ReactNode } from "react"

export type CellCoords = {
  row: number
  col: number
}

export type GetCellHandlerProps = {
  coords: CellCoords
  readonly: boolean
}

export interface DataGridCellProps<TData = unknown, TValue = any> {
  field: string
  context: CellContext<TData, TValue>
}

export interface DataGridCellContext<TData = unknown, TValue = any>
  extends CellContext<TData, TValue> {
  /**
   * The index of the column in the grid.
   */
  columnIndex: number
}

export interface DataGridCellContainerProps {
  isAnchor: boolean
  placeholder?: ReactNode
  wrapper: {
    onMouseDown: (e: MouseEvent<HTMLElement>) => void
    onMouseOver: ((e: MouseEvent<HTMLElement>) => void) | undefined
  }
  overlay: {
    onClick: () => void
  }
}

export type DataGridColumnType = "string" | "number" | "boolean"
