import { defineConfig } from "@zjedene-medusa/utils"

const { Modules } = require("@zjedene-medusa/utils")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
process.env.POSTGRES_URL = DB_URL
process.env.LOG_LEVEL = "error"

const customTaxProviderRegistration = {
  resolve: {
    services: [require("@zjedene-medusa/tax/dist/providers/system").default],
  },
  id: "system_2",
}

const customPaymentProvider = {
  resolve: {
    services: [require("@zjedene-medusa/payment/dist/providers/system").default],
  },
  id: "default_2",
}

const customFulfillmentProvider = {
  resolve: "@zjedene-medusa/fulfillment-manual",
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
  plugins: [
    {
      resolve: "@zjedene-medusa/loyalty-plugin",
      options: {},
    },
  ],
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
      resolve: "@zjedene-medusa/auth",
      options: {
        providers: [
          {
            id: "emailpass",
            resolve: "@zjedene-medusa/auth-emailpass",
          },
        ],
      },
    },
    {
      key: Modules.USER,
      scope: "internal",
      resolve: "@zjedene-medusa/user",
      options: {
        jwt_secret: "test",
      },
    },
    {
      key: Modules.CACHE,
      resolve: "@zjedene-medusa/cache-inmemory",
      options: { ttl: 0 }, // Cache disabled
    },
    {
      key: Modules.LOCKING,
      resolve: "@zjedene-medusa/locking",
    },
    {
      key: Modules.STOCK_LOCATION,
      resolve: "@zjedene-medusa/stock-location",
      options: {},
    },
    {
      key: Modules.INVENTORY,
      resolve: "@zjedene-medusa/inventory",
      options: {},
    },
    {
      key: Modules.PRODUCT,
      resolve: "@zjedene-medusa/product",
    },
    {
      key: Modules.PRICING,
      resolve: "@zjedene-medusa/pricing",
    },
    {
      key: Modules.PROMOTION,
      resolve: "@zjedene-medusa/promotion",
    },
    {
      key: Modules.REGION,
      resolve: "@zjedene-medusa/region",
    },
    {
      key: Modules.CUSTOMER,
      resolve: "@zjedene-medusa/customer",
    },
    {
      key: Modules.SALES_CHANNEL,
      resolve: "@zjedene-medusa/sales-channel",
    },
    {
      key: Modules.CART,
      resolve: "@zjedene-medusa/cart",
    },
    {
      key: Modules.WORKFLOW_ENGINE,
      resolve: "@zjedene-medusa/workflow-engine-inmemory",
    },
    {
      key: Modules.API_KEY,
      resolve: "@zjedene-medusa/api-key",
    },
    {
      key: Modules.STORE,
      resolve: "@zjedene-medusa/store",
    },
    {
      key: Modules.TAX,
      resolve: "@zjedene-medusa/tax",
      options: {
        providers: [customTaxProviderRegistration],
      },
    },
    {
      key: Modules.CURRENCY,
      resolve: "@zjedene-medusa/currency",
    },
    {
      key: Modules.ORDER,
      resolve: "@zjedene-medusa/order",
    },
    {
      key: Modules.PAYMENT,
      resolve: "@zjedene-medusa/payment",
      options: {
        providers: [customPaymentProvider],
      },
    },
    {
      key: Modules.FULFILLMENT,
      resolve: "@zjedene-medusa/fulfillment",
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
            resolve: "@zjedene-medusa/notification-local",
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
      resolve: "@zjedene-medusa/index",
      disable: process.env.ENABLE_INDEX_MODULE !== "true",
    },
    {
      key: "brand",
      resolve: "src/modules/brand",
    },
    {
      key: Modules.RBAC,
      resolve: "@zjedene-medusa/rbac",
    },
  ],
})
