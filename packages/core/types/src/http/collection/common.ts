import { BaseFilterable, OperatorMap } from "../../dal"
import { AdminProduct } from "../product"

export interface BaseCollection {
  id?: string
  title?: string
  handle?: string
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
  products?: AdminProduct[]
  metadata?: Record<string, unknown> | null
}

export interface BaseCollectionFilters
  extends BaseFilterable<BaseCollectionFilters> {
  q?: string
  id?: string | string[]
  handle?: string | string[]
  title?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
  deleted_at?: OperatorMap<string>
}
