import { loadEnv, defineConfig, Modules } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
process.env.DATABASE_DRIVER_OPTIONS = JSON.stringify({
  ssl: {
    rejectUnauthorized: false,
  },
  connection: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
})

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
      connection: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    },
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000,http://localhost:3000,https://docs.medusajs.com",
      adminCors: process.env.ADMIN_CORS || "http://localhost:5173,http://localhost:9000,https://docs.medusajs.com",
      authCors: process.env.AUTH_CORS || "http://localhost:5173,http://localhost:9000,http://localhost:8000,https://docs.medusajs.com",
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
    disable: false,
    path: "/app",
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "./src/modules/payment-cashfree",
            id: "cashfree",
            options: {
              appId: process.env.CASHFREE_APP_ID,
              secretKey: process.env.CASHFREE_SECRET_KEY,
              environment: process.env.CASHFREE_ENVIRONMENT || "sandbox",
              apiVersion: process.env.CASHFREE_API_VERSION || "2023-08-01",
            },
          },
        ],
      },
    },
  ],
})
