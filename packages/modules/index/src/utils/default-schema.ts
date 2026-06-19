import { Modules } from "@medusajs/utils"

export const defaultSchema = `
  type Product @Listeners(values: ["${Modules.PRODUCT}.product.created", "${Modules.PRODUCT}.product.updated", "${Modules.PRODUCT}.product.deleted", "${Modules.PRODUCT}.product.restored"]) {
    id: ID
    title: String
    handle: String
    status: String
    type_id: String
    collection_id: String
    is_giftcard: Boolean
    external_id: String
    created_at: DateTime
    updated_at: DateTime

    variants: [ProductVariant]
    sales_channels: [SalesChannel]
  }

  type ProductVariant @Listeners(values: ["${Modules.PRODUCT}.product-variant.created", "${Modules.PRODUCT}.product-variant.updated", "${Modules.PRODUCT}.product-variant.deleted", "${Modules.PRODUCT}.product-variant.restored"]) {
    id: ID
    product_id: String
    sku: String

    prices: [Price]
  }
  
  type Price @Listeners(values: ["${Modules.PRICING}.price.created", "${Modules.PRICING}.price.updated", "${Modules.PRICING}.price.deleted", "${Modules.PRICING}.price.restored"]) {
    id: ID
    amount: Float
    currency_code: String
    price_list_id: String
  }

  type SalesChannel @Listeners(values: ["${Modules.SALES_CHANNEL}.sales-channel.created", "${Modules.SALES_CHANNEL}.sales-channel.updated", "${Modules.SALES_CHANNEL}.sales-channel.deleted", "${Modules.SALES_CHANNEL}.sales-channel.restored"]) {
    id: ID
    is_disabled: Boolean
  }
`
