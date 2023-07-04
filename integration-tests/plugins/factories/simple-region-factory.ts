import { Connection } from "typeorm"
import faker from "faker"
import { Region } from "@medusajs/medusa"

export type RegionFactoryData = {
  id?: string
  name?: string
  currency_code?: string
  tax_rate?: number
  countries?: string[]
  automatic_taxes?: boolean
}

export const simpleRegionFactory = async (
  connection: Connection,
  data: RegionFactoryData = {},
  seed?: number
): Promise<Region> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = connection.manager

  const regionId = data.id || `simple-region-${Math.random() * 1000}`
  const r = manager.create(Region, {
    id: regionId,
    name: data.name || "Test Region",
    currency_code: data.currency_code || "usd",
    tax_rate: data.tax_rate || 0,
    payment_providers: [{ id: "test-pay" }],
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
