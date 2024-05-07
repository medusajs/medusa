export const eventBusServiceMock = {
  subscribe: jest.fn().mockImplementation((...args) => {
    return Promise.resolve(args)
  }),
}

export const containerMock = {
  // mock .resolve method so if its called with "eventBusService" it returns the mock
  resolve: jest.fn().mockImplementation((name: string) => {
    if (name === "eventBusModuleService") {
      return eventBusServiceMock
    } else {
      return {}
    }
  }),
}
