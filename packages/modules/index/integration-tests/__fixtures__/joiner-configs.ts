import { ModuleJoinerConfig } from "@medusajs/framework/types"

/**
 * Joiner configs describing the fake "remote" modules the index module
 * indexes data from. The index module is generic over the modules
 * registered in the application — it only consumes their joiner configs
 * (schema, aliases, linkable keys) and their events/query data. These
 * fixtures model a product-like and a pricing-like module joined by a
 * link module, without depending on the real commerce modules.
 */

const PRODUCT_SERVICE = "product"
const PRICING_SERVICE = "pricing"
const LINK_SERVICE = "productVariantPriceSet"

export const productJoinerConfig: ModuleJoinerConfig = {
  serviceName: PRODUCT_SERVICE,
  primaryKeys: ["id"],
  linkableKeys: {
    product_id: "Product",
    variant_id: "ProductVariant",
  },
  alias: [
    {
      name: ["product", "products"],
      entity: "Product",
    },
    {
      name: ["product_variant", "product_variants", "variant", "variants"],
      entity: "ProductVariant",
    },
  ],
  schema: `
    scalar DateTime

    type Product {
      id: ID!
      title: String
      handle: String
      created_at: DateTime
      updated_at: DateTime
      variants: [ProductVariant]
    }

    type ProductVariant {
      id: ID!
      product_id: String
      sku: String
      description: String
      created_at: DateTime
      updated_at: DateTime
      product: Product
    }
  `,
}

export const pricingJoinerConfig: ModuleJoinerConfig = {
  serviceName: PRICING_SERVICE,
  primaryKeys: ["id"],
  linkableKeys: {
    price_set_id: "PriceSet",
    price_id: "Price",
  },
  alias: [
    {
      name: ["price_set", "price_sets"],
      entity: "PriceSet",
    },
    {
      name: ["price", "prices"],
      entity: "Price",
    },
  ],
  schema: `
    scalar DateTime

    type PriceSet {
      id: ID!
      created_at: DateTime
      updated_at: DateTime
      prices: [Price]
    }

    type Price {
      id: ID!
      amount: Float
      currency_code: String
      created_at: DateTime
      updated_at: DateTime
      price_set: PriceSet
    }
  `,
}

export const productVariantPriceSetLinkConfig: ModuleJoinerConfig = {
  serviceName: LINK_SERVICE,
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
      serviceName: PRODUCT_SERVICE,
      entity: "ProductVariant",
      primaryKey: "id",
      foreignKey: "variant_id",
      alias: "variant",
    },
    {
      serviceName: PRICING_SERVICE,
      entity: "PriceSet",
      primaryKey: "id",
      foreignKey: "price_set_id",
      alias: "price_set",
      deleteCascade: true,
    },
  ],
  extends: [
    {
      serviceName: PRODUCT_SERVICE,
      entity: "ProductVariant",
      fieldAlias: {
        price_set: "price_set_link.price_set",
      },
      relationship: {
        serviceName: LINK_SERVICE,
        primaryKey: "variant_id",
        foreignKey: "id",
        alias: "price_set_link",
      },
    },
    {
      serviceName: PRICING_SERVICE,
      entity: "PriceSet",
      fieldAlias: {
        variant: "variant_link.variant",
      },
      relationship: {
        serviceName: LINK_SERVICE,
        primaryKey: "price_set_id",
        foreignKey: "id",
        alias: "variant_link",
      },
    },
  ],
  schema: `
    extend type ProductVariant {
      price_set_link: LinkProductVariantPriceSet
      price_set: PriceSet
    }

    extend type PriceSet {
      variant_link: LinkProductVariantPriceSet
      variant: ProductVariant
    }

    type LinkProductVariantPriceSet {
      id: ID!
      variant_id: String!
      price_set_id: String!
      variant: ProductVariant
      price_set: PriceSet
    }
  `,
}

/**
 * Registration order matters: entities are resolved against the configs in
 * order, and the link config's cleaned schema also declares the entities it
 * extends, so the owning modules must come first.
 */
export const remoteModulesJoinerConfigs: ModuleJoinerConfig[] = [
  productJoinerConfig,
  pricingJoinerConfig,
  productVariantPriceSetLinkConfig,
]
