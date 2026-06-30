import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = {}
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    describe("POST /admin/customers", () => {
      let appContainer
      beforeAll(async () => {
        appContainer = getContainer()
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        await dbUtils.snapshot()
      })

      it("should create a customer", async () => {
        const response = await api.post(
          `/admin/customers`,
          {
            first_name: "John",
            last_name: "Doe",
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            first_name: "John",
            last_name: "Doe",
            created_by: expect.any(String),
          })
        )
      })
    })
  },
})
