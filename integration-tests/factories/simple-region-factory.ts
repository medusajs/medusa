import { DataSource } from "typeorm"
import faker from "faker"
import { Region } from "@medusajs/medusa"

export type RegionFactoryData = {
  id?: string
  name?: string
  currency_code?: string
  tax_rate?: number
  countries?: string[]
  automatic_taxes?: boolean
  gift_cards_taxable?: boolean
  fulfillment_providers?: { id: string }[]
  includes_tax?: boolean
}

export const simpleRegionFactory = async (
  dataSource: DataSource,
  data: RegionFactoryData = {},
  seed?: number
): Promise<Region> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  const regionId = data.id || `simple-region-${Math.random() * 1000}`
  const r = manager.create(Region, {
    id: regionId,
    name: data.name || "Test Region",
    currency_code: data.currency_code || "usd",
    tax_rate: data.tax_rate || 0,
    payment_providers: [{ id: "test-pay" }],
    fulfillment_providers: data.fulfillment_providers ?? [{ id: "test-ful" }],
    gift_cards_taxable: data.gift_cards_taxable ?? true,
    includes_tax: data.includes_tax,
    automatic_taxes:
      typeof data.automatic_taxes !== "undefined" ? data.automatic_taxes : true,
  })

  const region = await manager.save(r)

  const countries = data.countries || ["us"]

  for (const cc of countries) {
    await manager.query(
      `UPDATE "country" SET region_id='${regionId}' WHERE iso_2 = '${cc}'`
    )
  }

  return region
}
