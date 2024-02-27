export const jobSchedulerServiceMock = {
  create: jest.fn().mockImplementation((...args) => {
    return Promise.resolve(args)
  }),
}

export const containerMock = {
  // mock .resolve method so if its called with "jobSchedulerService" it returns the mock
  resolve: jest.fn().mockImplementation((name: string) => {
    if (name === "jobSchedulerService") {
      return jobSchedulerServiceMock
    } else {
      return {}
    }
  }),
}
