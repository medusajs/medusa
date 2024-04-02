import {
  MoneyAmount,
  ProductOptionValue,
  ProductVariant,
  ProductVariantMoneyAmount,
} from "@medusajs/medusa"

import { DataSource } from "typeorm"
import faker from "faker"
import { breaking } from "../helpers/breaking"

export type ProductVariantFactoryData = {
  product_id: string
  id?: string
  is_giftcard?: boolean
  sku?: string
  manage_inventory?: boolean
  inventory_quantity?: number
  title?: string
  allow_backorder?: boolean
  options?: { option_id: string; value: string }[]
  prices?: { currency: string; amount: number; region_id?: string }[]
}

export const simpleProductVariantFactory = async (
  dataSource: DataSource,
  data: ProductVariantFactoryData,
  seed?: number
): Promise<ProductVariant> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  const id = data.id || `simple-variant-${Math.random() * 1000}`

  const toSave = await manager.create(ProductVariant, {
    id,
    product_id: data.product_id,
    sku: data.sku,
    allow_backorder: data.allow_backorder ?? false,
    manage_inventory:
      typeof data.manage_inventory !== "undefined"
        ? data.manage_inventory
        : true,
    inventory_quantity:
      typeof data.inventory_quantity !== "undefined"
        ? data.inventory_quantity
        : 10,
    title: data.title || faker.commerce.productName(),
  })

  const variant = await manager.save(toSave)

  const options = data.options || [{ option_id: "test-option", value: "Large" }]
  for (const o of options) {
    await manager.insert(ProductOptionValue, {
      id: `${variant.id}-${o.option_id ?? Math.random()}`,
      value: o.value,
      variant_id: id,
      option_id: o.option_id,
    })
  }

  await breaking(async () => {
    const prices = data.prices || [{ currency: "usd", amount: 100 }]
    for (const p of prices) {
      const ma_id = `${p.currency}-${p.amount}-${Math.random()}`
      await manager.insert(MoneyAmount, {
        id: ma_id,
        currency_code: p.currency,
        amount: p.amount,
        region_id: p.region_id,
      })

      await manager.insert(ProductVariantMoneyAmount, {
        id: `${ma_id}-${id}-${Math.random()}`,
        money_amount_id: ma_id,
        variant_id: id,
      })
    }
  })

  return variant
}
