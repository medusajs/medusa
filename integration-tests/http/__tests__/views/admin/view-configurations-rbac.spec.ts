import { Modules, PolicyOperation } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.ENABLE_RBAC_MODULE = "true"

const env = { MEDUSA_FF_VIEW_CONFIGURATIONS: true }

const configuration = { visible_columns: ["id"], column_order: ["id"] }

/**
 * The views routes take their resource from the `:entity` param, so they're
 * guarded at request time: the actor must be able to read the entity. System
 * default configurations apply to every user, so creating, changing,
 * promoting to, or deleting one needs the matching `view_configuration` policy.
 */
medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    const productReaderHeaders = { headers: { ...adminHeaders.headers } }
    const viewManagerHeaders = { headers: { ...adminHeaders.headers } }

    const statusOf = (request: Promise<{ status: number }>) =>
      request
        .then((response) => response.status)
        .catch((error) => error.response.status)

    const createView = async (
      entity: string,
      headers: typeof adminHeaders,
      body: Record<string, unknown> = {}
    ) => {
      const { data } = await api.post(
        `/admin/views/${entity}/configurations`,
        { name: "View", configuration, ...body },
        headers
      )
      return data.view_configuration
    }

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      const rbacModule = container.resolve(Modules.RBAC)
      const [productRead] = await rbacModule.listRbacPolicies({
        resource: "product",
        operation: PolicyOperation.read,
      })
      const role = await rbacModule.createRbacRoles({
        name: "Views Product Reader",
      })
      await rbacModule.createRbacRolePolicies([
        { role_id: role.id, policy_id: productRead.id },
      ])

      await createAdminUser(dbConnection, productReaderHeaders, container, {
        email: "views-product-reader@medusa.js",
        roles: [role.id],
      })

      const viewPolicies = await rbacModule.listRbacPolicies({
        resource: "view_configuration",
        operation: [
          PolicyOperation.create,
          PolicyOperation.update,
          PolicyOperation.delete,
        ],
      })
      const viewManager = await rbacModule.createRbacRoles({
        name: "Views Default Manager",
      })
      await rbacModule.createRbacRolePolicies(
        [productRead, ...viewPolicies].map((policy) => ({
          role_id: viewManager.id,
          policy_id: policy.id,
        }))
      )
      await createAdminUser(dbConnection, viewManagerHeaders, container, {
        email: "views-default-manager@medusa.js",
        roles: [viewManager.id],
      })

      await dbUtils.snapshot()
    })

    afterAll(async () => {
      delete process.env.ENABLE_RBAC_MODULE
    })

    describe("an entity the actor can't read", () => {
      it("forbids every configuration route", async () => {
        const orderView = await createView("orders", adminHeaders)
        const base = "/admin/views/orders/configurations"

        const statuses = await Promise.all([
          statusOf(api.get(base, productReaderHeaders)),
          statusOf(
            api.post(
              base,
              { name: "Mine", configuration },
              productReaderHeaders
            )
          ),
          statusOf(api.get(`${base}/${orderView.id}`, productReaderHeaders)),
          statusOf(
            api.post(
              `${base}/${orderView.id}`,
              { name: "Renamed" },
              productReaderHeaders
            )
          ),
          statusOf(api.get(`${base}/active`, productReaderHeaders)),
          statusOf(
            api.post(
              `${base}/active`,
              { view_configuration_id: null },
              productReaderHeaders
            )
          ),
          statusOf(api.delete(`${base}/${orderView.id}`, productReaderHeaders)),
        ])

        expect(statuses).toEqual([403, 403, 403, 403, 403, 403, 403])
      })
    })

    describe("an entity the actor can read", () => {
      it("allows every configuration route on the actor's own view", async () => {
        const base = "/admin/views/products/configurations"

        const view = await createView("products", productReaderHeaders)
        expect(view.user_id).toBeTruthy()

        expect(await statusOf(api.get(base, productReaderHeaders))).toEqual(200)
        expect(
          await statusOf(api.get(`${base}/${view.id}`, productReaderHeaders))
        ).toEqual(200)
        expect(
          await statusOf(
            api.post(
              `${base}/${view.id}`,
              { name: "Renamed" },
              productReaderHeaders
            )
          )
        ).toEqual(200)
        expect(
          await statusOf(
            api.post(
              `${base}/active`,
              { view_configuration_id: view.id },
              productReaderHeaders
            )
          )
        ).toEqual(200)
        expect(
          await statusOf(api.get(`${base}/active`, productReaderHeaders))
        ).toEqual(200)
        expect(
          await statusOf(api.delete(`${base}/${view.id}`, productReaderHeaders))
        ).toEqual(200)
      })

      it("does not expose another entity's view through the readable entity's path", async () => {
        const ordersView = await createView("orders", adminHeaders, {
          is_system_default: true,
        })
        const path = `/admin/views/products/configurations/${ordersView.id}`

        expect(await statusOf(api.get(path, productReaderHeaders))).toEqual(404)
        expect(
          await statusOf(
            api.post(path, { name: "Renamed" }, productReaderHeaders)
          )
        ).toEqual(404)
        expect(await statusOf(api.delete(path, productReaderHeaders))).toEqual(
          404
        )
      })
    })

    describe("system default configurations", () => {
      const base = "/admin/views/products/configurations"

      it("needs view_configuration:create to create one", async () => {
        expect(
          await statusOf(
            api.post(
              base,
              { is_system_default: true, configuration },
              productReaderHeaders
            )
          )
        ).toEqual(403)

        const view = await createView("products", viewManagerHeaders, {
          is_system_default: true,
        })
        expect(view.is_system_default).toEqual(true)
      })

      it("needs view_configuration:update to update one", async () => {
        const view = await createView("products", viewManagerHeaders, {
          is_system_default: true,
        })

        expect(
          await statusOf(
            api.post(
              `${base}/${view.id}`,
              { name: "Renamed" },
              productReaderHeaders
            )
          )
        ).toEqual(403)
        expect(
          await statusOf(
            api.post(
              `${base}/${view.id}`,
              { name: "Renamed" },
              viewManagerHeaders
            )
          )
        ).toEqual(200)
      })

      it("needs view_configuration:update to promote a view to one", async () => {
        const ownView = await createView("products", productReaderHeaders)
        expect(
          await statusOf(
            api.post(
              `${base}/${ownView.id}`,
              { is_system_default: true },
              productReaderHeaders
            )
          )
        ).toEqual(403)

        const managerView = await createView("products", viewManagerHeaders)
        expect(
          await statusOf(
            api.post(
              `${base}/${managerView.id}`,
              { is_system_default: true },
              viewManagerHeaders
            )
          )
        ).toEqual(200)
      })

      it("needs view_configuration:delete to delete one", async () => {
        const view = await createView("products", viewManagerHeaders, {
          is_system_default: true,
        })

        expect(
          await statusOf(api.delete(`${base}/${view.id}`, productReaderHeaders))
        ).toEqual(403)
        expect(
          await statusOf(api.delete(`${base}/${view.id}`, viewManagerHeaders))
        ).toEqual(200)
      })
    })
  },
})
