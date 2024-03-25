const { useApi } = require("../../../environment-helpers/use-api")
const { medusaIntegrationTestRunner } = require("medusa-test-utils")
const { createAdminUser } = require("../../../helpers/create-admin-user")
const { breaking } = require("../../../helpers/breaking")

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: { MEDUSA_FF_MEDUSA_V2: true },
  testSuite: ({ dbConnection, getContainer, api }) => {
    let container

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    it("creates admin session correctly", async () => {
      const response = await breaking(
        async () => {
          return await api.post("/admin/auth", {
            email: "admin@medusa.js",
            password: "secret_password",
          })
        },
        async () => {
          return await api.post("/auth/admin/emailpass", {
            email: "admin@medusa.js",
            password: "secret_password",
          })
        }
      )

      expect(response.status).toEqual(200)

      const v1Result = {
        user: expect.objectContaining({
          email: "admin@medusa.js",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      }

      // In V2, we respond with a token instead of the user object on session creation
      const v2Result = { token: expect.any(String) }

      expect(response.data).toEqual(
        breaking(
          () => v1Result,
          () => v2Result
        )
      )
    })

    // TODO: Remove in V2, as this is no longer supported
    it("creates admin JWT token correctly", async () => {
      breaking(async () => {
        const response = await api
          .post("/admin/auth/token", {
            email: "admin@medusa.js",
            password: "secret_password",
          })
          .catch((err) => {
            console.log(err)
          })

        expect(response.status).toEqual(200)
        expect(response.data.access_token).toEqual(expect.any(String))
      })
    })
  },
})
