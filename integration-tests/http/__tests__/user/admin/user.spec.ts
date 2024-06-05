import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let user

    beforeEach(async () => {
      const container = getContainer()
      const { user: adminUser } = await createAdminUser(
        dbConnection,
        adminHeaders,
        container
      )

      user = adminUser
    })

    describe("GET /admin/users/:id", () => {
      it("should return user by id", async () => {
        const response = await api.get(`/admin/users/${user.id}`, adminHeaders)

        const v2Response = {
          id: user.id,
          email: "admin@medusa.js",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }

        // BREAKING: V2 users do not have role + api_token
        expect(response.status).toEqual(200)
        expect(response.data.user).toEqual(expect.objectContaining(v2Response))
      })
    })

    describe("GET /admin/users", () => {
      it("should list users", async () => {
        const response = await api
          .get("/admin/users", adminHeaders)

        expect(response.status).toEqual(200)

        const v2Response = [
          expect.objectContaining({
            id: user.id,
            email: "admin@medusa.js",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        ]

        expect(response.data.users).toEqual(v2Response)
      })

      it("should list users that match the free text search", async () => {
        const emptyResponse = await api.get(
          "/admin/users?q=member",
          adminHeaders
        )

        expect(emptyResponse.status).toEqual(200)
        expect(emptyResponse.data.users.length).toEqual(0)

        const response = await api.get("/admin/users?q=user", adminHeaders)

        expect(response.data.users.length).toEqual(1)
        expect(response.data.users).toEqual([
          expect.objectContaining({
            id: user.id,
            email: "admin@medusa.js",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        ])
      })
    })

    describe("POST /admin/users", () => {
      let token

      beforeEach(async () => {
        token = (
          await api.post("/auth/user/emailpass", {
            email: "test@test123.com",
            password: "test123",
          })
        ).data.token
      })

      // BREAKING: V2 users do not require a role
      //   We should probably remove this endpoint?
      it("should create a user", async () => {
        const payload = {
          email: "test@test123.com",
        }

        // In V2, the flow to create an authenticated user depends on the token or session of a previously created auth user
        const headers = {
          headers: { Authorization: `Bearer ${token}` },
        }

        const response = await api.post("/admin/users", payload, headers)

        expect(response.status).toEqual(200)
        expect(response.data.user).toEqual(
          expect.objectContaining({
            id: expect.stringMatching(/^user_*/),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            email: "test@test123.com",
          })
        )
      })

      // V2 only test
      it("should throw, if session/bearer auth is present for existing user", async () => {
        const emailPassResponse = await api.post("/auth/user/emailpass", {
          email: "test@test123.com",
          password: "test123",
        })

        const token = emailPassResponse.data.token

        const headers = (token) => ({
          headers: { Authorization: `Bearer ${token}` },
        })

        const res = await api.post(
          "/admin/users",
          {
            email: "test@test123.com",
          },
          headers(token)
        )

        const authenticated = await api.post("/auth/user/emailpass", {
          email: "test@test123.com",
          password: "test123",
        })

        const payload = {
          email: "different@email.com",
        }

        const errorResponse = await api
          .post("/admin/users", payload, headers(authenticated.data.token))
          .catch((err) => err.response)

        expect(errorResponse.status).toEqual(400)
        expect(errorResponse.data.message).toEqual(
          "Request carries authentication for an existing user"
        )
      })
    })

    describe("POST /admin/users/:id", () => {
      it("should update a user", async () => {
        const updateResponse = (
          await api.post(
            `/admin/users/${user.id}`,
            { first_name: "John", last_name: "Doe" },
            adminHeaders
          )
        ).data.user

        expect(updateResponse).toEqual(
          expect.objectContaining({
            id: user.id,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            first_name: "John",
            last_name: "Doe",
          })
        )
      })
    })

    describe("DELETE /admin/users", () => {
      it("Deletes a user", async () => {
        const userId = "member-user"

        const response = await api.delete(
          `/admin/users/${userId}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          id: userId,
          object: "user",
          deleted: true,
        })
      })

      // TODO: Migrate when analytics config is implemented in 2.0
      it.skip("Deletes a user and their analytics config", async () => {
        const userId = "member-user"

        // await simpleAnalyticsConfigFactory(dbConnection, {
        //   user_id: userId,
        // })

        const response = await api.delete(
          `/admin/users/${userId}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          id: userId,
          object: "user",
          deleted: true,
        })

        const configs = await dbConnection.manager.query(
          `SELECT * FROM public.analytics_config WHERE user_id = '${userId}'`
        )

        expect(configs).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
              deleted_at: expect.any(Date),
              id: expect.any(String),
              user_id: userId,
              opt_out: false,
              anonymize: false,
            }),
          ])
        )
      })
    })

    // TODO: Migrate when implemented in 2.0
    describe.skip("POST /admin/users/reset-password + POST /admin/users/password-token", () => {
      let user
      beforeEach(async () => {
        const response = await api
          .post(
            "/admin/users",
            {
              email: "test@forgottenPassword.com",
              role: "member",
              password: "test123453",
            },
            adminHeaders
          )
          .catch((err) => console.log(err))

        user = response.data.user
      })

      it("Doesn't fail to fetch user when resetting password for an unknown email (unauthorized endpoint)", async () => {
        const resp = await api.post("/admin/users/password-token", {
          email: "test-doesnt-exist@test.com",
        })

        expect(resp.status).toEqual(204)
      })

      it("Doesn't fail when generating password reset token (unauthorized endpoint)", async () => {
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
          .catch((err) => console.log(err.response.data.message))

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

        const token = "test.test.test"

        await api
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
  },
})
