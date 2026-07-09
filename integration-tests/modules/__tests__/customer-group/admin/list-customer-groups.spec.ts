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
    describe("GET /admin/customer-groups", () => {
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

      it("should get all customer groups and its count", async () => {
        await customerModuleService.createCustomerGroups({
          name: "Test",
        })

        const response = await api.get(`/admin/customer-groups`, adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.customer_groups).toEqual([
          expect.objectContaining({
            id: expect.any(String),
            name: "Test",
          }),
        ])
      })

      it("should support searching of customer groups", async () => {
        await customerModuleService.createCustomerGroups([
          {
            name: "First group",
          },
          { name: "Second group" },
        ])

        const response = await api.get(
          `/admin/customer-groups?q=fir`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer_groups).toHaveLength(1)
        expect(response.data.customer_groups[0]).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "First group",
          })
        )
      })
    })
  },
})
