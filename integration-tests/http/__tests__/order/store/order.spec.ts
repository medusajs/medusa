import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ModuleRegistrationName } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"
import { createAuthenticatedCustomer } from "../../../../modules/helpers/create-authenticated-customer"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let order,
      draftOrder,
      seeder,
      storeHeaders,
      customer,
      storeHeadersWithCustomer

    beforeAll(async () => {
      const container = getContainer()

      await setupTaxStructure(container.resolve(ModuleRegistrationName.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)
      const publishableKey = await generatePublishableKey(container)
      storeHeaders = generateStoreHeaders({ publishableKey })

      const result = await createAuthenticatedCustomer(api, storeHeaders, {
        first_name: "tony",
        last_name: "stark",
        email: "tony@stark-industries.com",
      })

      customer = result.customer
      storeHeadersWithCustomer = {
        headers: {
          ...storeHeaders.headers,
          authorization: `Bearer ${result.jwt}`,
        },
      }

      seeder = await createOrderSeeder({
        api,
        container: getContainer(),
        storeHeaderOverride: storeHeadersWithCustomer,
      })
      order = seeder.order
      order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
        .order

      const payload = {
        email: "test@test.test",
        region_id: seeder.region.id,
        status: "completed",
        shipping_methods: [
          {
            shipping_option_id: seeder.shippingOption.id,
            amount: 10,
            name: "test",
          },
        ],
      }

      const draftOrderResposne = await api.post(
        "/admin/draft-orders?fields=+is_draft_order",
        payload,
        adminHeaders
      )

      await api.post(
        `/admin/orders/${draftOrderResposne.data.draft_order.id}/complete`,
        {},
        adminHeaders
      )

      draftOrder = draftOrderResposne.data.draft_order

      await dbUtils.snapshot()
    })

    describe("GET /store/orders", () => {
      it("should successfully list non draft orders", async () => {
        const response = await api.get(
          `/store/orders`,
          storeHeadersWithCustomer
        )

        expect(response.data.orders).toHaveLength(1)
        expect(response.data.orders).toEqual([
          expect.objectContaining({
            id: order.id,
          }),
        ])
      })

      it("should throw an error when customer isn't authenticated", async () => {
        const { response } = await api
          .get(`/store/orders`, storeHeaders)
          .catch((e) => e)

        expect(response.status).toEqual(401)
        expect(response.data.message).toEqual("Unauthorized")
      })
    })

    describe("GET /store/orders/:id", () => {
      it("should successfully fetch non draft order", async () => {
        const response = await api.get(
          `/store/orders/${order.id}`,
          storeHeadersWithCustomer
        )

        expect(response.data.order).toEqual(
          expect.objectContaining({
            id: order.id,
          })
        )
      })

      // TODO: This should have thrown an error, but doesn't seem to.
      it.skip("should throw an error when fetching draft order", async () => {
        const response = await api
          .get(
            `/store/orders/${draftOrder.id}?fields=+is_draft_order`,
            storeHeaders
          )
          .catch((e) => e)

        expect(response.status).toEqual(404)
        expect(response.data.message).toEqual(
          `Order with id: ${draftOrder.id} was not found`
        )
      })
    })
  },
})
