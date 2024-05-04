const { ProductVariantMoneyAmount } = require("@medusajs/medusa")
const { Region, PriceList, MoneyAmount } = require("@medusajs/medusa")

module.exports = async (dataSource, data = {}) => {
  const manager = dataSource.manager

  const priceListNoCustomerGroups = manager.create(PriceList, {
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

  const moneyAmount1 = manager.create(MoneyAmount, {
    id: "ma_test_1",
    amount: 100,
    currency_code: "usd",
    min_quantity: 1,
    max_quantity: 100,
    price_list_id: "pl_no_customer_groups",
  })

  await manager.save(moneyAmount1)

  const moneyAmount2 = manager.create(MoneyAmount, {
    id: "ma_test_2",
    amount: 80,
    currency_code: "usd",
    min_quantity: 101,
    max_quantity: 500,
    price_list_id: "pl_no_customer_groups",
  })

  await manager.save(moneyAmount2)

  const moneyAmount3 = manager.create(MoneyAmount, {
    id: "ma_test_3",
    amount: 50,
    currency_code: "usd",
    min_quantity: 501,
    max_quantity: 1000,
    price_list_id: "pl_no_customer_groups",
  })

  await manager.save(moneyAmount3)

  const moneyAmount4 = manager.create(MoneyAmount, {
    id: "ma_test_4",
    amount: 70,
    currency_code: "usd",
  })

  await manager.save(moneyAmount4)

  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma1-pl",
    money_amount_id: "ma_test_1",
    variant_id: "test-variant",
  })
  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma2-pl",
    money_amount_id: "ma_test_2",
    variant_id: "test-variant",
  })
  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma3-pl",
    money_amount_id: "ma_test_3",
    variant_id: "test-variant",
  })
  await manager.insert(ProductVariantMoneyAmount, {
    id: "pvma4-pl",
    money_amount_id: "ma_test_4",
    variant_id: "test-variant",
  })

  const priceListWithMA = manager.create(PriceList, {
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
