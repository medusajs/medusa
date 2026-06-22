const { defineConfig, Modules } = require("@medusajs/utils")
const os = require("os")
const path = require("path")

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
process.env.DATABASE_URL = DB_URL
process.env.LOG_LEVEL = "error"

const customFulfillmentProvider = {
  resolve: "@medusajs/fulfillment-manual",
  id: "test-provider",
}

const customFulfillmentProviderCalculated = {
  resolve: require("./dist/utils/providers/fulfillment-manual-calculated")
    .default,
  id: "test-provider-calculated",
}

const customPendingAuthPaymentProvider = {
  resolve: require("./dist/utils/providers/payment-pending-authorization")
    .default,
  id: "pending-auth",
}

// A second instance of the built-in system payment provider, registered under a
// distinct id (`pp_system_default_2`) so tests can assert a non-default provider
// is honored. The always-present `pp_system_default` is unaffected.
const customPaymentProvider = {
  resolve: {
    services: [require("@medusajs/payment/dist/providers/system").default],
  },
  id: "default_2",
}

const modules = {
  [Modules.PAYMENT]: {
    resolve: "@medusajs/payment",
    options: {
      providers: [customPaymentProvider, customPendingAuthPaymentProvider],
      webhook_delay: 0,
      webhook_retries: 0,
    },
  },
  [Modules.FULFILLMENT]: {
    /** @type {import('@medusajs/fulfillment').FulfillmentModuleOptions} */
    options: {
      providers: [
        customFulfillmentProvider,
        customFulfillmentProviderCalculated,
      ],
    },
  },
  [Modules.NOTIFICATION]: {
    resolve: "@medusajs/notification",
    options: {
      providers: [
        {
          resolve: "@medusajs/notification-local",
          id: "local",
          options: {
            name: "Local Notification Provider",
            channels: ["feed"],
          },
        },
      ],
    },
  },
  [Modules.FILE]: {
    resolve: "@medusajs/file",
    options: {
      providers: [
        {
          resolve: "@medusajs/file-local",
          id: "local",
          options: {
            // This is the directory where we can reliably write in CI environments
            upload_dir: path.join(os.tmpdir(), "uploads"),
            private_upload_dir: path.join(os.tmpdir(), "static"),
          },
        },
      ],
    },
  },
  [Modules.INDEX]: {
    resolve: "@medusajs/index",
    disable: process.env.ENABLE_INDEX_MODULE !== "true",
  },
  [Modules.RBAC]: {
    resolve: "@medusajs/rbac",
    disable: process.env.MEDUSA_FF_RBAC !== "true",
  },
  [Modules.AUTH]: {
    options: {
      mfa: {
        encryption_key: "test-mfa-encryption-key",
      },
      providers: [
        {
          resolve: "@medusajs/medusa/auth-emailpass",
          id: "emailpass",
        },
      ],
    },
  },
}

if (process.env.MEDUSA_FF_TRANSLATION === "true") {
  modules[Modules.TRANSLATION] = {
    resolve: "@medusajs/translation",
  }
}

module.exports = defineConfig({
  admin: {
    disable: true,
  },
  projectConfig: {
    http: {
      jwtSecret: "test",
    },
  },
  featureFlags: {
    index_engine: process.env.ENABLE_INDEX_MODULE === "true",
    translation: process.env.MEDUSA_FF_TRANSLATION === "true",
    rbac: process.env.MEDUSA_FF_RBAC === "true",
  },
  modules,
  plugins: [
    {
      resolve: "@medusajs/loyalty-plugin",
      options: {},
    },
  ],
})
