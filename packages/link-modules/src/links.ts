import { Modules } from "@medusajs/modules-sdk"
import { composeLinkName } from "./utils"

export const LINKS = {
  ProductVariantInventoryItem: composeLinkName(
    Modules.PRODUCT,
    "variant_id",
    Modules.INVENTORY,
    "inventory_item_id"
  ),
  ProductVariantPriceSet: composeLinkName(
    Modules.PRODUCT,
    "variant_id",
    Modules.PRICING,
    "price_set_id"
  ),
  CartPaymentCollection: composeLinkName(
    Modules.CART,
    "cart_id",
    Modules.PAYMENT,
    "payment_collection_id"
  ),

  // Internal services
  ProductShippingProfile: composeLinkName(
    Modules.PRODUCT,
    "variant_id",
    "shippingProfileService",
    "profile_id"
  ),
  ProductSalesChannel: composeLinkName(
    Modules.PRODUCT,
    "product_id",
    Modules.SALES_CHANNEL,
    "sales_channel_id"
  ),
  OrderSalesChannel: composeLinkName(
    "orderService",
    "order_id",
    Modules.SALES_CHANNEL,
    "sales_channel_id"
  ),
  PublishableApiKeySalesChannel: composeLinkName(
    "publishableApiKeyService",
    "publishable_key_id",
    Modules.SALES_CHANNEL,
    "sales_channel_id"
  ),
}
