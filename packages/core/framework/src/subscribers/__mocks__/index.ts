export const eventBusServiceMock = {
  subscribe: jest.fn().mockImplementation((...args) => {
    return Promise.resolve(args)
  }),
}
