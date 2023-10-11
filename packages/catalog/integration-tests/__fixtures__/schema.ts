export const schema = `
  type Product @Listeners(values: ["product.created", "product.updated"]) {
    id: String
    title: String
    variants: [ProductVariant]
  }
  
  type ProductVariant @Listeners(values: ["variant.created", "variant.updated"]) {
    id: String
    product_id: String
    sku: String
    money_amounts: [MoneyAmount]
  }
  
  type MoneyAmount @Listeners(values: ["price.created", "price.updated"]) {
    amount: Int
  }
`
