import { createUsersWorkflow } from "@medusajs/core-flows"
import { IAuthModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  RBAC_SUPER_ADMIN_ROLE_ID,
} from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import jwt from "jsonwebtoken"

jest.setTimeout(100000)

process.env.ENABLE_RBAC_MODULE = "true"

const PROVIDER_ID = "oidc-okta"

medusaIntegrationTestRunner({
  testSuite: ({ getContainer, api, dbUtils }) => {
    let container
    let authModule: IAuthModuleService
    let jwtSecret: string

    beforeAll(async () => {
      container = getContainer()
      authModule = container.resolve(Modules.AUTH)
      jwtSecret = container
        .resolve(ContainerRegistrationKeys.CONFIG_MODULE)
        .projectConfig.http.jwtSecret!.toString()

      // No user exists, as on a new deployment where the super admin
      // migration script had no user to assign the role to.
      await dbUtils.snapshot()
    })

    afterAll(async () => {
      delete process.env.ENABLE_RBAC_MODULE
    })

    // Provisions a user through SSO, as the identity provider callback would.
    const provisionSsoUser = async (email: string) => {
      const userMetadata = { email, given_name: "SSO", family_name: "User" }
      const authIdentity = await authModule.createAuthIdentities({
        provider_identities: [
          {
            provider: PROVIDER_ID,
            entity_id: `${PROVIDER_ID}-${email}`,
            user_metadata: userMetadata,
          },
        ],
      })

      const token = jwt.sign(
        {
          actor_id: "",
          actor_type: "user",
          auth_identity_id: authIdentity.id,
          auth_provider: PROVIDER_ID,
          user_metadata: userMetadata,
        },
        jwtSecret,
        { expiresIn: "1d" }
      )

      const response = await api.post(
        `/auth/${PROVIDER_ID}/user`,
        {},
        { headers: { authorization: `Bearer ${token}` } }
      )

      return response.data.user
    }

    const listRoleIds = async (userId: string) => {
      const assignments = await container
        .resolve(Modules.RBAC)
        .listRbacRoleAssignments({ reference: "user", reference_id: userId })

      return assignments.map((assignment) => assignment.role_id)
    }

    describe("Super admin bootstrap on user creation", () => {
      it("assigns the super admin role to the first user only", async () => {
        const firstUser = await provisionSsoUser("first@acme.com")
        const secondUser = await provisionSsoUser("second@acme.com")

        expect(await listRoleIds(firstUser.id)).toEqual([
          RBAC_SUPER_ADMIN_ROLE_ID,
        ])
        expect(await listRoleIds(secondUser.id)).toEqual([])
      })

      it("lets the first user use the admin API", async () => {
        const email = "first@acme.com"
        await provisionSsoUser(email)

        const [authIdentity] = await authModule.listAuthIdentities({
          provider_identities: { entity_id: `${PROVIDER_ID}-${email}` },
        })
        const token = jwt.sign(
          {
            actor_id: authIdentity.app_metadata!.user_id,
            actor_type: "user",
            auth_identity_id: authIdentity.id,
            auth_provider: PROVIDER_ID,
            app_metadata: authIdentity.app_metadata,
            user_metadata: {},
          },
          jwtSecret,
          { expiresIn: "1d" }
        )

        const response = await api.get("/admin/products", {
          headers: { authorization: `Bearer ${token}` },
        })

        expect(response.status).toEqual(200)
      })

      it("assigns the super admin role to a single user when the first users are created concurrently", async () => {
        const users = await Promise.all(
          ["a@acme.com", "b@acme.com", "c@acme.com"].map(provisionSsoUser)
        )

        const roleIds = await Promise.all(
          users.map((user) => listRoleIds(user.id))
        )

        expect(roleIds.flat()).toEqual([RBAC_SUPER_ADMIN_ROLE_ID])
      })

      it("assigns the super admin role to every user of the first batch, on top of their roles", async () => {
        const rbacModule = container.resolve(Modules.RBAC)
        const [readerRole] = await rbacModule.createRbacRoles([
          { name: "Reader" },
        ])

        const { result: users } = await createUsersWorkflow(container).run({
          input: {
            users: [
              { email: "reader@acme.com", roles: [{ role_id: readerRole.id }] },
              { email: "roleless@acme.com" },
            ],
          },
        })

        expect((await listRoleIds(users[0].id)).sort()).toEqual(
          [readerRole.id, RBAC_SUPER_ADMIN_ROLE_ID].sort()
        )
        expect(await listRoleIds(users[1].id)).toEqual([
          RBAC_SUPER_ADMIN_ROLE_ID,
        ])
      })

      it("only assigns the given roles when the input grants the super admin role", async () => {
        const { result: users } = await createUsersWorkflow(container).run({
          input: {
            users: [
              {
                email: "admin@acme.com",
                roles: [{ role_id: RBAC_SUPER_ADMIN_ROLE_ID }],
              },
              { email: "roleless@acme.com" },
            ],
          },
        })

        expect(await listRoleIds(users[0].id)).toEqual([
          RBAC_SUPER_ADMIN_ROLE_ID,
        ])
        expect(await listRoleIds(users[1].id)).toEqual([])
      })
    })
  },
})
