export const MiddlewareServiceMock = {
  usePostAuthentication: jest.fn(),
  usePreAuthentication: jest.fn(),
}

const mock = jest.fn().mockImplementation(() => {
  return MiddlewareServiceMock
})

export default mock
