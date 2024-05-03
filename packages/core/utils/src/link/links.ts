import { Modules } from "../modules-sdk"
import { composeLinkName } from "./compose-link-name"

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
  ShippingOptionPriceSet: composeLinkName(
    Modules.FULFILLMENT,
    "shipping_option_id",
    Modules.PRICING,
    "price_set_id"
  ),
  CartPaymentCollection: composeLinkName(
    Modules.CART,
    "cart_id",
    Modules.PAYMENT,
    "payment_collection_id"
  ),
  RegionPaymentProvider: composeLinkName(
    Modules.REGION,
    "region_id",
    Modules.PAYMENT,
    "payment_provider_id"
  ),
  CartPromotion: composeLinkName(
    Modules.CART,
    "cart_id",
    Modules.PROMOTION,
    "promotion_id"
  ),
  SalesChannelLocation: composeLinkName(
    Modules.SALES_CHANNEL,
    "sales_channel_id",
    Modules.STOCK_LOCATION,
    "location_id"
  ),
  FulfillmentSetLocation: composeLinkName(
    Modules.FULFILLMENT,
    "fulfillment_set_id",
    Modules.STOCK_LOCATION,
    "location_id"
  ),
  OrderPromotion: composeLinkName(
    Modules.ORDER,
    "order_id",
    Modules.PROMOTION,
    "promotion_id"
  ),
  OrderSalesChannel: composeLinkName(
    Modules.ORDER,
    "order_id",
    Modules.SALES_CHANNEL,
    "sales_channel_id"
  ),
  PublishableApiKeySalesChannel: composeLinkName(
    Modules.API_KEY,
    "api_key_id",
    Modules.SALES_CHANNEL,
    "sales_channel_id"
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
}
