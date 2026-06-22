import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IUserModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { createAdminUser } from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = {}
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    describe("DELETE /admin/invites/:id", () => {
      let appContainer
      let userModuleService: IUserModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        userModuleService = appContainer.resolve(Modules.USER)
      })

      beforeAll(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        await dbUtils.snapshot()
      })

      it("should delete a single invite", async () => {
        const invite = await userModuleService.createInvites({
          email: "potential_member@test.com",
          token: "test",
          expires_at: new Date(),
        })

        const response = await api.delete(
          `/admin/invites/${invite.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          id: invite.id,
          object: "invite",
          deleted: true,
        })

        const { response: deletedResponse } = await api
          .get(`/admin/invites/${invite.id}`, adminHeaders)
          .catch((e) => e)

        expect(deletedResponse.status).toEqual(404)
        expect(deletedResponse.data.type).toEqual("not_found")
      })
    })
  },
})
