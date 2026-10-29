import { Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.ENABLE_RBAC_MODULE = "true"

const env = { MEDUSA_FF_VIEW_CONFIGURATIONS: true }

// Entities the products table relates to, all governed by core policies.
const RELATED_ENTITIES = ["SalesChannel", "ProductCollection", "ProductTag"]

const relatedFilterEntities = (columns: any[]) =>
  columns
    .map((column) => column.filter?.relationship?.entity)
    .filter((entity) => RELATED_ENTITIES.includes(entity))

const relatedFields = (columns: any[]) =>
  columns
    .map((column) => column.field)
    .filter((field) => /^(sales_channels|collection|tags)\./.test(field))

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, api, getContainer }) => {
    const productReaderHeaders = { headers: { ...adminHeaders.headers } }

    afterAll(() => {
      delete process.env.ENABLE_RBAC_MODULE
    })

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      const rbacModule = container.resolve(Modules.RBAC)
      const [productRead] = await rbacModule.listRbacPolicies({
        resource: "product",
        operation: "read",
      })
      const role = await rbacModule.createRbacRoles({ name: "Product Reader" })
      await rbacModule.createRbacRolePolicies([
        { role_id: role.id, policy_id: productRead.id },
      ])

      await createAdminUser(dbConnection, productReaderHeaders, container, {
        email: "product-reader@medusa.js",
        roles: [role.id],
      })
    })

    describe("GET /admin/views/products/columns", () => {
      it("returns related columns and filters to a super admin", async () => {
        const { data } = await api.get(
          "/admin/views/products/columns",
          adminHeaders
        )

        expect(relatedFilterEntities(data.columns).length).toBeGreaterThan(0)
        expect(relatedFields(data.columns).length).toBeGreaterThan(0)
      })

      it("drops columns and filters for entities the user can't read", async () => {
        const { data } = await api.get(
          "/admin/views/products/columns",
          productReaderHeaders
        )

        expect(data.columns.length).toBeGreaterThan(0)
        expect(relatedFilterEntities(data.columns)).toEqual([])
        expect(relatedFields(data.columns)).toEqual([])
      })
    })

    describe("GET /admin/views/orders/columns", () => {
      it("forbids an entity the user can't read", async () => {
        const error = await api
          .get("/admin/views/orders/columns", productReaderHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(403)
      })
    })
  },
})
