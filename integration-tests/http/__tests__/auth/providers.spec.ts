import { IAuthModuleService, UserDTO } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import jwt from "jsonwebtoken"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(100000)

const PROVIDER_ID = "oidc-okta"

const signActorlessToken = (
  jwtSecret: string,
  {
    authIdentityId,
    userMetadata,
    provider = PROVIDER_ID,
    actorId = "",
  }: {
    authIdentityId: string
    userMetadata: Record<string, unknown>
    provider?: string
    actorId?: string
  }
) =>
  jwt.sign(
    {
      actor_id: actorId,
      actor_type: "user",
      auth_identity_id: authIdentityId,
      auth_provider: provider,
      user_metadata: userMetadata,
    },
    jwtSecret,
    { expiresIn: "1d" }
  )

medusaIntegrationTestRunner({
  testSuite: ({ getContainer, api, dbConnection, dbUtils }) => {
    describe("Auth provider discovery", () => {
      // The HTTP test env registers a single "emailpass" auth provider and does
      // not configure `authMethodsPerActor`, so every actor type is allowed to
      // use every registered provider.
      const emailpassProvider = {
        id: "emailpass",
        identifier: "emailpass",
        display_name: "Email/Password Authentication",
        flow: "credentials",
      }

      it("lists the auth providers for the user actor type without authentication", async () => {
        const response = await api.get("/auth/user/providers")

        expect(response.status).toEqual(200)
        expect(response.data.providers).toEqual([emailpassProvider])
      })

      it("lists the auth providers for the customer actor type", async () => {
        const response = await api.get("/auth/customer/providers")

        expect(response.status).toEqual(200)
        expect(response.data.providers).toEqual([emailpassProvider])
      })

      it("never exposes provider options or secrets", async () => {
        const response = await api.get("/auth/user/providers")

        for (const provider of response.data.providers) {
          expect(Object.keys(provider).sort()).toEqual([
            "display_name",
            "flow",
            "id",
            "identifier",
          ])
        }
      })
    })

    describe("user provisioning - POST /auth/:auth_provider/user", () => {
      let authModule: IAuthModuleService
      let jwtSecret: string
      let existingUser: UserDTO

      beforeAll(async () => {
        const container = getContainer()
        authModule = container.resolve(Modules.AUTH)
        jwtSecret = container
          .resolve(ContainerRegistrationKeys.CONFIG_MODULE)
          .projectConfig.http.jwtSecret!.toString()

        const adminUser = await createAdminUser(
          dbConnection,
          adminHeaders,
          container
        )
        existingUser = adminUser.user

        await dbUtils.snapshot()
      })

      // Creates an auth identity as the auth module would after a redirect
      // provider's callback: a single provider identity carrying the profile
      // claims in `user_metadata`.
      const createProviderIdentity = (
        userMetadata: Record<string, unknown>,
        provider = PROVIDER_ID
      ) =>
        authModule.createAuthIdentities({
          provider_identities: [
            {
              provider,
              entity_id: `${provider}-${userMetadata.email ?? "no-email"}`,
              user_metadata: userMetadata,
            },
          ],
        })

      it("creates a new user when none exists for the verified email", async () => {
        const claims = {
          email: "sso-new@acme.com",
          given_name: "New",
          family_name: "User",
        }
        const authIdentity = await createProviderIdentity(claims)
        const token = signActorlessToken(jwtSecret, {
          authIdentityId: authIdentity.id,
          userMetadata: claims,
        })

        const response = await api.post(
          `/auth/${PROVIDER_ID}/user`,
          {},
          { headers: { authorization: `Bearer ${token}` } }
        )

        expect(response.status).toEqual(200)
        expect(response.data.user).toMatchObject({
          id: expect.any(String),
          email: "sso-new@acme.com",
          first_name: "New",
          last_name: "User",
        })
        const createdUserId = response.data.user.id
        expect(createdUserId).not.toEqual(existingUser.id)

        // The identity is linked to the new user.
        const linkedIdentity = await authModule.retrieveAuthIdentity(
          authIdentity.id
        )
        expect(linkedIdentity.app_metadata?.user_id).toEqual(createdUserId)

        // Refreshing the (still-actorless) token now yields an actor token.
        const refreshResponse = await api.post(
          "/auth/token/refresh",
          {},
          { headers: { authorization: `Bearer ${token}` } }
        )
        expect(refreshResponse.status).toEqual(200)
        expect(jwt.decode(refreshResponse.data.token)).toMatchObject({
          actor_type: "user",
          auth_identity_id: authIdentity.id,
          actor_id: createdUserId,
        })

        const meResponse = await api.get("/admin/users/me", {
          headers: { authorization: `Bearer ${refreshResponse.data.token}` },
        })
        expect(meResponse.status).toEqual(200)
        expect(meResponse.data.user).toMatchObject({ id: createdUserId })
      })

      it("links the existing user when one already exists for the email", async () => {
        const claims = {
          email: existingUser.email,
          given_name: "Existing",
          family_name: "Admin",
        }
        const authIdentity = await createProviderIdentity(claims)
        const token = signActorlessToken(jwtSecret, {
          authIdentityId: authIdentity.id,
          userMetadata: claims,
        })

        const response = await api.post(
          `/auth/${PROVIDER_ID}/user`,
          {},
          { headers: { authorization: `Bearer ${token}` } }
        )

        expect(response.status).toEqual(200)
        // The existing user is returned, not a newly created one.
        expect(response.data.user).toMatchObject({
          id: existingUser.id,
          email: existingUser.email,
        })

        // The new identity is linked to the existing user.
        const linkedIdentity = await authModule.retrieveAuthIdentity(
          authIdentity.id
        )
        expect(linkedIdentity.app_metadata?.user_id).toEqual(existingUser.id)

        const refreshResponse = await api.post(
          "/auth/token/refresh",
          {},
          { headers: { authorization: `Bearer ${token}` } }
        )
        expect(jwt.decode(refreshResponse.data.token)).toMatchObject({
          actor_id: existingUser.id,
        })
      })

      it("rejects when the identity was issued by a different provider", async () => {
        const claims = { email: "sso-mismatch@acme.com" }
        // Identity created by "github"; provisioning attempted via "oidc-okta".
        const authIdentity = await createProviderIdentity(claims, "github")
        const token = signActorlessToken(jwtSecret, {
          authIdentityId: authIdentity.id,
          userMetadata: claims,
          provider: "github",
        })

        const response = await api
          .post(
            `/auth/${PROVIDER_ID}/user`,
            {},
            { headers: { authorization: `Bearer ${token}` } }
          )
          .catch((error) => error.response)

        expect(response.status).toEqual(401)
      })

      it("rejects when the identity carries no email claim", async () => {
        const authIdentity = await createProviderIdentity({
          email: "sso-noemail@acme.com",
        })
        // Sign a token whose user_metadata has no email (the route reads the
        // email from the backend-signed token, never the request body).
        const token = signActorlessToken(jwtSecret, {
          authIdentityId: authIdentity.id,
          userMetadata: { given_name: "No", family_name: "Email" },
        })

        const response = await api
          .post(
            `/auth/${PROVIDER_ID}/user`,
            {},
            { headers: { authorization: `Bearer ${token}` } }
          )
          .catch((error) => error.response)

        expect(response.status).toEqual(400)
      })

      it("rejects when the token is already linked to an actor", async () => {
        const claims = { email: "sso-already-linked@acme.com" }
        const authIdentity = await createProviderIdentity(claims)
        const token = signActorlessToken(jwtSecret, {
          authIdentityId: authIdentity.id,
          userMetadata: claims,
          actorId: existingUser.id,
        })

        const response = await api
          .post(
            `/auth/${PROVIDER_ID}/user`,
            {},
            { headers: { authorization: `Bearer ${token}` } }
          )
          .catch((error) => error.response)

        expect(response.status).toEqual(400)
      })

      it("rejects an unauthenticated request", async () => {
        const response = await api
          .post(`/auth/${PROVIDER_ID}/user`, {})
          .catch((error) => error.response)

        expect(response.status).toEqual(401)
      })
    })
  },
})
