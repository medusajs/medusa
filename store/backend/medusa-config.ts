import { loadEnv, defineConfig } from "@medusajs/framework/utils"

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
    { resolve: "@medusajs/medusa/product" },
    { resolve: "@medusajs/medusa/order" },
    { resolve: "@medusajs/medusa/cart" },
    { resolve: "@medusajs/medusa/currency" },
    { resolve: "@medusajs/medusa/region" },
    { resolve: "@medusajs/medusa/pricing" },
    { resolve: "@medusajs/medusa/inventory" },
    { resolve: "@medusajs/medusa/stock-location" },
    { resolve: "@medusajs/medusa/customer" },
    { resolve: "@medusajs/medusa/auth" },
    { resolve: "@medusajs/medusa/tax" },
    { resolve: "@medusajs/medusa/promotion" },

    // ── Payment ──────────────────────────────────────────────────────────────
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          // Stripe (cards, Apple Pay, Google Pay)
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
              capture: true,
            },
          },
          // Mollie (iDEAL, Bancontact, SOFORT, Klarna, credit cards)
          {
            resolve: "./src/modules/payment-mollie",
            id: "mollie",
            options: {
              apiKey:          process.env.MOLLIE_API_KEY,
              redirectBaseUrl: process.env.STORE_URL || "http://localhost:3000",
              webhookBaseUrl:  process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
            },
          },
          // PayPal
          {
            resolve: "./src/modules/payment-paypal",
            id: "paypal",
            options: {
              clientId:     process.env.PAYPAL_CLIENT_ID,
              clientSecret: process.env.PAYPAL_CLIENT_SECRET,
              sandbox:      process.env.PAYPAL_SANDBOX === "true",
              webhookId:    process.env.PAYPAL_WEBHOOK_ID,
            },
          },
          // Manual (cash on delivery / bank transfer)
          {
            resolve: "@medusajs/medusa/payment-manual",
            id: "manual",
          },
        ],
      },
    },

    // ── Fulfilment ───────────────────────────────────────────────────────────
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

    // ── Notifications ────────────────────────────────────────────────────────
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/notification-sendgrid",
            id: "sendgrid",
            options: {
              apiKey: process.env.SENDGRID_API_KEY,
              from:   process.env.SENDGRID_FROM_EMAIL || "hello@memorylane.gifts",
              // Order confirmation template includes personalization details
              orderPlacedTemplateId:   process.env.SENDGRID_ORDER_PLACED_TEMPLATE,
              orderShippedTemplateId:  process.env.SENDGRID_ORDER_SHIPPED_TEMPLATE,
            },
          },
        ],
      },
    },

    // ── File storage ─────────────────────────────────────────────────────────
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              bucketName:      process.env.S3_BUCKET_NAME,
              region:          process.env.S3_REGION || "us-east-1",
              accessKeyId:     process.env.S3_ACCESS_KEY_ID,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
              fileUrl:         process.env.S3_FILE_URL,
            },
          },
        ],
      },
    },
  ],
})
