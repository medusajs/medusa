export const PriceListServiceMock = {
  withTransaction: function() {
    return this
  },

  create: jest.fn().mockImplementation((f) => {
    return Promise.resolve(f)
  }),

  retrieve: jest.fn().mockImplementation((f) => {
    return Promise.resolve(f)
  }),

  update: jest.fn().mockImplementation((id, update) => {
    return Promise.resolve({ id, ...update })
  }),

  delete: jest.fn().mockImplementation((id) => {
    return Promise.resolve(id)
  }),

  addPrices: jest.fn().mockImplementation((id, prices) => {
    return Promise.resolve({ id, prices })
  }),

  deletePrices: jest.fn().mockImplementation((id, prices) => {
    return Promise.resolve({ id, prices })
  }),

  listAndCount: jest.fn().mockImplementation((fields, config) => {
    return Promise.resolve([[{ id: "pl_1" }, { id: "pl_2" }], 2])
  }),

  upsertCustomerGroups_: jest.fn().mockImplementation((id, groups) => {
    return Promise.resolve()
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return PriceListServiceMock
})

export default mock
