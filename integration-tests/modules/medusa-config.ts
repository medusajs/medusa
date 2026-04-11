import { defineConfig } from "@medusajs/utils"

const { Modules } = require("@medusajs/utils")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
process.env.POSTGRES_URL = DB_URL
process.env.LOG_LEVEL = "error"

const customTaxProviderRegistration = {
  resolve: {
    services: [require("@medusajs/tax/dist/providers/system").default],
  },
  id: "system_2",
}

const customPaymentProvider = {
  resolve: {
    services: [require("@medusajs/payment/dist/providers/system").default],
  },
  id: "default_2",
}

const customFulfillmentProvider = {
  resolve: "@medusajs/fulfillment-manual",
  id: "test-provider",
}

const customFulfillmentProviderCalculated = {
  resolve: require("./dist/utils/providers/fulfillment-manual-calculated")
    .default,
  id: "test-provider-calculated",
}

module.exports = defineConfig({
  admin: {
    disable: true,
  },
  plugins: [],
  projectConfig: {
    databaseUrl: DB_URL,
    databaseType: "postgres",
    http: {
      jwtSecret: "test",
      cookieSecret: "test",
    },
  },
  featureFlags: {},
  modules: [
    {
      key: "testingModule",
      resolve: "__tests__/__fixtures__/testing-module",
    },
    {
      key: "auth",
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            id: "emailpass",
            resolve: "@medusajs/auth-emailpass",
          },
        ],
      },
    },
    {
      key: Modules.USER,
      scope: "internal",
      resolve: "@medusajs/user",
      options: {
        jwt_secret: "test",
      },
    },
    {
      key: Modules.CACHE,
      resolve: "@medusajs/cache-inmemory",
      options: { ttl: 0 }, // Cache disabled
    },
    {
      key: Modules.LOCKING,
      resolve: "@medusajs/locking",
    },
    {
      key: Modules.STOCK_LOCATION,
      resolve: "@medusajs/stock-location",
      options: {},
    },
    {
      key: Modules.INVENTORY,
      resolve: "@medusajs/inventory",
      options: {},
    },
    {
      key: Modules.PRODUCT,
      resolve: "@medusajs/product",
    },
    {
      key: Modules.PRICING,
      resolve: "@medusajs/pricing",
    },
    {
      key: Modules.PROMOTION,
      resolve: "@medusajs/promotion",
    },
    {
      key: Modules.REGION,
      resolve: "@medusajs/region",
    },
    {
      key: Modules.CUSTOMER,
      resolve: "@medusajs/customer",
    },
    {
      key: Modules.SALES_CHANNEL,
      resolve: "@medusajs/sales-channel",
    },
    {
      key: Modules.CART,
      resolve: "@medusajs/cart",
    },
    {
      key: Modules.WORKFLOW_ENGINE,
      resolve: "@medusajs/workflow-engine-inmemory",
    },
    {
      key: Modules.API_KEY,
      resolve: "@medusajs/api-key",
    },
    {
      key: Modules.STORE,
      resolve: "@medusajs/store",
    },
    {
      key: Modules.TAX,
      resolve: "@medusajs/tax",
      options: {
        providers: [customTaxProviderRegistration],
      },
    },
    {
      key: Modules.CURRENCY,
      resolve: "@medusajs/currency",
    },
    {
      key: Modules.ORDER,
      resolve: "@medusajs/order",
    },
    {
      key: Modules.PAYMENT,
      resolve: "@medusajs/payment",
      options: {
        providers: [customPaymentProvider],
      },
    },
    {
      key: Modules.FULFILLMENT,
      resolve: "@medusajs/fulfillment",
      options: {
        providers: [
          customFulfillmentProvider,
          customFulfillmentProviderCalculated,
        ],
      },
    },
    {
      key: Modules.NOTIFICATION,
      options: {
        providers: [
          {
            resolve: "@medusajs/notification-local",
            id: "local-notification-provider",
            options: {
              name: "Local Notification Provider",
              channels: ["log", "email"],
            },
          },
        ],
      },
    },
    {
      key: Modules.INDEX,
      resolve: "@medusajs/index",
      disable: process.env.ENABLE_INDEX_MODULE !== "true",
    },
    {
      key: "brand",
      resolve: "src/modules/brand",
    },
    {
      key: Modules.RBAC,
      resolve: "@medusajs/rbac",
    },
  ],
})
