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

    // TODO: This test won't work since we don't allow creating a user through HTTP. We need to have the invite flow plugged in here.
    it.skip("test the entire authentication flow", async () => {
      // BREAKING: `/admin/auth` changes to `/auth/user/emailpass`
      const signup = await api.post("/auth/user/emailpass", {
        email: "newadmin@medusa.js",
        password: "secret_password",
      })

      //BREAKING: In V2, we respond with a JWT token instead of the user object, and a session is not created. you need to call `/auth/session` to create a session
      expect(signup.status).toEqual(200)
      expect(signup.data).toEqual({ token: expect.any(String) })

      // BREAKING: IN V2 creating a user is separated from creating an auth identity
      const createdUser = await api.post(
        "/admin/users",
        { email: "newadmin@medusa.js" },
        { headers: { authorization: `Bearer ${signup.data.token}` } }
      )
      expect(createdUser.status).toEqual(200)
      expect(createdUser.data.user.email).toEqual("newadmin@medusa.js")

      const login = await api.post("/auth/user/emailpass", {
        email: "newadmin@medusa.js",
        password: "secret_password",
      })
      expect(login.status).toEqual(200)
      expect(login.data).toEqual({ token: expect.any(String) })

      const createSession = await api.post(
        "/auth/session",
        {},
        { headers: { authorization: `Bearer ${login.data.token}` } }
      )
      expect(createSession.status).toEqual(200)

      // extract cookie
      const [cookie] = createSession.headers["set-cookie"][0].split(";")
      expect(cookie).toEqual(expect.stringContaining("connect.sid"))

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

    it("registration flow", async () => {
      // Create invite
      const { token: inviteToken } = (
        await api.post("/admin/invites", { email: "oli@oli.com" }, adminHeaders)
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
        "/auth/user/emailpass/register",
        {
          email: "oli@oli.com",
          password: "secret_password",
        },
        {
          headers: {
            authorization: `Bearer ${inviteToken}`,
          },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({ token: expect.any(String) })

      // Sign in
      const login = await api.post("/auth/user/emailpass", {
        email: "oli@oli.com",
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

      // // Perform cookie authenticated request
      // const authedRequest = await api.get(
      //   "/admin/products?limit=1",
      //   cookieHeader
      // )
      // expect(authedRequest.status).toEqual(200)

      // // Sign out
      // const signOutRequest = await api.delete("/auth/session", cookieHeader)
      // expect(signOutRequest.status).toEqual(200)

      // // Attempt to perform authenticated request
      // const unAuthedRequest = await api
      //   .get("/admin/products?limit=1", cookieHeader)
      //   .catch((e) => e)

      // expect(unAuthedRequest.response.status).toEqual(401)
    })

    it("should respond with 401 on register, if email already exists", async () => {
      
      const signup = await api.post("/auth/user/emailpass/register", {
        email: "admin@medusa.js",
        password: "secret_password",
      }).catch(e => e)

      expect(signup.response.status).toEqual(401)
      expect(signup.response.data.message).toEqual("Invalid email or password")
    })

    it("should respond with 401 on sign in, if email does not exist", async () => {
      
      const signup = await api.post("/auth/user/emailpass", {
        email: "john@doe.com",
        password: "secret_password",
      }).catch(e => e)

      expect(signup.response.status).toEqual(401)
      expect(signup.response.data.message).toEqual("Invalid email or password")
    })
  },
})
