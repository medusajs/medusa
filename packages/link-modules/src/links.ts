import { Modules } from "@medusajs/modules-sdk"
import { composeLinkName } from "./utils"

export const LINKS = {
  ProductVariantInventoryItem: composeLinkName(
    Modules.PRODUCT,
    "variant_id",
    Modules.INVENTORY,
    "inventory_item_id"
  ),
  ProductVariantMoneyAmount: composeLinkName(
    Modules.PRODUCT,
    "variant_id",
    Modules.PRICING,
    "money_amount_id"
  ),

  // Internal services
  ProductShippingProfile: composeLinkName(
    Modules.PRODUCT,
    "variant_id",
    "shippingProfileService",
    "profile_id"
  ),
}
