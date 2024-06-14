import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import {
  ICartModuleService,
  IFulfillmentModuleService,
  IInventoryServiceNext,
  IPricingModuleService,
  IProductModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
  IStockLocationServiceNext,
  ITaxModuleService,
} from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"
import { setupTaxStructure } from "../fixtures"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer
    let cartModuleService: ICartModuleService
    let regionModuleService: IRegionModuleService
    let scModuleService: ISalesChannelModuleService
    let productModule: IProductModuleService
    let pricingModule: IPricingModuleService
    let inventoryModule: IInventoryServiceNext
    let stockLocationModule: IStockLocationServiceNext
    let fulfillmentModule: IFulfillmentModuleService
    let taxModule: ITaxModuleService
    let remoteLink, remoteQuery

    beforeAll(async () => {
      appContainer = getContainer()
      cartModuleService = appContainer.resolve(ModuleRegistrationName.CART)
      regionModuleService = appContainer.resolve(ModuleRegistrationName.REGION)
      scModuleService = appContainer.resolve(
        ModuleRegistrationName.SALES_CHANNEL
      )
      productModule = appContainer.resolve(ModuleRegistrationName.PRODUCT)
      pricingModule = appContainer.resolve(ModuleRegistrationName.PRICING)
      inventoryModule = appContainer.resolve(ModuleRegistrationName.INVENTORY)
      stockLocationModule = appContainer.resolve(
        ModuleRegistrationName.STOCK_LOCATION
      )
      fulfillmentModule = appContainer.resolve(
        ModuleRegistrationName.FULFILLMENT
      )
      taxModule = appContainer.resolve(ModuleRegistrationName.TAX)
      remoteLink = appContainer.resolve(ContainerRegistrationKeys.REMOTE_LINK)
      remoteQuery = appContainer.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, appContainer)
    })

    describe("Draft Orders - Admin", () => {
      it("should create a draft order", async () => {
        const region = await regionModuleService.createRegions({
          name: "US",
          currency_code: "usd",
        })

        const salesChannel = await scModuleService.createSalesChannels({
          name: "Webshop",
        })

        const location = await stockLocationModule.createStockLocations({
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

        await setupTaxStructure(taxModule)

        const payload = {
          email: "oli@test.dk",
          region_id: region.id,
          sales_channel_id: salesChannel.id,
          currency_code: "usd",
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
          promo_codes: ["testytest"],
          items: [
            {
              variant_id: product.variants[0].id,
              quantity: 2,
            },
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
              unit_price: 2200,
              quantity: 1,
            },
          ],
          shipping_methods: [
            {
              name: "test-method",
              option_id: "test-option",
              amount: 100,
            },
          ],
        }

        const response = await api.post(
          "/admin/draft-orders",
          payload,
          adminHeaders
        )

        expect(response.data).toEqual(
          expect.objectContaining({
            draft_order: expect.objectContaining({
              status: "draft",
              version: 1,
              summary: expect.objectContaining({
                // TODO: add summary fields
              }),
              items: [
                expect.objectContaining({
                  title: "Test variant",
                  subtitle: "Test product",
                  product_title: "Test product",
                  product_description: null,
                  product_subtitle: null,
                  product_type: null,
                  product_collection: null,
                  product_handle: "test-product",
                  variant_sku: null,
                  variant_barcode: null,
                  variant_title: "Test variant",
                  variant_option_values: null,
                  requires_shipping: true,
                  is_discountable: true,
                  is_tax_inclusive: false,
                  raw_compare_at_unit_price: null,
                  raw_unit_price: expect.objectContaining({
                    value: "3000",
                  }),
                  metadata: {},
                  tax_lines: [],
                  adjustments: [],
                  unit_price: 3000,
                  quantity: 2,
                  raw_quantity: expect.objectContaining({
                    value: "2",
                  }),
                  detail: expect.objectContaining({
                    raw_quantity: expect.objectContaining({
                      value: "2",
                    }),
                    raw_fulfilled_quantity: expect.objectContaining({
                      value: "0",
                    }),
                    raw_shipped_quantity: expect.objectContaining({
                      value: "0",
                    }),
                    raw_return_requested_quantity: expect.objectContaining({
                      value: "0",
                    }),
                    raw_return_received_quantity: expect.objectContaining({
                      value: "0",
                    }),
                    raw_return_dismissed_quantity: expect.objectContaining({
                      value: "0",
                    }),
                    raw_written_off_quantity: expect.objectContaining({
                      value: "0",
                    }),
                    quantity: 2,
                    fulfilled_quantity: 0,
                    shipped_quantity: 0,
                    return_requested_quantity: 0,
                    return_received_quantity: 0,
                    return_dismissed_quantity: 0,
                    written_off_quantity: 0,
                  }),
                }),
                expect.objectContaining({
                  title: "Variant variable",
                  subtitle: "Another product",
                  raw_unit_price: expect.objectContaining({
                    value: "200",
                  }),
                  metadata: {
                    note: "reduced price",
                  },
                  unit_price: 200,
                  quantity: 1,
                  raw_quantity: expect.objectContaining({
                    value: "1",
                  }),
                }),
                expect.objectContaining({
                  title: "Custom Item",
                  variant_sku: "sku123",
                  variant_barcode: "barcode123",
                  variant_title: "Custom Item",
                  raw_unit_price: expect.objectContaining({
                    value: "2200",
                  }),
                  unit_price: 2200,
                  quantity: 1,
                  raw_quantity: expect.objectContaining({
                    value: "1",
                  }),
                }),
              ],
              shipping_address: expect.objectContaining({
                last_name: "Test",
                address_1: "Test",
                city: "Test",
                country_code: "US",
                postal_code: "12345",
                phone: "12345",
              }),
              billing_address: expect.objectContaining({
                first_name: "Test",
                last_name: "Test",
                address_1: "Test",
                city: "Test",
                country_code: "US",
                postal_code: "12345",
              }),
              shipping_methods: [
                expect.objectContaining({
                  name: "test-method",
                  raw_amount: expect.objectContaining({
                    value: "100",
                  }),
                  is_tax_inclusive: false,
                  shipping_option_id: null,
                  data: null,
                  tax_lines: [],
                  adjustments: [],
                  amount: 100,
                }),
              ],
            }),
          })
        )

        expect(response.status).toEqual(200)
      })
    })
  },
})
