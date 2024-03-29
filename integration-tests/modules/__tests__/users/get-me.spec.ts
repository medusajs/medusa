import { createAdminUser } from "../../../helpers/create-admin-user"
import { medusaIntegrationTestRunner } from "medusa-test-utils/dist"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("POST /admin/users/me", () => {
      let container

      beforeAll(() => {
        container = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, container)
      })

      it("gets the current user", async () => {
        const response = await api.get(`/admin/users/me`, adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          user: expect.objectContaining({ id: "admin_user" }),
        })
      })
    })
  },
})
