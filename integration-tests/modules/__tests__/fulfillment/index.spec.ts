import { medusaIntegrationTestRunner } from "medusa-test-utils/dist"
import { setupFullDataFulfillmentStructure } from "../fixtures"
import { IFulfillmentModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

jest.setTimeout(100000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    let service: IFulfillmentModuleService

    beforeAll(() => {
      const container = getContainer()
      service = container.resolve(ModuleRegistrationName.FULFILLMENT)
    })

    /**
     * The test runner run both the medusa migrations as well as the modules
     * migrations. In order to ensure the backward compatibility
     * of the migration works, we will create a full data structure.
     */
    describe("Fulfillment module migrations backward compatibility", () => {
      it("should allow to create a full data structure after the backward compatible migration have run on top of the medusa v1 database", async () => {
        await setupFullDataFulfillmentStructure(service, {
          providerId: `manual_test-provider`,
        })

        const fulfillmentSets = await service.list(
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
  },
})
