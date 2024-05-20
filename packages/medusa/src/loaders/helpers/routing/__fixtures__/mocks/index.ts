export const customersGlobalMiddlewareMock = jest.fn()
export const customersCreateMiddlewareMock = jest.fn()
export const storeGlobalMiddlewareMock = jest.fn()

export const config = {
  projectConfig: {
    database_logging: false,
    http: {
      storeCors: "http://localhost:8000",
      adminCors: "http://localhost:7001",
      jwtSecret: "supersecret",
      cookieSecret: "superSecret",
    },
  },
  featureFlags: {},
  plugins: [],
}
