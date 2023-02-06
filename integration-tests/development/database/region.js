const { Region } = require("@medusajs/medusa")

module.exports = async (connection) => {
  const manager = connection.manager

  const r = manager.create(Region, {
    id: "test-region",
    name: "Test Region",
    payment_providers: [{ id: "test-pay" }],
    currency_code: "usd",
    tax_rate: 0,
  })

  await manager.save(r)

  const europeRegion = manager.create(Region, {
    id: "eur-region",
    name: "Europe Region",
    payment_providers: [{ id: "test-pay" }],
    currency_code: "eur",
    tax_rate: 0,
  })

  await manager.save(europeRegion)

  // Region with multiple countries
  const regionWithMultipleCoutries = manager.create(Region, {
    id: "test-region-multiple",
    name: "Test Region",
    currency_code: "eur",
    tax_rate: 0,
  })

  await manager.save(regionWithMultipleCoutries)

  await manager.query(
    `UPDATE "country" SET region_id='test-region-multiple' WHERE iso_2 = 'no'`
  )
  await manager.query(
    `UPDATE "country" SET region_id='test-region-multiple' WHERE iso_2 = 'dk'`
  )
  await manager.query(
    `UPDATE "country" SET region_id='test-region' WHERE iso_2 = 'us'`
  )
}
