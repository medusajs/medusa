import { IdMap } from "medusa-test-utils"

export const moneyAmounts = {
  amountOne: {
    id: IdMap.getId("amountOne"),
    currency_code: "USD",
    amount: 1,
    min_quantity: 1,
    max_quantity: 10,
    price_list_id: null,
  }
}

export const MoneyAmountModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  findOne: jest.fn().mockImplementation(query => {
    if (query._id === IdMap.getId("amountOne")) {
        return Promise.resolve(moneyAmounts.amountOne)
    }
    return Promise.resolve(undefined)
  }),
  addToPriceList: jest.fn().mockImplementation((priceListId, prices, overrideExisting) => {
    return Promise.resolve()
  }),
  deletePriceListPrices: jest.fn().mockImplementation((priceListId, moneyAmountIds) => {
    return Promise.resolve()
  }),
  updatePriceListPrices: jest.fn().mockImplementation((priceListId, updates) => {
    return Promise.resolve()
  }),
}
