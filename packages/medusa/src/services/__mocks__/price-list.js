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
}

const mock = jest.fn().mockImplementation(() => {
  return PriceListServiceMock
})

export default mock
