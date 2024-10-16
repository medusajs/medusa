import { ModuleJoinerConfig } from "@medusajs/framework/types"
import { LINKS, Modules } from "@medusajs/framework/utils"

export const ProductVariantInventoryItem: ModuleJoinerConfig = {
  serviceName: LINKS.ProductVariantInventoryItem,
  isLink: true,
  databaseConfig: {
    tableName: "product_variant_inventory_item",
    idPrefix: "pvitem",
    extraFields: {
      required_quantity: {
        type: "integer",
        defaultValue: "1",
      },
    },
  },
  alias: [
    {
      name: [
        "product_variant_inventory_item",
        "product_variant_inventory_items",
      ],
      entity: "LinkProductVariantInventoryItem",
    },
  ],
  primaryKeys: ["id", "variant_id", "inventory_item_id"],
  relationships: [
    {
      serviceName: Modules.PRODUCT,
      entity: "ProductVariant",
      primaryKey: "id",
      foreignKey: "variant_id",
      alias: "variant",
      args: {
        methodSuffix: "ProductVariants",
      },
    },
    {
      serviceName: Modules.INVENTORY,
      entity: "InventoryItem",
      primaryKey: "id",
      foreignKey: "inventory_item_id",
      alias: "inventory",
      args: {
        methodSuffix: "InventoryItems",
      },
    },
  ],
  extends: [
    {
      serviceName: Modules.PRODUCT,
      fieldAlias: {
        inventory: "inventory_items.inventory",
      },
      relationship: {
        serviceName: LINKS.ProductVariantInventoryItem,
        primaryKey: "variant_id",
        foreignKey: "id",
        alias: "inventory_items",
        isList: true,
      },
    },
    {
      serviceName: Modules.INVENTORY,
      fieldAlias: {
        variants: {
          path: "variant_link.variant",
          isList: true,
        },
      },
      relationship: {
        serviceName: LINKS.ProductVariantInventoryItem,
        primaryKey: "inventory_item_id",
        foreignKey: "id",
        alias: "variant_link",
        isList: true,
      },
    },
  ],
}
