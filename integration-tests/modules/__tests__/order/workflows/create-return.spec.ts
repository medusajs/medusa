import {
  createReturnOrderWorkflow,
  createShippingOptionsWorkflow,
} from "@medusajs/core-flows"
import {
  ModuleRegistrationName,
  Modules,
  RemoteLink,
} from "@medusajs/modules-sdk"
import {
  FulfillmentSetDTO,
  FulfillmentWorkflow,
  IOrderModuleService,
  IRegionModuleService,
  IStockLocationService,
  OrderWorkflow,
  ProductDTO,
  RegionDTO,
  ShippingOptionDTO,
  StockLocationDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
  RuleOperator,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils/dist"

jest.setTimeout(500000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const providerId = "manual_test-provider"

async function prepareDataFixtures({ container }) {
  const fulfillmentService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  )
  const salesChannelService = container.resolve(
    ModuleRegistrationName.SALES_CHANNEL
  )
  const stockLocationModule: IStockLocationService = container.resolve(
    ModuleRegistrationName.STOCK_LOCATION
  )
  const productModule = container.resolve(ModuleRegistrationName.PRODUCT)
  const inventoryModule = container.resolve(ModuleRegistrationName.INVENTORY)

  const shippingProfile = await fulfillmentService.createShippingProfiles({
    name: "test",
    type: "default",
  })

  const fulfillmentSet = await fulfillmentService.createFulfillmentSets({
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

  const [region] = await regionService.createRegions([
    {
      name: "Test region",
      currency_code: "eur",
      countries: ["fr"],
    },
  ])

  const salesChannel = await salesChannelService.createSalesChannels({
    name: "Webshop",
  })

  const location: StockLocationDTO =
    await stockLocationModule.createStockLocations({
      name: "Warehouse",
      address: {
        address_1: "Test",
        city: "Test",
        country_code: "US",
        postal_code: "12345",
        phone: "12345",
      },
    })

  const [product] = await productModule.createProducts([
    {
      title: "Test product",
      variants: [
        {
          title: "Test variant",
          sku: "test-variant",
        },
      ],
    },
  ])

  const inventoryItem = await inventoryModule.createInventoryItems({
    sku: "inv-1234",
  })

  await inventoryModule.createInventoryLevels([
    {
      inventory_item_id: inventoryItem.id,
      location_id: location.id,
      stocked_quantity: 2,
      reserved_quantity: 0,
    },
  ])

  const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)

  await remoteLink.create([
    {
      [Modules.STOCK_LOCATION]: {
        stock_location_id: location.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    },
    {
      [Modules.SALES_CHANNEL]: {
        sales_channel_id: salesChannel.id,
      },
      [Modules.STOCK_LOCATION]: {
        stock_location_id: location.id,
      },
    },
    {
      [Modules.PRODUCT]: {
        variant_id: product.variants[0].id,
      },
      [Modules.INVENTORY]: {
        inventory_item_id: inventoryItem.id,
      },
    },
  ])

  const shippingOptionData: FulfillmentWorkflow.CreateShippingOptionsWorkflowInput =
    {
      name: "Return shipping option",
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
    salesChannel,
    location,
    product,
    fulfillmentSet,
  }
}

async function createOrderFixture({ container, product }) {
  const orderService: IOrderModuleService = container.resolve(
    ModuleRegistrationName.ORDER
  )
  let order = await orderService.createOrders({
    region_id: "test_region_idclear",
    email: "foo@bar.com",
    items: [
      {
        title: "Custom Item 2",
        variant_sku: product.variants[0].sku,
        variant_title: product.variants[0].title,
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
      } as any,
    ],
    transactions: [
      {
        amount: 50, // TODO: check calculation, I think it should be 60 wit the shipping but the order total is 50
        currency_code: "usd",
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

  await orderService.addOrderAction([
    {
      action: "FULFILL_ITEM",
      order_id: order.id,
      version: order.version,
      reference: "fullfilment",
      reference_id: "fulfill_123",
      details: {
        reference_id: order.items![0].id,
        quantity: 1,
      },
    },
    {
      action: "SHIP_ITEM",
      order_id: order.id,
      version: order.version,
      reference: "fullfilment",
      reference_id: "fulfill_123",
      details: {
        reference_id: order.items![0].id,
        quantity: 1,
      },
    },
  ])

  const returnReason = await orderService.createReturnReasons({
    value: "Test reason",
    label: "Test reason",
  })

  await orderService.createReturnReasons({
    value: "Test child reason",
    label: "Test child reason",
    parent_return_reason_id: returnReason.id,
  })

  await orderService.applyPendingOrderActions(order.id)

  order = await orderService.retrieveOrder(order.id, {
    relations: ["items"],
  })

  return order
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    let container

    beforeAll(() => {
      container = getContainer()
    })

    describe("Create return order workflow", () => {
      let shippingOption: ShippingOptionDTO
      let region: RegionDTO
      let location: StockLocationDTO
      let product: ProductDTO
      let fulfillmentSet: FulfillmentSetDTO

      let orderService: IOrderModuleService

      beforeEach(async () => {
        const fixtures = await prepareDataFixtures({
          container,
        })

        shippingOption = fixtures.shippingOption
        region = fixtures.region
        location = fixtures.location
        product = fixtures.product
        fulfillmentSet = fixtures.fulfillmentSet

        orderService = container.resolve(ModuleRegistrationName.ORDER)
      })

      it("should create a return order", async () => {
        const order = await createOrderFixture({ container, product })
        const reasons = await orderService.listReturnReasons({})
        const testReason = reasons.find(
          (r) => r.value.toLowerCase() === "test child reason"
        )!

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
                reason_id: testReason.id,
              },
            ],
          }

        await createReturnOrderWorkflow(container).run({
          input: createReturnOrderData,
          throwOnError: true,
        })

        const remoteQuery = container.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )
        const remoteQueryObject = remoteQueryObjectFromString({
          entryPoint: "order",
          variables: {
            id: order.id,
          },
          fields: [
            "*",
            "items.*",
            "shipping_methods.*",
            "total",
            "item_total",
            "fulfillments.*",
          ],
        })

        const [returnOrder] = await remoteQuery(remoteQueryObject)

        expect(returnOrder).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            display_id: 1,
            region_id: "test_region_idclear",
            customer_id: "joe",
            version: 2,
            sales_channel_id: "test", // TODO: What about order with a sales channel but a shipping option link to a stock from another channel?
            status: "pending",
            is_draft_order: false,
            email: "foo@bar.com",
            currency_code: "usd",
            shipping_address_id: expect.any(String),
            billing_address_id: expect.any(String),
            items: [
              expect.objectContaining({
                id: order.items![0].id,
                title: "Custom Item 2",
                variant_sku: product.variants[0].sku,
                variant_title: product.variants[0].title,
                requires_shipping: true,
                is_discountable: true,
                is_tax_inclusive: false,
                compare_at_unit_price: null,
                unit_price: 50,
                quantity: 1,
                detail: expect.objectContaining({
                  id: expect.any(String),
                  order_id: expect.any(String),
                  version: 2,
                  item_id: expect.any(String),
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 1,
                  return_requested_quantity: 1,
                  return_received_quantity: 0,
                  return_dismissed_quantity: 0,
                  written_off_quantity: 0,
                }),
              }),
            ],
            shipping_methods: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: "Test shipping method",
                description: null,
                is_tax_inclusive: false,
                shipping_option_id: null,
                amount: 10,
                order_id: expect.any(String),
              }),
              expect.objectContaining({
                id: expect.any(String),
                name: shippingOption.name,
                description: null,
                is_tax_inclusive: false,
                shipping_option_id: shippingOption.id,
                amount: 10,
                order_id: expect.any(String),
              }),
            ]),
            fulfillments: [
              expect.objectContaining({
                id: expect.any(String),
                location_id: location.id,
                provider_id: providerId,
                shipping_option_id: shippingOption.id,
                // TODO: Validate the address once we are fixed on it
                /*delivery_address: {
                  id: "fuladdr_01HY0RTAP0P1EEAFK7BXJ0BKBN",
                },*/
              }),
            ],
          })
        )
      })

      it("should fail when location is not linked", async () => {
        const order = await createOrderFixture({ container, product })
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
          }

        // Remove the location link
        const remoteLink = container.resolve(
          ContainerRegistrationKeys.REMOTE_LINK
        ) as RemoteLink

        await remoteLink.dismiss([
          {
            [Modules.STOCK_LOCATION]: {
              stock_location_id: location.id,
            },
            [Modules.FULFILLMENT]: {
              fulfillment_set_id: fulfillmentSet.id,
            },
          },
        ])

        const { errors } = await createReturnOrderWorkflow(container).run({
          input: createReturnOrderData,
          throwOnError: false,
        })

        await expect(errors[0].error.message).toBe(
          `Cannot create return without stock location, either provide a location or you should link the shipping option ${shippingOption.id} to a stock location.`
        )
      })

      it("should fail when a reason with children is provided", async () => {
        const order = await createOrderFixture({ container, product })
        const reasons = await orderService.listReturnReasons({})
        const testReason = reasons.find(
          (r) => r.value.toLowerCase() === "test reason"
        )!

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
                reason_id: testReason.id,
              },
            ],
          }

        const { errors } = await createReturnOrderWorkflow(container).run({
          input: createReturnOrderData,
          throwOnError: false,
        })

        expect(errors[0].error.message).toBe(
          `Cannot apply return reason with id ${testReason.id} to order with id ${order.id}. Return reason has nested reasons.`
        )
      })
    })
  },
})
