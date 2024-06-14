import {
  cancelOrderFulfillmentWorkflow,
  createOrderFulfillmentWorkflow,
  createShippingOptionsWorkflow,
} from "@medusajs/core-flows"
import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import {
  FulfillmentWorkflow,
  IOrderModuleService,
  IRegionModuleService,
  IStockLocationServiceNext,
  OrderWorkflow,
  ProductDTO,
  RegionDTO,
  ShippingOptionDTO,
  StockLocationDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils/dist"

jest.setTimeout(500000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const providerId = "manual_test-provider"
let inventoryItem

async function prepareDataFixtures({ container }) {
  const fulfillmentService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  )
  const salesChannelService = container.resolve(
    ModuleRegistrationName.SALES_CHANNEL
  )
  const stockLocationModule: IStockLocationServiceNext = container.resolve(
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

  const location: StockLocationDTO = await stockLocationModule.create({
    name: "Warehouse",
    address: {
      address_1: "Test",
      city: "Test",
      country_code: "US",
      postal_code: "12345",
      phone: "12345",
    },
  })

  const [product] = await productModule.create([
    {
      title: "Test product",
      variants: [
        {
          title: "Test variant",
          sku: "test-variant",
        },
        {
          title: "Test variant no inventory management",
          sku: "test-variant-no-inventory",
          manage_inventory: false,
        },
      ],
    },
  ])

  inventoryItem = await inventoryModule.create({
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
      name: "Shipping option",
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
  }
}

async function createOrderFixture({ container, product, location }) {
  const orderService: IOrderModuleService = container.resolve(
    ModuleRegistrationName.ORDER
  )
  let order = await orderService.create({
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
      },
      {
        title: product.title,
        variant_sku: product.variants[1].sku,
        variant_title: product.variants[1].title,
        variant_id: product.variants[1].id,
        quantity: 1,
        unit_price: 200,
      },
    ],
    transactions: [
      {
        amount: 50,
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

  const inventoryModule = container.resolve(ModuleRegistrationName.INVENTORY)

  const reservation = await inventoryModule.createReservationItems([
    {
      line_item_id: order.items![0].id,
      inventory_item_id: inventoryItem.id,
      location_id: location.id,
      quantity: order.items![0].quantity,
    },
  ])

  order = await orderService.retrieve(order.id, {
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

    describe("Order fulfillment workflow", () => {
      let shippingOption: ShippingOptionDTO
      let region: RegionDTO
      let location: StockLocationDTO
      let product: ProductDTO

      let orderService: IOrderModuleService

      beforeEach(async () => {
        const fixtures = await prepareDataFixtures({
          container,
        })

        shippingOption = fixtures.shippingOption
        region = fixtures.region
        location = fixtures.location
        product = fixtures.product

        orderService = container.resolve(ModuleRegistrationName.ORDER)
      })

      it("should create a order fulfillment and cancel it", async () => {
        const order = await createOrderFixture({ container, product, location })

        // Create a fulfillment
        const createOrderFulfillmentData: OrderWorkflow.CreateOrderFulfillmentWorkflowInput =
          {
            order_id: order.id,
            created_by: "user_1",
            items: [
              {
                id: order.items![0].id,
                quantity: 1,
              },
            ],
            no_notification: false,
            location_id: undefined,
          }

        await createOrderFulfillmentWorkflow(container).run({
          input: createOrderFulfillmentData,
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

        const [orderFulfill] = await remoteQuery(remoteQueryObject)

        expect(orderFulfill.fulfillments).toHaveLength(1)
        expect(orderFulfill.items[0].detail.fulfilled_quantity).toEqual(1)

        const inventoryModule = container.resolve(
          ModuleRegistrationName.INVENTORY
        )
        const reservation = await inventoryModule.listReservationItems({
          line_item_id: order.items![0].id,
        })
        expect(reservation).toHaveLength(0)

        const stockAvailability = await inventoryModule.retrieveStockedQuantity(
          inventoryItem.id,
          [location.id]
        )
        expect(stockAvailability).toEqual(1)

        // Cancel the fulfillment
        const cancelFulfillmentData: OrderWorkflow.CancelOrderFulfillmentWorkflowInput =
          {
            order_id: order.id,
            fulfillment_id: orderFulfill.fulfillments[0].id,
            no_notification: false,
          }

        await cancelOrderFulfillmentWorkflow(container).run({
          input: cancelFulfillmentData,
        })

        const remoteQueryObjectFulfill = remoteQueryObjectFromString({
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

        const [orderFulfillAfterCancelled] = await remoteQuery(
          remoteQueryObjectFulfill
        )

        expect(orderFulfillAfterCancelled.fulfillments).toHaveLength(1)
        expect(
          orderFulfillAfterCancelled.items[0].detail.fulfilled_quantity
        ).toEqual(0)

        const stockAvailabilityAfterCancelled =
          await inventoryModule.retrieveStockedQuantity(inventoryItem.id, [
            location.id,
          ])
        expect(stockAvailabilityAfterCancelled).toEqual(2)
      })

      it("should revert an order fulfillment when it fails and recreate it when tried again", async () => {
        const order = await createOrderFixture({ container, product, location })

        // Create a fulfillment
        const createOrderFulfillmentData: OrderWorkflow.CreateOrderFulfillmentWorkflowInput =
          {
            order_id: order.id,
            created_by: "user_1",
            items: [
              {
                id: order.items![0].id,
                quantity: 1,
              },
            ],
            no_notification: false,
            location_id: undefined,
          }

        const worflow = createOrderFulfillmentWorkflow(container)
        worflow.addAction("fail", {
          invoke: () => {
            throw new Error("Fulfillment failed")
          },
        })

        await worflow
          .run({
            input: createOrderFulfillmentData,
          })
          .catch(() => void 0)

        worflow.deleteAction("fail")

        await worflow.run({
          input: createOrderFulfillmentData,
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

        const [orderFulfill] = await remoteQuery(remoteQueryObject)

        expect(orderFulfill.fulfillments).toHaveLength(1)
        expect(orderFulfill.items[0].detail.fulfilled_quantity).toEqual(1)

        const inventoryModule = container.resolve(
          ModuleRegistrationName.INVENTORY
        )
        const reservation = await inventoryModule.listReservationItems({
          line_item_id: order.items![0].id,
        })
        expect(reservation).toHaveLength(0)

        const stockAvailability = await inventoryModule.retrieveStockedQuantity(
          inventoryItem.id,
          [location.id]
        )
        expect(stockAvailability).toEqual(1)
      })
    })
  },
})
