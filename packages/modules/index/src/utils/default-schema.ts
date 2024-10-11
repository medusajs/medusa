import { Modules } from "@medusajs/utils"

export const defaultSchema = `
  type Product @Listeners(values: ["${Modules.PRODUCT}.product.created", "${Modules.PRODUCT}.product.updated", "${Modules.PRODUCT}.product.deleted"]) {
    id: String
    title: String
    variants: [ProductVariant]
  }
  
  type ProductVariant @Listeners(values: ["${Modules.PRODUCT}.product-variant.created", "${Modules.PRODUCT}.product-variant.updated", "${Modules.PRODUCT}.product-variant.deleted"]) {
    id: String
    product_id: String
    sku: String
    prices: [Price]
  }
  
  type Price @Listeners(values: ["${Modules.PRICING}.price.created", "${Modules.PRICING}.price.updated", "${Modules.PRICING}.price.deleted"]) {
    amount: Int
    currency_code: String
  } 
`
