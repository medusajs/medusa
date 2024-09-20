export const defaultSchema = `
  type Product @Listeners(values: ["Product.product.created", "Product.product.updated", "Product.product.deleted"]) {
    id: String
    title: String
    description: String
    variants: [ProductVariant]
    metadata: JSON
  }
  
  type ProductVariant @Listeners(values: ["Product.product-variant.created", "Product.product-variant.updated", "Product.product-variant.deleted"]) {
    id: String
    product_id: String
    sku: String
    title: String
    length: Float
    width: Float
    height: Float
    weight: Float
    prices: [Price]
    metadata: JSON
  }
  
  type Price @Listeners(values: ["Pricing.price.created", "Pricing.price.updated", "Pricing.price.deleted"]) {
    amount: Float
    currency_code: String
  } 
`
