export const CustomerGroupServiceMock = {
  withTransaction: function () {
    return this
  },

  create: jest.fn().mockImplementation((f) => {
    return Promise.resolve(f)
  }),

  retrieve: jest.fn().mockImplementation((f) => {
    return Promise.resolve(f)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return CustomerGroupServiceMock
})

export default mock

