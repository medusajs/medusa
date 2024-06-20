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
    describe("GET customer group customers", () => {
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
        const group = await customerModuleService.createCustomerGroups({
          name: "Test",
        })

        const customers = await customerModuleService.createCustomers([
          {
            first_name: "Test",
            last_name: "Test",
          },
          {
            first_name: "Test2",
            last_name: "Test2",
          },
        ])

        // add to group

        await customerModuleService.addCustomerToGroup(
          customers.map((c) => ({
            customer_id: c.id,
            customer_group_id: group.id,
          }))
        )

        const response = await api.get(
          `/admin/customers?groups[]=${group.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(2)
        expect(response.data.customers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: customers[0].id,
            }),
            expect.objectContaining({
              id: customers[1].id,
            }),
          ])
        )
      })
    })
  },
})
