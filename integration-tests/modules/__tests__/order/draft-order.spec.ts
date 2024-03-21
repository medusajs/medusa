import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import {
  ICartModuleService,
  ICustomerModuleService,
  IFulfillmentModuleService,
  IInventoryServiceNext,
  IPaymentModuleService,
  IPricingModuleService,
  IProductModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
  IStockLocationServiceNext,
} from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer
    let cartModuleService: ICartModuleService
    let regionModuleService: IRegionModuleService
    let scModuleService: ISalesChannelModuleService
    let customerModule: ICustomerModuleService
    let productModule: IProductModuleService
    let pricingModule: IPricingModuleService
    let paymentModule: IPaymentModuleService
    let inventoryModule: IInventoryServiceNext
    let stockLocationModule: IStockLocationServiceNext
    let fulfillmentModule: IFulfillmentModuleService
    let locationModule: IStockLocationServiceNext
    let remoteLink, remoteQuery

    let defaultRegion

    beforeAll(async () => {
      appContainer = getContainer()
      cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
      regionModuleService = appContainer.resolve(ModuleRegistrationName.REGION)
      scModuleService = appContainer.resolve(
        ModuleRegistrationName.SALES_CHANNEL
      )
      customerModule = appContainer.resolve(ModuleRegistrationName.CUSTOMER)
      productModule = appContainer.resolve(ModuleRegistrationName.PRODUCT)
      pricingModule = appContainer.resolve(ModuleRegistrationName.PRICING)
      paymentModule = appContainer.resolve(ModuleRegistrationName.PAYMENT)
      inventoryModule = appContainer.resolve(ModuleRegistrationName.INVENTORY)
      stockLocationModule = appContainer.resolve(
        ModuleRegistrationName.STOCK_LOCATION
      )
      fulfillmentModule = appContainer.resolve(
        ModuleRegistrationName.FULFILLMENT
      )
      locationModule = appContainer.resolve(
        ModuleRegistrationName.STOCK_LOCATION
      )
      remoteLink = appContainer.resolve(ContainerRegistrationKeys.REMOTE_LINK)
      remoteQuery = appContainer.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, appContainer)

      // Here, so we don't have to create a region for each test
      defaultRegion = await regionModuleService.create({
        name: "Default Region",
        currency_code: "dkk",
      })
    })

    describe("Draft Orders - Admin", () => {
      it("should create a draft order", async () => {
        const region = await regionModuleService.create({
          name: "US",
          currency_code: "usd",
        })

        const salesChannel = await scModuleService.create({
          name: "Webshop",
        })

        const location = await stockLocationModule.create({
          name: "Warehouse",
        })

        const [product, product_2] = await productModule.create([
          {
            title: "Test product",
            variants: [
              {
                title: "Test variant",
              },
            ],
          },
          {
            title: "Another product",
            variants: [
              {
                title: "Variant variable",
                manage_inventory: false,
              },
            ],
          },
        ])

        const inventoryItem = await inventoryModule.create({
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

        const [priceSet, priceSet_2] = await pricingModule.create([
          {
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
            ],
          },
          {
            prices: [
              {
                amount: 1000,
                currency_code: "usd",
              },
            ],
          },
        ])

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
            [Modules.PRODUCT]: {
              variant_id: product_2.variants[0].id,
            },
            [Modules.PRICING]: {
              price_set_id: priceSet_2.id,
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

        const payload = {
          email: "oli@test.dk",
          region_id: region.id,
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
          discounts: [{ code: "testytest" }],
          items: [
            /*
            {
              variant_id: product.variants[0].id,
              quantity: 2,
              metadata: {},
            },
            */
            {
              variant_id: product_2.variants[0].id,
              unit_price: 200,
              quantity: 1,
              metadata: {
                note: "reduced price",
              },
            },
            {
              title: "Custom Item",
              sku: "sku123",
              barcode: "barcode123",
              unit_price: 3000,
              quantity: 1,
              metadata: {},
            },
          ],
          currency_code: "USD",
          shipping_methods: [
            {
              name: "test-method",
              option_id: "test-option",
            },
          ],
        }

        const response = await api.post(
          "/admin/draft-orders",
          payload,
          adminHeaders
        )
        expect(response.status).toEqual(200)
      })
    })
  },
})
