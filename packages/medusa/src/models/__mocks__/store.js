import { IdMap } from "medusa-test-utils"

export const store = {
  _id: IdMap.getId("store"),
  name: "test store",
  currencies: ["DKK"],
}

export const StoreModelMock = {
  create: jest.fn().mockReturnValue(Promise.resolve()),
  updateOne: jest.fn().mockImplementation((query, update) => {
    return Promise.resolve()
  }),
  findOne: jest.fn().mockImplementation(query => {
    return Promise.resolve(store)
  }),
}
