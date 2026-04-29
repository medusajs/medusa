import {
  addToCartWorkflow,
  beginOrderEditOrderWorkflow,
  completeCartWorkflow,
  confirmOrderEditRequestWorkflow,
  createCartWorkflow,
  createPaymentCollectionForCartWorkflow,
  createPaymentSessionsWorkflow,
  getOrderDetailWorkflow,
  listShippingOptionsForCartWorkflow,
  orderEditAddNewItemWorkflow,
  processPaymentWorkflow,
} from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  ICartModuleService,
  ICustomerModuleService,
  IEventBusModuleService,
  IFulfillmentModuleService,
  IInventoryService,
  IPaymentModuleService,
  IPricingModuleService,
  IProductModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
  IStockLocationService,
  Message,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  Modules,
  PaymentCollectionStatus,
  ProductStatus,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { seedStorefrontDefaults } from "../../../../helpers/seed-storefront-defaults"
import { createAuthenticatedCustomer } from "../../../helpers/create-authenticated-customer"

jest.setTimeout(200000)

const env = {}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Carts workflows", () => {
      let appContainer
      let cartModuleService: ICartModuleService
      let regionModuleService: IRegionModuleService
      let scModuleService: ISalesChannelModuleService
      let customerModule: ICustomerModuleService
      let productModule: IProductModuleService
      let pricingModule: IPricingModuleService
      let paymentModule: IPaymentModuleService
      let stockLocationModule: IStockLocationService
      let inventoryModule: IInventoryService
      let fulfillmentModule: IFulfillmentModuleService
      let remoteLink, remoteQuery, query
      let storeHeaders
      let salesChannel
      let defaultRegion
      let customer, storeHeadersWithCustomer
      let setPricingContextHook: any
      let eventBus: IEventBusModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        cartModuleService = appContainer.resolve(Modules.CART)
        regionModuleService = appContainer.resolve(Modules.REGION)
        scModuleService = appContainer.resolve(Modules.SALES_CHANNEL)
        customerModule = appContainer.resolve(Modules.CUSTOMER)
        productModule = appContainer.resolve(Modules.PRODUCT)
        pricingModule = appContainer.resolve(Modules.PRICING)
        paymentModule = appContainer.resolve(Modules.PAYMENT)
        eventBus = appContainer.resolve(Modules.EVENT_BUS)
        fulfillmentModule = appContainer.resolve(Modules.FULFILLMENT)
        inventoryModule = appContainer.resolve(Modules.INVENTORY)
        stockLocationModule = appContainer.resolve(Modules.STOCK_LOCATION)
        remoteLink = appContainer.resolve(ContainerRegistrationKeys.REMOTE_LINK)
        remoteQuery = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )
        query = appContainer.resolve(ContainerRegistrationKeys.QUERY)

        createCartWorkflow.hooks.setPricingContext(
          (input) => {
            if (setPricingContextHook) {
              return setPricingContextHook(input)
            }
          },
          () => {}
        )
        addToCartWorkflow.hooks.setPricingContext(
          (input) => {
            if (setPricingContextHook) {
              return setPricingContextHook(input)
            }
          },
          () => {}
        )
        listShippingOptionsForCartWorkflow.hooks.setPricingContext(
          (input) => {
            if (setPricingContextHook) {
              return setPricingContextHook(input)
            }
          },
          () => {}
        )
      })

      beforeEach(async () => {
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        const result = await createAuthenticatedCustomer(api, storeHeaders, {
          first_name: "tony",
          last_name: "stark",
          email: "tony@test-industries.com",
        })

        customer = result.customer
        storeHeadersWithCustomer = {
          headers: {
            ...storeHeaders.headers,
            authorization: `Bearer ${result.jwt}`,
          },
        }

        const { region } = await seedStorefrontDefaults(appContainer, "dkk")

        defaultRegion = region

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "test sales channel", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel
      })

      describe("CompleteCartWorkflow", () => {
        it("should complete cart with custom item", async () => {
          const salesChannel = await scModuleService.createSalesChannels({
            name: "Webshop",
          })

          const location = await stockLocationModule.createStockLocations({
            name: "Warehouse",
          })

          const region = await regionModuleService.createRegions({
            name: "US",
            currency_code: "usd",
          })

          let cart = await cartModuleService.createCarts({
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
            region_id: region.id,
          })

          await remoteLink.create([
            {
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: salesChannel.id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
            },
          ])

          cart = await cartModuleService.retrieveCart(cart.id, {
            select: ["id", "region_id", "currency_code", "sales_channel_id"],
          })

          await addToCartWorkflow(appContainer).run({
            input: {
              items: [
                {
                  title: "Test item",
                  subtitle: "Test subtitle",
                  thumbnail: "some-url",
                  requires_shipping: false,
                  is_discountable: false,
                  is_tax_inclusive: false,
                  unit_price: 3000,
                  metadata: {
                    foo: "bar",
                  },
                  quantity: 1,
                },
                {
                  title: "zero price item",
                  subtitle: "zero price item",
                  thumbnail: "some-url",
                  requires_shipping: false,
                  is_discountable: false,
                  is_tax_inclusive: false,
                  unit_price: 0,
                  quantity: 1,
                },
              ],
              cart_id: cart.id,
            },
          })

          cart = await cartModuleService.retrieveCart(cart.id, {
            relations: ["items"],
          })

          await createPaymentCollectionForCartWorkflow(appContainer).run({
            input: {
              cart_id: cart.id,
            },
          })

          const [paymentCollection] =
            await paymentModule.listPaymentCollections({})

          await createPaymentSessionsWorkflow(appContainer).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default",
              context: {},
              data: {},
            },
          })

          await completeCartWorkflow(appContainer).run({
            input: {
              id: cart.id,
            },
          })

          const { data } = await query.graph({
            entity: "cart",
            filters: {
              id: cart.id,
            },
            fields: ["id", "currency_code", "completed_at", "items.*"],
          })

          expect(data[0]).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              completed_at: expect.any(Date),
              items: [
                {
                  cart_id: cart.id,
                  compare_at_unit_price: null,
                  created_at: expect.any(Date),
                  deleted_at: null,
                  id: expect.any(String),
                  is_discountable: false,
                  is_giftcard: false,
                  is_tax_inclusive: false,
                  is_custom_price: true,
                  metadata: {
                    foo: "bar",
                  },
                  product_collection: null,
                  product_description: null,
                  product_handle: null,
                  product_id: null,
                  product_subtitle: null,
                  product_title: null,
                  product_type: null,
                  product_type_id: null,
                  quantity: 1,
                  raw_compare_at_unit_price: null,
                  raw_unit_price: {
                    precision: 20,
                    value: "3000",
                  },
                  requires_shipping: false,
                  subtitle: "Test subtitle",
                  thumbnail: "some-url",
                  title: "Test item",
                  unit_price: 3000,
                  updated_at: expect.any(Date),
                  variant_barcode: null,
                  variant_id: null,
                  variant_option_values: null,
                  variant_sku: null,
                  variant_title: null,
                },
                expect.objectContaining({
                  title: "zero price item",
                  subtitle: "zero price item",
                  is_custom_price: true,
                  unit_price: 0,
                }),
              ],
            })
          )
        })

        it("should complete cart reserving inventory from available locations", async () => {
          const salesChannel = await scModuleService.createSalesChannels({
            name: "Webshop",
          })

          const location = await stockLocationModule.createStockLocations({
            name: "Warehouse",
          })

          const location2 = await stockLocationModule.createStockLocations({
            name: "Side Warehouse",
          })

          const [product] = await productModule.createProducts([
            {
              title: "Test product",
              status: ProductStatus.PUBLISHED,
              variants: [
                {
                  title: "Test variant",
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
              stocked_quantity: 1,
              reserved_quantity: 0,
            },
          ])

          await inventoryModule.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: location2.id,
              stocked_quantity: 1,
              reserved_quantity: 0,
            },
          ])

          const priceSet = await pricingModule.createPriceSets({
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
            ],
          })

          await pricingModule.createPricePreferences({
            attribute: "currency_code",
            value: "usd",
            is_tax_inclusive: true,
          })

          await remoteLink.create([
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSet.id,
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
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: salesChannel.id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location2.id,
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

          // complete 2 carts
          for (let i = 1; i <= 2; i++) {
            const cart = await cartModuleService.createCarts({
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
            })

            await addToCartWorkflow(appContainer).run({
              input: {
                items: [
                  {
                    variant_id: product.variants[0].id,
                    quantity: 1,
                    requires_shipping: false,
                  },
                ],
                cart_id: cart.id,
              },
            })

            await createPaymentCollectionForCartWorkflow(appContainer).run({
              input: {
                cart_id: cart.id,
              },
            })

            const [payCol] = await remoteQuery(
              remoteQueryObjectFromString({
                entryPoint: "cart_payment_collection",
                variables: { filters: { cart_id: cart.id } },
                fields: ["payment_collection_id"],
              })
            )

            await createPaymentSessionsWorkflow(appContainer).run({
              input: {
                payment_collection_id: payCol.payment_collection_id,
                provider_id: "pp_system_default",
                context: {},
                data: {},
              },
            })

            await completeCartWorkflow(appContainer).run({
              input: {
                id: cart.id,
              },
            })
          }

          const reservations = await api.get(
            `/admin/reservations`,
            adminHeaders
          )

          const locations = reservations.data.reservations.map(
            (r) => r.location_id
          )

          expect(locations).toEqual(
            expect.arrayContaining([location.id, location2.id])
          )
        })

        it("should complete cart when payment webhook is called first and payment has auto-capture on", async () => {
          const salesChannel = await scModuleService.createSalesChannels({
            name: "Webshop",
          })

          const location = await stockLocationModule.createStockLocations({
            name: "Warehouse",
          })

          const [product] = await productModule.createProducts([
            {
              title: "Test product",
              status: ProductStatus.PUBLISHED,
              variants: [
                {
                  title: "Test variant",
                  manage_inventory: false,
                },
              ],
            },
          ])

          const priceSet = await pricingModule.createPriceSets({
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
            ],
          })

          await pricingModule.createPricePreferences({
            attribute: "currency_code",
            value: "usd",
            has_tax_inclusive: true,
          })

          await remoteLink.create([
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSet.id,
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
          ])

          // create cart
          const cart = await cartModuleService.createCarts({
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
          })

          await addToCartWorkflow(appContainer).run({
            input: {
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                  requires_shipping: false,
                },
              ],
              cart_id: cart.id,
            },
          })

          await createPaymentCollectionForCartWorkflow(appContainer).run({
            input: {
              cart_id: cart.id,
            },
          })

          const [payCol] = await remoteQuery(
            remoteQueryObjectFromString({
              entryPoint: "cart_payment_collection",
              variables: { filters: { cart_id: cart.id } },
              fields: ["payment_collection_id"],
            })
          )

          const { result: paymentSession } =
            await createPaymentSessionsWorkflow(appContainer).run({
              input: {
                payment_collection_id: payCol.payment_collection_id,
                provider_id: "pp_system_default",
                context: {},
                data: {},
              },
            })

          // payment webhook is triggered before complete cart workflow
          await processPaymentWorkflow(appContainer).run({
            input: {
              action: "captured",
              data: {
                session_id: paymentSession.id,
                amount: 3000,
              },
            },
          })

          // call complete cart workflow after
          const { result: order } = await completeCartWorkflow(
            appContainer
          ).run({
            input: {
              id: cart.id,
            },
          })

          const { result: fullOrder } = await getOrderDetailWorkflow(
            appContainer
          ).run({
            input: {
              fields: ["*"],
              order_id: order.id,
            },
          })

          expect(fullOrder.payment_status).toBe("captured")
          expect(fullOrder.payment_collections[0].authorized_amount).toBe(3000)
          expect(fullOrder.payment_collections[0].captured_amount).toBe(3000)
          expect(fullOrder.payment_collections[0].status).toBe("completed")
        })

        it("should refund payment when payment webhook is called first and payment has auto-capture on but the completion fails", async () => {
          const salesChannel = await scModuleService.createSalesChannels({
            name: "Webshop",
          })

          const location = await stockLocationModule.createStockLocations({
            name: "Warehouse",
          })

          const [product] = await productModule.createProducts([
            {
              title: "Test product",
              status: ProductStatus.PUBLISHED,
              variants: [
                {
                  title: "Test variant",
                  manage_inventory: false,
                },
              ],
            },
          ])

          const priceSet = await pricingModule.createPriceSets({
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
            ],
          })

          await pricingModule.createPricePreferences({
            attribute: "currency_code",
            value: "usd",
            is_tax_inclusive: true,
          })

          await remoteLink.create([
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSet.id,
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
          ])

          // create cart
          const cart = await cartModuleService.createCarts({
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
          })

          await addToCartWorkflow(appContainer).run({
            input: {
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                  requires_shipping: false,
                },
              ],
              cart_id: cart.id,
            },
          })

          await createPaymentCollectionForCartWorkflow(appContainer).run({
            input: {
              cart_id: cart.id,
            },
          })

          const [payCol] = await remoteQuery(
            remoteQueryObjectFromString({
              entryPoint: "cart_payment_collection",
              variables: { filters: { cart_id: cart.id } },
              fields: ["payment_collection_id"],
            })
          )

          const { result: paymentSession } =
            await createPaymentSessionsWorkflow(appContainer).run({
              input: {
                payment_collection_id: payCol.payment_collection_id,
                provider_id: "pp_system_default",
                context: {},
                data: {},
              },
            })

          let validateHook: Function | undefined = () => {
            throw new Error("cart complete failed")
          }
          completeCartWorkflow.hooks.validate(() => {
            if (validateHook) {
              validateHook()
            }
          })

          // payment webhook is triggered before complete cart workflow
          await processPaymentWorkflow(appContainer).run({
            input: {
              action: "captured",
              data: {
                session_id: paymentSession.id,
                amount: 3000,
              },
            },
          })

          validateHook = undefined

          const paymentCollectionQuery = await query.graph({
            entity: "payment_collection",
            filters: {
              id: paymentSession.payment_collection_id,
            },
            fields: [
              "*",
              "payment_sessions.*",
              "payments.*",
              "payments.captures.*",
              "payments.refunds.*",
            ],
          })

          // expects the payment to be refunded and a new payment session to be created
          expect(paymentCollectionQuery.data[0].payments[0]).toEqual(
            expect.objectContaining({
              amount: 3000,
              payment_session_id: paymentSession.id,
              refunds: [
                expect.objectContaining({
                  note: "Refunded due to cart completion failure",
                  amount: 3000,
                }),
              ],
              captures: [
                expect.objectContaining({
                  amount: 3000,
                }),
              ],
            })
          )

          const sessions = paymentCollectionQuery.data[0].payment_sessions
          expect(sessions).toHaveLength(1)

          expect(sessions[0].id).toBeDefined()
          expect(sessions[0].id).not.toBe(paymentSession.id)
          expect(sessions[0].status).toBe("pending")
        })

        it("should complete cart when payment webhook and storefront are called in simultaneously", async () => {
          const salesChannel = await scModuleService.createSalesChannels({
            name: "Webshop",
          })

          const location = await stockLocationModule.createStockLocations({
            name: "Warehouse",
          })

          const [product] = await productModule.createProducts([
            {
              title: "Test product",
              status: ProductStatus.PUBLISHED,
              variants: [
                {
                  title: "Test variant",
                  manage_inventory: false,
                },
              ],
            },
          ])

          const priceSet = await pricingModule.createPriceSets({
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
            ],
          })

          await pricingModule.createPricePreferences({
            attribute: "currency_code",
            value: "usd",
            has_tax_inclusive: true,
          })

          await remoteLink.create([
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSet.id,
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
          ])

          // create cart
          const cart = await cartModuleService.createCarts({
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
          })

          await addToCartWorkflow(appContainer).run({
            input: {
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                  requires_shipping: false,
                },
              ],
              cart_id: cart.id,
            },
          })

          await createPaymentCollectionForCartWorkflow(appContainer).run({
            input: {
              cart_id: cart.id,
            },
          })

          const [payCol] = await remoteQuery(
            remoteQueryObjectFromString({
              entryPoint: "cart_payment_collection",
              variables: { filters: { cart_id: cart.id } },
              fields: ["payment_collection_id"],
            })
          )

          const { result: paymentSession } =
            await createPaymentSessionsWorkflow(appContainer).run({
              input: {
                payment_collection_id: payCol.payment_collection_id,
                provider_id: "pp_system_default",
                context: {},
                data: {},
              },
            })

          const [{ result: order }] = await Promise.all([
            completeCartWorkflow(appContainer).run({
              input: {
                id: cart.id,
              },
            }),
            processPaymentWorkflow(appContainer).run({
              input: {
                action: "captured",
                data: {
                  session_id: paymentSession.id,
                  amount: 3000,
                },
              },
            }),
          ])

          await new Promise((resolve) => setTimeout(resolve, 100))

          const { result: fullOrder } = await getOrderDetailWorkflow(
            appContainer
          ).run({
            input: {
              fields: ["*"],
              order_id: order.id,
            },
          })

          expect(fullOrder.payment_status).toBe("captured")
          expect(fullOrder.payment_collections[0].authorized_amount).toBe(3000)
          expect(fullOrder.payment_collections[0].captured_amount).toBe(3000)
          expect(fullOrder.payment_collections[0].status).toBe("completed")
        })

        it("should clear events when complete cart fails after emitting events", async () => {
          const salesChannel = await scModuleService.createSalesChannels({
            name: "Webshop",
          })

          const location = await stockLocationModule.createStockLocations({
            name: "Warehouse",
          })

          const region = await regionModuleService.createRegions({
            name: "US",
            currency_code: "usd",
          })

          let cart = await cartModuleService.createCarts({
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
            region_id: region.id,
          })

          await remoteLink.create([
            {
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: salesChannel.id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
            },
          ])

          cart = await cartModuleService.retrieveCart(cart.id, {
            select: ["id", "region_id", "currency_code", "sales_channel_id"],
          })

          await addToCartWorkflow(appContainer).run({
            input: {
              items: [
                {
                  title: "Test item",
                  subtitle: "Test subtitle",
                  thumbnail: "some-url",
                  requires_shipping: false,
                  is_discountable: false,
                  is_tax_inclusive: false,
                  unit_price: 3000,
                  metadata: {
                    foo: "bar",
                  },
                  quantity: 1,
                },
                {
                  title: "zero price item",
                  subtitle: "zero price item",
                  thumbnail: "some-url",
                  requires_shipping: false,
                  is_discountable: false,
                  is_tax_inclusive: false,
                  unit_price: 0,
                  quantity: 1,
                },
              ],
              cart_id: cart.id,
            },
          })

          cart = await cartModuleService.retrieveCart(cart.id, {
            relations: ["items"],
          })

          await createPaymentCollectionForCartWorkflow(appContainer).run({
            input: {
              cart_id: cart.id,
            },
          })

          const [paymentCollection] =
            await paymentModule.listPaymentCollections({})

          await createPaymentSessionsWorkflow(appContainer).run({
            input: {
              payment_collection_id: paymentCollection.id,
              provider_id: "pp_system_default",
              context: {},
              data: {},
            },
          })

          let grouppedEventBefore: Message[] = []
          let eventGroupId!: string

          /**
           * Register order.placed listener to trigger the event group
           * registration and be able to check the event group during
           * the workflow execution against it after compensation
           */

          eventBus.subscribe("order.placed", async () => {
            // noop
          })

          const workflow = completeCartWorkflow(appContainer)

          workflow.addAction("throw", {
            invoke: async function failStep({ context }) {
              eventGroupId = context!.eventGroupId!
              grouppedEventBefore = (
                (eventBus as any).groupedEventsMap_ as Map<string, any>
              ).get(context!.eventGroupId!)

              throw new Error(
                `Failed to do something before ending complete cart workflow`
              )
            },
          })

          const { errors } = await workflow.run({
            input: {
              id: cart.id,
            },
            throwOnError: false,
          })

          const grouppedEventAfter =
            ((eventBus as any).groupedEventsMap_ as Map<string, any>).get(
              eventGroupId
            ) ?? []

          expect(grouppedEventBefore).toHaveLength(17)
          expect(grouppedEventAfter).toHaveLength(0) // events have been compensated

          expect(errors[0].error.message).toBe(
            "Failed to do something before ending complete cart workflow"
          )
        })

        it("should avoid completing cart when order already exists", async () => {
          const salesChannel = await scModuleService.createSalesChannels({
            name: "Webshop",
          })

          const location = await stockLocationModule.createStockLocations({
            name: "Warehouse",
          })

          const [product] = await productModule.createProducts([
            {
              title: "Test product",
              status: ProductStatus.PUBLISHED,
              variants: [
                {
                  title: "Test variant",
                  manage_inventory: false,
                },
              ],
            },
          ])

          const priceSet = await pricingModule.createPriceSets({
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
            ],
          })

          await pricingModule.createPricePreferences({
            attribute: "currency_code",
            value: "usd",
            has_tax_inclusive: true,
          })

          await remoteLink.create([
            {
              [Modules.PRODUCT]: {
                variant_id: product.variants[0].id,
              },
              [Modules.PRICING]: {
                price_set_id: priceSet.id,
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
          ])

          // create cart
          const cart = await cartModuleService.createCarts({
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
          })

          await addToCartWorkflow(appContainer).run({
            input: {
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                  requires_shipping: false,
                },
              ],
              cart_id: cart.id,
            },
          })

          await createPaymentCollectionForCartWorkflow(appContainer).run({
            input: {
              cart_id: cart.id,
            },
          })

          const [payCol] = await remoteQuery(
            remoteQueryObjectFromString({
              entryPoint: "cart_payment_collection",
              variables: { filters: { cart_id: cart.id } },
              fields: ["payment_collection_id"],
            })
          )

          await createPaymentSessionsWorkflow(appContainer).run({
            input: {
              payment_collection_id: payCol.payment_collection_id,
              provider_id: "pp_system_default",
              context: {},
              data: {},
            },
          })

          const {
            result: { id: orderId },
          } = await completeCartWorkflow(appContainer).run({
            input: {
              id: cart.id,
            },
          })

          await beginOrderEditOrderWorkflow(appContainer).run({
            input: {
              order_id: orderId,
            },
          })
          await orderEditAddNewItemWorkflow(appContainer).run({
            input: {
              order_id: orderId,
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
              ],
            },
          })
          await confirmOrderEditRequestWorkflow(appContainer).run({
            input: { order_id: orderId },
          })

          const orderPaymentCollections = await remoteQuery(
            remoteQueryObjectFromString({
              entryPoint: "order_payment_collection",
              variables: { filters: { order_id: orderId } },
              fields: ["payment_collection_id"],
            })
          )

          const [pendingPaymentCollection] = await remoteQuery(
            remoteQueryObjectFromString({
              entryPoint: "payment_collection",
              variables: {
                filters: {
                  id: orderPaymentCollections.map(
                    (orderPayCol) => orderPayCol.payment_collection_id
                  ),
                  status: PaymentCollectionStatus.NOT_PAID,
                },
              },
              fields: ["id"],
            })
          )

          const { result: paymentSession } =
            await createPaymentSessionsWorkflow(appContainer).run({
              input: {
                payment_collection_id: pendingPaymentCollection.id,
                provider_id: "pp_system_default",
                context: {},
                data: {},
              },
            })

          let completeCartCalled = false
          const workflow = processPaymentWorkflow(appContainer)

          workflow.addAction("track-complete-cart-step", {
            invoke: async function trackStep({ invoke }) {
              completeCartCalled = !!invoke["complete-cart-after-payment-step"]
            },
          })

          await workflow.run({
            input: {
              action: "captured",
              data: {
                session_id: paymentSession.id,
                amount: 3000,
              },
            },
          })

          expect(completeCartCalled).toBe(false)
        })
      })
    })
  },
})
