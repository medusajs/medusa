import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import {
  Address,
  Cart,
  LineItem,
  LineItemAdjustment,
  LineItemTaxLine,
  ShippingMethod,
  ShippingMethodAdjustment,
  ShippingMethodTaxLine,
} from "@models"

export const LinkableKeys = {
  cart_id: Cart.name,
  line_item_id: LineItem.name,
  shipping_method_id: ShippingMethod.name,
  address_id: Address.name,
  line_item_adjustment_id: LineItemAdjustment.name,
  shipping_method_adjustment_id: ShippingMethodAdjustment.name,
  line_item_tax_line_id: LineItemTaxLine.name,
  shipping_method_tax_line_id: ShippingMethodTaxLine.name,
}

const entityLinkableKeysMap: MapToConfig = {}
Object.entries(LinkableKeys).forEach(([key, value]) => {
  entityLinkableKeysMap[value] ??= []
  entityLinkableKeysMap[value].push({
    mapTo: key,
    valueFrom: key.split("_").pop()!,
  })
})

export const entityNameToLinkableKeysMap: MapToConfig = entityLinkableKeysMap

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.CART,
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  alias: [
    {
      name: ["cart", "carts"],
      args: {
        entity: Cart.name,
      },
    },
    {
      name: ["line_item", "line_items"],
      args: {
        entity: LineItem.name,
        methodSuffix: "LineItems",
      },
    },
    {
      name: ["shipping_method", "shipping_methods"],
      args: {
        entity: ShippingMethod.name,
        methodSuffix: "ShippingMethods",
      },
    },
    {
      name: ["address", "addresses"],
      args: {
        entity: Address.name,
        methodSuffix: "Addresses",
      },
    },
    {
      name: ["line_item_adjustment", "line_item_adjustments"],
      args: {
        entity: LineItemAdjustment.name,
        methodSuffix: "LineItemAdjustments",
      },
    },
    {
      name: ["shipping_method_adjustment", "shipping_method_adjustments"],
      args: {
        entity: ShippingMethodAdjustment.name,
        methodSuffix: "ShippingMethodAdjustments",
      },
    },
    {
      name: ["line_item_tax_line", "line_item_tax_lines"],
      args: {
        entity: LineItemTaxLine.name,
        methodSuffix: "LineItemTaxLines",
      },
    },
    {
      name: ["shipping_method_tax_line", "shipping_method_tax_lines"],
      args: {
        entity: ShippingMethodTaxLine.name,
        methodSuffix: "ShippingMethodTaxLines",
      },
    },
  ],
}
