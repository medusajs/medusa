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
  force_modules_migration: true,
  env: {
    MEDUSA_FF_MEDUSA_V2: true,
  },
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

    it("should test the entire authentication lifecycle", async () => {
      // sign in
      const response = await api.post("/auth/admin/emailpass", {
        email: "admin@medusa.js",
        password: "secret_password",
      })

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({ token: expect.any(String) })

      const headers = {
        headers: { ["authorization"]: `Bearer ${response.data.token}` },
      }

      // convert token to session
      const cookieRequest = await api.post("/auth/session", {}, headers)
      expect(cookieRequest.status).toEqual(200)

      // extract cookie
      const [cookie] = cookieRequest.headers["set-cookie"][0].split(";")

      const cookieHeader = {
        headers: { Cookie: cookie },
      }

      // perform cookie authenticated request
      const authedRequest = await api.get(
        "/admin/products?limit=1",
        cookieHeader
      )
      expect(authedRequest.status).toEqual(200)

      // sign out
      const signOutRequest = await api.delete("/auth/session", cookieHeader)
      expect(signOutRequest.status).toEqual(200)

      // attempt to perform authenticated request
      const unAuthedRequest = await api
        .get("/admin/products?limit=1", cookieHeader)
        .catch((e) => e)

      expect(unAuthedRequest.response.status).toEqual(401)
    })
  },
})
