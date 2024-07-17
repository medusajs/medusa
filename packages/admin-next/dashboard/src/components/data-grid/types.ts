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
  /**
   * The index of the row in the grid.
   */
  rowIndex: number
}

export interface DataGridCellContainerProps {
  isAnchor: boolean
  placeholder?: ReactNode
  wrapper: {
    onMouseOver: ((e: MouseEvent<HTMLElement>) => void) | undefined
  }
  overlay: {
    onMouseDown: (e: MouseEvent<HTMLElement>) => void
  }
  input: {
    onMouseDown: (e: MouseEvent<HTMLElement>) => void
    onChange: (next: any, prev: any) => void
    onBlur: () => void
    onFocus: () => void
  }
}

export type DataGridColumnType = "string" | "number" | "boolean"
