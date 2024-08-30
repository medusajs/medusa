import { BaseFilterable, OperatorMap } from "../../../dal"
import { FindParams } from "../../common"
import {
  BaseProductListParams,
  BaseProductOptionParams,
} from "../common"

export interface AdminProductOptionParams extends BaseProductOptionParams {}
export interface AdminProductVariantParams extends 
  FindParams, BaseFilterable<AdminProductVariantParams> {
    q?: string
    id?: string | string[]
    manage_inventory?: boolean
    allow_backorder?: boolean
    created_at?: OperatorMap<string>
    updated_at?: OperatorMap<string>
    deleted_at?: OperatorMap<string>
  }
export interface AdminProductListParams extends BaseProductListParams {
  price_list_id?: string | string[]
  variants?: AdminProductVariantParams
}
