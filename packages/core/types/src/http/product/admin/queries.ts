import {
  BaseProductOptionParams,
  BaseProductParams,
  BaseProductTagParams,
  BaseProductTypeParams,
  BaseProductVariantParams,
} from "../common"

export interface AdminProductTagParams extends BaseProductTagParams {}
export interface AdminProductTypeParams extends BaseProductTypeParams {}
export interface AdminProductOptionParams extends BaseProductOptionParams {}
export interface AdminProductVariantParams extends BaseProductVariantParams {}
export interface AdminProductParams extends BaseProductParams {
  price_list_id?: string | string[]
  variants?: AdminProductVariantParams
}
