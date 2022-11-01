import { IdMap } from "medusa-test-utils"

export const ProductTypeServiceMock = {
  withTransaction: function () {
    return this
  },
  create: jest.fn().mockImplementation((data) => {
    return Promise.resolve({ id: IdMap.getId("ptyp"), ...data })
  }),
  retrieve: jest.fn().mockImplementation((id) => {
    if (id === IdMap.getId("ptyp")) {
      return Promise.resolve({ id: IdMap.getId("ptyp"), value: "shirt" })
    }
  }),
  delete: jest.fn().mockReturnValue(Promise.resolve()),
  update: jest.fn().mockImplementation((id, value) => {
    return Promise.resolve({ id, value })
  }),
  list: jest.fn().mockImplementation((data) => {
    return Promise.resolve([{ id: IdMap.getId("ptyp"), value: "shirt" }])
  }),
  listAndCount: jest.fn().mockImplementation((data) => {
    return Promise.resolve([[{ id: IdMap.getId("ptyp"), value: "shirt" }], 1])
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ProductTypeServiceMock
})

export default mock
