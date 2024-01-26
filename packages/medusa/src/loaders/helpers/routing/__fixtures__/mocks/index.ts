export const customersGlobalMiddlewareMock = jest.fn()
export const customersCreateMiddlewareMock = jest.fn()
export const storeGlobalMiddlewareMock = jest.fn()

export const config = {
  projectConfig: {
    store_cors: "http://localhost:8000",
    admin_cors: "http://localhost:7001",
    database_logging: false,
    jwt_secret: "supersecret",
    cookie_secret: "superSecret",
  },
  featureFlags: {},
  plugins: [],
}
