import { Modules } from "@medusajs/modules-sdk"
import { IFulfillmentModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"
import {
  generateCreateFulfillmentData,
  generateCreateShippingOptionsData,
} from "../../__fixtures__"

jest.setTimeout(100000)

// TODO: Temporary until the providers are sorted out
const createProvider = async (MikroOrmWrapper, providerId: string) => {
  const [{ id }] = await MikroOrmWrapper.forkManager().execute(
    `insert into service_provider (id) values ('${providerId}') returning id`
  )

  return id
}

moduleIntegrationTestRunner({
  moduleName: Modules.FULFILLMENT,
  moduleOptions: {},
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IFulfillmentModuleService>) => {
    describe("Fulfillment Module Service", () => {
      describe("read", () => {
        it("should list fulfillment", async () => {
          const shippingProfile = await service.createShippingProfiles({
            name: "test",
            type: "default",
          })
          const fulfillmentSet = await service.create({
            name: "test",
            type: "test-type",
          })
          const serviceZone = await service.createServiceZones({
            name: "test",
            fulfillment_set_id: fulfillmentSet.id,
          })
          const providerId = await createProvider(
            MikroOrmWrapper,
            "test-provider"
          )
          const shippingOption = await service.createShippingOptions(
            generateCreateShippingOptionsData({
              service_provider_id: providerId,
              service_zone_id: serviceZone.id,
              shipping_profile_id: shippingProfile.id,
            })
          )

          const fulfillment = await service.createFulfillment(
            generateCreateFulfillmentData({
              provider_id: providerId,
              shipping_option_id: shippingOption.id,
            })
          )

          const result = await service.retrieveFulfillment(fulfillment.id)

          expect(result.id).toEqual(fulfillment.id)
        })
      })

      describe("mutations", () => {})
    })
  },
})
