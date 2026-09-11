import { defineConfig } from "@medusajs/framework/utils"
import { TestDatabaseUtils } from "@medusajs/test-utils"
import path from "path"

export default defineConfig({
  admin: { disable: true },
  projectConfig: {
    databaseUrl: TestDatabaseUtils.getDatabaseURL(),
    http: {
      jwtSecret: "test",
      cookieSecret: "test",
      authCors: "http://localhost",
      storeCors: "http://localhost",
      adminCors: "http://localhost",
    },
  },
  modules: [{ resolve: path.resolve(__dirname, "../../../src/modules/brand") }],
})
