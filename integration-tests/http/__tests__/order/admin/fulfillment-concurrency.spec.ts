import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  cancelOrderFulfillmentWorkflow,
  createOrderFulfillmentWorkflow,
  createOrderShipmentWorkflow,
  createOrderWorkflow,
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  markOrderFulfillmentAsDeliveredWorkflow,
} from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(300_000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    let regionId: string
    let locationId: string
    let optionId: string

    beforeAll(async () => {
      const container = getContainer()
      const link = container.resolve(ContainerRegistrationKeys.LINK)
      const fulfillment = container.resolve(Modules.FULFILLMENT)
      const {
        result: [region],
      } = await createRegionsWorkflow(container).run({
        input: {
          regions: [{ name: "R", currency_code: "eur", countries: ["de"] }],
        },
      })
      regionId = region.id
      const {
        result: [location],
      } = await createStockLocationsWorkflow(container).run({
        input: {
          locations: [
            { name: "W", address: { address_1: "1", country_code: "de" } },
          ],
        },
      })
      locationId = location.id
      await link.create({
        [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
        [Modules.FULFILLMENT]: {
          fulfillment_provider_id: "manual_test-provider",
        },
      })
      const [profile] = await fulfillment.createShippingProfiles([
        { name: "P", type: "default" },
      ])
      const set = await fulfillment.createFulfillmentSets({
        name: "S",
        type: "shipping",
        service_zones: [
          { name: "Z", geo_zones: [{ type: "country", country_code: "de" }] },
        ],
      })
      await link.create({
        [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
        [Modules.FULFILLMENT]: { fulfillment_set_id: set.id },
      })
      const {
        result: [option],
      } = await createShippingOptionsWorkflow(container).run({
        input: [
          {
            name: "manual",
            price_type: "flat",
            provider_id: "manual_test-provider",
            service_zone_id: set.service_zones[0].id,
            shipping_profile_id: profile.id,
            type: { label: "manual", description: "manual", code: "manual" },
            prices: [{ currency_code: "eur", amount: 5 }],
            rules: [],
          },
        ],
      })
      optionId = option.id
    })

    async function orderWithFulfillments(count = 2) {
      const container = getContainer()
      const { result: order } = await createOrderWorkflow(container).run({
        input: {
          region_id: regionId,
          email: "a@example.com",
          items: [{ title: "Thing", quantity: 2, unit_price: 10 }],
          shipping_methods: [
            { name: "manual", amount: 5, shipping_option_id: optionId },
          ],
          shipping_address: {
            first_name: "A",
            last_name: "B",
            address_1: "1",
            country_code: "de",
          },
        },
      })
      const lineId = order.items![0].id
      const fulfillmentIds: string[] = []
      for (let i = 0; i < count; i++) {
        const { result } = await createOrderFulfillmentWorkflow(container).run({
          input: {
            order_id: order.id,
            items: [{ id: lineId, quantity: 1 }],
            location_id: locationId,
            shipping_option_id: optionId,
          },
        })
        fulfillmentIds.push(result.id)
      }
      return { orderId: order.id, lineId, fulfillmentIds }
    }

    async function recorded(orderId: string, fulfillmentId: string) {
      const container = getContainer()
      const pg = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)
      const {
        rows: [fulfillment],
      } = await pg.raw(
        "select shipped_at is not null as shipped, canceled_at is not null as canceled, delivered_at is not null as delivered from fulfillment where id = ?",
        [fulfillmentId]
      )
      const { rows: actions } = await pg.raw(
        `select action, count(*)::int as n from order_change_action
          where reference_id = ? and deleted_at is null and applied = true group by action`,
        [fulfillmentId]
      )
      const { rows: versions } = await pg.raw(
        `select version from order_change where order_id = ? and deleted_at is null
          group by version having count(*) > 1`,
        [orderId]
      )
      const {
        data: [order],
      } = await container.resolve(ContainerRegistrationKeys.QUERY).graph({
        entity: "order",
        fields: [
          "items.detail.shipped_quantity",
          "items.detail.delivered_quantity",
          "items.detail.fulfilled_quantity",
        ],
        filters: { id: orderId },
      })
      return {
        shipped: fulfillment.shipped,
        canceled: fulfillment.canceled,
        delivered: fulfillment.delivered,
        actions: Object.fromEntries(
          actions.map(({ action, n }) => [action, n])
        ),
        shippedQuantity: Number(order.items[0].detail.shipped_quantity),
        deliveredQuantity: Number(order.items[0].detail.delivered_quantity),
        fulfilledQuantity: Number(order.items[0].detail.fulfilled_quantity),
        duplicateOrderChangeVersions: versions.map(({ version }) => version),
      }
    }

    async function expectOrderUnlocked(orderId: string) {
      const locking = getContainer().resolve(Modules.LOCKING)
      await locking.acquire(orderId)
      await locking.release(orderId)
    }

    it("two concurrent createOrderShipmentWorkflow runs for one fulfillment register one shipment", async () => {
      const container = getContainer()
      const { orderId, lineId, fulfillmentIds } = await orderWithFulfillments()
      const ship = () =>
        createOrderShipmentWorkflow(container).run({
          input: {
            order_id: orderId,
            fulfillment_id: fulfillmentIds[0],
            items: [{ id: lineId, quantity: 1 }],
          },
        })

      const outcomes = await Promise.allSettled([ship(), ship()])
      expect(
        outcomes.filter((result) => result.status === "fulfilled")
      ).toHaveLength(1)
      await expectOrderUnlocked(orderId)
      const state = await recorded(orderId, fulfillmentIds[0])

      // Expected: one shipment registered and one shipped unit; the other run rejected.
      expect(state.actions.SHIP_ITEM ?? 0).toBe(1)
      expect(state.shippedQuantity).toBe(1)
      expect(state.duplicateOrderChangeVersions).toEqual([])
    })

    it("createOrderShipmentWorkflow ∥ cancelOrderFulfillmentWorkflow leaves one consistent outcome", async () => {
      const container = getContainer()
      const { orderId, lineId, fulfillmentIds } = await orderWithFulfillments()

      const outcomes = await Promise.allSettled([
        createOrderShipmentWorkflow(container).run({
          input: {
            order_id: orderId,
            fulfillment_id: fulfillmentIds[0],
            items: [{ id: lineId, quantity: 1 }],
          },
        }),
        cancelOrderFulfillmentWorkflow(container).run({
          input: { order_id: orderId, fulfillment_id: fulfillmentIds[0] },
        }),
      ])
      expect(
        outcomes.filter((result) => result.status === "fulfilled")
      ).toHaveLength(1)
      await expectOrderUnlocked(orderId)
      const state = await recorded(orderId, fulfillmentIds[0])

      // Expected: shipped with its SHIP_ITEM, or canceled with no shipment; never a mix.
      expect(state.shipped).toBe((state.actions.SHIP_ITEM ?? 0) === 1)
      expect(state.canceled && state.shipped).toBe(false)
      expect(state.shippedQuantity).toBe(state.shipped ? 1 : 0)
    })

    it("registers both shipments when different fulfillments of the same order are shipped concurrently", async () => {
      const container = getContainer()
      const { orderId, lineId, fulfillmentIds } = await orderWithFulfillments()

      await Promise.all(
        fulfillmentIds.map((fulfillmentId) =>
          createOrderShipmentWorkflow(container).run({
            input: {
              order_id: orderId,
              fulfillment_id: fulfillmentId,
              items: [{ id: lineId, quantity: 1 }],
            },
          })
        )
      )

      for (const fulfillmentId of fulfillmentIds) {
        const state = await recorded(orderId, fulfillmentId)
        expect(state.actions.SHIP_ITEM).toBe(1)
        expect(state.shippedQuantity).toBe(2)
        expect(state.duplicateOrderChangeVersions).toEqual([])
      }
      await expectOrderUnlocked(orderId)
    })

    it("keeps order versions consistent when fulfillment creation overlaps a shipment", async () => {
      const container = getContainer()
      const { orderId, lineId, fulfillmentIds } = await orderWithFulfillments(1)

      await Promise.all([
        createOrderFulfillmentWorkflow(container).run({
          input: {
            order_id: orderId,
            items: [{ id: lineId, quantity: 1 }],
            location_id: locationId,
            shipping_option_id: optionId,
          },
        }),
        createOrderShipmentWorkflow(container).run({
          input: {
            order_id: orderId,
            fulfillment_id: fulfillmentIds[0],
            items: [{ id: lineId, quantity: 1 }],
          },
        }),
      ])

      const state = await recorded(orderId, fulfillmentIds[0])
      expect(state.shippedQuantity).toBe(1)
      expect(state.fulfilledQuantity).toBe(2)
      expect(state.duplicateOrderChangeVersions).toEqual([])
      await expectOrderUnlocked(orderId)
    })

    it("keeps delivery and order actions consistent when cancellation overlaps delivery", async () => {
      const container = getContainer()
      const { orderId, fulfillmentIds } = await orderWithFulfillments()

      const outcomes = await Promise.allSettled([
        markOrderFulfillmentAsDeliveredWorkflow(container).run({
          input: { orderId, fulfillmentId: fulfillmentIds[0] },
        }),
        cancelOrderFulfillmentWorkflow(container).run({
          input: { order_id: orderId, fulfillment_id: fulfillmentIds[0] },
        }),
      ])

      expect(outcomes.some((result) => result.status === "fulfilled")).toBe(
        true
      )
      const state = await recorded(orderId, fulfillmentIds[0])
      expect(state.delivered).toBe((state.actions.DELIVER_ITEM ?? 0) === 1)
      expect(state.canceled && state.delivered).toBe(false)
      expect(state.deliveredQuantity).toBe(state.delivered ? 1 : 0)
      expect(state.duplicateOrderChangeVersions).toEqual([])
      await expectOrderUnlocked(orderId)
    })
  },
})
