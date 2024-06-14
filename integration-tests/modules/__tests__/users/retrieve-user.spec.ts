import { IUserModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { createAdminUser } from "../../../helpers/create-admin-user"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("GET /admin/users/:id", () => {
      let appContainer
      let userModuleService: IUserModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        userModuleService = appContainer.resolve(ModuleRegistrationName.USER)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should retrieve a single user", async () => {
        const user = await userModuleService.createUsers({
          email: "member@test.com",
        })

        const response = await api.get(`/admin/users/${user.id}`, adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.user).toEqual(
          expect.objectContaining({ email: "member@test.com" })
        )
      })
    })
  },
})
