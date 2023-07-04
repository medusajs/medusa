import { IdMap } from "medusa-test-utils"

export const StockLocationServiceMock = {
  withTransaction: function () {
    return this
  },

  retrieve: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve({
      id: id,
      name: "stock location 1 name",
    })
  }),
  update: jest.fn().mockImplementation((id, data) => {
    return Promise.resolve({ id, ...data })
  }),

  listAndCount: jest.fn().mockImplementation(() => {
    return Promise.resolve([
      [
        {
          id: IdMap.getId("stock_location_1"),
          name: "stock location 1 name",
        },
      ],
      1,
    ])
  }),

  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve({
      id: id,
      ...data,
    })
  }),

  delete: jest.fn().mockImplementation((id, config) => {
    return Promise.resolve()
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return StockLocationServiceMock
})

export default mock
