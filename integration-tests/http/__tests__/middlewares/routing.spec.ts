import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"
import path from "path"

jest.setTimeout(60000)

medusaIntegrationTestRunner({
  env: {},
  cwd: path.resolve(__dirname, "../../__fixtures__/middlewares"),
  testSuite: ({ getContainer, api, dbConnection }) => {
    describe("API Middleware Routing", () => {
      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, getContainer())
      })

      it("should run custom user middleware on exact path before Medusa built-in validation", async () => {
        // We POST an empty body to /admin/products.
        // With our fix, the user middleware in the fixture intercepts this before the Zod validator.
        const response = await api.post(
          "/admin/products",
          {},
          adminHeaders
        ).catch((e) => e.response)

        expect(response.status).toEqual(200)
        expect(response.data.custom_middleware_hit).toEqual(true)
      })
    })
  },
})
