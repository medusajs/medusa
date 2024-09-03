import { defineJoinerConfig, Modules } from "@medusajs/utils"
import {
  Product,
  ProductCategory,
  ProductCollection,
  ProductOption,
  ProductTag,
  ProductType,
  ProductVariant,
} from "@models"
import ProductImage from "./models/product-image"

export const joinerConfig = defineJoinerConfig(Modules.PRODUCT, {
  models: [
    Product,
    ProductVariant,
    ProductOption,
    ProductType,
    ProductImage,
    ProductTag,
    ProductCollection,
    ProductCategory,
  ],
  schema: `
    type Product {
      id: ID!
      handle: String!
      title: String!
      description: String
      variants: [ProductVariant]
    }
    
    type ProductVariant {
      id: ID!
      handle: String!
      title: String!
      
      product: Product
    }
    
    type ProductCategory {
      id: ID!
      handle: String!
      title: String
    }
  `,
  primaryKeys: ["id", "handle"],
  alias: [
    {
      name: ["product_variant", "product_variants", "variant", "variants"],
      args: {
        entity: "ProductVariant",
      },
    },
  ],
})
