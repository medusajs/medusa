const defaultMoneyAmountsData = [
  {
    id: "pl-money-amount-USD",
    currency_code: "USD",
    amount: 500,
    min_quantity: 1,
    max_quantity: 10,
  },
  {
    id: "pl-money-amount-EUR",
    currency_code: "EUR",
    amount: 400,
    min_quantity: 1,
    max_quantity: 5,
  },
  {
    id: "pl-money-amount-CAD",
    currency_code: "CAD",
    amount: 600,
    min_quantity: 1,
    max_quantity: 8,
  },
]

export const defaultPriceListData = [{
  id: "price-list-1",
  name: "Default Price List",
  description: "Default Price List",
  prices: defaultMoneyAmountsData,
}, {
  id: "price-list-2",
  name: "Default Price List",
  description: "Default Price List",
  prices: [],
}]
