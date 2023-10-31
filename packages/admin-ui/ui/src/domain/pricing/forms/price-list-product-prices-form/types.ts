import { Noop } from "react-hook-form"
import { z } from "zod"
import { priceListProductPricesSchema } from "./schema"

export type PricePayload = {
  id?: string
  amount: number
  currency_code?: string
  region_id?: string
  variant_id: string
  min_quantity?: number
  max_quantity?: number
}

export type Point = {
  row: number
  col: number
}

export type CellWithParentRow = HTMLTableCellElement & {
  parentElement: HTMLTableRowElement
}

/**
 * Represents the state of a cell.
 */
export type CellState = {
  isSelected: boolean
  isAnchor: boolean
  isRangeEnd: boolean
  borders: BorderAttributes
  outline: BorderAttributes
}

/**
 * Base props for a controlled cell.
 */
export interface CellProps {
  value: string | undefined | null
  name: string | undefined
  onChange: (...event: any[]) => void
  onBlur: Noop
  onRegisterCell: (point: Point) => void
  onUnregisterCell: (point: Point) => void
  onDragToFillStart: (e: React.MouseEvent) => void
  onCellMouseDown: (e: React.MouseEvent) => void
  onCellOver: (e: React.MouseEvent) => void
  getCellState: (point: Point | null) => CellState
  setIsEditing: (state: boolean) => void
  onNextRow: () => void
  variantId: string
  currencyCode?: string
  regionId?: string
  symbol?: string
  decimalScale: number
  type: "amount" | "min_quantity" | "max_quantity"
}

/**
 * Represents a range of cells.
 */
export type BoundingBox = {
  topLeft: Point | null
  bottomRight: Point | null
}

/**
 * Attributes for a points border.
 */
export type BorderAttributes = {
  top: boolean
  left: boolean
  bottom: boolean
  right: boolean
}

export type RectStyles = {
  top: number
  left: number
  width: number
  height: number
}

export type PriceListProductPricesSchema = z.infer<
  typeof priceListProductPricesSchema
>

// Hack to make the type checker happy.
export type PriceListProductPricesPath = "variants.0.region.0.amount"

export type DragPosition = "above" | "below" | "left" | "right"
