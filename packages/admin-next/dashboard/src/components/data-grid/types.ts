import { CellContext, ColumnDef, ColumnMeta, Row } from "@tanstack/react-table"
import React, { PropsWithChildren, ReactNode, RefObject } from "react"
import {
  FieldError,
  FieldErrors,
  FieldPath,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form"

export type ColumnType = "text" | "number" | "boolean"

export type CellCoords = {
  row: number
  col: number
}

export type GetCellHandlerProps = {
  coords: CellCoords
  readonly: boolean
}

export interface DataGridCellProps<TData = unknown, TValue = any> {
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

export type DataGridErrorRenderProps<TFieldValues extends FieldValues> = {
  errors: FieldErrors<TFieldValues>
  cellError: FieldError | undefined
  rowErrors: FieldErrors<TFieldValues> | undefined
}

export interface DataGridCellRenderProps {
  container: DataGridCellContainerProps
  input: InputProps
}

type InputAttributes = {
  "data-row": number
  "data-col": number
  "data-cell-id": string
  "data-field": string
}

export interface InputProps {
  ref: RefObject<HTMLElement>
  onBlur: () => void
  onFocus: () => void
  onChange: (next: any, prev: any) => void
  "data-row": number
  "data-col": number
  "data-cell-id": string
  "data-field": string
}

type InnerAttributes = {
  "data-container-id": string
}

interface InnerProps {
  ref: RefObject<HTMLDivElement>
  onMouseOver: ((e: React.MouseEvent<HTMLElement>) => void) | undefined
  onMouseDown: ((e: React.MouseEvent<HTMLElement>) => void) | undefined
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void
  onFocus: (e: React.FocusEvent<HTMLElement>) => void
  "data-container-id": string
}

interface OverlayProps {
  onMouseDown: (e: React.MouseEvent<HTMLElement>) => void
}

export interface DataGridCellContainerProps extends PropsWithChildren<{}> {
  field: string
  innerProps: InnerProps
  overlayProps: OverlayProps
  isAnchor: boolean
  isSelected: boolean
  isDragSelected: boolean
  placeholder?: ReactNode
  showOverlay: boolean
}

export type DataGridColumnType = "string" | "number" | "boolean"

export type CellSnapshot<TFieldValues extends FieldValues = FieldValues> = {
  field: string
  value: PathValue<TFieldValues, Path<TFieldValues>>
}

export type FieldContext<TData> = {
  row: Row<TData>
  column: ColumnDef<TData>
}

export type FieldFunction<TData, TFieldValues extends FieldValues> = (
  context: FieldContext<TData>
) => FieldPath<TFieldValues> | null

export type InternalColumnMeta<TData, TFieldValues extends FieldValues> = {
  name: string
  field?: FieldFunction<TData, TFieldValues>
} & (
  | {
      field: FieldFunction<TData, TFieldValues>
      type: ColumnType
    }
  | { field?: null | undefined; type?: never }
) &
  ColumnMeta<TData, any>

export type GridCell<TFieldValues extends FieldValues> = {
  field: FieldPath<TFieldValues>
  type: ColumnType
  enabled: boolean
}

export type Grid<TFieldValues extends FieldValues> =
  (GridCell<TFieldValues> | null)[][]

export type CellMetadata = {
  id: string
  field: string
  type: ColumnType
  inputAttributes: InputAttributes
  innerAttributes: InnerAttributes
}

export type CellErrorMetadata = {
  field: string | null
  accessor: string | null
}
