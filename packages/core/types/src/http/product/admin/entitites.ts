import { AdminPrice } from "../../pricing"
import { AdminProductCategory } from "../../product-category"
import { AdminSalesChannel } from "../../sales-channel"
import {
  BaseProduct,
  BaseProductImage,
  BaseProductOption,
  BaseProductOptionValue,
  BaseProductTag,
  BaseProductType,
  BaseProductVariant,
  ProductStatus,
} from "../common"

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
export type AdminProductStatus = ProductStatus
