import { Modules, PolicyOperation } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.ENABLE_RBAC_MODULE = "true"

const configuration = { widgets: { "product.details": { hidden: true } } }

/**
 * A user's layout is their own, but the default layout applies to every
 * user, so writing it needs `layout_configuration:update`.
 */
medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    const noRolesHeaders = { headers: { ...adminHeaders.headers } }
    const layoutManagerHeaders = { headers: { ...adminHeaders.headers } }

    const statusOf = (request: Promise<{ status: number }>) =>
      request
        .then((response) => response.status)
        .catch((error) => error.response.status)

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
      await createAdminUser(dbConnection, noRolesHeaders, container, {
        email: "layouts-no-roles@medusa.js",
        roles: [],
      })

      const rbacModule = container.resolve(Modules.RBAC)
      const [layoutUpdate] = await rbacModule.listRbacPolicies({
        resource: "layout_configuration",
        operation: PolicyOperation.update,
      })
      const role = await rbacModule.createRbacRoles({ name: "Layout Manager" })
      await rbacModule.createRbacRolePolicies([
        { role_id: role.id, policy_id: layoutUpdate.id },
      ])
      await createAdminUser(dbConnection, layoutManagerHeaders, container, {
        email: "layouts-manager@medusa.js",
        roles: [role.id],
      })

      await dbUtils.snapshot()
    })

    afterAll(async () => {
      delete process.env.ENABLE_RBAC_MODULE
    })

    describe("POST /admin/layouts/:zone/configuration", () => {
      it("lets any user write their own layout", async () => {
        const response = await api.post(
          "/admin/layouts/products/configuration",
          { configuration },
          noRolesHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.personal_configuration).toBeTruthy()
      })

      it("forbids a user without layout_configuration:update from writing the default layout", async () => {
        expect(
          await statusOf(
            api.post(
              "/admin/layouts/products/configuration",
              { is_default: true, configuration },
              noRolesHeaders
            )
          )
        ).toEqual(403)
      })

      it.each([
        ["a role holding layout_configuration:update", layoutManagerHeaders],
        ["a super admin", adminHeaders],
      ])("lets %s write the default layout", async (_, headers) => {
        const response = await api.post(
          "/admin/layouts/products/configuration",
          { is_default: true, configuration },
          headers
        )

        expect(response.status).toEqual(200)
        expect(response.data.default_configuration).toBeTruthy()
      })
    })
  },
})
