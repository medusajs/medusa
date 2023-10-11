export const schema = `
  type Product @Listeners(values: ["product.created", "product.updated"]) {
    id: String
    title: String
    variants: [ProductVariant]
  }
  
  type ProductVariant @Listeners(values: ["variants.created", "variants.updated"]) {
    id: String
    product_id: String
    sku: String
    money_amounts: [MoneyAmount]
  }
  
  type MoneyAmount @Listeners(values: ["prices.created", "prices.updated"]) {
    amount: Int
  }
`
