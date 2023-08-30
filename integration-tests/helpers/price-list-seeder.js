const { Region, PriceList, MoneyAmount } = require("@medusajs/medusa")

module.exports = async (dataSource, data = {}) => {
  const manager = dataSource.manager

  const priceListNoCustomerGroups = await manager.create(PriceList, {
    id: "pl_no_customer_groups",
    name: "VIP winter sale",
    description: "Winter sale for VIP customers. 25% off selected items.",
    type: "sale",
    status: "active",
    starts_at: "2022-07-01T00:00:00.000Z",
    ends_at: "2022-07-31T00:00:00.000Z",
  })

  await manager.save(priceListNoCustomerGroups)

  await manager.insert(Region, {
    id: "region-pl",
    name: "Test Region",
    currency_code: "eur",
    tax_rate: 0,
  })

  const moneyAmount1 = await manager.create(MoneyAmount, {
    id: "ma_test_1",
    amount: 100,
    currency_code: "usd",
    min_quantity: 1,
    max_quantity: 100,
    price_list_id: "pl_no_customer_groups",
  })

  await manager.save(moneyAmount1)

  const moneyAmount2 = await manager.create(MoneyAmount, {
    id: "ma_test_2",
    amount: 80,
    currency_code: "usd",
    min_quantity: 101,
    max_quantity: 500,
    price_list_id: "pl_no_customer_groups",
  })

  await manager.save(moneyAmount2)

  const moneyAmount3 = await manager.create(MoneyAmount, {
    id: "ma_test_3",
    amount: 50,
    currency_code: "usd",
    min_quantity: 501,
    max_quantity: 1000,
    price_list_id: "pl_no_customer_groups",
  })

  await manager.save(moneyAmount3)

  const moneyAmount4 = await manager.create(MoneyAmount, {
    id: "ma_test_4",
    amount: 70,
    currency_code: "usd",
  })

  await manager.save(moneyAmount4)

  await manager.query(
    `INSERT INTO "money_amount_variant"(money_amount_id, variant_id) VALUES 
    ('ma_test_1', 'test-variant'), 
    ('ma_test_2', 'test-variant'), 
    ('ma_test_3', 'test-variant'), 
    ('ma_test_4', 'test-variant');
    `
  )

  const priceListWithMA = await manager.create(PriceList, {
    id: "pl_with_some_ma",
    name: "Weeken sale",
    description: "Desc. of the list",
    type: "sale",
    status: "active",
    starts_at: "2022-07-01T00:00:00.000Z",
    ends_at: "2022-07-31T00:00:00.000Z",
  })

  priceListWithMA.prices = [moneyAmount4]

  await manager.save(priceListWithMA)
}
