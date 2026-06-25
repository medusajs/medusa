import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ICustomerModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = {}
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    describe("POST /admin/customers/:id", () => {
      let appContainer
      let customerModuleService: ICustomerModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        customerModuleService = appContainer.resolve(Modules.CUSTOMER)
      })

      beforeAll(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        await dbUtils.snapshot()
      })

      it("should update a customer", async () => {
        const customer = await customerModuleService.createCustomers({
          first_name: "John",
          last_name: "Doe",
        })

        const response = await api.post(
          `/admin/customers/${customer.id}`,
          {
            first_name: "Jane",
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            first_name: "Jane",
            last_name: "Doe",
          })
        )
      })
    })
  },
})
