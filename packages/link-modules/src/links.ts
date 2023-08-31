import { Modules } from "@medusajs/modules-sdk"
import { composeLinkName } from "./utils"

export const LINKS = {
  ProductVariantInventoryItem: composeLinkName(
    Modules.PRODUCT,
    "variant_id",
    Modules.INVENTORY,
    "inventory_item_id"
  ),
  ProductShippingProfile: composeLinkName(
    Modules.PRODUCT,
    "variant_id",
    "shippingProfileService",
    "profile_id"
  ),
}
