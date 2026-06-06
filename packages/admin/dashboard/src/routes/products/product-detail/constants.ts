import {
  AdminProduct,
  AdminProductCategory,
  AdminShippingProfile,
} from "@zjedene-medusa/types"
import { getLinkedFields } from "../../../dashboard-app"

export const PRODUCT_DETAIL_FIELDS = getLinkedFields(
  "product",
  "*categories,*shipping_profile,-variants"
)

export type ExtendedProduct = AdminProduct & {
  categories?: AdminProductCategory[]
  shipping_profile?: AdminShippingProfile
}
