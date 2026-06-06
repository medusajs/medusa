import { createShippingOptionsWorkflow } from "@zjedene-medusa/core-flows"
import {
  FulfillmentWorkflow,
  IOrderModuleService,
  IRegionModuleService,
  IStockLocationService,
  StockLocationDTO,
} from "@zjedene-medusa/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/utils"

const providerId = "manual_test-provider"
const providerIdCalculated = "manual-calculated_test-provider-calculated"

export async function prepareDataFixtures({ container }) {
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const stockLocationModule: IStockLocationService = container.resolve(
    Modules.STOCK_LOCATION
  )
  const pricingModule = container.resolve(Modules.PRICING)
  const productModule = container.resolve(Modules.PRODUCT)
  const inventoryModule = container.resolve(Modules.INVENTORY)
  const customerService = container.resolve(Modules.CUSTOMER)

  const customer = await customerService.createCustomers({
    email: "foo@bar.com",
  })

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
    Modules.REGION
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

  const priceSets = await pricingModule.createPriceSets([
    {
      prices: [
        {
          amount: 10,
          region_id: region.id,
          currency_code: "usd",
        },
      ],
    },
  ])

  const [product] = await productModule.createProducts([
    {
      title: "Test product",
      status: ProductStatus.PUBLISHED,
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
      stocked_quantity: 10,
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
    {
      [Modules.PRODUCT]: {
        variant_id: product.variants[0].id,
      },
      [Modules.PRICING]: {
        price_set_id: priceSets[0].id,
      },
    },
  ])

  await remoteLink.create([
    {
      [Modules.STOCK_LOCATION]: {
        stock_location_id: location.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: providerId,
      },
    },

    {
      [Modules.STOCK_LOCATION]: {
        stock_location_id: location.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_provider_id: providerIdCalculated,
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

  const shippingOptionCalculatedData: FulfillmentWorkflow.CreateShippingOptionsWorkflowInput =
    {
      name: "Calculated shipping option",
      service_zone_id: serviceZone.id,
      shipping_profile_id: shippingProfile.id,
      provider_id: providerIdCalculated,
      price_type: "calculated",
      type: {
        label: "Test type",
        description: "Test description",
        code: "test-code",
      },
      rules: [],
    }

  const { result } = await createShippingOptionsWorkflow(container).run({
    input: [shippingOptionData, shippingOptionCalculatedData],
  })

  const remoteQueryObject = remoteQueryObjectFromString({
    entryPoint: "shipping_option",
    variables: {
      id: result.map((r) => r.id),
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

  const shippingOptions = await remoteQuery(remoteQueryObject)
  return {
    shippingOption: shippingOptions.find((s) => s.price_type === "flat"),
    shippingOptionCalculated: shippingOptions.find(
      (s) => s.price_type === "calculated"
    ),
    region,
    salesChannel,
    location,
    product,
    customer,
    inventoryItem,
  }
}

export async function createOrderFixture({
  container,
  product,
  location,
  inventoryItem,
  region,
  salesChannel,
  customer,
  overrides,
}: {
  container: any
  product: any
  location: any
  inventoryItem: any
  salesChannel?: any
  customer?: any
  region?: any
  overrides?: { quantity?: number }
}) {
  const orderService: IOrderModuleService = container.resolve(Modules.ORDER)

  let order = await orderService.createOrders({
    region_id: region?.id || "test_region_id",
    email: customer?.email || "foo@bar.com",
    items: [
      {
        title: "Custom Item 2",
        variant_sku: product.variants[0].sku,
        variant_title: product.variants[0].title,
        quantity: overrides?.quantity ?? 1,
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
    sales_channel_id: salesChannel?.id || "test",
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
    customer_id: customer?.id || "joe",
  })

  const inventoryModule = container.resolve(Modules.INVENTORY)
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
