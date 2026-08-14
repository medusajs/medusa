import { ModuleJoinerConfig } from "@medusajs/types"

/**
 * Minimal product / pricing / sales channel setup connected through link
 * modules, with cross-module join metadata (`__internal`) as emitted by
 * defineJoinerConfig from DML models.
 */

const productJoinerConfig: ModuleJoinerConfig = {
  serviceName: "product",
  primaryKeys: ["id"],
  alias: [
    {
      name: ["product", "products"],
      entity: "Product",
      __internal: {
        crossjoinable: ["id", "title", "handle"],
        tableName: "product",
        relations: {
          variants: {
            entity: "ProductVariant",
            foreignKey: "product_id",
            foreignKeyOwner: "target",
            isList: true,
          },
        },
      },
      args: {
        methodSuffix: "Products",
      },
    },
    {
      name: ["variant", "variants"],
      entity: "ProductVariant",
      __internal: {
        crossjoinable: ["id", "title", "sku"],
        tableName: "product_variant",
      },
      args: {
        methodSuffix: "ProductVariants",
      },
    },
  ],
}

const pricingJoinerConfig: ModuleJoinerConfig = {
  serviceName: "pricing",
  primaryKeys: ["id"],
  alias: [
    {
      name: ["price_set", "price_sets"],
      entity: "PriceSet",
      // calculated_price is a computed DML field, hence not crossjoinable.
      __internal: {
        crossjoinable: ["id", "currency_code"],
        tableName: "price_set",
        relations: {
          prices: {
            entity: "Price",
            foreignKey: "price_set_id",
            foreignKeyOwner: "target",
            isList: true,
          },
        },
      },
      args: {
        methodSuffix: "PriceSets",
      },
    },
    {
      name: ["price", "prices"],
      entity: "Price",
      // price_list_id mirrors a belongsTo foreign key column.
      __internal: {
        crossjoinable: ["id", "amount", "currency_code", "price_list_id"],
        tableName: "price",
      },
      args: {
        methodSuffix: "Prices",
      },
    },
  ],
}

const salesChannelJoinerConfig: ModuleJoinerConfig = {
  serviceName: "sales_channel",
  primaryKeys: ["id"],
  alias: [
    {
      name: ["sales_channel", "sales_channels"],
      entity: "SalesChannel",
      __internal: {
        crossjoinable: ["id", "name"],
        tableName: "sales_channel",
      },
      args: {
        methodSuffix: "SalesChannels",
      },
    },
  ],
}

const productVariantPriceSetLink: ModuleJoinerConfig = {
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
    },
  ],
  extends: [
    {
      serviceName: "product",
      entity: "ProductVariant",
      fieldAlias: {
        price_set: "price_set_link.price_set",
        prices: {
          path: "price_set_link.price_set.prices",
          isList: true,
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
      entity: "PriceSet",
      fieldAlias: {
        variant: "variant_link.variant",
      },
      relationship: {
        serviceName: "link-product-variant-price-set",
        primaryKey: "price_set_id",
        foreignKey: "id",
        alias: "variant_link",
      },
    },
  ],
}

// A second link targeting the same price_set table, used to exercise the
// unique-target-table constraint.
const productVariantBackupPriceSetLink: ModuleJoinerConfig = {
  serviceName: "link-product-variant-backup-price-set",
  isLink: true,
  databaseConfig: {
    tableName: "product_variant_backup_price_set",
    idPrefix: "pvbps",
  },
  alias: [
    {
      name: [
        "product_variant_backup_price_set",
        "product_variant_backup_price_sets",
      ],
      entity: "LinkProductVariantBackupPriceSet",
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
    },
  ],
  extends: [
    {
      serviceName: "product",
      entity: "ProductVariant",
      fieldAlias: {
        backup_price_set: "backup_price_set_link.price_set",
      },
      relationship: {
        serviceName: "link-product-variant-backup-price-set",
        primaryKey: "variant_id",
        foreignKey: "id",
        alias: "backup_price_set_link",
      },
    },
  ],
}

const priceSetSalesChannelLink: ModuleJoinerConfig = {
  serviceName: "link-price-set-sales-channel",
  isLink: true,
  databaseConfig: {
    tableName: "price_set_sales_channel",
    idPrefix: "pssc",
  },
  alias: [
    {
      name: ["price_set_sales_channel", "price_set_sales_channels"],
      entity: "LinkPriceSetSalesChannel",
    },
  ],
  primaryKeys: ["id", "price_set_id", "sales_channel_id"],
  relationships: [
    {
      serviceName: "pricing",
      entity: "PriceSet",
      primaryKey: "id",
      foreignKey: "price_set_id",
      alias: "price_set",
      args: {
        methodSuffix: "PriceSets",
      },
    },
    {
      serviceName: "sales_channel",
      entity: "SalesChannel",
      primaryKey: "id",
      foreignKey: "sales_channel_id",
      alias: "sales_channel",
      args: {
        methodSuffix: "SalesChannels",
      },
    },
  ],
  extends: [
    {
      serviceName: "pricing",
      entity: "PriceSet",
      fieldAlias: {
        sales_channels: {
          path: "sales_channel_link.sales_channel",
          isList: true,
        },
      },
      relationship: {
        serviceName: "link-price-set-sales-channel",
        primaryKey: "price_set_id",
        foreignKey: "id",
        alias: "sales_channel_link",
        isList: true,
      },
    },
  ],
}

const cartJoinerConfig: ModuleJoinerConfig = {
  serviceName: "cart",
  primaryKeys: ["id"],
  alias: [
    {
      name: ["cart", "carts"],
      entity: "Cart",
      __internal: {
        crossjoinable: ["id", "email"],
        tableName: "cart",
        relations: {
          items: {
            entity: "LineItem",
            foreignKey: "cart_id",
            foreignKeyOwner: "target",
            isList: true,
          },
        },
      },
      args: {
        methodSuffix: "Carts",
      },
    },
    {
      name: ["line_item", "line_items"],
      entity: "LineItem",
      __internal: {
        crossjoinable: ["id", "title", "quantity"],
        tableName: "cart_line_item",
        relations: {
          cart: {
            entity: "Cart",
            foreignKey: "cart_id",
            foreignKeyOwner: "self",
          },
        },
      },
      args: {
        methodSuffix: "LineItems",
      },
    },
  ],
}

// Read-only links: FK columns on cart tables referencing other modules.
const cartProductReadonlyLink: ModuleJoinerConfig = {
  isLink: true,
  isReadOnlyLink: true,
  extends: [
    {
      serviceName: "cart",
      entity: "LineItem",
      relationship: {
        serviceName: "product",
        entity: "Product",
        primaryKey: "id",
        foreignKey: "items.product_id",
        alias: "product",
        args: {
          methodSuffix: "Products",
        },
      },
    },
    {
      serviceName: "cart",
      entity: "Cart",
      relationship: {
        serviceName: "sales_channel",
        entity: "SalesChannel",
        primaryKey: "id",
        foreignKey: "sales_channel_id",
        alias: "sales_channel",
        args: {
          methodSuffix: "SalesChannels",
        },
      },
    },
    // Inverse direction: the join column (sales_channel_id) lives on the
    // cart table, i.e. the target side of the relation.
    {
      serviceName: "sales_channel",
      entity: "SalesChannel",
      relationship: {
        serviceName: "cart",
        entity: "Cart",
        primaryKey: "sales_channel_id",
        foreignKey: "id",
        alias: "carts",
        isList: true,
        args: {
          methodSuffix: "Carts",
        },
      },
    },
  ],
}

const productSalesChannelLink: ModuleJoinerConfig = {
  serviceName: "link-product-sales-channel",
  isLink: true,
  databaseConfig: {
    tableName: "product_sales_channel",
    idPrefix: "prodsc",
  },
  alias: [
    {
      name: ["product_sales_channel", "product_sales_channels"],
      entity: "LinkProductSalesChannel",
    },
  ],
  primaryKeys: ["id", "product_id", "sales_channel_id"],
  relationships: [
    {
      serviceName: "product",
      entity: "Product",
      primaryKey: "id",
      foreignKey: "product_id",
      alias: "product",
      args: {
        methodSuffix: "Products",
      },
    },
    {
      serviceName: "sales_channel",
      entity: "SalesChannel",
      primaryKey: "id",
      foreignKey: "sales_channel_id",
      alias: "sales_channel",
      args: {
        methodSuffix: "SalesChannels",
      },
    },
  ],
  extends: [
    {
      serviceName: "product",
      entity: "Product",
      fieldAlias: {
        sales_channels: {
          path: "sales_channels_link.sales_channel",
          isList: true,
        },
      },
      relationship: {
        serviceName: "link-product-sales-channel",
        primaryKey: "product_id",
        foreignKey: "id",
        alias: "sales_channels_link",
        isList: true,
      },
    },
  ],
}

export const crossModuleJoinerConfigs: ModuleJoinerConfig[] = [
  productJoinerConfig,
  pricingJoinerConfig,
  salesChannelJoinerConfig,
  cartJoinerConfig,
  productVariantPriceSetLink,
  productVariantBackupPriceSetLink,
  priceSetSalesChannelLink,
  cartProductReadonlyLink,
  productSalesChannelLink,
]
