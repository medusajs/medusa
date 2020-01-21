export const ProductServiceMock = {
  createDraft: jest.fn().mockImplementation(data => {
    return Promise.resolve(data)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return ProductServiceMock
})

export default mock
