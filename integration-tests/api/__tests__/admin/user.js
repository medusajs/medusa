const jwt = require("jsonwebtoken")
const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const userSeeder = require("../../helpers/user-seeder")
const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/admin/users", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  describe("GET /admin/users", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await userSeeder(dbConnection)
      } catch (err) {
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns user by id", async () => {
      const api = useApi()

      const response = await api.get("/admin/users/admin_user", {
        headers: { Authorization: "Bearer test_token " },
      })

      expect(response.status).toEqual(200)
      expect(response.data.user).toMatchSnapshot({
        id: "admin_user",
        email: "admin@medusa.js",
        api_token: "test_token",
        role: "admin",
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })

    it("lists invites", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/users/invites", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.invites).toMatchSnapshot([
        {
          id: "memberInvite",
          user_email: "invite-member@test.com",
          role: "member",
          accepted: false,
          token: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: "adminInvite",
          user_email: "invite-admin@test.com",
          role: "admin",
          accepted: false,
          token: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ])
    })

    it("lists users", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/users", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.users).toMatchSnapshot([
        {
          id: "admin_user",
          email: "admin@medusa.js",
          api_token: "test_token",
          role: "admin",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        {
          id: "member-user",
          role: "member",
          email: "member@test.com",
          first_name: "member",
          last_name: "user",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      ])
    })
  })

  describe("POST /admin/users", () => {
    let user
    beforeEach(async () => {
      const api = useApi()
      try {
        await adminSeeder(dbConnection)
        await userSeeder(dbConnection)

        const response = await api
          .post(
            "/admin/users",
            {
              email: "test@forgottenPassword.com",
              role: "member",
              password: "test123453",
            },
            {
              headers: { Authorization: "Bearer test_token" },
            }
          )
          .catch((err) => console.log(err))

        user = response.data.user
      } catch (err) {
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a user", async () => {
      const api = useApi()

      const payload = {
        email: "test@test123.com",
        role: "member",
        password: "test123",
      }

      const response = await api
        .post("/admin/users", payload, {
          headers: { Authorization: "Bearer test_token" },
        })
        .catch((err) => console.log(err))

      expect(response.status).toEqual(200)
      expect(response.data.user).toMatchSnapshot({
        id: expect.stringMatching(/^usr_*/),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        role: "member",
        email: "test@test123.com",
      })
    })

    it("updates a user", async () => {
      const api = useApi()

      const updateResponse = await api
        .post(
          "/admin/users/member-user",
          { first_name: "karl" },
          {
            headers: { Authorization: "Bearer test_token " },
          }
        )
        .catch((err) => console.log(err.response.data.message))

      expect(updateResponse.status).toEqual(200)
      expect(updateResponse.data.user).toMatchSnapshot({
        id: "member-user",
        created_at: expect.any(String),
        updated_at: expect.any(String),
        role: "member",
        email: "member@test.com",
        first_name: "karl",
        last_name: "user",
      })
    })

    describe("Invitations", () => {
      it("creates multiple invites with the specified emails and role", async () => {
        const api = useApi()

        const payload = {
          users: ["test@medusa-commerce.com", "testing@medusa-commerce.com"],
          role: "admin",
        }

        const createReponse = await api
          .post("/admin/users/invite", payload, {
            headers: { Authorization: "Bearer test_token" },
          })
          .catch((err) => console.log(err))

        const response = await api
          .get("/admin/users/invites", {
            headers: {
              Authorization: "Bearer test_token",
            },
          })
          .catch((err) => {
            console.log(err)
          })

        expect(createReponse.status).toEqual(200)

        expect(response.data.invites).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ user_email: payload.users[0] }),
            expect.objectContaining({ user_email: payload.users[1] }),
          ])
        )

        expect(response.status).toEqual(200)
      })

      it("updates invite with new role", async () => {
        const api = useApi()

        const payload = {
          users: ["invite-member@test.com"],
          role: "admin",
        }

        const createReponse = await api
          .post("/admin/users/invite", payload, {
            headers: { Authorization: "Bearer test_token" },
          })
          .catch((err) => console.log(err))

        const response = await api
          .get("/admin/users/invites", {
            headers: {
              Authorization: "Bearer test_token",
            },
          })
          .catch((err) => {
            console.log(err)
          })

        expect(createReponse.status).toEqual(200)

        expect(response.data.invites).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              user_email: payload.users[0],
              role: "admin",
            }),
          ])
        )

        expect(response.status).toEqual(200)
      })

      it("resends invite", async () => {
        const api = useApi()

        const id = "memberInvite"

        const resendResponse = await api
          .post(
            `/admin/users/invite/${id}/resend`,
            {},
            {
              headers: { Authorization: "Bearer test_token" },
            }
          )
          .catch((err) => console.log(err))

        expect(resendResponse.status).toEqual(200)
      })

      it("creates a user successfully when accepting an invite (unauthorized endpoint)", async () => {
        const api = useApi()

        const inviteResponse = await api.get("/admin/users/invites", {
          headers: { Authorization: "Bearer test_token" },
        })

        const { token, ...rest } = inviteResponse.data.invites[0]

        const user = {
          first_name: "test",
          last_name: "testesen",
          password: "supersecret",
        }

        const payload = { token, user }

        const createResponse = await api
          .post("/admin/users/invite/accept", payload)
          .catch((err) => console.log(err))

        const userResponse = await api.get("/admin/users", {
          headers: { Authorization: "Bearer test_token" },
        })

        const newUser = userResponse.data.users.find(
          (usr) => usr.email == rest.user_email
        )

        expect(newUser).toEqual(expect.objectContaining({ role: rest.role }))
        expect(createResponse.status).toEqual(200)
      })

      it("creates a user successfully with new role after updating invite (unauthorized endpoint)", async () => {
        const api = useApi()

        const inviteResponse = await api.get("/admin/users/invites", {
          headers: { Authorization: "Bearer test_token" },
        })

        const { token, ...rest } = inviteResponse.data.invites.find(
          (inv) => inv.role === "member"
        )

        const user = {
          first_name: "test",
          last_name: "testesen",
          password: "supersecret",
        }

        const updatePayload = {
          users: [rest.user_email],
          role: "admin",
        }

        const updateResponse = await api
          .post("/admin/users/invite", updatePayload, {
            headers: { Authorization: "Bearer test_token" },
          })
          .catch((err) => console.log(err))

        const payload = { token, user }

        const createResponse = await api.post(
          "/admin/users/invite/accept",
          payload
        )

        const userResponse = await api.get("/admin/users", {
          headers: { Authorization: "Bearer test_token" },
        })

        const newUser = userResponse.data.users.find(
          (usr) => usr.email == rest.user_email
        )

        expect(newUser).toEqual(expect.objectContaining({ role: "admin" }))
        expect(updateResponse.status).toEqual(200)
        expect(createResponse.status).toEqual(200)
      })
      it("Fails to accept an invite given an invalid token (unauthorized endpoint)", async () => {
        expect.assertions(2)
        const api = useApi()

        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnZpdGVfaWQiOiJpbnZpdGVfMDFGSFFWNlpBOERRRlgySjM3UVo5SjZTOTAiLCJyb2xlIjoiYWRtaW4iLCJ1c2VyX2VtYWlsIjoic2ZAc2RmLmNvbSIsImlhdCI6MTYzMzk2NDAyMCwiZXhwIjoxNjM0NTY4ODIwfQ.ZsmDvunBxhRW1iRqvfEfWixJLZ1zZVzaEYST38Vbl00"

        const result = await api
          .post("/admin/users/invite/accept", {
            token,
            user: {
              first_name: "test",
              last_name: "testesen",
              password: "supersecret",
            },
          })
          .catch((err) => {
            console.log(err.response.data.message)
            expect(err.response.status).toEqual(400)
            expect(err.response.data.message).toEqual("Token is not valid")
          })
      })

      it("fails to accept an already accepted invite (unauthorized endpoint)", async () => {
        expect.assertions(4)

        const api = useApi()

        const inviteResponse = await api.get("/admin/users/invites", {
          headers: { Authorization: "Bearer test_token" },
        })

        const { token, ...rest } = inviteResponse.data.invites[0]

        const user = {
          first_name: "test",
          last_name: "testesen",
          password: "supersecret",
        }

        const payload = { token, user }

        const createResponse = await api.post(
          "/admin/users/invite/accept",
          payload
        )

        const secondPayload = {
          user: {
            first_name: "testesens",
            last_name: "test",
            password: "testesens",
          },
          token,
        }

        const secondAcceptResponse = await api
          .post("/admin/users/invite/accept", secondPayload)
          .catch((err) => {
            expect(err.response.status).toEqual(400)
            expect(err.response.data.message).toEqual("Invite already accepted")
            expect(err.response.data.type).toEqual("invalid_data")
          })
        expect(createResponse.status).toEqual(200)
      })
    })

    describe("Password reset", () => {
      it("Doesn't fail when generating password reset token (unauthorized endpoint)", async () => {
        const api = useApi()

        const resp = await api
          .post("/admin/users/password-token", {
            email: user.email,
          })
          .catch((err) => {
            console.log(err)
          })

        expect(resp.data).toEqual("")
        expect(resp.status).toEqual(204)
      })

      it("Resets the password given a valid token (unauthorized endpoint)", async () => {
        const api = useApi()

        const expiry = Math.floor(Date.now() / 1000) + 60 * 15
        const dbUser = await dbConnection.manager.query(
          `SELECT * FROM public.user WHERE email = '${user.email}'`
        )

        const token_payload = {
          user_id: user.id,
          email: user.email,
          exp: expiry,
        }
        const token = jwt.sign(token_payload, dbUser[0].password_hash)

        const result = await api
          .post("/admin/users/reset-password", {
            token,
            email: "test@forgottenpassword.com",
            password: "new password",
          })
          .catch((err) => console.log(err))

        const loginResult = await api.post("admin/auth", {
          email: "test@forgottenpassword.com",
          password: "new password",
        })

        expect(result.status).toEqual(200)
        expect(result.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
        expect(result.data.user.password_hash).toEqual(undefined)

        expect(loginResult.status).toEqual(200)
        expect(loginResult.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
      })

      it("Resets the password given a valid token without including email(unauthorized endpoint)", async () => {
        const api = useApi()

        const expiry = Math.floor(Date.now() / 1000) + 60 * 15
        const dbUser = await dbConnection.manager.query(
          `SELECT * FROM public.user WHERE email = '${user.email}'`
        )

        const token_payload = {
          user_id: user.id,
          email: user.email,
          exp: expiry,
        }
        const token = jwt.sign(token_payload, dbUser[0].password_hash)

        const result = await api
          .post("/admin/users/reset-password", {
            token,
            password: "new password",
          })
          .catch((err) => console.log(err))

        const loginResult = await api.post("admin/auth", {
          email: user.email,
          password: "new password",
        })

        expect(result.status).toEqual(200)
        expect(result.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
        expect(result.data.user.password_hash).toEqual(undefined)

        expect(loginResult.status).toEqual(200)
        expect(loginResult.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
      })

      it("Fails to Reset the password given an invalid token (unauthorized endpoint)", async () => {
        expect.assertions(2)
        const api = useApi()

        const token = "test.test.test"

        const result = await api
          .post("/admin/users/reset-password", {
            token,
            email: "test@forgottenpassword.com",
            password: "new password",
          })
          .catch((err) => {
            expect(err.response.status).toEqual(400)
            expect(err.response.data.message).toEqual("invalid token")
          })
      })
    })
  })

  describe("DELETE /admin/users", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await userSeeder(dbConnection)
      } catch (err) {
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("Deletes a user", async () => {
      const api = useApi()

      const userId = "member-user"

      const usersBeforeDeleteResponse = await api.get("/admin/users", {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      const usersBeforeDelete = usersBeforeDeleteResponse.data.users

      const response = await api
        .delete(`/admin/users/${userId}`, {
          headers: { Authorization: "Bearer test_token" },
        })
        .catch((err) => console.log(err))

      const usersAfterDeleteResponse = await api.get("/admin/users", {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id: userId,
        object: "user",
        deleted: true,
      })

      const usersAfterDelete = usersAfterDeleteResponse.data.users

      expect(usersAfterDelete.length).toEqual(usersBeforeDelete.length - 1)
      expect(usersBeforeDelete).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: userId })])
      )

      expect(usersAfterDelete).toEqual(
        expect.not.arrayContaining([expect.objectContaining({ id: userId })])
      )
    })

    it("/admin/users/invite Deletes an invite", async () => {
      const api = useApi()

      const inviteId = "memberInvite"

      const UsersAndInvitesBeforeDelete = await api.get(
        "/admin/users/invites",
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      )

      const usersBeforeDelete = UsersAndInvitesBeforeDelete.data.invites

      const response = await api
        .delete(`/admin/users/invite/${inviteId}`, {
          headers: { Authorization: "Bearer test_token" },
        })
        .catch((err) => console.log(err))

      const UsersAndInvitesAfterDelete = await api.get("/admin/users/invites", {
        headers: {
          Authorization: "Bearer test_token",
        },
      })

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id: inviteId,
        object: "invite",
        deleted: true,
      })

      const usersAfterDelete = UsersAndInvitesAfterDelete.data.invites

      expect(usersAfterDelete.length).toEqual(usersBeforeDelete.length - 1)
      expect(usersBeforeDelete).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: inviteId })])
      )

      expect(usersAfterDelete).toEqual(
        expect.not.arrayContaining([expect.objectContaining({ id: inviteId })])
      )
    })
  })
})
