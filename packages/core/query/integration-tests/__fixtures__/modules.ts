import { LoadedModule, ModuleJoinerConfig } from "@medusajs/types"
import { integrationData } from "./data"

const productJoinerConfig: ModuleJoinerConfig = {
  serviceName: "product",
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
      name: ["product_variant", "product_variants", "variant"],
      entity: "ProductVariant",
      args: {
        methodSuffix: "ProductVariants",
      },
    },
  ],
  relationships: [
    {
      serviceName: "product",
      entity: "ProductVariant",
      primaryKey: "id",
      foreignKey: "product_id",
      alias: "variants",
      inverse: true,
      args: {
        methodSuffix: "ProductVariants",
      },
    },
  ],
  schema: `
    type Product {
      id: ID!
      title: String
      handle: String
      variants: [ProductVariant]
    }

    type ProductVariant {
      id: ID!
      product_id: String
      sku: String
      product: Product
    }
  `,
}

const pricingJoinerConfig: ModuleJoinerConfig = {
  serviceName: "pricing",
  primaryKeys: ["id"],
  linkableKeys: {
    price_set_id: "PriceSet",
    price_id: "Price",
  },
  alias: [
    {
      name: ["price_set", "price_sets"],
      entity: "PriceSet",
      args: {
        methodSuffix: "PriceSets",
      },
    },
    {
      name: ["price"],
      entity: "Price",
      args: {
        methodSuffix: "Prices",
      },
    },
  ],
  relationships: [
    {
      serviceName: "pricing",
      entity: "Price",
      primaryKey: "id",
      foreignKey: "price_set_id",
      alias: "prices",
      inverse: true,
      args: {
        methodSuffix: "Prices",
      },
    },
  ],
  schema: `
    type PriceSet {
      id: ID!
      prices: [Price]
    }

    type Price {
      id: ID!
      amount: Float
      currency_code: String
      price_set_id: String
      price_set: PriceSet
    }
  `,
}

const productVariantPriceSetLinkConfig: ModuleJoinerConfig = {
  serviceName: "productVariantPriceSet",
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
    },
    {
      serviceName: "pricing",
      entity: "PriceSet",
      primaryKey: "id",
      foreignKey: "price_set_id",
      alias: "price_set",
      deleteCascade: true,
    },
  ],
  extends: [
    {
      serviceName: "product",
      entity: "ProductVariant",
      fieldAlias: {
        price_set: "price_set_link.price_set",
      },
      relationship: {
        serviceName: "productVariantPriceSet",
        primaryKey: "variant_id",
        foreignKey: "id",
        alias: "price_set_link",
      },
    },
    {
      serviceName: "pricing",
      entity: "PriceSet",
      fieldAlias: {
        variant: "variant_link.variant",
      },
      relationship: {
        serviceName: "productVariantPriceSet",
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

type ListMethod = jest.Mock<
  Promise<unknown[] | [unknown[], number]>,
  [Record<string, unknown>?, Record<string, unknown>?]
>

export type TestModules = {
  product: LoadedModule & {
    list: ListMethod
    listAndCount: ListMethod
    listProductVariants: ListMethod
    listAndCountProductVariants: ListMethod
  }
  pricing: LoadedModule & {
    list: ListMethod
    listAndCount: ListMethod
    listPriceSets: ListMethod
    listAndCountPriceSets: ListMethod
    listPrices: ListMethod
    listAndCountPrices: ListMethod
  }
  link: LoadedModule & {
    list: ListMethod
    listAndCount: ListMethod
  }
}

export function createTestModules(): TestModules {
  return {
    product: {
      __definition: {
        key: "product",
        isQueryable: true,
      } as LoadedModule["__definition"],
      __joinerConfig: productJoinerConfig,
      list: jest.fn(),
      listAndCount: jest.fn(),
      listProductVariants: jest.fn(),
      listAndCountProductVariants: jest.fn(),
    },
    pricing: {
      __definition: {
        key: "pricing",
        isQueryable: true,
      } as LoadedModule["__definition"],
      __joinerConfig: pricingJoinerConfig,
      list: jest.fn(),
      listAndCount: jest.fn(),
      listPriceSets: jest.fn(),
      listAndCountPriceSets: jest.fn(),
      listPrices: jest.fn(),
      listAndCountPrices: jest.fn(),
    },
    link: {
      __definition: {
        key: "productVariantPriceSet",
        isQueryable: true,
      } as LoadedModule["__definition"],
      __joinerConfig: productVariantPriceSetLinkConfig,
      list: jest.fn(),
      listAndCount: jest.fn(),
    },
  }
}

export function createFakeLoadedModules(modules: TestModules): LoadedModule[] {
  return [modules.product, modules.pricing, modules.link]
}

export function getJoinerConfigs(modulesLoaded: LoadedModule[]) {
  return modulesLoaded.map((module) => module.__joinerConfig)
}

export { integrationData }
