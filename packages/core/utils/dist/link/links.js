"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINKS = void 0;
var modules_sdk_1 = require("../modules-sdk");
var compose_link_name_1 = require("./compose-link-name");
exports.LINKS = {
    ProductVariantInventoryItem: (0, compose_link_name_1.composeLinkName)(modules_sdk_1.Modules.PRODUCT, "variant_id", modules_sdk_1.Modules.INVENTORY, "inventory_item_id"),
    ProductVariantPriceSet: (0, compose_link_name_1.composeLinkName)(modules_sdk_1.Modules.PRODUCT, "variant_id", modules_sdk_1.Modules.PRICING, "price_set_id"),
    ShippingOptionPriceSet: (0, compose_link_name_1.composeLinkName)(modules_sdk_1.Modules.FULFILLMENT, "shipping_option_id", modules_sdk_1.Modules.PRICING, "price_set_id"),
    CartPaymentCollection: (0, compose_link_name_1.composeLinkName)(modules_sdk_1.Modules.CART, "cart_id", modules_sdk_1.Modules.PAYMENT, "payment_collection_id"),
    RegionPaymentProvider: (0, compose_link_name_1.composeLinkName)(modules_sdk_1.Modules.REGION, "region_id", modules_sdk_1.Modules.PAYMENT, "payment_provider_id"),
    CartPromotion: (0, compose_link_name_1.composeLinkName)(modules_sdk_1.Modules.CART, "cart_id", modules_sdk_1.Modules.PROMOTION, "promotion_id"),
    SalesChannelLocation: (0, compose_link_name_1.composeLinkName)(modules_sdk_1.Modules.SALES_CHANNEL, "sales_channel_id", modules_sdk_1.Modules.STOCK_LOCATION, "location_id"),
    LocationFulfillmentSet: (0, compose_link_name_1.composeLinkName)(modules_sdk_1.Modules.STOCK_LOCATION, "stock_location_id", modules_sdk_1.Modules.FULFILLMENT, "fulfillment_set_id"),
    OrderPromotion: (0, compose_link_name_1.composeLinkName)(modules_sdk_1.Modules.ORDER, "order_id", modules_sdk_1.Modules.PROMOTION, "promotion_id"),
    OrderSalesChannel: (0, compose_link_name_1.composeLinkName)(modules_sdk_1.Modules.ORDER, "order_id", modules_sdk_1.Modules.SALES_CHANNEL, "sales_channel_id"),
    PublishableApiKeySalesChannel: (0, compose_link_name_1.composeLinkName)(modules_sdk_1.Modules.API_KEY, "api_key_id", modules_sdk_1.Modules.SALES_CHANNEL, "sales_channel_id"),
    // Internal services
    ProductShippingProfile: (0, compose_link_name_1.composeLinkName)(modules_sdk_1.Modules.PRODUCT, "variant_id", "shippingProfileService", "profile_id"),
    ProductSalesChannel: (0, compose_link_name_1.composeLinkName)(modules_sdk_1.Modules.PRODUCT, "product_id", modules_sdk_1.Modules.SALES_CHANNEL, "sales_channel_id"),
};
//# sourceMappingURL=links.js.map