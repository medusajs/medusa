import { BaseFilterable, OperatorMap } from "../../dal"
import { FindParams, SelectParams } from "../common"
import { AdminProduct } from "../product"

export interface BaseCollection {
  id: string
  title: string
  handle: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  products?: AdminProduct[]
  metadata: Record<string, unknown> | null
}

export interface BaseCollectionParams extends SelectParams {}

export interface BaseCollectionListParams
  extends FindParams,
    BaseFilterable<BaseCollectionListParams> {
  q?: string
  id?: string | string[]
  handle?: string | string[]
  title?: string | string[]
  created_at?: OperatorMap<string>
  updated_at?: OperatorMap<string>
}
