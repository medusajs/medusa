import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ModuleRegistrationName } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let order, seeder, container

    beforeEach(async () => {
      container = getContainer()

      await setupTaxStructure(container.resolve(ModuleRegistrationName.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)

      seeder = await createOrderSeeder({ api, container: getContainer() })
      order = seeder.order
    })

    describe("GET /admin/orders - sorting", () => {
      describe("valid sort fields", () => {
        it("should sort orders by created_at ascending", async () => {
          const response = await api.get(
            `/admin/orders?order=created_at`,
            adminHeaders
          )

          expect(response.status).toBe(200)
          expect(response.data.orders).toBeDefined()
        })

        it("should sort orders by created_at descending", async () => {
          const response = await api.get(
            `/admin/orders?order=-created_at`,
            adminHeaders
          )

          expect(response.status).toBe(200)
          expect(response.data.orders).toBeDefined()
        })

        it("should sort orders by updated_at", async () => {
          const response = await api.get(
            `/admin/orders?order=updated_at`,
            adminHeaders
          )

          expect(response.status).toBe(200)
          expect(response.data.orders).toBeDefined()
        })

        it("should sort orders by display_id", async () => {
          const response = await api.get(
            `/admin/orders?order=display_id`,
            adminHeaders
          )

          expect(response.status).toBe(200)
          expect(response.data.orders).toBeDefined()
        })
      })

      describe("non-sortable computed fields", () => {
        it("should return 400 when sorting by total", async () => {
          const response = await api
            .get(`/admin/orders?order=total`, adminHeaders)
            .catch((e) => e)

          expect(response.response.status).toBe(400)
          expect(response.response.data.message).toBe(
            "Field total is not sortable"
          )
        })

        it("should return 400 when sorting by total descending", async () => {
          const response = await api
            .get(`/admin/orders?order=-total`, adminHeaders)
            .catch((e) => e)

          expect(response.response.status).toBe(400)
          expect(response.response.data.message).toBe(
            "Field total is not sortable"
          )
        })

        it("should return 400 when sorting by fulfillment_status", async () => {
          const response = await api
            .get(`/admin/orders?order=fulfillment_status`, adminHeaders)
            .catch((e) => e)

          expect(response.response.status).toBe(400)
          expect(response.response.data.message).toBe(
            "Field fulfillment_status is not sortable"
          )
        })

        it("should return 400 when sorting by payment_status", async () => {
          const response = await api
            .get(`/admin/orders?order=payment_status`, adminHeaders)
            .catch((e) => e)

          expect(response.response.status).toBe(400)
          expect(response.response.data.message).toBe(
            "Field payment_status is not sortable"
          )
        })

        it("should return 400 when sorting by payment_status descending", async () => {
          const response = await api
            .get(`/admin/orders?order=-payment_status`, adminHeaders)
            .catch((e) => e)

          expect(response.response.status).toBe(400)
          expect(response.response.data.message).toBe(
            "Field payment_status is not sortable"
          )
        })
      })
    })
  },
})
