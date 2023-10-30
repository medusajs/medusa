export const customersGlobalMiddlewareMock = jest.fn()
export const customersCreateMiddlewareMock = jest.fn()
export const storeCorsMiddlewareMock = jest.fn()

export const mockConfigModule = {
  projectConfig: {
    store_cors: "http://localhost:8000",
    admin_cors: "http://localhost:7001",
    database_logging: false,
  },
  featureFlags: {},
  plugins: [],
}
