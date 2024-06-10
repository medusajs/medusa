import { AdminPrice } from "../../pricing"
import { AdminSalesChannel } from "../../sales-channel"
import {
  BaseProduct,
  BaseProductCategory,
  BaseProductImage,
  BaseProductOption,
  BaseProductOptionValue,
  BaseProductTag,
  BaseProductType,
  BaseProductVariant,
} from "../common"

export interface AdminProductCategory extends BaseProductCategory {
  is_active?: boolean
  is_internal?: boolean
}
export interface AdminProductVariant extends BaseProductVariant {
  prices: AdminPrice[] | null
}
export interface AdminProductTag extends BaseProductTag {}
export interface AdminProductType extends BaseProductType {}
export interface AdminProductOption extends BaseProductOption {}
export interface AdminProductImage extends BaseProductImage {}
export interface AdminProductOptionValue extends BaseProductOptionValue {}
export interface AdminProduct
  extends Omit<BaseProduct, "categories" | "variants"> {
  categories?: AdminProductCategory[] | null
  sales_channels?: AdminSalesChannel[] | null
  variants?: AdminProductVariant[] | null
}
