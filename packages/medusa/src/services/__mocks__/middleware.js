export const MiddlewareServiceMock = {
  usePostAuthentication: jest.fn(),
  usePreAuthentication: jest.fn(),
  getRouters: jest.fn().mockReturnValue([]),
}

const mock = jest.fn().mockImplementation(() => {
  return MiddlewareServiceMock
})

export default mock
