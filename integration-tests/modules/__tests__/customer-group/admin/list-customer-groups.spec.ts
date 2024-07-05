import { ICustomerModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("GET /admin/customer-groups", () => {
      let appContainer
      let customerModuleService: ICustomerModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        customerModuleService = appContainer.resolve(
          ModuleRegistrationName.CUSTOMER
        )
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should get all customer groups and its count", async () => {
        await customerModuleService.createCustomerGroup({
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
        await customerModuleService.createCustomerGroup([
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
