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
    describe("POST /admin/invites/:id/resend", () => {
      let appContainer
      let userModuleService: IUserModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        userModuleService = appContainer.resolve(ModuleRegistrationName.USER)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should resend a single invite", async () => {
        const invite = await userModuleService.createInvites({
          email: "potential_member@test.com",
        })

        const response = await api.post(
          `/admin/invites/${invite.id}/resend`,
          {},
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.invite.token).not.toEqual(invite.token)
        expect(response.data.invite).toEqual(
          expect.objectContaining({ email: "potential_member@test.com" })
        )
      })
    })
  },
})
