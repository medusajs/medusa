import { IdMap } from "medusa-test-utils"

export const ProductCollectionServiceMock = {
  withTransaction: function() {
    return this
  },
  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve({ id: IdMap.getId("col"), ...data })
  }),
  retrieve: jest.fn().mockImplementation((id) => {
    if (id === IdMap.getId("col")) {
      return Promise.resolve({ id: IdMap.getId("col"), title: "Suits" })
    }
  }),
  delete: jest.fn().mockReturnValue(Promise.resolve()),
  update: jest.fn().mockImplementation((id, value) => {
    return Promise.resolve({ id, title: value })
  }),
  addProducts: jest.fn().mockImplementation((id, product_ids) => {
    if (id === IdMap.getId("col")) {
      return Promise.resolve({
        id,
        products: product_ids.map((i) => ({ id: i })),
      })
    }
    throw new Error("Product collection not found")
  }),
  removeProducts: jest.fn().mockReturnValue(Promise.resolve()),
  list: jest.fn().mockImplementation((data) => {
    return Promise.resolve([{ id: IdMap.getId("col"), title: "Suits" }])
  }),
  listAndCount: jest.fn().mockImplementation((data) => {
    return Promise.resolve([[{ id: IdMap.getId("col"), title: "Suits" }], 1])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ProductCollectionServiceMock
})

export default mock
