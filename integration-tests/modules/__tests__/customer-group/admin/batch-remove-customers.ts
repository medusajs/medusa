import { ICustomerModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("POST /admin/customer-groups/:id/customers", () => {
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

      it("should batch delete customers from a group", async () => {
        const group = await customerModuleService.createCustomerGroups({
          name: "VIP",
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
          {
            first_name: "Test3",
            last_name: "Test3",
          },
        ])

        await customerModuleService.addCustomerToGroup(
          customers.map((c) => ({
            customer_id: c.id,
            customer_group_id: group.id,
          }))
        )

        const response = await api.post(
          `/admin/customer-groups/${group.id}/customers`,
          {
            remove: customers.map((c) => c.id),
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)

        const updatedGroup = await customerModuleService.retrieveCustomerGroup(
          group.id,
          {
            relations: ["customers"],
          }
        )
        expect(updatedGroup.customers?.length).toEqual(0)
      })
    })
  },
})
