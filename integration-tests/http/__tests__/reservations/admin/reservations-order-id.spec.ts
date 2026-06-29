import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer

    beforeAll(async () => {
      appContainer = getContainer()
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, appContainer)
    })

    describe("GET /admin/reservations - order_id", () => {
      it("exposes the order id of the reservation's line item via order_item.order_id", async () => {
        const seeder = await createOrderSeeder({
          api,
          container: appContainer,
        })

        const order = seeder.order
        const inventoryItem = seeder.inventoryItem
        const lineItem = order.items[0]

        const stockLocation = (
          await api.post(
            `/admin/stock-locations`,
            { name: "reservation-loc" },
            adminHeaders
          )
        ).data.stock_location

        await api.post(
          `/admin/inventory-items/${inventoryItem.id}/location-levels`,
          { location_id: stockLocation.id, stocked_quantity: 100 },
          adminHeaders
        )

        const reservation = (
          await api.post(
            `/admin/reservations`,
            {
              inventory_item_id: inventoryItem.id,
              location_id: stockLocation.id,
              line_item_id: lineItem.id,
              quantity: 1,
            },
            adminHeaders
          )
        ).data.reservation

        const result = (
          await api.get(
            `/admin/reservations/${reservation.id}?fields=id,line_item_id,order_item.order_id`,
            adminHeaders
          )
        ).data.reservation

        expect(result).toEqual(
          expect.objectContaining({
            id: reservation.id,
            line_item_id: lineItem.id,
            order_item: expect.objectContaining({
              order_id: order.id,
            }),
          })
        )
      })
    })
  },
})
