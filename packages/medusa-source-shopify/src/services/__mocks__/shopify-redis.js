export const ShopifyRedisServiceMock = {
  addIgnore: jest.fn().mockImplementation((_id, _event) => {
    return Promise.resolve()
  }),
  shouldIgnore: jest.fn().mockImplementation((_id, _event) => {
    return false
  }),
}
