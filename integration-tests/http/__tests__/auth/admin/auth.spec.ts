import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
    })

    it("Invite + registration + authentication flow", async () => {
      // Create invite
      const { token: inviteToken } = (
        await api.post(
          "/admin/invites",
          { email: "newadmin@medusa.js" },
          adminHeaders
        )
      ).data.invite

      // Register identity
      const signup = await api.post("/auth/user/emailpass/register", {
        email: "newadmin@medusa.js",
        password: "secret_password",
      })

      expect(signup.status).toEqual(200)
      expect(signup.data).toEqual({ token: expect.any(String) })

      // Accept invite
      const response = await api.post(
        `/admin/invites/accept?token=${inviteToken}`,
        {
          email: "newadmin@medusa.js",
          first_name: "John",
          last_name: "Doe",
        },
        {
          headers: {
            authorization: `Bearer ${signup.data.token}`,
          },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        user: expect.objectContaining({
          email: "newadmin@medusa.js",
          first_name: "John",
          last_name: "Doe",
        }),
      })

      // Sign in
      const login = await api.post("/auth/user/emailpass", {
        email: "newadmin@medusa.js",
        password: "secret_password",
      })
      expect(login.status).toEqual(200)
      expect(login.data).toEqual({ token: expect.any(String) })

      // Convert token to session
      const createSession = await api.post(
        "/auth/session",
        {},
        { headers: { authorization: `Bearer ${login.data.token}` } }
      )
      expect(createSession.status).toEqual(200)

      // Extract cookie
      const [cookie] = createSession.headers["set-cookie"][0].split(";")
      expect(cookie).toEqual(expect.stringContaining("connect.sid"))

      const cookieHeader = {
        headers: { Cookie: cookie },
      }

      // Perform cookie authenticated request
      const authedRequest = await api.get(
        "/admin/products?limit=1",
        cookieHeader
      )
      expect(authedRequest.status).toEqual(200)

      // Sign out
      const signOutRequest = await api.delete("/auth/session", cookieHeader)
      expect(signOutRequest.status).toEqual(200)

      // Attempt to perform authenticated request
      const unAuthedRequest = await api
        .get("/admin/products?limit=1", cookieHeader)
        .catch((e) => e)

      expect(unAuthedRequest.response.status).toEqual(401)
    })

    it("should respond with 401 on register, if email already exists", async () => {
      const signup = await api
        .post("/auth/user/emailpass/register", {
          email: "admin@medusa.js",
          password: "secret_password",
        })
        .catch((e) => e)

      expect(signup.response.status).toEqual(401)
      expect(signup.response.data.message).toEqual(
        "Identity with email already exists"
      )
    })

    it("should respond with 401 on sign in, if email does not exist", async () => {
      const signup = await api
        .post("/auth/user/emailpass", {
          email: "john@doe.com",
          password: "secret_password",
        })
        .catch((e) => e)

      expect(signup.response.status).toEqual(401)
      expect(signup.response.data.message).toEqual("Invalid email or password")
    })
  },
})
