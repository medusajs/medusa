import { defineJoinerConfig } from "@medusajs/utils"
import { MedusaModule } from "../../medusa-module"
import { ModuleJoinerConfig } from "@medusajs/types"

const customModuleJoinerConfig = defineJoinerConfig("custom_user", {
  schema: `
    type CustomProduct {
      id: ID
      title: String
      product: Product
    }
    
    type Product {
      id: ID
      title: String
    }
  `,
  alias: [
    {
      name: ["custom_products", "custom_product"],
      entity: "CustomProduct",
    },
  ],
})

const productJoinerConfig = defineJoinerConfig("product", {
  schema: `
    type Product {
      id: ID
      title: String
      variants: [Variant]
    }

    type Variant {
      id: ID
      sku: String
    }
  `,
  alias: [
    {
      name: ["product"],
      entity: "Product",
      args: {
        methodSuffix: "Products",
      },
    },
    {
      name: ["variant", "variants"],
      entity: "Variant",
      args: {
        methodSuffix: "Variants",
      },
    },
  ],
})

const pricingJoinerConfig = defineJoinerConfig("pricing", {
  schema: `
    type PriceSet {
      id: ID
      prices: [Price]
    }

    type Price {
      amount: Int
      deep_nested_price: DeepNestedPrice
    }
    
    type DeepNestedPrice {
      amount: Int
    }
  `,
  alias: [
    {
      name: ["price", "prices"],
      entity: "Price",
      args: {
        methodSuffix: "price",
      },
    },
    {
      name: ["price_set", "price_sets"],
      entity: "PriceSet",
      args: {
        methodSuffix: "priceSet",
      },
    },
    {
      name: ["deep_nested_price", "deep_nested_prices"],
      entity: "DeepNestedPrice",
      args: {
        methodSuffix: "deepNestedPrice",
      },
    },
  ],
})

const linkProductVariantPriceSet = {
  serviceName: "link-product-variant-price-set",
  isLink: true,
  databaseConfig: {
    tableName: "product_variant_price_set",
    idPrefix: "pvps",
  },
  alias: [
    {
      name: ["product_variant_price_set", "product_variant_price_sets"],
      entity: "LinkProductVariantPriceSet",
    },
  ],
  primaryKeys: ["id", "variant_id", "price_set_id"],
  relationships: [
    {
      serviceName: "product",
      entity: "ProductVariant",
      primaryKey: "id",
      foreignKey: "variant_id",
      alias: "variant",
      args: {
        methodSuffix: "ProductVariants",
      },
    },
    {
      serviceName: "pricing",
      entity: "PriceSet",
      primaryKey: "id",
      foreignKey: "price_set_id",
      alias: "price_set",
      args: {
        methodSuffix: "PriceSets",
      },
      deleteCascade: true,
    },
  ],
  extends: [
    {
      serviceName: "product",
      fieldAlias: {
        price_set: "price_set_link.price_set",
        prices: {
          path: "price_set_link.price_set.prices",
          isList: true,
          forwardArgumentsOnPath: ["price_set_link.price_set"],
        },
        deep_nested_price: {
          path: "price_set_link.price_set.deep_nested_price",
          forwardArgumentsOnPath: ["price_set_link.price_set"],
        },
        calculated_price: {
          path: "price_set_link.price_set.calculated_price",
          forwardArgumentsOnPath: ["price_set_link.price_set"],
        },
      },
      relationship: {
        serviceName: "link-product-variant-price-set",
        primaryKey: "variant_id",
        foreignKey: "id",
        alias: "price_set_link",
      },
    },
    {
      serviceName: "pricing",
      relationship: {
        serviceName: "link-product-variant-price-set",
        primaryKey: "price_set_id",
        foreignKey: "id",
        alias: "variant_link",
      },
      fieldAlias: {
        variant: "variant_link.variant",
      },
    },
  ],
} as ModuleJoinerConfig

MedusaModule.setJoinerConfig("product", productJoinerConfig)
MedusaModule.setJoinerConfig("pricing", pricingJoinerConfig)
MedusaModule.setJoinerConfig("customProduct", customModuleJoinerConfig)
MedusaModule.setJoinerConfig(
  "link-product-variant-price-set",
  linkProductVariantPriceSet
)
