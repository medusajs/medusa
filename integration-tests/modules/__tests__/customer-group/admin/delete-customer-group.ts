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
    describe("DELETE /admin/customer-groups/:id", () => {
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
