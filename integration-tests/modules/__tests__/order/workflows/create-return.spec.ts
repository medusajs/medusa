import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FulfillmentWorkflow,
  IFulfillmentModuleService,
  IOrderModuleService,
  IRegionModuleService,
  ShippingOptionDTO,
} from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils/dist"
import { createShippingOptionsWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
  RuleOperator,
} from "@medusajs/utils"

jest.setTimeout(100000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const providerId = "manual_test-provider"

async function createShippingOptionFixture({ container, fulfillmentService }) {
  const shippingProfile = await fulfillmentService.createShippingProfiles({
    name: "test",
    type: "default",
  })

  const fulfillmentSet = await fulfillmentService.create({
    name: "Test fulfillment set",
    type: "manual_test",
  })

  const serviceZone = await fulfillmentService.createServiceZones({
    name: "Test service zone",
    fulfillment_set_id: fulfillmentSet.id,
    geo_zones: [
      {
        type: "country",
        country_code: "US",
      },
    ],
  })

  const regionService = container.resolve(
    ModuleRegistrationName.REGION
  ) as IRegionModuleService

  const [region] = await regionService.create([
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
      provider_id: providerId,
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

  const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const [createdShippingOption] = await remoteQuery(remoteQueryObject)
  return createdShippingOption
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    let orderService: IOrderModuleService
    let fulfillmentService: IFulfillmentModuleService
    let container

    beforeAll(() => {
      container = getContainer()
      orderService = container.resolve(ModuleRegistrationName.ORDER)
      fulfillmentService = container.resolve(ModuleRegistrationName.FULFILLMENT)
    })

    describe("Create return order workflow", () => {
      let shippingOption: ShippingOptionDTO

      beforeEach(async () => {
        shippingOption = await createShippingOptionFixture({
          container,
          fulfillmentService,
        })
      })
    })
  },
})
