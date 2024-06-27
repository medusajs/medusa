import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IFulfillmentModuleService } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../helpers/create-admin-user"
import {
  generateCreateFulfillmentData,
  generateCreateShippingOptionsData,
  setupFullDataFulfillmentStructure,
} from "../fixtures"

jest.setTimeout(100000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}
const providerId = "manual_test-provider"

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer, api, dbConnection }) => {
    let service: IFulfillmentModuleService
    let container

    beforeAll(() => {
      container = getContainer()
      service = container.resolve(ModuleRegistrationName.FULFILLMENT)
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    /**
     * The test runner run both the medusa migrations as well as the modules
     * migrations. In order to ensure the backward compatibility
     * of the migration works, we will create a full data structure.
     */
    describe("Fulfillment module migrations backward compatibility", () => {
      it("should allow to create a full data structure after the backward compatible migration have run on top of the medusa v1 database", async () => {
        await setupFullDataFulfillmentStructure(service, { providerId })

        const fulfillmentSets = await service.listFulfillmentSets(
          {},
          {
            relations: [
              "service_zones.geo_zones",
              "service_zones.shipping_options.shipping_profile",
              "service_zones.shipping_options.provider",
              "service_zones.shipping_options.type",
              "service_zones.shipping_options.rules",
              "service_zones.shipping_options.fulfillments.labels",
              "service_zones.shipping_options.fulfillments.items",
              "service_zones.shipping_options.fulfillments.delivery_address",
            ],
          }
        )

        expect(fulfillmentSets).toHaveLength(1)

        let fulfillmentSet = fulfillmentSets[0]
        expect(fulfillmentSet.service_zones).toHaveLength(1)

        let serviceZone = fulfillmentSet.service_zones[0]
        expect(serviceZone.geo_zones).toHaveLength(1)
        expect(serviceZone.shipping_options).toHaveLength(1)

        let geoZone = serviceZone.geo_zones[0]

        let shippingOption = serviceZone.shipping_options[0]
        expect(!!shippingOption.shipping_profile.deleted_at).toEqual(false)
        expect(shippingOption.fulfillments).toHaveLength(1)
        expect(shippingOption.rules).toHaveLength(1)

        let fulfillment = shippingOption.fulfillments[0]
        expect(fulfillment.labels).toHaveLength(1)
        expect(fulfillment.items).toHaveLength(1)
      })
    })

    describe("POST /admin/fulfillments/:id/cancel", () => {
      it("should throw an error when id is not found", async () => {
        const error = await api
          .post(`/admin/fulfillments/does-not-exist/cancel`, {}, adminHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data).toEqual({
          type: "not_found",
          message: "Fulfillment with id: does-not-exist was not found",
        })
      })

      it("should cancel a fulfillment", async () => {
        await setupFullDataFulfillmentStructure(service, { providerId })

        const [fulfillment] = await service.listFulfillments()

        const response = await api.post(
          `/admin/fulfillments/${fulfillment.id}/cancel`,
          {},
          adminHeaders
        )

        expect(response.status).toEqual(200)

        const canceledFulfillment = await service.retrieveFulfillment(
          fulfillment.id
        )

        expect(canceledFulfillment.canceled_at).toBeTruthy()
      })
    })

    describe("POST /admin/fulfillments", () => {
      it("should create a fulfillment", async () => {
        const shippingProfile = await service.createShippingProfiles({
          name: "test",
          type: "default",
        })

        const fulfillmentSet = await service.createFulfillmentSets({
          name: "test",
          type: "test-type",
        })

        const serviceZone = await service.createServiceZones({
          name: "test",
          fulfillment_set_id: fulfillmentSet.id,
        })

        const shippingOption = await service.createShippingOptions(
          generateCreateShippingOptionsData({
            provider_id: providerId,
            service_zone_id: serviceZone.id,
            shipping_profile_id: shippingProfile.id,
          })
        )

        const data = generateCreateFulfillmentData({
          provider_id: providerId,
          shipping_option_id: shippingOption.id,
          order_id: "order_123",
        })

        const response = await api
          .post(`/admin/fulfillments`, data, adminHeaders)
          .catch((e) => e)

        expect(response.status).toEqual(200)
        expect(response.data.fulfillment).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            location_id: "test-location",
            packed_at: null,
            shipped_at: null,
            delivered_at: null,
            canceled_at: null,
            provider_id: "manual_test-provider",
            delivery_address: expect.objectContaining({
              address_1: expect.any(String),
              address_2: expect.any(String),
              city: expect.any(String),
              country_code: expect.any(String),
              province: expect.any(String),
              postal_code: expect.any(String),
            }),
            items: [
              expect.objectContaining({
                id: expect.any(String),
                title: expect.any(String),
                sku: expect.any(String),
                barcode: expect.any(String),
                raw_quantity: {
                  value: "1",
                  precision: 20,
                },
                quantity: 1,
              }),
            ],
            labels: [
              expect.objectContaining({
                id: expect.any(String),
                tracking_number: expect.any(String),
                tracking_url: expect.any(String),
                label_url: expect.any(String),
              }),
            ],
          })
        )
      })
    })

    describe("POST /admin/fulfillments/:id/shipment", () => {
      it("should throw an error when id is not found", async () => {
        const error = await api
          .post(
            `/admin/fulfillments/does-not-exist/shipment`,
            {
              labels: [
                {
                  tracking_number: "test-tracking-number",
                  tracking_url: "test-tracking-url",
                  label_url: "test-label-url",
                },
              ],
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data).toEqual({
          type: "not_found",
          message: "Fulfillment with id: does-not-exist was not found",
        })
      })

      it("should update a fulfillment to be shipped", async () => {
        await setupFullDataFulfillmentStructure(service, { providerId })

        const [fulfillment] = await service.listFulfillments()

        const response = await api.post(
          `/admin/fulfillments/${fulfillment.id}/shipment`,
          {
            labels: [
              {
                tracking_number: "test-tracking-number",
                tracking_url: "test-tracking-url",
                label_url: "test-label-url",
              },
            ],
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.fulfillment).toEqual(
          expect.objectContaining({
            id: fulfillment.id,
            shipped_at: expect.any(String),
            labels: [
              expect.objectContaining({
                id: expect.any(String),
                tracking_number: "test-tracking-number",
                tracking_url: "test-tracking-url",
                label_url: "test-label-url",
              }),
            ],
          })
        )
      })

      it("should throw error when already shipped", async () => {
        await setupFullDataFulfillmentStructure(service, { providerId })

        const [fulfillment] = await service.listFulfillments()

        await service.updateFulfillment(fulfillment.id, {
          shipped_at: new Date(),
        })

        const error = await api
          .post(
            `/admin/fulfillments/${fulfillment.id}/shipment`,
            {
              labels: [
                {
                  tracking_number: "test-tracking-number",
                  tracking_url: "test-tracking-url",
                  label_url: "test-label-url",
                },
              ],
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data).toEqual({
          type: "not_allowed",
          message: "Shipment has already been created",
        })
      })
    })
  },
})
