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
    describe("DELETE /admin/customer-groups/:id", () => {
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

      it("should delete a group", async () => {
        const group = await customerModuleService.createCustomerGroups({
          name: "VIP",
        })

        const response = await api.delete(
          `/admin/customer-groups/${group.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)

        const deletedCustomer =
          await customerModuleService.retrieveCustomerGroup(group.id, {
            withDeleted: true,
          })
        expect(deletedCustomer.deleted_at).toBeTruthy()
      })
    })
  },
})
