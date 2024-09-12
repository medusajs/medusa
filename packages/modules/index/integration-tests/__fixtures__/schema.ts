export const schema = `
  type Product @Listeners(values: ["product.created", "product.updated", "product.deleted"]) {
    id: String
    title: String
    deep: InternalNested
    variants: [ProductVariant]
  }
  
  type InternalNested {
    a: Int
    obj: InternalObject
  }
  
  type InternalObject {
    b: Int
  }
  
  type ProductVariant @Listeners(values: ["variant.created", "variant.updated", "variant.deleted"]) {
    id: String
    product_id: String
    sku: String
    prices: [Price]
  }
  
  type Price @Listeners(values: ["price.created", "price.updated", "price.deleted"]) {
    amount: Int
  }
`
