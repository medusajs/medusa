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
 * user, so only super admins can write it.
 */
medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    const noRolesHeaders = { headers: { ...adminHeaders.headers } }

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

      it("forbids a user that isn't a super admin from writing the default layout", async () => {
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

      it("lets a super admin write the default layout", async () => {
        const response = await api.post(
          "/admin/layouts/products/configuration",
          { is_default: true, configuration },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.default_configuration).toBeTruthy()
      })
    })
  },
})
