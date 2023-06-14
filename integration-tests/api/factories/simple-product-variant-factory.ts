import { DataSource } from "typeorm"
import faker from "faker"
import {
  MoneyAmount,
  ProductOptionValue,
  ProductVariant,
} from "@medusajs/medusa"

export type ProductVariantFactoryData = {
  product_id: string
  id?: string
  is_giftcard?: boolean
  sku?: string
  inventory_quantity?: number
  title?: string
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
  const toSave = manager.create(ProductVariant, {
    id,
    product_id: data.product_id,
    sku: data.sku,
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

  const prices = data.prices || [{ currency: "usd", amount: 100 }]
  for (const p of prices) {
    await manager.insert(MoneyAmount, {
      id: `${p.currency}-${p.amount}-${Math.random()}`,
      variant_id: id,
      currency_code: p.currency,
      amount: p.amount,
      region_id: p.region_id,
    })
  }

  return variant
}
