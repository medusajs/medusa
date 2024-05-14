import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FulfillmentWorkflow,
  IFulfillmentModuleService,
  IOrderModuleService,
  IRegionModuleService,
  OrderWorkflow,
  RegionDTO,
  ShippingOptionDTO,
} from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils/dist"
import {
  createReturnOrderWorkflow,
  createShippingOptionsWorkflow,
} from "@medusajs/core-flows"
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
          attribute: "is_return",
          operator: RuleOperator.EQ,
          value: '"true"',
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
  return {
    shippingOption: createdShippingOption,
    region,
  }
}

async function createOrderFixture({ orderService }) {
  const order = await orderService.create({
    region_id: "test_region_idclear",
    email: "foo@bar.com",
    items: [
      {
        title: "Custom Item 2",
        quantity: 1,
        unit_price: 50,
        adjustments: [
          {
            code: "VIP_25 ETH",
            amount: "0.000000000000000005",
            description: "VIP discount",
            promotion_id: "prom_123",
            provider_id: "coupon_kings",
          },
        ],
      },
    ],
    sales_channel_id: "test",
    shipping_address: {
      first_name: "Test",
      last_name: "Test",
      address_1: "Test",
      city: "Test",
      country_code: "US",
      postal_code: "12345",
      phone: "12345",
    },
    billing_address: {
      first_name: "Test",
      last_name: "Test",
      address_1: "Test",
      city: "Test",
      country_code: "US",
      postal_code: "12345",
    },
    shipping_methods: [
      {
        name: "Test shipping method",
        amount: 10,
        data: {},
        tax_lines: [
          {
            description: "shipping Tax 1",
            tax_rate_id: "tax_usa_shipping",
            code: "code",
            rate: 10,
          },
        ],
        adjustments: [
          {
            code: "VIP_10",
            amount: 1,
            description: "VIP discount",
            promotion_id: "prom_123",
          },
        ],
      },
    ],
    currency_code: "usd",
    customer_id: "joe",
  })

  return order
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
      let region: RegionDTO

      beforeEach(async () => {
        const fixtures = await createShippingOptionFixture({
          container,
          fulfillmentService,
        })

        shippingOption = fixtures.shippingOption
        region = fixtures.region
      })

      it("should create a return order", async () => {
        const order = await createOrderFixture({ orderService }).catch(
          (err) => {
            console.log(err)
          }
        )
        const createReturnOrderData: OrderWorkflow.CreateOrderReturnWorkflowInput =
          {
            order_id: order.id,
            return_shipping: {
              option_id: shippingOption.id,
            },
            items: [
              {
                id: order.items![0].id,
                quantity: 1,
              },
            ],
            region: region,
          }

        const { result, errors } = await createReturnOrderWorkflow(
          container
        ).run({
          input: createReturnOrderData,
          throwOnError: false,
        })

        console.log(errors)
      })
    })
  },
})
