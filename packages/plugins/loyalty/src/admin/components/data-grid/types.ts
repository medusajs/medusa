import {
  CellContext,
  ColumnDef,
  ColumnMeta,
  Row,
  VisibilityState,
} from "@tanstack/react-table"
import React, { PropsWithChildren, ReactNode, RefObject } from "react"
import {
  FieldErrors,
  FieldPath,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form"

export type DataGridColumnType =
  | "text"
  | "number"
  | "boolean"
  | "togglable-number"

export type DataGridCoordinates = {
  row: number
  col: number
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

export type DataGridRowError = {
  message: string
  to: () => void
}

export type DataGridErrorRenderProps<TFieldValues extends FieldValues> = {
  errors: FieldErrors<TFieldValues>
  rowErrors: DataGridRowError[]
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
  outerComponent?: ReactNode
}

export type DataGridCellSnapshot<
  TFieldValues extends FieldValues = FieldValues,
> = {
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
      type: DataGridColumnType
    }
  | { field?: null | undefined; type?: never }
) &
  ColumnMeta<TData, any>

export type GridCell<TFieldValues extends FieldValues> = {
  field: FieldPath<TFieldValues>
  type: DataGridColumnType
  enabled: boolean
}

export type Grid<TFieldValues extends FieldValues> =
  (GridCell<TFieldValues> | null)[][]

export type CellMetadata = {
  id: string
  field: string
  type: DataGridColumnType
  inputAttributes: InputAttributes
  innerAttributes: InnerAttributes
}

export type CellErrorMetadata = {
  field: string | null
  accessor: string | null
}

export type VisibilitySnapshot = {
  rows: VisibilityState
  columns: VisibilityState
}

export type GridColumnOption = {
  id: string
  name: string
  checked: boolean
  disabled: boolean
}

export type DataGridToggleableNumber = {
  quantity: number | string
  checked: boolean
  disabledToggle: boolean
}
