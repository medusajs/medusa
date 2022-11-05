import { MedusaError } from "medusa-core-utils"
import { IdMap } from "medusa-test-utils"

export const ProductOptionServiceMock = {
  withTransaction: function () {
    return this
  },
  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve({ id: IdMap.getId("opt"), ...data })
  }),
  retrieve: jest.fn().mockImplementation((id) => {
    if (id === IdMap.getId("opt")) {
      return Promise.resolve({ id: IdMap.getId("opt"), title: "Size" })
    }
  }),
  delete: jest.fn().mockReturnValue(Promise.resolve()),
  update: jest.fn().mockImplementation((id, value) => {
    return Promise.resolve({ id, title: value })
  }),
  addProducts: jest.fn().mockImplementation((id, product_ids) => {
    if (id === IdMap.getId("opt")) {
      return Promise.resolve({
        id,
        products: product_ids.map((i) => ({ id: i })),
      })
    }
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product option with id: ${id} was not found`
    )
  }),
  removeProducts: jest.fn().mockReturnValue(Promise.resolve()),
  list: jest.fn().mockImplementation((data) => {
    return Promise.resolve([{ id: IdMap.getId("opt"), title: "Size" }])
  }),
  listAndCount: jest.fn().mockImplementation((data) => {
    return Promise.resolve([[{ id: IdMap.getId("opt"), title: "Size" }], 1])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ProductOptionServiceMock
})

export default mock
