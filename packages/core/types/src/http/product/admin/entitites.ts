import { AdminCollection } from "../../collection"
import { AdminPrice } from "../../pricing"
import { AdminProductCategory } from "../../product-category"
import { AdminProductTag } from "../../product-tag"
import { AdminProductType } from "../../product-type"
import { AdminSalesChannel } from "../../sales-channel"
import {
  BaseProduct,
  BaseProductImage,
  BaseProductOption,
  BaseProductOptionValue,
  BaseProductVariant,
  ProductStatus,
} from "../common"

export interface AdminProductVariant extends BaseProductVariant {
  prices: AdminPrice[] | null
}
export interface AdminProductOption extends BaseProductOption {}
export interface AdminProductImage extends BaseProductImage {}
export interface AdminProductOptionValue extends BaseProductOptionValue {}
export interface AdminProduct
  extends Omit<BaseProduct, "categories" | "variants"> {
  collection?: AdminCollection | null
  categories?: AdminProductCategory[] | null
  sales_channels?: AdminSalesChannel[] | null
  variants?: AdminProductVariant[] | null
  type: AdminProductType | null
  tags?: AdminProductTag[] | null
}
export type AdminProductStatus = ProductStatus
