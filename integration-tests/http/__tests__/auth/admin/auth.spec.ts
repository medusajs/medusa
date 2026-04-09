import { generateResetPasswordTokenWorkflow } from "@medusajs/core-flows"
import { AuthWorkflowEvents, Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import jwt from "jsonwebtoken"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let container
    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    describe("Full authentication lifecycle", () => {
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
        expect(signup.response.data.message).toEqual(
          "Invalid email or password"
        )
      })
    })

    describe("Reset password flows", () => {
      it("should generate a reset password token", async () => {
        const response = await api.post("/auth/user/emailpass/reset-password", {
          identifier: "admin@medusa.js",
        })

        expect(response.status).toEqual(201)
      })

      it("should fail if identifier is not provided", async () => {
        const errResponse = await api
          .post("/auth/user/emailpass/reset-password", {})
          .catch((e) => e)

        expect(errResponse.response.data.message).toEqual(
          "Invalid request: Field 'identifier' is required"
        )
        expect(errResponse.response.status).toEqual(400)
      })

      it("should fail to generate token for non-existing user, but still respond with 201", async () => {
        const response = await api.post("/auth/user/emailpass/reset-password", {
          identifier: "non-existing-user@medusa.js",
        })

        expect(response.status).toEqual(201)
      })

      it("should fail to generate token for existing user but no provider, but still respond with 201", async () => {
        const response = await api.post(
          "/auth/user/non-existing-provider/reset-password",
          { identifier: "admin@medusa.js" }
        )

        expect(response.status).toEqual(201)
      })

      it("should successfully reset password", async () => {
        // Register user
        await api.post("/auth/user/emailpass/register", {
          email: "test@medusa-commerce.com",
          password: "secret_password",
        })

        // The token won't be part of the Rest API response, so we need to generate it manually
        const { result } = await generateResetPasswordTokenWorkflow(
          container
        ).run({
          input: {
            entityId: "test@medusa-commerce.com",
            actorType: "user",
            provider: "emailpass",
            secret: "test",
          },
        })

        const response = await api.post(
          `/auth/user/emailpass/update`,
          {
            password: "new_password",
          },
          {
            headers: {
              authorization: `Bearer ${result}`,
            },
          }
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({ success: true })

        const failedLogin = await api
          .post("/auth/user/emailpass", {
            email: "test@medusa-commerce.com",
            password: "secret_password",
          })
          .catch((e) => e)

        expect(failedLogin.response.status).toEqual(401)
        expect(failedLogin.response.data.message).toEqual(
          "Invalid email or password"
        )

        const login = await api.post("/auth/user/emailpass", {
          email: "test@medusa-commerce.com",
          password: "new_password",
        })

        expect(login.status).toEqual(200)
        expect(login.data).toEqual({ token: expect.any(String) })
      })

      it("should ensure you can only update password", async () => {
        // Register user
        await api.post("/auth/user/emailpass/register", {
          email: "test@medusa-commerce.com",
          password: "secret_password",
        })

        // The token won't be part of the Rest API response, so we need to generate it manually
        const { result } = await generateResetPasswordTokenWorkflow(
          container
        ).run({
          input: {
            entityId: "test@medusa-commerce.com",
            actorType: "user",
            provider: "emailpass",
            secret: "test",
          },
        })

        const response = await api.post(
          `/auth/user/emailpass/update`,
          {
            email: "test+new@medusa-commerce.com",
            password: "new_password",
          },
          {
            headers: {
              authorization: `Bearer ${result}`,
            },
          }
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({ success: true })

        const failedLogin = await api
          .post("/auth/user/emailpass", {
            email: "test+new@medusa-commerce.com",
            password: "new_password",
          })
          .catch((e) => e)

        expect(failedLogin.response.status).toEqual(401)
        expect(failedLogin.response.data.message).toEqual(
          "Invalid email or password"
        )

        const login = await api.post("/auth/user/emailpass", {
          email: "test@medusa-commerce.com",
          password: "new_password",
        })

        expect(login.status).toEqual(200)
        expect(login.data).toEqual({ token: expect.any(String) })
      })

      it("should fail if token has expired", async () => {
        jest.useFakeTimers()

        // Register user
        await api.post("/auth/user/emailpass/register", {
          email: "test@medusa-commerce.com",
          password: "secret_password",
        })

        // The token won't be part of the Rest API response, so we need to generate it manually
        const { result } = await generateResetPasswordTokenWorkflow(
          container
        ).run({
          input: {
            entityId: "test@medusa-commerce.com",
            actorType: "user",
            provider: "emailpass",
            secret: "test",
          },
        })

        // Advance time by 15 minutes
        jest.advanceTimersByTime(15 * 60 * 1000)

        const response = await api
          .post(
            `/auth/user/emailpass/update`,
            {
              password: "new_password",
            },
            {
              headers: {
                authorization: `Bearer ${result}`,
              },
            }
          )
          .catch((e) => e)

        expect(response.response.status).toEqual(401)
        expect(response.response.data.message).toEqual("Invalid token")
      })

      it("should fail if no token is passed", async () => {
        jest.useFakeTimers()

        // Register user
        await api.post("/auth/user/emailpass/register", {
          email: "test@medusa-commerce.com",
          password: "secret_password",
        })

        // Advance time by 15 minutes
        jest.advanceTimersByTime(15 * 60 * 1000)

        const response = await api
          .post(`/auth/user/emailpass/update`, {
            email: "test@medusa-commerce.com",
          })
          .catch((e) => e)

        expect(response.response.status).toEqual(401)
        expect(response.response.data.message).toEqual("Invalid token")
      })

      it("should fail if update is attempted on different actor type", async () => {
        jest.useFakeTimers()

        // Register user
        await api.post("/auth/user/emailpass/register", {
          email: "test@medusa-commerce.com",
          password: "secret_password",
        })

        // The token won't be part of the Rest API response, so we need to generate it manually
        const { result } = await generateResetPasswordTokenWorkflow(
          container
        ).run({
          input: {
            entityId: "test@medusa-commerce.com",
            actorType: "user",
            provider: "emailpass",
            secret: "test",
          },
        })

        // Advance time by 15 minutes
        jest.advanceTimersByTime(15 * 60 * 1000)

        const response = await api
          .post(
            `/auth/customer/emailpass/update`,
            {
              password: "new_password",
            },
            {
              headers: {
                authorization: `Bearer ${result}`,
              },
            }
          )
          .catch((e) => e)

        expect(response.response.status).toEqual(401)
        expect(response.response.data.message).toEqual("Invalid token")
      })

      it("should fail if token secret is incorrect", async () => {
        jest.useFakeTimers()

        // Register user
        await api.post("/auth/user/emailpass/register", {
          email: "test@medusa-commerce.com",
          password: "secret_password",
        })

        // The token won't be part of the Rest API response, so we need to generate it manually
        const { result } = await generateResetPasswordTokenWorkflow(
          container
        ).run({
          input: {
            entityId: "test@medusa-commerce.com",
            actorType: "user",
            provider: "emailpass",
            secret: "incorrect_secret",
          },
        })

        // Advance time by 15 minutes
        jest.advanceTimersByTime(15 * 60 * 1000)

        const response = await api
          .post(
            `/auth/user/emailpass/update`,
            {
              password: "new_password",
            },
            {
              headers: {
                authorization: `Bearer ${result}`,
              },
            }
          )
          .catch((e) => e)

        expect(response.response.status).toEqual(401)
        expect(response.response.data.message).toEqual("Invalid token")
      })

      it("should emit metadata in password reset event", async () => {
        await api.post("/auth/user/emailpass/register", {
          email: "test-metadata@medusa-commerce.com",
          password: "secret_password",
        })

        const eventBus = container.resolve(Modules.EVENT_BUS)
        const subscriber = jest.fn()

        eventBus.subscribe(AuthWorkflowEvents.PASSWORD_RESET, subscriber)

        const metadata = {
          source: "test",
          userId: "123",
          customField: "customValue",
        }

        const response = await api.post("/auth/user/emailpass/reset-password", {
          identifier: "test-metadata@medusa-commerce.com",
          metadata: metadata,
        })

        expect(response.status).toEqual(201)

        await new Promise((resolve) => setTimeout(resolve, 100))

        expect(subscriber).toHaveBeenCalledTimes(1)

        const eventData = subscriber.mock.calls[0][0]

        expect(eventData.data).toMatchObject({
          entity_id: "test-metadata@medusa-commerce.com",
          actor_type: "user",
          token: expect.any(String),
          metadata,
        })

        eventBus.unsubscribe(AuthWorkflowEvents.PASSWORD_RESET, subscriber)
      })
    })

    it("should refresh the token successfully", async () => {
      // Make sure issue date is later than the admin one
      jest.useFakeTimers()
      jest.advanceTimersByTime(2000)

      const resp = await api.post("/auth/token/refresh", {}, adminHeaders)
      const decodedOriginalToken = jwt.decode(
        adminHeaders.headers["authorization"].split(" ")[1]
      ) as any
      const decodedRefreshedToken = jwt.decode(resp.data.token) as any

      expect(decodedOriginalToken).toEqual(
        expect.objectContaining({
          actor_id: decodedRefreshedToken.actor_id,
          actor_type: decodedRefreshedToken.actor_type,
          auth_identity_id: decodedRefreshedToken.auth_identity_id,
        })
      )

      expect(decodedOriginalToken.iat).toBeLessThan(decodedRefreshedToken.iat)
      expect(decodedOriginalToken.exp).toBeLessThan(decodedRefreshedToken.exp)
    })
  },
})
