import { createShippingOptionsWorkflow } from "@medusajs/core-flows"
import {
  FulfillmentWorkflow,
  IOrderModuleService,
  IRegionModuleService,
  IStockLocationService,
  StockLocationDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

const providerId = "manual_test-provider"
export async function prepareDataFixtures({ container }) {
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

  await remoteLink.create([
    {
      [Modules.STOCK_LOCATION]: {
        stock_location_id: location.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: "manual_test-provider",
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
    inventoryItem,
  }
}

export async function createOrderFixture({
  container,
  product,
  location,
  inventoryItem,
}) {
  const orderService: IOrderModuleService = container.resolve(
    ModuleRegistrationName.ORDER
  )

  let order = await orderService.createOrders({
    region_id: "test_region_id",
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
  await inventoryModule.createReservationItems([
    {
      line_item_id: order.items![0].id,
      inventory_item_id: inventoryItem.id,
      location_id: location.id,
      quantity: order.items![0].quantity,
    },
  ])

  order = await orderService.retrieveOrder(order.id, {
    relations: ["items"],
  })

  return order
}
