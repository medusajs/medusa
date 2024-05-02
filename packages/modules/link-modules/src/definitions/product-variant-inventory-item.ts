import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "@medusajs/utils"

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
      args: {
        entity: "LinkProductVariantInventoryItem",
      },
    },
  ],
  primaryKeys: ["id", "variant_id", "inventory_item_id"],
  relationships: [
    {
      serviceName: Modules.PRODUCT,
      primaryKey: "id",
      foreignKey: "variant_id",
      alias: "variant",
      args: {
        methodSuffix: "Variants",
      },
    },
    {
      serviceName: Modules.INVENTORY,
      primaryKey: "id",
      foreignKey: "inventory_item_id",
      alias: "inventory",
      deleteCascade: true,
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
        variant: "variant_link.variant",
      },
      relationship: {
        serviceName: LINKS.ProductVariantInventoryItem,
        primaryKey: "inventory_item_id",
        foreignKey: "id",
        alias: "variant_link",
      },
    },
  ],
}
