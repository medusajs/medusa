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
    describe("GET /admin/users", () => {
      let appContainer
      let userModuleService: IUserModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        userModuleService = appContainer.resolve(ModuleRegistrationName.USER)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should list users", async () => {
        await userModuleService.createUsers([
          {
            email: "member@test.com",
          },
        ])

        const response = await api.get(`/admin/users`, adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          users: expect.arrayContaining([
            expect.objectContaining({
              email: "admin@medusa.js",
            }),
            expect.objectContaining({ email: "member@test.com" }),
          ]),
          count: 2,
          offset: 0,
          limit: 50,
        })
      })
    })
  },
})
