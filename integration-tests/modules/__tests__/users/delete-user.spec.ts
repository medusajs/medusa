import { IUserModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("DELETE /admin/users/:id", () => {
      let appContainer
      let userModuleService: IUserModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        userModuleService = appContainer.resolve(ModuleRegistrationName.USER)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should delete a single user", async () => {
        const user = await userModuleService.createUsers({
          email: "member@test.com",
        })

        const response = await api.delete(
          `/admin/users/${user.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          id: user.id,
          object: "user",
          deleted: true,
        })

        const { response: deletedResponse } = await api
          .get(`/admin/users/${user.id}`, adminHeaders)
          .catch((e) => e)

        expect(deletedResponse.status).toEqual(404)
        expect(deletedResponse.data.type).toEqual("not_found")
      })
    })
  },
})
