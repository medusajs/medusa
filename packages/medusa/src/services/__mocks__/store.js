import { IdMap } from "medusa-test-utils"

export const store = {
  _id: IdMap.getId("store"),
  name: "Test store",
  currencies: ["DKK", "SEK", "GBP"],
}

export const StoreServiceMock = {
  addCurrency: jest.fn().mockImplementation(data => {
    return Promise.resolve()
  }),
  removeCurrency: jest.fn().mockImplementation(data => {
    return Promise.resolve()
  }),
  update: jest.fn().mockImplementation(data => {
    return Promise.resolve()
  }),
  retrieve: jest.fn().mockImplementation(data => {
    return Promise.resolve(store)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return StoreServiceMock
})

export default mock
