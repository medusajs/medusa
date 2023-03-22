export const ShopifyCacheServiceMock = {
  addIgnore: jest.fn().mockImplementation((_id, _event) => {
    return Promise.resolve()
  }),
  shouldIgnore: jest.fn().mockImplementation((_id, _event) => {
    return false
  }),
  addUniqueValue: jest.fn().mockImplementation((val, type) => {
    return Promise.resolve()
  }),
  getUniqueValue: jest.fn().mockImplementation((val, type) => {
    if (val === "uniq") {
      return Promise.resolve("uniq")
    } else {
      return Promise.resolve(undefined)
    }
  }),
}
