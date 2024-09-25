export const defaultSchema = `
  type Product @Events {
    id: String
    title: String
    description: String
    variants: [ProductVariant]
    metadata: JSON
  }
  
  type ProductVariant @Events {
    id: String
    product_id: String
    sku: String
    title: String
    material: String
    length: Float
    width: Float
    height: Float
    weight: Float
    prices: [Price]
    metadata: JSON
  }
  
  type Price @Events {
    amount: Float
    currency_code: String
  } 
`
