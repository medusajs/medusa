import {
  AuthIdentityDTO,
  IAuthModuleService,
  UserDTO,
} from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import jwt from "jsonwebtoken"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer, api, dbConnection }) => {
    let authModule: IAuthModuleService
    let jwtSecret: string
    let existingUser: UserDTO
    let existingAuthIdentity: AuthIdentityDTO

    beforeEach(async () => {
      const container = getContainer()
      authModule = container.resolve(Modules.AUTH)

      const config = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)
      jwtSecret = config.projectConfig.http.jwtSecret!.toString()

      const adminUser = await createAdminUser(
        dbConnection,
        adminHeaders,
        getContainer()
      )
      existingUser = adminUser.user
      existingAuthIdentity = adminUser.authIdentity
    })

    describe("POST /cloud/auth/users", () => {
      it("should create a new user when user doesn't exist", async () => {
        // Create an auth identity (simulating cloud auth callback)
        const authIdentity = await authModule.createAuthIdentities({
          provider_identities: [
            {
              provider: "cloud",
              entity_id: "cloud-user-123",
              user_metadata: {
                email: "john@doe.com",
                given_name: "John",
                family_name: "Doe",
              },
            },
          ],
        })

        // Generate a token for this auth identity (without actor_id since user doesn't exist yet)
        const token = jwt.sign(
          {
            actor_id: "",
            actor_type: "user",
            auth_identity_id: authIdentity.id,
            user_metadata: {
              email: "john@doe.com",
              given_name: "John",
              family_name: "Doe",
            },
          },
          jwtSecret,
          { expiresIn: "1d" }
        )

        // Call the endpoint to create the user
        const createUserResponse = await api.post(
          "/cloud/auth/users",
          {},
          { headers: { authorization: `Bearer ${token}` } }
        )
        expect(createUserResponse.status).toEqual(200)
        expect(createUserResponse.data.user).toMatchObject({
          id: expect.any(String),
          email: "john@doe.com",
          first_name: "John",
          last_name: "Doe",
        })
        const createdUserId = createUserResponse.data.user.id
        expect(createdUserId).not.toEqual(existingUser.id)

        // Refresh the token to get updated actor_id which should be the user's id
        const refreshResponse = await api.post(
          "/auth/token/refresh",
          {},
          { headers: { authorization: `Bearer ${token}` } }
        )
        expect(refreshResponse.status).toEqual(200)
        const refreshedToken = refreshResponse.data.token
        expect(jwt.decode(refreshResponse.data.token)).toMatchObject({
          actor_type: "user",
          auth_identity_id: authIdentity.id,
          actor_id: createdUserId,
        })

        // Verify the user was created
        const meResponse = await api.get("/admin/users/me", {
          headers: {
            authorization: `Bearer ${refreshedToken}`,
          },
        })
        expect(meResponse.status).toEqual(200)
        expect(meResponse.data.user).toMatchObject({
          id: createdUserId,
          email: "john@doe.com",
          first_name: "John",
          last_name: "Doe",
        })
      })

      it("should link existing user to auth identity when user with same email already exists", async () => {
        // Create an auth identity (simulating cloud auth callback)
        const authIdentity = await authModule.createAuthIdentities({
          provider_identities: [
            {
              provider: "cloud",
              entity_id: "cloud-user-123",
              user_metadata: {
                email: existingUser.email,
                given_name: "John",
                family_name: "Doe",
              },
            },
          ],
        })

        // Generate a token for this auth identity (without actor_id since user doesn't exist yet)
        const token = jwt.sign(
          {
            actor_id: "",
            actor_type: "user",
            auth_identity_id: authIdentity.id,
            user_metadata: {
              email: existingUser.email,
              given_name: "John",
              family_name: "Doe",
            },
          },
          jwtSecret,
          { expiresIn: "1d" }
        )

        // Call the endpoint to create the user
        const createUserResponse = await api.post(
          "/cloud/auth/users",
          {},
          { headers: { authorization: `Bearer ${token}` } }
        )
        expect(createUserResponse.status).toEqual(200)
        expect(createUserResponse.data.user).toMatchObject({
          id: existingUser.id,
          email: existingUser.email,
        })

        // Refresh the token to get updated actor_id, which should be the user id
        const refreshResponse = await api.post(
          "/auth/token/refresh",
          {},
          { headers: { authorization: `Bearer ${token}` } }
        )
        expect(refreshResponse.status).toEqual(200)
        expect(jwt.decode(refreshResponse.data.token)).toMatchObject({
          actor_type: "user",
          auth_identity_id: authIdentity.id,
          actor_id: existingUser.id,
        })

        // Verify the previous auth identity is still linked to the user
        const updatedAuthIdentity = await authModule.retrieveAuthIdentity(
          existingAuthIdentity.id
        )
        expect(updatedAuthIdentity.app_metadata?.user_id).toEqual(
          existingUser.id
        )
      })

      it("should not allow non-cloud identities to create a user", async () => {
        // Create an auth identity
        const authIdentity = await authModule.createAuthIdentities({
          provider_identities: [
            {
              provider: "github",
              entity_id: "github-user-123",
              user_metadata: {
                email: "john@doe.com",
                given_name: "John",
                family_name: "Doe",
              },
            },
          ],
        })

        // Generate a token for this auth identity (without actor_id since user doesn't exist yet)
        const token = jwt.sign(
          {
            actor_id: "",
            actor_type: "user",
            auth_identity_id: authIdentity.id,
            user_metadata: {
              email: "john@doe.com",
              given_name: "John",
              family_name: "Doe",
            },
          },
          jwtSecret,
          { expiresIn: "1d" }
        )

        // Call the endpoint to create the user
        const createUserResponse = await api.post(
          "/cloud/auth/users",
          {},
          { headers: { authorization: `Bearer ${token}` } }
        ).catch((error) => error.response)
        expect(createUserResponse.status).toEqual(401)
      })
    })
  },
})
