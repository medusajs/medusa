import { defineConfig, Modules } from "@medusajs/utils"
import path from "path"

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL || "postgres://postgres:password@localhost:5432/medusa_playground",
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:8000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000,http://localhost:5173",
      authCors: process.env.AUTH_CORS || "http://localhost:8000,http://localhost:9000,http://localhost:5173",
      jwtSecret: process.env.JWT_SECRET || "playground-jwt-secret",
      cookieSecret: process.env.COOKIE_SECRET || "playground-cookie-secret",
    },
  },
  admin: {
    disable: false,
  },
  modules: {
    [Modules.FILE]: {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              upload_dir: path.join(process.cwd(), ".medusa", "uploads"),
              private_upload_dir: path.join(process.cwd(), ".medusa", "private"),
            },
          },
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
    [Modules.FULFILLMENT]: {
      resolve: "@medusajs/fulfillment",
      options: {
        providers: [
          {
            resolve: "@medusajs/fulfillment-manual",
            id: "manual",
          },
        ],
      },
    },
    [Modules.AUTH]: {
      resolve: "@medusajs/auth",
      options: {
        providers: [
          {
            resolve: "@medusajs/auth-emailpass",
            id: "emailpass",
          },
        ],
      },
    },
    [Modules.CACHE]: {
      resolve: "@medusajs/cache-inmemory",
    },
    [Modules.EVENT_BUS]: {
      resolve: "@medusajs/event-bus-local",
    },
    [Modules.WORKFLOW_ENGINE]: {
      resolve: "@medusajs/workflow-engine-inmemory",
    },
    [Modules.BRAND]: {
      resolve: "@medusajs/brand",
    },
    [Modules.ORGANIZATION]: {
      resolve: "@medusajs/organization",
    },
    [Modules.SHOP]: {
      resolve: "@medusajs/shop",
    },
    [Modules.MATERIAL]: {
      resolve: "@medusajs/material",
    },
    [Modules.PLATFORM_MAPPING]: {
      resolve: "@medusajs/platform-mapping",
    },
    [Modules.CHANNEL_PRICE]: {
      resolve: "@medusajs/channel-price",
    },
    [Modules.STORE_INVENTORY]: {
      resolve: "@medusajs/store-inventory",
    },
  },
})
