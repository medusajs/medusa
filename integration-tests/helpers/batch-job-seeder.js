const { Region } = require("@medusajs/medusa")

module.exports = async (dataSource, data = {}) => {
  const manager = dataSource.manager

  await manager.insert(Region, {
    id: "region-product-import-0",
    name: "ImportLand",
    currency_code: "eur",
    tax_rate: 0,
  })

  await manager.insert(Region, {
    id: "region-product-import-1",
    name: "denmark",
    currency_code: "dkk",
    tax_rate: 0,
  })

  await manager.insert(Region, {
    id: "region-product-import-2",
    name: "Denmark",
    currency_code: "dkk",
    tax_rate: 0,
  })
}
