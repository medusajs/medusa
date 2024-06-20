const { Modules } = require("@medusajs/modules-sdk")
const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
process.env.POSTGRES_URL = DB_URL
process.env.LOG_LEVEL = "error"

const enableMedusaV2 = process.env.MEDUSA_FF_MEDUSA_V2 == "true"

const customPaymentProvider = {
  resolve: {
    services: [require("@medusajs/payment/dist/providers/system").default],
  },
  options: {
    config: {
      default_2: {},
    },
  },
}

const customFulfillmentProvider = {
  resolve: "@medusajs/fulfillment-manual",
  options: {
    config: {
      "test-provider": {},
    },
  },
}

module.exports = {
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
    notifications: {
      events: [
        {
          event: "order.created",
          template: "order-created-template",
          channel: "email",
          to: "order.email",
          resource_id: "order.id",
          data: {
            order_id: "order.id",
          },
        },
      ],
    },
  },
  featureFlags: {
    medusa_v2: enableMedusaV2,
  },
  modules: {
    [Modules.AUTH]: true,
    [Modules.USER]: {
      scope: "internal",
      resources: "shared",
      resolve: "@medusajs/user",
      options: {
        jwt_secret: "test",
      },
    },
    [Modules.CACHE]: {
      resolve: "@medusajs/cache-inmemory",
      options: { ttl: 0 }, // Cache disabled
    },
    [Modules.STOCK_LOCATION]: {
      resolve: "@medusajs/stock-location-next",
      options: {},
    },
    [Modules.INVENTORY]: {
      resolve: "@medusajs/inventory-next",
      options: {},
    },
    [Modules.PRODUCT]: true,
    [Modules.PRICING]: true,
    [Modules.PROMOTION]: true,
    [Modules.REGION]: true,
    [Modules.CUSTOMER]: true,
    [Modules.SALES_CHANNEL]: true,
    [Modules.CART]: true,
    [Modules.WORKFLOW_ENGINE]: true,
    [Modules.REGION]: true,
    [Modules.API_KEY]: true,
    [Modules.STORE]: true,
    [Modules.TAX]: true,
    [Modules.CURRENCY]: true,
    [Modules.ORDER]: true,
    [Modules.PAYMENT]: {
      resolve: "@medusajs/payment",
      /** @type {import('@medusajs/payment').PaymentModuleOptions}*/
      options: {
        providers: [customPaymentProvider],
      },
    },
    [Modules.FULFILLMENT]: {
      /** @type {import('@medusajs/fulfillment').FulfillmentModuleOptions} */
      options: {
        providers: [customFulfillmentProvider],
      },
    },
    [Modules.NOTIFICATION]: {
      /** @type {import('@medusajs/types').LocalNotificationServiceOptions} */
      options: {
        providers: [
          {
            resolve: "@medusajs/notification-local",
            options: {
              config: {
                "local-notification-provider": {
                  name: "Local Notification Provider",
                  channels: ["log", "email"],
                },
              },
            },
          },
        ],
      },
    },
  },
}
