import { Modules, RBAC_SUPER_ADMIN_ROLE_ID } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.ENABLE_RBAC_MODULE = "true"

const ensurePolicies = async (
  rbacModule,
  actions: [resource: string, operation: string][]
) => {
  return Promise.all(
    actions.map(async ([resource, operation]) => {
      const key = `${resource}:${operation}`
      const [existing] = await rbacModule.listRbacPolicies({ key })

      return (
        existing ??
        (await rbacModule.createRbacPolicies({
          key,
          resource,
          operation,
          name: key,
        }))
      )
    })
  )
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    let container
    let readerRole
    let superAdminInvite
    let readerInvite
    let plainInvite
    // Reads, creates, updates invites and assigns roles, but holds only
    // `product:read` beyond that, so it can grant "Product Reader" and not
    // the super admin role.
    const clerkHeaders = { headers: {} as Record<string, string> }

    beforeAll(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      await dbUtils.snapshot()
    })

    afterAll(async () => {
      delete process.env.ENABLE_RBAC_MODULE
    })

    beforeEach(async () => {
      const rbacModule = container.resolve(Modules.RBAC)

      const policies = await ensurePolicies(rbacModule, [
        ["invite", "read"],
        ["invite", "create"],
        ["invite", "update"],
        ["rbac_role_assignment", "create"],
        ["product", "read"],
      ])
      const productRead = policies.find((p) => p.key === "product:read")

      let clerkRole
      ;[clerkRole, readerRole] = await rbacModule.createRbacRoles([
        { name: "Invite Clerk" },
        { name: "Product Reader" },
      ])
      await rbacModule.createRbacRolePolicies([
        ...policies.map((p) => ({ role_id: clerkRole.id, policy_id: p.id })),
        { role_id: readerRole.id, policy_id: productRead.id },
      ])

      await createAdminUser(dbConnection, clerkHeaders, container, {
        email: "clerk@medusa.js",
        roles: [clerkRole.id],
      })

      const createInvite = async (
        email: string,
        roles?: { role_id: string }[]
      ) =>
        (await api.post("/admin/invites", { email, roles }, adminHeaders)).data
          .invite

      superAdminInvite = await createInvite("super-admin@medusa.js", [
        { role_id: RBAC_SUPER_ADMIN_ROLE_ID },
      ])
      readerInvite = await createInvite("reader@medusa.js", [
        { role_id: readerRole.id },
      ])
      plainInvite = await createInvite("plain@medusa.js")
    })

    describe("invite tokens", () => {
      it("are listed only for the invites whose roles the actor can assign", async () => {
        const response = await api.get("/admin/invites", clerkHeaders)
        const invites = Object.fromEntries(
          response.data.invites.map((invite) => [invite.id, invite])
        )

        expect(response.status).toEqual(200)
        expect(invites[superAdminInvite.id]).not.toHaveProperty("token")
        expect(invites[readerInvite.id].token).toEqual(readerInvite.token)
        expect(invites[plainInvite.id].token).toEqual(plainInvite.token)
      })

      it("are listed for every invite to an actor who can assign all their roles", async () => {
        const response = await api.get("/admin/invites", adminHeaders)
        const invites = Object.fromEntries(
          response.data.invites.map((invite) => [invite.id, invite])
        )

        expect(invites[superAdminInvite.id].token).toEqual(
          superAdminInvite.token
        )
        expect(invites[readerInvite.id].token).toEqual(readerInvite.token)
        expect(invites[plainInvite.id].token).toEqual(plainInvite.token)
      })

      it("are omitted when retrieving an invite the actor can't grant", async () => {
        const forbidden = await api.get(
          `/admin/invites/${superAdminInvite.id}`,
          clerkHeaders
        )
        const allowed = await api.get(
          `/admin/invites/${readerInvite.id}`,
          clerkHeaders
        )

        expect(forbidden.status).toEqual(200)
        expect(forbidden.data.invite).not.toHaveProperty("token")
        expect(allowed.data.invite.token).toEqual(readerInvite.token)
      })

      it("can't be requested explicitly through fields", async () => {
        const list = await api.get("/admin/invites?fields=token", clerkHeaders)
        const retrieve = await api.get(
          `/admin/invites/${superAdminInvite.id}?fields=token`,
          clerkHeaders
        )

        expect(
          list.data.invites.find((invite) => invite.id === superAdminInvite.id)
        ).not.toHaveProperty("token")
        expect(
          list.data.invites.find((invite) => invite.id === readerInvite.id)
            .token
        ).toEqual(readerInvite.token)
        expect(retrieve.data.invite).not.toHaveProperty("token")
      })

      it("are rotated but not returned when resending an invite the actor can't grant", async () => {
        const forbidden = await api.post(
          `/admin/invites/${superAdminInvite.id}/resend`,
          {},
          clerkHeaders
        )
        const rotated = await api.get(
          `/admin/invites/${superAdminInvite.id}`,
          adminHeaders
        )
        const allowed = await api.post(
          `/admin/invites/${readerInvite.id}/resend`,
          {},
          clerkHeaders
        )

        expect(forbidden.status).toEqual(200)
        expect(forbidden.data.invite).not.toHaveProperty("token")
        expect(rotated.data.invite.token).not.toEqual(superAdminInvite.token)
        expect(allowed.data.invite.token).toEqual(expect.any(String))
        expect(allowed.data.invite.token).not.toEqual(readerInvite.token)
      })

      it("are returned to the actor who creates an invite", async () => {
        const response = await api.post(
          "/admin/invites",
          {
            email: "created-by-clerk@medusa.js",
            roles: [{ role_id: readerRole.id }],
          },
          clerkHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.invite.token).toEqual(expect.any(String))
      })
    })
  },
})
