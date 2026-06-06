import { medusaIntegrationTestRunner } from "@zjedene-medusa/test-utils"
import { ICustomerModuleService } from "@zjedene-medusa/types"
import { Modules } from "@zjedene-medusa/utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = {}
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("GET /admin/customer-groups/:id", () => {
      let appContainer
      let customerModuleService: ICustomerModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        customerModuleService = appContainer.resolve(Modules.CUSTOMER)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should retrieve customer group", async () => {
        const group = await customerModuleService.createCustomerGroups({
          name: "Test",
        })

        const response = await api.get(
          `/admin/customer-groups/${group.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer_group).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "Test",
          })
        )
      })
    })
  },
})
