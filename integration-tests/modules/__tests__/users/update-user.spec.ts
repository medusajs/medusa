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
    describe("POST /admin/users/:id", () => {
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

      it("should update a single user", async () => {
        const user = await userModuleService.createUsers({
          email: "member@test.com",
        })

        const body = {
          first_name: "John",
          last_name: "Doe",
        }
        const response = await api.post(
          `/admin/users/${user.id}`,
          body,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.user).toEqual(expect.objectContaining(body))
      })
    })
  },
})
