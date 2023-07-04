export const ProductVariantServiceMock = {
  withTransaction: function () {
    return this
  },
  create: jest.fn().mockImplementation((_data) => {
    return Promise.resolve({})
  }),
  update: jest.fn().mockImplementation((_data) => {
    return Promise.resolve()
  }),
  delete: jest.fn().mockImplementation((_data) => {
    return Promise.resolve()
  }),
  addOption: jest.fn().mockImplementation((id, title) => {
    return Promise.resolve()
  }),
}
