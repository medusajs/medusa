export const PAGE_SIZE = 20
export const DEFAULT_COLUMN_ORDER = 500
export const QUERY_PREFIX = "o"

export enum ColumnAlignment {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

export interface ColumnState {
  visibility: Record<string, boolean>
  order: string[]
}
