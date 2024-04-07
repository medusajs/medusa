import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  ICartModuleService,
  ICustomerModuleService,
  IFulfillmentModuleService,
  IInventoryServiceNext,
  IOrderModuleService,
  IPaymentModuleService,
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

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  debug: true,
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
    let taxModule: ITaxModuleService
    let orderModule: IOrderModuleService
    let remoteLink, remoteQuery

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
      taxModule = appContainer.resolve(ModuleRegistrationName.TAX)
      remoteLink = appContainer.resolve(ContainerRegistrationKeys.REMOTE_LINK)
      remoteQuery = appContainer.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
      orderModule = appContainer.resolve(ModuleRegistrationName.ORDER)
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, appContainer)
    })

    describe("Orders - Admin", () => {
      it("should get an order", async () => {
        const created = await orderModule.create({
          region_id: "test_region_idclear",
          email: "foo@bar.com",
          items: [
            {
              title: "Item 1",
              subtitle: "Subtitle 1",
              thumbnail: "thumbnail1.jpg",
              quantity: 1,
              product_id: "product1",
              product_title: "Product 1",
              product_description: "Description 1",
              product_subtitle: "Product Subtitle 1",
              product_type: "Type 1",
              product_collection: "Collection 1",
              product_handle: "handle1",
              variant_id: "variant1",
              variant_sku: "SKU1",
              variant_barcode: "Barcode1",
              variant_title: "Variant 1",
              variant_option_values: {
                color: "Red",
                size: "Large",
              },
              requires_shipping: true,
              is_discountable: true,
              is_tax_inclusive: true,
              compare_at_unit_price: 10,
              unit_price: 8,
              tax_lines: [
                {
                  description: "Tax 1",
                  tax_rate_id: "tax_usa",
                  code: "code",
                  rate: 0.1,
                  provider_id: "taxify_master",
                },
              ],
              adjustments: [
                {
                  code: "VIP_10",
                  amount: 10,
                  description: "VIP discount",
                  promotion_id: "prom_123",
                  provider_id: "coupon_kings",
                },
              ],
            },
            {
              title: "Item 2",
              quantity: 2,
              unit_price: 5,
            },
            {
              title: "Item 3",
              quantity: 1,
              unit_price: 30,
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
          transactions: [
            {
              amount: 58,
              currency_code: "USD",
              reference: "payment",
              reference_id: "pay_123",
            },
          ],
          currency_code: "usd",
          customer_id: "joe",
        })

        const response = await api.get(
          "/admin/orders/" + created.id,
          adminHeaders
        )

        /*
        

        console.log(response.data)

        expect(response.data).toEqual({})

        expect(response.status).toEqual(200)
        */
      })
    })
  },
})
