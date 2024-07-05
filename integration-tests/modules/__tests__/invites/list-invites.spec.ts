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
    describe("GET /admin/invites", () => {
      let appContainer
      let userModuleService: IUserModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        userModuleService = appContainer.resolve(ModuleRegistrationName.USER)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should list invites", async () => {
        await userModuleService.createInvites({
          email: "potential_member@test.com",
          token: "test",
          expires_at: new Date(),
        })

        const response = await api.get(`/admin/invites`, adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          invites: [
            expect.objectContaining({ email: "potential_member@test.com" }),
          ],
          count: 1,
          offset: 0,
          limit: 50,
        })
      })
    })
  },
})
