import { generateResetPasswordTokenWorkflow } from "@medusajs/core-flows"
import { IAuthModuleService } from "@medusajs/framework/types"
import { AuthWorkflowEvents, Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import jwt from "jsonwebtoken"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let container
    beforeAll(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      await dbUtils.snapshot()
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

        // Regression: DELETE /auth/session must clear the session cookie on
        // the client. See https://github.com/medusajs/medusa/issues/15508
        const signOutSetCookie = signOutRequest.headers["set-cookie"]
        expect(signOutSetCookie).toBeDefined()
        expect(signOutSetCookie[0]).toMatch(/^connect\.sid=;/)
        expect(signOutSetCookie[0]).toContain("Expires=")

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

      it("should reject replaying a reset token after a successful password update", async () => {
        await api.post("/auth/user/emailpass/register", {
          email: "replay@medusa-commerce.com",
          password: "secret_password",
        })

        const { result: resetToken } = await generateResetPasswordTokenWorkflow(
          container
        ).run({
          input: {
            entityId: "replay@medusa-commerce.com",
            actorType: "user",
            provider: "emailpass",
            secret: "test",
          },
        })

        const firstUse = await api.post(
          `/auth/user/emailpass/update`,
          { password: "first_new_password" },
          { headers: { authorization: `Bearer ${resetToken}` } }
        )
        expect(firstUse.status).toEqual(200)

        const replay = await api
          .post(
            `/auth/user/emailpass/update`,
            { password: "attacker_password" },
            { headers: { authorization: `Bearer ${resetToken}` } }
          )
          .catch((e) => e)

        expect(replay.response.status).toEqual(401)
        expect(replay.response.data.message).toEqual("Invalid token")

        const attackerLogin = await api
          .post("/auth/user/emailpass", {
            email: "replay@medusa-commerce.com",
            password: "attacker_password",
          })
          .catch((e) => e)
        expect(attackerLogin.response.status).toEqual(401)

        const legitLogin = await api.post("/auth/user/emailpass", {
          email: "replay@medusa-commerce.com",
          password: "first_new_password",
        })
        expect(legitLogin.status).toEqual(200)
      })

      it("should invalidate previously issued reset tokens when a new one is generated", async () => {
        await api.post("/auth/user/emailpass/register", {
          email: "reissue@medusa-commerce.com",
          password: "secret_password",
        })

        const { result: firstToken } = await generateResetPasswordTokenWorkflow(
          container
        ).run({
          input: {
            entityId: "reissue@medusa-commerce.com",
            actorType: "user",
            provider: "emailpass",
            secret: "test",
          },
        })

        const { result: secondToken } =
          await generateResetPasswordTokenWorkflow(container).run({
            input: {
              entityId: "reissue@medusa-commerce.com",
              actorType: "user",
              provider: "emailpass",
              secret: "test",
            },
          })

        const oldTokenAttempt = await api
          .post(
            `/auth/user/emailpass/update`,
            { password: "attacker_password" },
            { headers: { authorization: `Bearer ${firstToken}` } }
          )
          .catch((e) => e)
        expect(oldTokenAttempt.response.status).toEqual(401)
        expect(oldTokenAttempt.response.data.message).toEqual("Invalid token")

        const newTokenUse = await api.post(
          `/auth/user/emailpass/update`,
          { password: "new_password" },
          { headers: { authorization: `Bearer ${secondToken}` } }
        )
        expect(newTokenUse.status).toEqual(200)
      })

      it("should reject session bearer tokens on the password update endpoint", async () => {
        await api.post("/auth/user/emailpass/register", {
          email: "session@medusa-commerce.com",
          password: "secret_password",
        })

        const login = await api.post("/auth/user/emailpass", {
          email: "session@medusa-commerce.com",
          password: "secret_password",
        })

        const attempt = await api
          .post(
            `/auth/user/emailpass/update`,
            { password: "new_password" },
            { headers: { authorization: `Bearer ${login.data.token}` } }
          )
          .catch((e) => e)

        expect(attempt.response.status).toEqual(401)
        expect(attempt.response.data.message).toEqual("Invalid token")
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

        await dbConnection.raw(
          `UPDATE "auth_password_reset_token" SET expires_at = NOW() - INTERVAL '1 day' WHERE entity_id = ? AND deleted_at IS NULL`,
          ["test@medusa-commerce.com"]
        )

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
        // Register user
        await api.post("/auth/user/emailpass/register", {
          email: "test@medusa-commerce.com",
          password: "secret_password",
        })

        const response = await api
          .post(`/auth/user/emailpass/update`, {
            email: "test@medusa-commerce.com",
          })
          .catch((e) => e)

        expect(response.response.status).toEqual(401)
        expect(response.response.data.message).toEqual("Invalid token")
      })

      it("should fail if update is attempted on different actor type", async () => {
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
      await new Promise((resolve) => setTimeout(resolve, 100))

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

    it("should preserve custom app_metadata fields on token refresh", async () => {
      // Register a new identity via emailpass
      const signup = await api.post("/auth/user/emailpass/register", {
        email: "custom-meta@medusa.js",
        password: "secret_password",
      })
      expect(signup.status).toEqual(200)

      // Add custom fields to the auth identity's app_metadata
      const authModule: IAuthModuleService = container.resolve(Modules.AUTH)
      const { auth_identity_id } = jwt.decode(signup.data.token) as any
      await authModule.updateAuthIdentities({
        id: auth_identity_id,
        app_metadata: { is_verified: true, custom_role: "manager" },
      })

      // Login to get a fresh token that reflects the updated app_metadata
      const login = await api.post("/auth/user/emailpass", {
        email: "custom-meta@medusa.js",
        password: "secret_password",
      })
      expect(login.status).toEqual(200)

      const loginDecoded = jwt.decode(login.data.token) as any
      expect(loginDecoded.app_metadata).toMatchObject({
        is_verified: true,
        custom_role: "manager",
      })

      // Refresh the token and verify custom fields are not stripped
      const refresh = await api.post(
        "/auth/token/refresh",
        {},
        { headers: { authorization: `Bearer ${login.data.token}` } }
      )
      expect(refresh.status).toEqual(200)

      const refreshDecoded = jwt.decode(refresh.data.token) as any
      expect(refreshDecoded.app_metadata).toMatchObject({
        is_verified: true,
        custom_role: "manager",
      })
    })

    it("should include auth_provider in the JWT and preserve it on token refresh", async () => {
      // Register and log in via emailpass
      await api.post("/auth/user/emailpass/register", {
        email: "provider-test@medusa.js",
        password: "secret_password",
      })

      const login = await api.post("/auth/user/emailpass", {
        email: "provider-test@medusa.js",
        password: "secret_password",
      })
      expect(login.status).toEqual(200)

      // Initial token should carry auth_provider so refresh can resolve user_metadata
      const loginDecoded = jwt.decode(login.data.token) as any
      expect(loginDecoded.auth_provider).toEqual("emailpass")

      // Refresh — auth_provider must be forwarded so provider identity is resolved
      const refresh = await api.post(
        "/auth/token/refresh",
        {},
        { headers: { authorization: `Bearer ${login.data.token}` } }
      )
      expect(refresh.status).toEqual(200)

      const refreshDecoded = jwt.decode(refresh.data.token) as any
      expect(refreshDecoded.auth_provider).toEqual("emailpass")
    })

    it("should preserve user_metadata from the provider identity on token refresh", async () => {
      // Register via emailpass to get an auth identity with a provider identity
      const signup = await api.post("/auth/user/emailpass/register", {
        email: "user-meta@medusa.js",
        password: "secret_password",
      })
      expect(signup.status).toEqual(200)

      // Seed user_metadata directly on the provider identity (simulates what an
      // OIDC/Auth0 provider would set in validateCallback)
      const authModule: IAuthModuleService = container.resolve(Modules.AUTH)
      const { auth_identity_id } = jwt.decode(signup.data.token) as any
      const authIdentity = await authModule.retrieveAuthIdentity(
        auth_identity_id,
        { relations: ["provider_identities"] }
      )
      const providerIdentityId = authIdentity.provider_identities![0].id
      await authModule.updateProviderIdentities({
        id: providerIdentityId,
        user_metadata: { email: "user-meta@medusa.js", roles: ["editor"] },
      })

      // Login to get a fresh token that includes the user_metadata
      const login = await api.post("/auth/user/emailpass", {
        email: "user-meta@medusa.js",
        password: "secret_password",
      })
      expect(login.status).toEqual(200)

      const loginDecoded = jwt.decode(login.data.token) as any
      expect(loginDecoded.user_metadata).toEqual({
        email: "user-meta@medusa.js",
        roles: ["editor"],
      })

      // Refresh — user_metadata must survive because provider_identities is
      // now eagerly loaded and auth_provider is forwarded from the JWT claim
      const refresh = await api.post(
        "/auth/token/refresh",
        {},
        { headers: { authorization: `Bearer ${login.data.token}` } }
      )
      expect(refresh.status).toEqual(200)

      const refreshDecoded = jwt.decode(refresh.data.token) as any
      expect(refreshDecoded.user_metadata).toEqual({
        email: "user-meta@medusa.js",
        roles: ["editor"],
      })
    })
  },
})
