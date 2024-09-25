export const schema = `
  type Product @Events {
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
  
  type ProductVariant @Events {
    id: String
    product_id: String
    sku: String
    prices: [Price]
  }
  
  type Price @Events {
    amount: Int
  }
`
