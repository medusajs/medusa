import {
  createShippingOptionsWorkflow,
  deleteShippingOptionsWorkflow,
} from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FulfillmentSetDTO,
  FulfillmentWorkflow,
  IFulfillmentModuleService,
  IRegionModuleService,
  ServiceZoneDTO,
  ShippingProfileDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  RuleOperator,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

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

        fulfillmentSet = await service.createFulfillmentSets({
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

      it("should delete shipping options", async () => {
        const regionService = container.resolve(
          ModuleRegistrationName.REGION
        ) as IRegionModuleService

        const [region] = await regionService.createRegions([
          {
            name: "Test region",
            currency_code: "eur",
            countries: ["fr"],
          },
        ])

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
              {
                region_id: region.id,
                amount: 100,
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

        await deleteShippingOptionsWorkflow(container).run({
          input: { ids: [result[0].id] },
        })

        const remoteQuery = container.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )

        const remoteQueryObject = remoteQueryObjectFromString({
          entryPoint: "shipping_option",
          variables: {
            id: result[0].id,
          },
          fields: [
            "id",
            "name",
            "price_type",
            "service_zone_id",
            "shipping_profile_id",
            "provider_id",
            "data",
            "metadata",
            "type.*",
            "created_at",
            "updated_at",
            "deleted_at",
            "shipping_option_type_id",
            "prices.*",
          ],
        })

        const createdShippingOption = await remoteQuery(remoteQueryObject)
        expect(createdShippingOption).toHaveLength(0)
      })

      it("should revert the deleted shipping options", async () => {
        const regionService = container.resolve(
          ModuleRegistrationName.REGION
        ) as IRegionModuleService

        const [region] = await regionService.createRegions([
          {
            name: "Test region",
            currency_code: "eur",
            countries: ["fr"],
          },
        ])

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
              {
                region_id: region.id,
                amount: 100,
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

        const deleteWorkflow = await deleteShippingOptionsWorkflow(container)

        deleteWorkflow.addAction(
          "throw",
          {
            invoke: async function failStep() {
              throw new Error(`Failed to delete shipping options`)
            },
          },
          {
            noCompensation: true,
          }
        )

        const { result } = await createShippingOptionsWorkflow(container).run({
          input: [shippingOptionData],
        })

        const { errors } = await deleteWorkflow.run({
          input: { ids: [result[0].id] },
          throwOnError: false,
        })

        expect(errors).toHaveLength(1)
        expect(errors[0].error.message).toEqual(
          `Failed to delete shipping options`
        )

        const remoteQuery = container.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )

        const remoteQueryObject = remoteQueryObjectFromString({
          entryPoint: "shipping_option",
          fields: [
            "id",
            "name",
            "price_type",
            "service_zone_id",
            "shipping_profile_id",
            "provider_id",
            "data",
            "metadata",
            "type.*",
            "created_at",
            "updated_at",
            "deleted_at",
            "shipping_option_type_id",
          ],
        })

        const createdShippingOptions = await remoteQuery(remoteQueryObject)

        expect(createdShippingOptions).toHaveLength(1)
        expect(createdShippingOptions[0]).toEqual(
          expect.objectContaining({
            name: shippingOptionData.name,
            price_type: shippingOptionData.price_type,
            service_zone_id: serviceZone.id,
            shipping_profile_id: shippingProfile.id,
            provider_id: provider_id,
            data: null,
            metadata: null,
            type: expect.objectContaining({
              id: expect.any(String),
            }),
          })
        )
      })
    })
  },
})
