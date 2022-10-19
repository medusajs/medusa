import { IdMap } from "medusa-test-utils"

export const currency = {
  code: IdMap.getId("currency-1"),
  symbol: "SYM",
  symbol_native: "SYM",
  name: "Symbol",
}

export const CurrencyServiceMock = {
  withTransaction: function() {
    return this
  },
  retrieve: jest.fn().mockImplementation((code) => {
    return Promise.resolve({
      ...currency,
      code: code,
    })
  }),

  update: jest.fn().mockImplementation((code, data) => {
    return Promise.resolve({
      ...currency,
      ...data,
    })
  }),

  listAndCount: jest.fn().mockImplementation(() => {
    return Promise.resolve([
      [currency],
      1,
    ])
  })
}

const mock = jest.fn().mockImplementation(() => {
  return CurrencyServiceMock
})

export default mock
