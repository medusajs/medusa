export const cacheServiceMock = {
  set: jest.fn().mockImplementation(async () => void 0),
  get: jest.fn().mockImplementation(async () => null),
  invalidate: jest.fn().mockImplementation(async () => void 0),
}

const mock = jest.fn().mockImplementation(() => {
  return cacheServiceMock
})

export default mock
