import { loadEnv, defineConfig, Modules } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:9000,http://localhost:3000",
      jwtSecret: process.env.JWT_SECRET || "memorylane-super-secret",
      cookieSecret: process.env.COOKIE_SECRET || "memorylane-cookie-secret",
    },
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
    disable: false,
  },
  modules: [
    {
      resolve: "@medusajs/medusa/product",
      options: {
        databaseName: process.env.POSTGRES_DB || "memorylane",
      },
    },
    {
      resolve: "@medusajs/medusa/order",
    },
    {
      resolve: "@medusajs/medusa/cart",
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/fulfillment",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/fulfillment-manual",
            id: "manual",
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/notification-sendgrid",
            id: "sendgrid",
            options: {
              apiKey: process.env.SENDGRID_API_KEY,
              from: process.env.SENDGRID_FROM_EMAIL || "hello@memorylane.gifts",
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              bucketName: process.env.S3_BUCKET_NAME,
              region: process.env.S3_REGION || "us-east-1",
              accessKeyId: process.env.S3_ACCESS_KEY_ID,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/currency",
    },
    {
      resolve: "@medusajs/medusa/region",
    },
    {
      resolve: "@medusajs/medusa/pricing",
    },
    {
      resolve: "@medusajs/medusa/inventory",
    },
    {
      resolve: "@medusajs/medusa/stock-location",
    },
    {
      resolve: "@medusajs/medusa/customer",
    },
    {
      resolve: "@medusajs/medusa/auth",
    },
    {
      resolve: "@medusajs/medusa/tax",
    },
    {
      resolve: "@medusajs/medusa/promotion",
    },
  ],
})
