import { ConfigModule } from "@medusajs/types"

export const customersGlobalMiddlewareMock = jest.fn()
export const customersCreateMiddlewareMock = jest.fn()
export const storeGlobalMiddlewareMock = jest.fn()

export const config: ConfigModule = {
  projectConfig: {
    databaseLogging: false,
    http: {
      authCors: "http://localhost:9000",
      storeCors: "http://localhost:8000",
      adminCors: "http://localhost:7001",
      jwtSecret: "supersecret",
      cookieSecret: "superSecret",
    },
  },
  featureFlags: {},
  plugins: [],
}
