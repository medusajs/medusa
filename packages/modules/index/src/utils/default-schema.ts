export const defaultSchema = `
  type Product @Listeners(values: ["Product.product.created", "Product.product.updated", "Product.product.deleted"]) {
    id: String
    title: String
    variants: [ProductVariant]
  }
  
  type ProductVariant @Listeners(values: ["Product.product-variant.created", "Product.product-variant.updated", "Product.product-variant.deleted"]) {
    id: String
    product_id: String
    sku: String
    prices: [Price]
  }
  
  type Price @Listeners(values: ["Pricing.price.created", "Pricing.price.updated", "Pricing.price.deleted"]) {
    amount: Float
    currency_code: String
  } 
`
