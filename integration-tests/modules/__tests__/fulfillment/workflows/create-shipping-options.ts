import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FulfillmentSetDTO,
  FulfillmentWorkflow,
  IFulfillmentModuleService,
  ServiceZoneDTO,
  ShippingProfileDTO,
} from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils/dist"
import { createShippingOptionsWorkflow } from "@medusajs/core-flows"
import { RuleOperator } from "@medusajs/utils"

jest.setTimeout(100000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const provider_id = "manual_test-provider"

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    let service: IFulfillmentModuleService
    let container

    beforeAll(() => {
      container = getContainer()
      service = container.resolve(ModuleRegistrationName.FULFILLMENT)
    })

    describe("Fulfillment workflows", () => {
      let fulfillmentSet: FulfillmentSetDTO
      let serviceZone: ServiceZoneDTO
      let shippingProfile: ShippingProfileDTO

      beforeEach(async () => {
        shippingProfile = await service.createShippingProfiles({
          name: "test",
          type: "default",
        })

        fulfillmentSet = await service.create({
          name: "Test fulfillment set",
          type: "manual_test",
        })

        serviceZone = await service.createServiceZones({
          name: "Test service zone",
          fulfillment_set_id: fulfillmentSet.id,
          geo_zones: [
            {
              type: "country",
              country_code: "US",
            },
          ],
        })
      })

      it("should create a shipping options", async () => {
        const shippingOptionData: FulfillmentWorkflow.CreateShippingOptionsWorkflowInput =
          {
            name: "Test shipping option",
            price_type: "flat",
            service_zone_id: serviceZone.id,
            shipping_profile_id: shippingProfile.id,
            provider_id,
            type: {
              code: "manual-type",
              label: "Manual Type",
              description: "Manual Type Description",
            },
            prices: [
              {
                currency_code: "usd",
                amount: 10,
              },
            ],
            rules: [
              {
                attribute: "total",
                operator: RuleOperator.EQ,
                value: "100",
              },
            ],
          }

        const { result } = await createShippingOptionsWorkflow(container).run({
          input: [shippingOptionData],
        })

        const createdShippingOption = await service.retrieveShippingOption(result[0].id

        console.log(result)
        expect(result[0].name).toEqual("Test shipping option")
      })
    })
  },
})
