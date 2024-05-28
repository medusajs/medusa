const jwt = require("jsonwebtoken")

const { medusaIntegrationTestRunner } = require("medusa-test-utils")
const {
  createAdminUser,
  adminHeaders,
} = require("../../../helpers/create-admin-user")
const { breaking } = require("../../../helpers/breaking")
const { ModuleRegistrationName } = require("@medusajs/modules-sdk")

jest.setTimeout(30000)

let userSeeder = {}
let simpleAnalyticsConfigFactory = {}

medusaIntegrationTestRunner({
  // env: { MEDUSA_FF_MEDUSA_V2: true },
  testSuite: ({ dbConnection, getContainer, api }) => {
    let container
    let userModuleService

    beforeAll(() => {
      userSeeder = require("../../../helpers/user-seeder")
      simpleAnalyticsConfigFactory = require("../../../factories/simple-analytics-config-factory")
    })

    beforeEach(async () => {
      container = getContainer()

      userModuleService = container.resolve(ModuleRegistrationName.USER)

      await createAdminUser(dbConnection, adminHeaders, container)
    })

    describe("GET /admin/users/:id", () => {
      beforeEach(async () => {
        await breaking(async () => {
          await userSeeder(dbConnection)
        })
      })

      it("should return user by id", async () => {
        const response = await api.get("/admin/users/admin_user", adminHeaders)

        const v1Response = {
          id: "admin_user",
          email: "admin@medusa.js",
          api_token: "test_token",
          role: "admin",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }

        const v2Response = {
          id: "admin_user",
          email: "admin@medusa.js",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }

        expect(response.status).toEqual(200)
        expect(response.data.user).toEqual(
          expect.objectContaining(
            breaking(
              () => v1Response,
              () => v2Response
            )
          )
        )
      })
    })

    describe("GET /admin/users", () => {
      beforeEach(async () => {
        await breaking(
          async () => {
            await userSeeder(dbConnection)
          },
          async () => {
            await userModuleService.create({
              id: "member-user",
              email: "member@test.com",
              first_name: "member",
              last_name: "user",
            })
          }
        )
      })

      it("should list users", async () => {
        const response = await api
          .get("/admin/users", adminHeaders)
          .catch((err) => {
            console.log(err)
          })

        expect(response.status).toEqual(200)

        const v1Response = [
          expect.objectContaining({
            id: "admin_user",
            email: "admin@medusa.js",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            api_token: "test_token",
            role: "admin",
          }),
          expect.objectContaining({
            id: "member-user",
            email: "member@test.com",
            first_name: "member",
            last_name: "user",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            role: "member",
          }),
        ]

        const v2Response = [
          expect.objectContaining({
            id: "admin_user",
            email: "admin@medusa.js",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
          expect.objectContaining({
            id: "member-user",
            email: "member@test.com",
            first_name: "member",
            last_name: "user",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        ]

        expect(response.data.users).toEqual(
          expect.arrayContaining(
            breaking(
              () => v1Response,
              () => v2Response
            )
          )
        )
      })

      it("should list users that match the free text search", async () => {
        const response = await api.get("/admin/users?q=member", adminHeaders)

        expect(response.status).toEqual(200)

        expect(response.data.users.length).toEqual(1)
        expect(response.data.users).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: "member-user",
              email: "member@test.com",
              first_name: "member",
              last_name: "user",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              ...breaking(
                () => ({ role: "member" }),
                () => ({})
              ),
            }),
          ])
        )
      })
    })

    describe("POST /admin/users", () => {
      let token

      beforeEach(async () => {
        token = await breaking(
          () => null,
          async () => {
            const emailPassResponse = await api.post("/auth/user/emailpass", {
              email: "test@test123.com",
              password: "test123",
            })

            return emailPassResponse.data.token
          }
        )
      })

      it("should create a user", async () => {
        const payload = {
          email: "test@test123.com",
          ...breaking(
            () => ({ role: "member", password: "test123" }),
            () => ({})
          ),
        }

        // In V2, the flow to create an authenticated user depends on the token or session of a previously created auth user
        const headers = breaking(
          () => adminHeaders,
          () => {
            return {
              headers: { Authorization: `Bearer ${token}` },
            }
          }
        )

        const response = await api
          .post("/admin/users", payload, headers)
          .catch((err) => console.log(err))

        expect(response.status).toEqual(200)
        expect(response.data.user).toEqual(
          expect.objectContaining({
            id: expect.stringMatching(
              breaking(
                () => /^usr_*/,
                () => /^user_*/
              )
            ),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            email: "test@test123.com",
            ...breaking(
              () => ({ role: "member" }),
              () => ({})
            ),
          })
        )
      })

      // V2 only test
      it.skip("should throw, if session/bearer auth is present for existing user", async () => {
        const emailPassResponse = await api.post("/auth/user/emailpass", {
          email: "test@test123.com",
          password: "test123",
        })

        const token = emailPassResponse.data.token

        const headers = (token) => ({
          headers: { Authorization: `Bearer ${token}` },
        })

        // Create user
        const res = await api
          .post(
            "/admin/users",
            {
              email: "test@test123.com",
            },
            headers(token)
          )
          .catch((err) => console.log(err))

        const payload = {
          email: "different@email.com",
        }

        const { response: errorResponse } = await api
          .post("/admin/users", payload, headers(res.data.token))
          .catch((err) => err)

        expect(errorResponse.status).toEqual(400)
        expect(errorResponse.data.message).toEqual(
          "Request carries authentication for an existing user"
        )
      })
    })

    describe("POST /admin/users/:id", () => {
      beforeEach(async () => {
        await breaking(
          async () => {
            await userSeeder(dbConnection)
          },
          async () => {
            await userModuleService.create([
              {
                id: "member-user",
                email: "member@test.com",
                first_name: "member",
                last_name: "user",
              },
            ])
          }
        )
      })

      it("should update a user", async () => {
        const updateResponse = await api
          .post(
            "/admin/users/member-user",
            { first_name: "karl" },
            adminHeaders
          )
          .catch((err) => console.log(err.response.data.message))

        expect(updateResponse.status).toEqual(200)
        expect(updateResponse.data.user).toEqual(
          expect.objectContaining({
            id: "member-user",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            email: "member@test.com",
            first_name: "karl",
            last_name: "user",
            ...breaking(
              () => ({ role: "member" }),
              () => ({})
            ),
          })
        )
      })
    })

    describe("DELETE /admin/users", () => {
      beforeEach(async () => {
        await breaking(
          async () => {
            await userSeeder(dbConnection)
          },
          async () => {
            await userModuleService.create([
              {
                id: "member-user",
                email: "member@test.com",
                first_name: "member",
                last_name: "user",
              },
            ])
          }
        )
      })

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

        await simpleAnalyticsConfigFactory(dbConnection, {
          user_id: userId,
        })

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
    describe("POST /admin/users/reset-password + POST /admin/users/password-token", () => {
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
