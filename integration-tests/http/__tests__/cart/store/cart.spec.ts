import {
  createCartCreditLinesWorkflow,
  updateCartsStep,
} from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  Modules,
  PaymentSessionStatus,
  PriceListStatus,
  PriceListType,
  ProductStatus,
  PromotionRuleOperator,
  PromotionStatus,
  PromotionType,
} from "@medusajs/utils"
import { setTimeout } from "timers/promises"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"
import { createAuthenticatedCustomer } from "../../../../modules/helpers/create-authenticated-customer"
import { medusaTshirtProduct } from "../../../__fixtures__/product"
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

jest.setTimeout(100000)

const env = {}
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

const shippingAddressData = {
  address_1: "test address 1",
  address_2: "test address 2",
  city: "SF",
  country_code: "US",
  province: "CA",
  postal_code: "94016",
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer

    beforeAll(async () => {
      appContainer = getContainer()
    })

    describe("Store Carts API", () => {
      let storeHeaders
      let storeHeadersWithCustomer
      let region,
        noAutomaticRegion,
        product,
        salesChannel,
        cart,
        customer,
        promotion,
        shippingProfile,
        taxSeedData

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        const result = await createAuthenticatedCustomer(api, storeHeaders, {
          first_name: "tony",
          last_name: "stark",
          email: "tony@stark-industries.com",
        })

        customer = result.customer
        storeHeadersWithCustomer = {
          headers: {
            ...storeHeaders.headers,
            authorization: `Bearer ${result.jwt}`,
          },
        }

        shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "default", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        taxSeedData = await setupTaxStructure(appContainer.resolve(Modules.TAX))

        region = (
          await api.post(
            "/admin/regions",
            { name: "US", currency_code: "usd", countries: ["us"] },
            adminHeaders
          )
        ).data.region

        noAutomaticRegion = (
          await api.post(
            "/admin/regions",
            { name: "EUR", currency_code: "eur", automatic_taxes: false },
            adminHeaders
          )
        ).data.region

        product = (
          await api.post(
            "/admin/products",
            { ...medusaTshirtProduct, shipping_profile_id: shippingProfile.id },
            adminHeaders
          )
        ).data.product

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "Webshop", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel

        await api.post(
          "/admin/price-preferences",
          {
            attribute: "currency_code",
            value: "usd",
            is_tax_inclusive: true,
          },
          adminHeaders
        )

        promotion = (
          await api.post(
            `/admin/promotions`,
            {
              code: "PROMOTION_APPLIED",
              type: PromotionType.STANDARD,
              status: PromotionStatus.ACTIVE,
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "each",
                value: 100,
                max_quantity: 1,
                currency_code: "usd",
                target_rules: [
                  {
                    attribute: "items.product_id",
                    operator: "in",
                    values: [product.id],
                  },
                ],
              },
            },
            adminHeaders
          )
        ).data.promotion
      })

      describe("GET /store/carts/[id]", () => {
        it("should return 404 when trying to fetch a cart that does not exist", async () => {
          const response = await api
            .get(`/store/carts/fake`, storeHeadersWithCustomer)
            .catch((e) => e)

          expect(response.response.status).toEqual(404)
        })
      })

      describe("POST /store/carts", () => {
        it("should successfully create a cart", async () => {
          const response = await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeadersWithCustomer
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              currency_code: "usd",
              items: expect.arrayContaining([
                expect.objectContaining({
                  unit_price: 1500,
                  compare_at_unit_price: null,
                  is_tax_inclusive: true,
                  quantity: 1,
                  tax_lines: [
                    expect.objectContaining({
                      description: "CA Default Rate",
                      code: "CADEFAULT",
                      rate: 5,
                      provider_id: "system",
                    }),
                  ],
                  adjustments: [],
                }),
              ]),
            })
          )
        })

        it("should successfully create a cart with a line item with quantity and calculate prices based on the correct quantity", async () => {
          const productData = {
            title: "Medusa T-Shirt based quantity",
            handle: "t-shirt-with-quantity-prices",
            status: ProductStatus.PUBLISHED,
            options: [
              {
                title: "Size",
                values: ["S"],
              },
            ],
            variants: [
              {
                title: "S",
                sku: "SHIRT-S-BLACK-w-quantity-prices",
                options: {
                  Size: "S",
                },
                manage_inventory: false,
                prices: [
                  {
                    amount: 1500,
                    currency_code: "usd",
                    min_quantity: 1,
                    max_quantity: 4,
                  },
                  {
                    amount: 1000,
                    currency_code: "usd",
                    min_quantity: 5,
                    max_quantity: 10,
                  },
                ],
              },
            ],
          }

          const newProduct = await api.post(
            `/admin/products`,
            productData,
            adminHeaders
          )

          const variantId = newProduct.data.product.variants[0].id

          const newCart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: shippingAddressData,
                items: [{ variant_id: variantId, quantity: 6 }],
              },
              storeHeaders
            )
          ).data.cart

          expect(newCart).toEqual(
            expect.objectContaining({
              item_subtotal: 5714.285714285715,
              item_tax_total: 285.7142857142857,
              item_total: 6000,
              items: [
                expect.objectContaining({
                  quantity: 6,
                  title: "Medusa T-Shirt based quantity",
                  unit_price: 1000,
                  updated_at: expect.any(String),
                  variant_barcode: null,
                  variant_id: expect.any(String),
                  variant_sku: "SHIRT-S-BLACK-w-quantity-prices",
                  variant_title: "S",
                }),
              ],
              original_item_subtotal: 5714.285714285715,
              original_item_tax_total: 285.7142857142857,
              original_item_total: 6000,
              original_shipping_subtotal: 0,
              original_shipping_tax_total: 0,
              original_shipping_total: 0,
              original_tax_total: 285.7142857142857,
              original_total: 6000,
              shipping_subtotal: 0,
              shipping_tax_total: 0,
              shipping_total: 0,
              subtotal: 5714.285714285715,
              tax_total: 285.7142857142857,
              total: 6000,
            })
          )
        })

        it("should successfully create a cart with a line items for the same variant with different quantities and calculate prices based on the correct quantity", async () => {
          const productData = {
            title: "Medusa T-Shirt based quantity",
            handle: "t-shirt-with-quantity-prices",
            status: ProductStatus.PUBLISHED,
            options: [
              {
                title: "Size",
                values: ["S"],
              },
            ],
            variants: [
              {
                title: "S",
                sku: "SHIRT-S-BLACK-w-quantity-prices",
                options: {
                  Size: "S",
                },
                manage_inventory: false,
                prices: [
                  {
                    amount: 1500,
                    currency_code: "usd",
                    min_quantity: 1,
                    max_quantity: 4,
                  },
                  {
                    amount: 1000,
                    currency_code: "usd",
                    min_quantity: 5,
                    max_quantity: 10,
                  },
                ],
              },
            ],
          }

          const newProduct = await api.post(
            `/admin/products`,
            productData,
            adminHeaders
          )

          const variantId = newProduct.data.product.variants[0].id

          const newCart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: shippingAddressData,
                items: [{ variant_id: variantId, quantity: 6 }],
              },
              storeHeaders
            )
          ).data.cart

          expect(newCart).toEqual(
            expect.objectContaining({
              item_subtotal: 5714.285714285715,
              item_tax_total: 285.7142857142857,
              item_total: 6000,
              items: [
                expect.objectContaining({
                  quantity: 6,
                  title: "Medusa T-Shirt based quantity",
                  unit_price: 1000,
                  updated_at: expect.any(String),
                  variant_barcode: null,
                  variant_id: expect.any(String),
                  variant_sku: "SHIRT-S-BLACK-w-quantity-prices",
                  variant_title: "S",
                }),
              ],
              original_item_subtotal: 5714.285714285715,
              original_item_tax_total: 285.7142857142857,
              original_item_total: 6000,
              original_shipping_subtotal: 0,
              original_shipping_tax_total: 0,
              original_shipping_total: 0,
              original_tax_total: 285.7142857142857,
              original_total: 6000,
              shipping_subtotal: 0,
              shipping_tax_total: 0,
              shipping_total: 0,
              subtotal: 5714.285714285715,
              tax_total: 285.7142857142857,
              total: 6000,
            })
          )

          const updatedCart = (
            await api.post(
              `/store/carts/${newCart.id}/line-items`,
              {
                variant_id: variantId,
                quantity: 1,
                metadata: { custom: true },
              },
              storeHeaders
            )
          ).data.cart

          expect(updatedCart).toEqual(
            expect.objectContaining({
              item_subtotal: 7142.857142857143,
              item_tax_total: 357.14285714285717,
              item_total: 7500,
              items: expect.arrayContaining([
                expect.objectContaining({
                  quantity: 6,
                  title: "Medusa T-Shirt based quantity",
                  unit_price: 1000,
                  updated_at: expect.any(String),
                  variant_barcode: null,
                  variant_id: expect.any(String),
                  variant_sku: "SHIRT-S-BLACK-w-quantity-prices",
                  variant_title: "S",
                }),
                expect.objectContaining({
                  quantity: 1,
                  title: "Medusa T-Shirt based quantity",
                  unit_price: 1500,
                  updated_at: expect.any(String),
                  variant_barcode: null,
                  variant_id: expect.any(String),
                  variant_sku: "SHIRT-S-BLACK-w-quantity-prices",
                  variant_title: "S",
                }),
              ]),
              original_item_subtotal: 7142.857142857143,
              original_item_tax_total: 357.14285714285717,
              original_item_total: 7500,
              original_shipping_subtotal: 0,
              original_shipping_tax_total: 0,
              original_shipping_total: 0,
              original_tax_total: 357.14285714285717,
              original_total: 7500,
              shipping_subtotal: 0,
              shipping_tax_total: 0,
              shipping_total: 0,
              subtotal: 7142.857142857143,
              tax_total: 357.14285714285717,
              total: 7500,
            })
          )
        })

        describe("with sale price lists", () => {
          let priceList

          beforeEach(async () => {
            priceList = (
              await api.post(
                `/admin/price-lists`,
                {
                  title: "test price list",
                  description: "test",
                  status: PriceListStatus.ACTIVE,
                  type: PriceListType.SALE,
                  prices: [
                    {
                      amount: 350,
                      currency_code: "usd",
                      variant_id: product.variants[0].id,
                    },
                  ],
                },
                adminHeaders
              )
            ).data.price_list
          })

          it("should successfully create cart with price from price list", async () => {
            const response = await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: shippingAddressData,
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
              },
              storeHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.cart).toEqual(
              expect.objectContaining({
                currency_code: "usd",
                items: expect.arrayContaining([
                  expect.objectContaining({
                    unit_price: 350,
                    compare_at_unit_price: 1500,
                    is_tax_inclusive: true,
                    quantity: 1,
                    tax_lines: [
                      expect.objectContaining({
                        description: "CA Default Rate",
                        code: "CADEFAULT",
                        rate: 5,
                        provider_id: "system",
                      }),
                    ],
                    adjustments: [],
                  }),
                ]),
              })
            )
          })
        })
      })

      describe("POST /store/carts/:id/line-items", () => {
        let shippingOption, shippingOptionExpensive, stockLocation

        beforeEach(async () => {
          stockLocation = (
            await api.post(
              `/admin/stock-locations`,
              { name: "test location" },
              adminHeaders
            )
          ).data.stock_location

          await api.post(
            `/admin/stock-locations/${stockLocation.id}/sales-channels`,
            { add: [salesChannel.id] },
            adminHeaders
          )

          const shippingProfile = (
            await api.post(
              `/admin/shipping-profiles`,
              { name: `test-${stockLocation.id}`, type: "default" },
              adminHeaders
            )
          ).data.shipping_profile

          const fulfillmentSets = (
            await api.post(
              `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
              {
                name: `Test-${shippingProfile.id}`,
                type: "test-type",
              },
              adminHeaders
            )
          ).data.stock_location.fulfillment_sets

          const fulfillmentSet = (
            await api.post(
              `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
              {
                name: `Test-${shippingProfile.id}`,
                geo_zones: [
                  { type: "country", country_code: "it" },
                  { type: "country", country_code: "us" },
                ],
              },
              adminHeaders
            )
          ).data.fulfillment_set

          await api.post(
            `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
            { add: ["manual_test-provider"] },
            adminHeaders
          )

          const shippingOptionPayload = {
            name: `Shipping`,
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
            prices: [
              { currency_code: "usd", amount: 1000 },
              {
                currency_code: "usd",
                amount: 0,
                rules: [
                  {
                    attribute: "item_total",
                    operator: "gt",
                    value: 5000,
                  },
                ],
              },
            ],
            rules: [
              {
                attribute: "enabled_in_store",
                value: "true",
                operator: "eq",
              },
              {
                attribute: "is_return",
                value: "false",
                operator: "eq",
              },
            ],
          }

          shippingOption = (
            await api.post(
              `/admin/shipping-options`,
              shippingOptionPayload,
              adminHeaders
            )
          ).data.shipping_option

          shippingOptionExpensive = (
            await api.post(
              `/admin/shipping-options`,
              {
                ...shippingOptionPayload,
                prices: [
                  { currency_code: "usd", amount: 10000 },
                  {
                    currency_code: "usd",
                    amount: 5000,
                    rules: [
                      {
                        attribute: "item_total",
                        operator: "gt",
                        value: 5000,
                      },
                    ],
                  },
                ],
              },
              adminHeaders
            )
          ).data.shipping_option

          cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: shippingAddressData,
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                promo_codes: [promotion.code],
              },
              storeHeaders
            )
          ).data.cart
        })

        it("should add item to cart", async () => {
          let response = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              items: expect.arrayContaining([
                expect.objectContaining({
                  unit_price: 1500,
                  compare_at_unit_price: null,
                  is_tax_inclusive: true,
                  quantity: 2,
                  tax_lines: expect.arrayContaining([
                    expect.objectContaining({
                      description: "CA Default Rate",
                      code: "CADEFAULT",
                      rate: 5,
                      provider_id: "system",
                    }),
                  ]),
                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      code: "PROMOTION_APPLIED",
                      promotion_id: promotion.id,
                      amount: 100,
                    }),
                  ]),
                }),
              ]),
            })
          )
        })

        it("should add item to cart and calculate prices based on item quantity", async () => {
          const productData = {
            title: "Medusa T-Shirt based quantity",
            handle: "t-shirt-with-quantity-prices",
            status: ProductStatus.PUBLISHED,
            options: [
              {
                title: "Size",
                values: ["S"],
              },
            ],
            variants: [
              {
                title: "S",
                sku: "SHIRT-S-BLACK-w-quantity-prices",
                options: {
                  Size: "S",
                },
                manage_inventory: false,
                prices: [
                  {
                    amount: 1500,
                    currency_code: "usd",
                    min_quantity: 1,
                    max_quantity: 4,
                  },
                  {
                    amount: 1000,
                    currency_code: "usd",
                    min_quantity: 5,
                    max_quantity: 10,
                  },
                ],
              },
            ],
          }

          const newProduct = await api.post(
            `/admin/products`,
            productData,
            adminHeaders
          )

          const variantId = newProduct.data.product.variants[0].id

          const newCart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: shippingAddressData,
              },
              storeHeaders
            )
          ).data.cart

          /**
           * Add item to cart with quantity 1
           * in order to have the price calculated based on the price rule
           * with min_quantity 1 and max_quantity 4
           */

          let response = await api.post(
            `/store/carts/${newCart.id}/line-items`,
            {
              variant_id: variantId,
              quantity: 1,
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              billing_address: null,
              completed_at: null,
              created_at: expect.any(String),
              credit_line_subtotal: 0,
              credit_line_tax_total: 0,
              credit_line_total: 0,
              credit_lines: [],
              currency_code: "usd",
              customer_id: null,
              discount_subtotal: 0,
              discount_tax_total: 0,
              discount_total: 0,
              email: null,
              id: newCart.id,
              item_subtotal: 1428.5714285714287,
              item_tax_total: 71.42857142857143,
              item_total: 1500,
              items: [
                expect.objectContaining({
                  compare_at_unit_price: null,
                  created_at: expect.any(String),
                  id: expect.any(String),
                  is_tax_inclusive: true,
                  metadata: {},
                  product: expect.objectContaining({
                    categories: [],
                    collection_id: null,
                    id: expect.any(String),
                    tags: [],
                    type_id: null,
                  }),
                  product_collection: null,
                  product_description: null,
                  product_handle: "t-shirt-with-quantity-prices",
                  product_id: expect.any(String),
                  product_subtitle: null,
                  product_title: "Medusa T-Shirt based quantity",
                  product_type: null,
                  product_type_id: null,
                  quantity: 1,
                  requires_shipping: false,
                  tax_lines: [
                    {
                      code: "CADEFAULT",
                      description: "CA Default Rate",
                      id: expect.any(String),
                      provider_id: "system",
                      rate: 5,
                    },
                  ],
                  thumbnail: null,
                  title: "Medusa T-Shirt based quantity",
                  unit_price: 1500,
                  updated_at: expect.any(String),
                  variant_barcode: null,
                  variant_id: expect.any(String),
                  variant_sku: "SHIRT-S-BLACK-w-quantity-prices",
                  variant_title: "S",
                }),
              ],
              metadata: null,
              original_item_subtotal: 1428.5714285714287,
              original_item_tax_total: 71.42857142857143,
              original_item_total: 1500,
              original_shipping_subtotal: 0,
              original_shipping_tax_total: 0,
              original_shipping_total: 0,
              original_tax_total: 71.42857142857143,
              original_total: 1500,
              region: expect.objectContaining({
                automatic_taxes: true,
                countries: expect.any(Array),
                currency_code: "usd",
                id: expect.any(String),
                name: "US",
              }),
              region_id: expect.any(String),
              sales_channel_id: expect.any(String),
              shipping_address: expect.objectContaining({
                address_1: "test address 1",
                address_2: "test address 2",
                city: "SF",
                company: null,
                country_code: "US",
                first_name: null,
                id: expect.any(String),
                last_name: null,
                phone: null,
                postal_code: "94016",
                province: "CA",
              }),
              shipping_address_id: expect.any(String),
              shipping_methods: [],
              shipping_subtotal: 0,
              shipping_tax_total: 0,
              shipping_total: 0,
              subtotal: 1428.5714285714287,
              tax_total: 71.42857142857143,
              total: 1500,
              updated_at: expect.any(String),
            })
          )

          /**
           * Add item to cart with quantity 5
           * in order to have the price calculated based on the price rule
           * with min_quantity 5 and max_quantity 10
           */

          response = await api.post(
            `/store/carts/${newCart.id}/line-items`,
            {
              variant_id: variantId,
              quantity: 5,
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              billing_address: null,
              completed_at: null,
              created_at: expect.any(String),
              credit_line_subtotal: 0,
              credit_line_tax_total: 0,
              credit_line_total: 0,
              credit_lines: [],
              currency_code: "usd",
              customer_id: null,
              discount_subtotal: 0,
              discount_tax_total: 0,
              discount_total: 0,
              email: null,
              id: newCart.id,
              item_subtotal: 5714.285714285715,
              item_tax_total: 285.7142857142857,
              item_total: 6000,
              items: [
                expect.objectContaining({
                  adjustments: [],
                  compare_at_unit_price: null,
                  created_at: expect.any(String),
                  id: expect.any(String),
                  is_tax_inclusive: true,
                  metadata: {},
                  product: {
                    categories: [],
                    collection_id: null,
                    id: expect.any(String),
                    tags: [],
                    type_id: null,
                  },
                  product_collection: null,
                  product_description: null,
                  product_handle: "t-shirt-with-quantity-prices",
                  product_id: expect.any(String),
                  product_subtitle: null,
                  product_title: "Medusa T-Shirt based quantity",
                  product_type: null,
                  product_type_id: null,
                  quantity: 6,
                  requires_shipping: false,
                  tax_lines: [
                    {
                      code: "CADEFAULT",
                      description: "CA Default Rate",
                      id: expect.any(String),
                      provider_id: "system",
                      rate: 5,
                    },
                  ],
                  thumbnail: null,
                  title: "Medusa T-Shirt based quantity",
                  unit_price: 1000,
                  updated_at: expect.any(String),
                  variant_barcode: null,
                  variant_id: expect.any(String),
                  variant_sku: "SHIRT-S-BLACK-w-quantity-prices",
                  variant_title: "S",
                }),
              ],
              metadata: null,
              original_item_subtotal: 5714.285714285715,
              original_item_tax_total: 285.7142857142857,
              original_item_total: 6000,
              original_shipping_subtotal: 0,
              original_shipping_tax_total: 0,
              original_shipping_total: 0,
              original_tax_total: 285.7142857142857,
              original_total: 6000,
              promotions: [],
              region: {
                automatic_taxes: true,
                countries: expect.any(Array),
                currency_code: "usd",
                id: expect.any(String),
                name: "US",
              },
              region_id: expect.any(String),
              sales_channel_id: expect.any(String),
              shipping_address: {
                address_1: "test address 1",
                address_2: "test address 2",
                city: "SF",
                company: null,
                country_code: "US",
                first_name: null,
                id: expect.any(String),
                last_name: null,
                phone: null,
                postal_code: "94016",
                province: "CA",
              },
              shipping_address_id: expect.any(String),
              shipping_methods: [],
              shipping_subtotal: 0,
              shipping_tax_total: 0,
              shipping_total: 0,
              subtotal: 5714.285714285715,
              tax_total: 285.7142857142857,
              total: 6000,
              updated_at: expect.any(String),
            })
          )
        })

        it("should update a cart line item quantity and calculate prices based the new item quantity", async () => {
          const productData = {
            title: "Medusa T-Shirt based quantity",
            handle: "t-shirt-with-quantity-prices",
            status: ProductStatus.PUBLISHED,
            options: [
              {
                title: "Size",
                values: ["S"],
              },
            ],
            variants: [
              {
                title: "S",
                sku: "SHIRT-S-BLACK-w-quantity-prices",
                options: {
                  Size: "S",
                },
                manage_inventory: false,
                prices: [
                  {
                    amount: 1500,
                    currency_code: "usd",
                    min_quantity: 1,
                    max_quantity: 4,
                  },
                  {
                    amount: 1000,
                    currency_code: "usd",
                    min_quantity: 5,
                    max_quantity: 10,
                  },
                ],
              },
            ],
          }

          const newProduct = await api.post(
            `/admin/products`,
            productData,
            adminHeaders
          )

          const variantId = newProduct.data.product.variants[0].id

          const newCart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: shippingAddressData,
              },
              storeHeaders
            )
          ).data.cart

          /**
           * Add item to cart with quantity 1
           * in order to have the price calculated based on the price rule
           * with min_quantity 1 and max_quantity 4
           */

          let response = await api.post(
            `/store/carts/${newCart.id}/line-items`,
            {
              variant_id: variantId,
              quantity: 1,
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              item_subtotal: 1428.5714285714287,
              item_tax_total: 71.42857142857143,
              item_total: 1500,
              items: [
                expect.objectContaining({
                  quantity: 1,
                  title: "Medusa T-Shirt based quantity",
                  unit_price: 1500,
                  updated_at: expect.any(String),
                  variant_barcode: null,
                  variant_id: expect.any(String),
                  variant_sku: "SHIRT-S-BLACK-w-quantity-prices",
                  variant_title: "S",
                }),
              ],
              original_item_subtotal: 1428.5714285714287,
              original_item_tax_total: 71.42857142857143,
              original_item_total: 1500,
              original_shipping_subtotal: 0,
              original_shipping_tax_total: 0,
              original_shipping_total: 0,
              original_tax_total: 71.42857142857143,
              original_total: 1500,
              shipping_subtotal: 0,
              shipping_tax_total: 0,
              shipping_total: 0,
              subtotal: 1428.5714285714287,
              tax_total: 71.42857142857143,
              total: 1500,
            })
          )

          /**
           * update item quantity to 5
           * in order to have the price calculated based on the price rule
           * with min_quantity 5 and max_quantity 10
           */

          const itemId = response.data.cart.items[0].id
          response = await api
            .post(
              `/store/carts/${newCart.id}/line-items/${itemId}`,
              {
                quantity: 6,
              },
              storeHeaders
            )
            .catch((e) => {
              console.log(e.response.data)
              throw e
            })

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              item_subtotal: 5714.285714285715,
              item_tax_total: 285.7142857142857,
              item_total: 6000,
              items: [
                expect.objectContaining({
                  quantity: 6,
                  title: "Medusa T-Shirt based quantity",
                  unit_price: 1000,
                  updated_at: expect.any(String),
                  variant_barcode: null,
                  variant_id: expect.any(String),
                  variant_sku: "SHIRT-S-BLACK-w-quantity-prices",
                  variant_title: "S",
                }),
              ],
              original_item_subtotal: 5714.285714285715,
              original_item_tax_total: 285.7142857142857,
              original_item_total: 6000,
              original_shipping_subtotal: 0,
              original_shipping_tax_total: 0,
              original_shipping_total: 0,
              original_tax_total: 285.7142857142857,
              original_total: 6000,
              shipping_subtotal: 0,
              shipping_tax_total: 0,
              shipping_total: 0,
              subtotal: 5714.285714285715,
              tax_total: 285.7142857142857,
              total: 6000,
            })
          )
        })

        it("should remove promotions when promotion is no longer in active state", async () => {
          let responseBeforePromotionUpdate = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(responseBeforePromotionUpdate.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              items: expect.arrayContaining([
                expect.objectContaining({
                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      code: "PROMOTION_APPLIED",
                      promotion_id: promotion.id,
                      amount: 100,
                    }),
                  ]),
                }),
              ]),
            })
          )

          await api.post(
            `/admin/promotions/${promotion.id}`,
            { status: PromotionStatus.INACTIVE },
            adminHeaders
          )

          let responseAfterPromotionUpdate = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(responseAfterPromotionUpdate.status).toEqual(200)
          expect(responseAfterPromotionUpdate.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              items: expect.arrayContaining([
                expect.objectContaining({
                  adjustments: [],
                }),
                expect.objectContaining({
                  adjustments: [],
                }),
              ]),
            })
          )
        })

        describe("with custom shipping options prices", () => {
          beforeEach(async () => {
            cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  promo_codes: [promotion.code],
                },
                storeHeadersWithCustomer
              )
            ).data.cart
          })

          it("should update shipping method amount when cart totals change", async () => {
            let response = await api.post(
              `/store/carts/${cart.id}/shipping-methods`,
              { option_id: shippingOption.id },
              storeHeaders
            )

            expect(response.data.cart).toEqual(
              expect.objectContaining({
                id: cart.id,
                shipping_methods: expect.arrayContaining([
                  expect.objectContaining({
                    shipping_option_id: shippingOption.id,
                    amount: 1000,
                    is_tax_inclusive: true,
                  }),
                ]),
              })
            )

            response = await api.post(
              `/store/carts/${cart.id}/line-items`,
              {
                variant_id: product.variants[0].id,
                quantity: 100,
              },
              storeHeaders
            )

            expect(response.data.cart).toEqual(
              expect.objectContaining({
                id: cart.id,
                shipping_methods: expect.arrayContaining([
                  expect.objectContaining({
                    shipping_option_id: shippingOption.id,
                    amount: 0,
                    is_tax_inclusive: true,
                  }),
                ]),
              })
            )
          })

          it("should remove shipping methods when they are no longer valid for the cart", async () => {
            let response = await api.post(
              `/store/carts/${cart.id}/shipping-methods`,
              { option_id: shippingOption.id },
              storeHeaders
            )

            expect(response.data.cart).toEqual(
              expect.objectContaining({
                id: cart.id,
                shipping_methods: expect.arrayContaining([
                  expect.objectContaining({
                    shipping_option_id: shippingOption.id,
                    amount: 1000,
                    is_tax_inclusive: true,
                  }),
                ]),
              })
            )

            response = await api.post(
              `/store/carts/${cart.id}`,
              { region_id: noAutomaticRegion.id },
              storeHeaders
            )

            expect(response.data.cart).toEqual(
              expect.objectContaining({
                id: cart.id,
                shipping_methods: expect.arrayContaining([]),
              })
            )
          })

          it("should update payment collection upon changing shipping option", async () => {
            await api.post(
              `/store/carts/${cart.id}/shipping-methods`,
              { option_id: shippingOption.id },
              storeHeaders
            )

            await api.post(
              `/store/payment-collections`,
              { cart_id: cart.id },
              storeHeaders
            )

            const cartAfterCollection = (
              await api.get(`/store/carts/${cart.id}`, storeHeaders)
            ).data.cart

            expect(cartAfterCollection).toEqual(
              expect.objectContaining({
                id: cart.id,
                shipping_methods: expect.arrayContaining([
                  expect.objectContaining({
                    shipping_option_id: shippingOption.id,
                  }),
                ]),
                payment_collection: expect.objectContaining({
                  amount: 2398,
                }),
              })
            )

            await api.post(
              `/store/carts/${cart.id}/line-items`,
              {
                variant_id: product.variants[0].id,
                quantity: 100,
              },
              storeHeaders
            )

            let cartAfterExpensiveShipping = (
              await api.post(
                `/store/carts/${cart.id}/shipping-methods`,
                { option_id: shippingOptionExpensive.id },
                storeHeaders
              )
            ).data.cart

            expect(cartAfterExpensiveShipping).toEqual(
              expect.objectContaining({
                id: cartAfterExpensiveShipping.id,
                shipping_methods: expect.arrayContaining([
                  expect.objectContaining({
                    shipping_option_id: shippingOptionExpensive.id,
                    amount: 5000,
                  }),
                ]),
                payment_collection: expect.objectContaining({
                  amount: 156398,
                }),
              })
            )
          })
        })

        it("should add item to cart with tax lines multiple times", async () => {
          let response = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              items: expect.arrayContaining([
                expect.objectContaining({
                  unit_price: 1500,
                  compare_at_unit_price: null,
                  is_tax_inclusive: true,
                  title: "Medusa T-Shirt",
                  quantity: 2,
                  tax_lines: [
                    expect.objectContaining({
                      description: "CA Default Rate",
                      code: "CADEFAULT",
                      rate: 5,
                      provider_id: "system",
                    }),
                  ],
                }),
              ]),
            })
          )

          response = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[1].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              items: expect.arrayContaining([
                expect.objectContaining({
                  unit_price: 1500,
                  compare_at_unit_price: null,
                  is_tax_inclusive: true,
                  quantity: 2,
                  title: "Medusa T-Shirt",
                  tax_lines: [
                    expect.objectContaining({
                      description: "CA Default Rate",
                      code: "CADEFAULT",
                      rate: 5,
                      provider_id: "system",
                    }),
                  ],
                }),
                expect.objectContaining({
                  unit_price: 1500,
                  compare_at_unit_price: null,
                  is_tax_inclusive: true,
                  quantity: 1,
                  title: "Medusa T-Shirt",
                  tax_lines: [
                    expect.objectContaining({
                      description: "CA Default Rate",
                      code: "CADEFAULT",
                      rate: 5,
                      provider_id: "system",
                    }),
                  ],
                }),
              ]),
            })
          )
        })

        describe("with sale price lists", () => {
          beforeEach(async () => {
            await api.post(
              `/admin/price-lists`,
              {
                title: "test price list",
                description: "test",
                status: PriceListStatus.ACTIVE,
                type: PriceListType.SALE,
                prices: [
                  {
                    amount: 350,
                    currency_code: "usd",
                    variant_id: product.variants[0].id,
                  },
                ],
              },
              adminHeaders
            )

            const customerGroup = (
              await api.post(
                "/admin/customer-groups",
                { name: "VIP" },
                adminHeaders
              )
            ).data.customer_group

            await api.post(
              `/admin/customer-groups/${customerGroup.id}/customers`,
              {
                add: [customer.id],
              },
              adminHeaders
            )

            await api.post(
              `/admin/price-lists`,
              {
                title: "test price list",
                description: "test",
                status: PriceListStatus.ACTIVE,
                type: PriceListType.SALE,
                prices: [
                  {
                    amount: 200,
                    currency_code: "usd",
                    variant_id: product.variants[0].id,
                  },
                ],
                rules: {
                  "customer.groups.id": [customerGroup.id],
                },
              },
              adminHeaders
            )
          })

          it("should add price from price list and set compare_at_unit_price", async () => {
            let response = await api.post(
              `/store/carts/${cart.id}/line-items`,
              {
                variant_id: product.variants[0].id,
                quantity: 1,
              },
              storeHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.cart).toEqual(
              expect.objectContaining({
                id: cart.id,
                currency_code: "usd",
                items: expect.arrayContaining([
                  expect.objectContaining({
                    unit_price: 350,
                    compare_at_unit_price: 1500,
                    is_tax_inclusive: true,
                    quantity: 2,
                    tax_lines: expect.arrayContaining([
                      expect.objectContaining({
                        description: "CA Default Rate",
                        code: "CADEFAULT",
                        rate: 5,
                        provider_id: "system",
                      }),
                    ]),
                    adjustments: expect.arrayContaining([
                      expect.objectContaining({
                        id: expect.any(String),
                        code: "PROMOTION_APPLIED",
                        promotion_id: promotion.id,
                        amount: 100,
                      }),
                    ]),
                  }),
                ]),
              })
            )
          })

          it("should add price from price list associated to a customer group when customer rules match", async () => {
            const transferredCart = (
              await api.post(
                `/store/carts/${cart.id}/customer`,
                {},
                storeHeadersWithCustomer
              )
            ).data.cart

            expect(transferredCart).toEqual(
              expect.objectContaining({
                id: cart.id,
                items: expect.arrayContaining([
                  expect.objectContaining({
                    unit_price: 200,
                    compare_at_unit_price: 1500,
                    is_tax_inclusive: true,
                    quantity: 1,
                  }),
                ]),
              })
            )

            let response = await api.post(
              `/store/carts/${cart.id}/line-items`,
              {
                variant_id: product.variants[0].id,
                quantity: 1,
              },
              storeHeadersWithCustomer
            )

            expect(response.status).toEqual(200)
            expect(response.data.cart).toEqual(
              expect.objectContaining({
                id: cart.id,
                currency_code: "usd",
                items: expect.arrayContaining([
                  expect.objectContaining({
                    unit_price: 200,
                    compare_at_unit_price: 1500,
                    is_tax_inclusive: true,
                    quantity: 2,
                  }),
                ]),
              })
            )
          })
        })

        describe("with manage_inventory true", () => {
          let inventoryItem
          beforeEach(async () => {
            await api.post(
              `/admin/products/${product.id}/variants/${product.variants[0].id}`,
              { manage_inventory: true },
              adminHeaders
            )

            inventoryItem = (
              await api.post(
                `/admin/inventory-items`,
                { sku: "bottle" },
                adminHeaders
              )
            ).data.inventory_item
          })

          describe("with allow_backorder true", () => {
            beforeEach(async () => {
              await api.post(
                `/admin/products/${product.id}/variants/${product.variants[0].id}`,
                { allow_backorder: true },
                adminHeaders
              )
            })

            it("should add item to cart even if no inventory locations", async () => {
              let response = await api.post(
                `/store/carts/${cart.id}/line-items`,
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
                storeHeaders
              )

              expect(response.status).toEqual(200)
            })

            it("should add item to cart even if inventory is empty", async () => {
              await api.post(
                `/admin/inventory-items/${inventoryItem.id}/location-levels/batch`,
                { create: [{ location_id: stockLocation.id }] },
                adminHeaders
              )

              let response = await api.post(
                `/store/carts/${cart.id}/line-items`,
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
                storeHeaders
              )

              expect(response.status).toEqual(200)
            })
          })
        })
      })

      describe("POST /store/carts/:id/line-items/:id", () => {
        let item, customerGroup

        beforeEach(async () => {
          cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: shippingAddressData,
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
              },
              storeHeadersWithCustomer
            )
          ).data.cart

          item = cart.items[0]

          customerGroup = (
            await api.post(
              "/admin/customer-groups",
              { name: "VIP" },
              adminHeaders
            )
          ).data.customer_group

          await api.post(
            `/admin/customer-groups/${customerGroup.id}/customers`,
            {
              add: [customer.id],
            },
            adminHeaders
          )
        })

        it("should update cart's line item", async () => {
          let response = await api.post(
            `/store/carts/${cart.id}/line-items/${item.id}`,
            {
              quantity: 2,
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              items: expect.arrayContaining([
                expect.objectContaining({
                  unit_price: 1500,
                  quantity: 2,
                }),
              ]),
            })
          )

          await api.post(
            `/admin/price-lists`,
            {
              title: "test price list",
              description: "test",
              status: PriceListStatus.ACTIVE,
              type: PriceListType.SALE,
              prices: [
                {
                  amount: 200,
                  currency_code: "usd",
                  variant_id: product.variants[0].id,
                },
              ],
              rules: {
                "customer.groups.id": [customerGroup.id],
              },
            },
            adminHeaders
          )

          response = await api.post(
            `/store/carts/${cart.id}/line-items/${item.id}`,
            { quantity: 3 },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              items: expect.arrayContaining([
                expect.objectContaining({
                  unit_price: 200,
                  quantity: 3,
                }),
              ]),
            })
          )
        })
      })

      describe("POST /store/carts/:id/complete", () => {
        describe("should successfully complete cart", () => {
          beforeEach(async () => {
            const stockLocation = (
              await api.post(
                `/admin/stock-locations`,
                { name: "test location" },
                adminHeaders
              )
            ).data.stock_location

            await api.post(
              `/admin/stock-locations/${stockLocation.id}/sales-channels`,
              { add: [salesChannel.id] },
              adminHeaders
            )

            const fulfillmentSets = (
              await api.post(
                `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
                {
                  name: `Test-${shippingProfile.id}`,
                  type: "test-type",
                },
                adminHeaders
              )
            ).data.stock_location.fulfillment_sets

            const fulfillmentSet = (
              await api.post(
                `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
                {
                  name: `Test-${shippingProfile.id}`,
                  geo_zones: [{ type: "country", country_code: "US" }],
                },
                adminHeaders
              )
            ).data.fulfillment_set

            await api.post(
              `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
              { add: ["manual_test-provider"] },
              adminHeaders
            )

            const shippingOption = (
              await api.post(
                `/admin/shipping-options`,
                {
                  name: `Test shipping option ${fulfillmentSet.id}`,
                  service_zone_id: fulfillmentSet.service_zones[0].id,
                  shipping_profile_id: shippingProfile.id,
                  provider_id: "manual_test-provider",
                  price_type: "flat",
                  type: {
                    label: "Test type",
                    description: "Test description",
                    code: "test-code",
                  },
                  prices: [{ currency_code: "usd", amount: 1000 }],
                  rules: [],
                },
                adminHeaders
              )
            ).data.shipping_option

            cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: shippingAddressData,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  promo_codes: [promotion.code],
                },
                storeHeadersWithCustomer
              )
            ).data.cart

            await api.post(
              `/store/carts/${cart.id}/shipping-methods`,
              { option_id: shippingOption.id },
              storeHeaders
            )
          })

          it("should successfully complete cart and fail on concurrent complete", async () => {
            const paymentCollection = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            await createCartCreditLinesWorkflow.run({
              input: [
                {
                  cart_id: cart.id,
                  amount: 100,
                  currency_code: "usd",
                  reference: "test",
                  reference_id: "test",
                },
              ],
              container: appContainer,
            })

            // Concurrently complete the cart
            let completedCart: any[] = []
            for (let i = 0; i < 5; i++) {
              completedCart.push(
                api
                  .post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
                  .catch((e) => e)
              )

              await setTimeout(25)
            }

            let all = await Promise.all(completedCart)

            let success = all.filter((res) => res.status === 200)
            let failure = all.filter((res) => res.status !== 200)

            const successData = success[0].data.order
            for (const res of success) {
              expect(res.data.order).toEqual(successData)
            }

            expect(failure.length).toBe(0)

            expect(successData).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                currency_code: "usd",
                credit_lines: [
                  expect.objectContaining({
                    amount: 100,
                    reference: "test",
                    reference_id: "test",
                  }),
                ],
                items: expect.arrayContaining([
                  expect.objectContaining({
                    unit_price: 1500,
                    compare_at_unit_price: null,
                    quantity: 1,
                  }),
                ]),
              })
            )
          })

          it("should successfully complete cart", async () => {
            const paymentCollection = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            await createCartCreditLinesWorkflow.run({
              input: [
                {
                  cart_id: cart.id,
                  amount: 100,
                  currency_code: "usd",
                  reference: "test",
                  reference_id: "test",
                },
              ],
              container: appContainer,
            })

            const response = await api.post(
              `/store/carts/${cart.id}/complete`,
              {},
              storeHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.order).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                currency_code: "usd",
                credit_lines: [
                  expect.objectContaining({
                    amount: 100,
                    reference: "test",
                    reference_id: "test",
                  }),
                ],
                items: expect.arrayContaining([
                  expect.objectContaining({
                    unit_price: 1500,
                    compare_at_unit_price: null,
                    quantity: 1,
                  }),
                ]),
              })
            )
          })

          it("should successfully complete cart with pre existing captured payment session", async () => {
            const paymentModule = appContainer.resolve(Modules.PAYMENT)

            const paymentCollection = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart.id },
                storeHeaders
              )
            ).data.payment_collection

            const paymentSession = await api
              .post(
                `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
                { provider_id: "pp_system_default" },
                storeHeaders
              )
              .then((res) => res.data.payment_collection.payment_sessions[0])

            // Authorize the payment session (creates a payment)
            const payment = await paymentModule.authorizePaymentSession(
              paymentSession.id,
              {}
            )

            // Capture the payment
            await paymentModule.capturePayment({
              payment_id: payment.id,
            })

            const updatedPaymentSession =
              await paymentModule.retrievePaymentSession(paymentSession.id, {
                relations: ["payment", "payment.captures"],
              })
            expect(updatedPaymentSession.payment.captures).toHaveLength(1)
            expect(updatedPaymentSession.status).toBe(
              PaymentSessionStatus.AUTHORIZED
            )

            // Complete the cart
            const response = await api.post(
              `/store/carts/${cart.id}/complete`,
              {},
              storeHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.order).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                currency_code: "usd",
                items: expect.arrayContaining([
                  expect.objectContaining({
                    unit_price: 1500,
                    compare_at_unit_price: null,
                    quantity: 1,
                  }),
                ]),
              })
            )
          })

          it("should successfully complete cart with credit lines alone", async () => {
            const oldCart = (
              await api.get(`/store/carts/${cart.id}`, storeHeaders)
            ).data.cart

            createCartCreditLinesWorkflow.run({
              input: [
                {
                  cart_id: oldCart.id,
                  amount: oldCart.total,
                  currency_code: "usd",
                  reference: "test",
                  reference_id: "test",
                },
              ],
              container: appContainer,
            })

            const response = await api.post(
              `/store/carts/${cart.id}/complete`,
              {},
              storeHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.order).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                currency_code: "usd",
                credit_line_total: 2395,
                discount_total: 105,
                credit_lines: [
                  expect.objectContaining({
                    amount: 2395,
                  }),
                ],
                items: expect.arrayContaining([
                  expect.objectContaining({
                    unit_price: 1500,
                    compare_at_unit_price: null,
                    quantity: 1,
                  }),
                ]),
              })
            )
          })

          it("should successfully complete cart with promotions", async () => {
            const oldCart = (
              await api.get(`/store/carts/${cart.id}`, storeHeaders)
            ).data.cart

            createCartCreditLinesWorkflow.run({
              input: [
                {
                  cart_id: oldCart.id,
                  amount: oldCart.total,
                  currency_code: "usd",
                  reference: "test",
                  reference_id: "test",
                },
              ],
              container: appContainer,
            })

            const cartResponse = await api.post(
              `/store/carts/${cart.id}/complete`,
              {},
              storeHeaders
            )

            const orderResponse = await api.get(
              `/store/orders/${cartResponse.data.order.id}?fields=+promotions.*`,
              storeHeaders
            )

            expect(cartResponse.status).toEqual(200)
            expect(orderResponse.data.order).toEqual(
              expect.objectContaining({
                promotions: [
                  expect.objectContaining({
                    code: promotion.code,
                  }),
                ],
                items: expect.arrayContaining([
                  expect.objectContaining({
                    unit_price: 1500,
                    compare_at_unit_price: null,
                    quantity: 1,
                    adjustments: expect.arrayContaining([
                      expect.objectContaining({
                        amount: 100,
                        code: promotion.code,
                      }),
                    ]),
                  }),
                ]),
              })
            )
          })

          it("should fail to complete a cart if that would exceed the promotion limit", async () => {
            const product = (
              await api.post(
                `/admin/products`,
                {
                  status: ProductStatus.PUBLISHED,
                  title: "Product for camapign",
                  description: "test",
                  options: [
                    {
                      title: "Type",
                      values: ["L"],
                    },
                  ],
                  variants: [
                    {
                      title: "L",
                      sku: "campaign-product-l",
                      options: {
                        Type: "L",
                      },
                      manage_inventory: false,
                      prices: [
                        {
                          amount: 300,
                          currency_code: "usd",
                        },
                      ],
                    },
                  ],
                },
                adminHeaders
              )
            ).data.product

            const campaign = (
              await api.post(
                `/admin/campaigns`,
                {
                  name: "TEST-1",
                  budget: {
                    type: "spend",
                    currency_code: "usd",
                    limit: 100, // -> promotions value can't exceed 100$
                  },
                  campaign_identifier: "PROMO_CAMPAIGN",
                },
                adminHeaders
              )
            ).data.campaign

            const promotion = (
              await api
                .post(
                  `/admin/promotions`,
                  {
                    code: "TEST_PROMO",
                    type: PromotionType.STANDARD,
                    status: PromotionStatus.ACTIVE,
                    is_automatic: false,
                    is_tax_inclusive: true,
                    application_method: {
                      target_type: "items",
                      type: "fixed",
                      allocation: "across",
                      currency_code: "usd",
                      value: 100, // -> promotion applies 100$ fixed discount on the entire order
                    },
                    campaign_id: campaign.id,
                  },
                  adminHeaders
                )
                .catch((e) => console.log(e))
            ).data.promotion

            const cart1 = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: shippingAddressData,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  promo_codes: [promotion.code],
                },
                storeHeadersWithCustomer
              )
            ).data.cart

            expect(cart1).toEqual(
              expect.objectContaining({
                promotions: [
                  expect.objectContaining({
                    code: promotion.code,
                  }),
                ],
              })
            )

            const cart2 = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: shippingAddressData,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  promo_codes: [promotion.code],
                },
                storeHeadersWithCustomer
              )
            ).data.cart

            expect(cart2).toEqual(
              expect.objectContaining({
                promotions: [
                  expect.objectContaining({
                    code: promotion.code,
                  }),
                ],
              })
            )

            /**
             * At this point both carts have the same promotion applied successfully
             */

            const paymentCollection1 = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart1.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection1.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            const order1 = (
              await api.post(
                `/store/carts/${cart1.id}/complete`,
                {},
                storeHeaders
              )
            ).data.order

            expect(order1).toEqual(
              expect.objectContaining({ discount_total: 100 })
            )

            let campaignAfter = (
              await api.get(
                `/admin/campaigns/${campaign.id}?fields=budget.*`,
                adminHeaders
              )
            ).data.campaign

            expect(campaignAfter).toEqual(
              expect.objectContaining({
                budget: expect.objectContaining({
                  used: 100,
                  limit: 100,
                }),
              })
            )

            const paymentCollection2 = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart2.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection2.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            const response2 = await api
              .post(`/store/carts/${cart2.id}/complete`, {}, storeHeaders)
              .catch((e) => e)

            expect(response2.response.status).toEqual(400)
            expect(response2.response.data).toEqual(
              expect.objectContaining({
                type: "not_allowed",
                message: "Promotion usage exceeds the budget limit.",
              })
            )

            campaignAfter = (
              await api.get(
                `/admin/campaigns/${campaign.id}?fields=budget.*`,
                adminHeaders
              )
            ).data.campaign

            expect(campaignAfter).toEqual(
              expect.objectContaining({
                budget: expect.objectContaining({
                  used: 100,
                  limit: 100,
                }),
              })
            )
          })

          it("should successfully complete cart without shipping for digital products", async () => {
            /**
             * Product has a shipping profile so cart item should not require shipping
             */
            const product = (
              await api.post(
                `/admin/products`,
                {
                  title: "Product without inventory management",
                  description: "test",
                  status: ProductStatus.PUBLISHED,
                  options: [
                    {
                      title: "Size",
                      values: ["S", "M", "L", "XL"],
                    },
                  ],
                  variants: [
                    {
                      title: "S / Black",
                      sku: "special-shirt",
                      options: {
                        Size: "S",
                      },
                      manage_inventory: false,
                      prices: [
                        {
                          amount: 1500,
                          currency_code: "usd",
                        },
                      ],
                    },
                  ],
                },
                adminHeaders
              )
            ).data.product

            cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: shippingAddressData,
                },
                storeHeadersWithCustomer
              )
            ).data.cart

            cart = (
              await api.post(
                `/store/carts/${cart.id}/line-items`,
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
                storeHeaders
              )
            ).data.cart

            const paymentCollection = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            expect(cart.items[0].requires_shipping).toEqual(false)

            const response = await api.post(
              `/store/carts/${cart.id}/complete`,
              {},
              storeHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.order).toEqual(
              expect.objectContaining({
                shipping_methods: [],
                items: expect.arrayContaining([
                  expect.objectContaining({
                    requires_shipping: false,
                  }),
                ]),
              })
            )
          })

          describe("with sale price lists", () => {
            let priceList

            beforeEach(async () => {
              priceList = (
                await api.post(
                  `/admin/price-lists`,
                  {
                    title: "test price list",
                    description: "test",
                    status: PriceListStatus.ACTIVE,
                    type: PriceListType.SALE,
                    prices: [
                      {
                        amount: 350,
                        currency_code: "usd",
                        variant_id: product.variants[0].id,
                      },
                    ],
                  },
                  adminHeaders
                )
              ).data.price_list

              await api.post(
                `/store/carts/${cart.id}/line-items`,
                { variant_id: product.variants[0].id, quantity: 1 },
                storeHeaders
              )

              const paymentCollection = (
                await api.post(
                  `/store/payment-collections`,
                  { cart_id: cart.id },
                  storeHeaders
                )
              ).data.payment_collection

              await api.post(
                `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
                { provider_id: "pp_system_default" },
                storeHeaders
              )
            })

            it("should add price from price list and set compare_at_unit_price for order item", async () => {
              const response = await api.post(
                `/store/carts/${cart.id}/complete`,
                {},
                storeHeaders
              )

              expect(response.status).toEqual(200)
              expect(response.data.order).toEqual(
                expect.objectContaining({
                  items: expect.arrayContaining([
                    expect.objectContaining({
                      unit_price: 350,
                      compare_at_unit_price: 1500,
                      is_tax_inclusive: true,
                      quantity: 2,
                    }),
                  ]),
                })
              )
            })
          })

          describe("with inventory kit", () => {
            let stockLocation, inventoryItem, product, cart
            beforeEach(async () => {
              stockLocation = (
                await api.post(
                  `/admin/stock-locations`,
                  { name: "test location" },
                  adminHeaders
                )
              ).data.stock_location

              inventoryItem = (
                await api.post(
                  `/admin/inventory-items`,
                  { sku: "bottle" },
                  adminHeaders
                )
              ).data.inventory_item

              await api.post(
                `/admin/inventory-items/${inventoryItem.id}/location-levels`,
                {
                  location_id: stockLocation.id,
                  stocked_quantity: 10,
                },
                adminHeaders
              )

              await api.post(
                `/admin/stock-locations/${stockLocation.id}/sales-channels`,
                { add: [salesChannel.id] },
                adminHeaders
              )

              product = (
                await api.post(
                  "/admin/products",
                  {
                    title: `Test fixture ${shippingProfile.id}`,
                    status: ProductStatus.PUBLISHED,
                    shipping_profile_id: shippingProfile.id,
                    options: [
                      { title: "pack", values: ["1-pack", "2-pack", "3-pack"] },
                    ],
                    variants: [
                      {
                        title: "2-pack",
                        sku: "2-pack",
                        inventory_items: [
                          {
                            inventory_item_id: inventoryItem.id,
                            required_quantity: 2,
                          },
                        ],
                        prices: [
                          {
                            currency_code: "usd",
                            amount: 100,
                          },
                        ],
                        options: {
                          pack: "2-pack",
                        },
                      },
                      {
                        title: "3-pack",
                        sku: "3-pack",
                        inventory_items: [
                          {
                            inventory_item_id: inventoryItem.id,
                            required_quantity: 3,
                          },
                        ],
                        prices: [
                          {
                            currency_code: "usd",
                            amount: 140,
                          },
                        ],
                        options: {
                          pack: "3-pack",
                        },
                      },
                    ],
                  },
                  adminHeaders
                )
              ).data.product

              cart = (
                await api.post(
                  `/store/carts`,
                  {
                    currency_code: "usd",
                    sales_channel_id: salesChannel.id,
                    region_id: region.id,
                    shipping_address: shippingAddressData,
                    items: [
                      { variant_id: product.variants[0].id, quantity: 1 },
                      { variant_id: product.variants[1].id, quantity: 1 },
                    ],
                  },
                  storeHeadersWithCustomer
                )
              ).data.cart

              const fulfillmentSets = (
                await api.post(
                  `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
                  {
                    name: `Test-inventory`,
                    type: "test-type",
                  },
                  adminHeaders
                )
              ).data.stock_location.fulfillment_sets

              const fulfillmentSet = (
                await api.post(
                  `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
                  {
                    name: `Test-inventory`,
                    geo_zones: [{ type: "country", country_code: "US" }],
                  },
                  adminHeaders
                )
              ).data.fulfillment_set

              await api.post(
                `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
                { add: ["manual_test-provider"] },
                adminHeaders
              )

              const shippingOption = (
                await api.post(
                  `/admin/shipping-options`,
                  {
                    name: `Test shipping option ${fulfillmentSet.id}`,
                    service_zone_id: fulfillmentSet.service_zones[0].id,
                    shipping_profile_id: shippingProfile.id,
                    provider_id: "manual_test-provider",
                    price_type: "flat",
                    type: {
                      label: "Test type",
                      description: "Test description",
                      code: "test-code",
                    },
                    prices: [{ currency_code: "usd", amount: 1000 }],
                    rules: [],
                  },
                  adminHeaders
                )
              ).data.shipping_option

              await api.post(
                `/store/carts/${cart.id}/shipping-methods`,
                { option_id: shippingOption.id },
                storeHeaders
              )

              const paymentCollection = (
                await api.post(
                  `/store/payment-collections`,
                  { cart_id: cart.id },
                  storeHeaders
                )
              ).data.payment_collection

              await api.post(
                `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
                { provider_id: "pp_system_default" },
                storeHeaders
              )
            })

            it("should complete a cart with inventory item shared between variants", async () => {
              const response = await api.post(
                `/store/carts/${cart.id}/complete`,
                {},
                storeHeaders
              )

              expect(response.status).toEqual(200)
              expect(response.data.order).toEqual(
                expect.objectContaining({
                  items: expect.arrayContaining([
                    expect.objectContaining({
                      subtitle: "2-pack",
                      quantity: 1,
                    }),
                    expect.objectContaining({
                      subtitle: "3-pack",
                      quantity: 1,
                    }),
                  ]),
                })
              )

              const reservations = (
                await api.get(`/admin/reservations`, adminHeaders)
              ).data.reservations

              expect(reservations).toEqual(
                expect.arrayContaining([
                  expect.objectContaining({
                    location_id: stockLocation.id,
                    inventory_item_id: inventoryItem.id,
                    quantity: 2, // 2-pack
                    inventory_item: expect.objectContaining({
                      id: inventoryItem.id,
                      sku: "bottle",
                      reserved_quantity: 5,
                      stocked_quantity: 10,
                    }),
                  }),
                  expect.objectContaining({
                    location_id: stockLocation.id,
                    inventory_item_id: inventoryItem.id,
                    quantity: 3, // 3-pack
                    inventory_item: expect.objectContaining({
                      id: inventoryItem.id,
                      sku: "bottle",
                      reserved_quantity: 5,
                      stocked_quantity: 10,
                    }),
                  }),
                ])
              )
            })
          })
        })

        describe("shipping validation", () => {
          it("should fail to complete the cart if no shipping method is selected and items require shipping", async () => {
            const cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: shippingAddressData,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  promo_codes: [promotion.code],
                },
                storeHeadersWithCustomer
              )
            ).data.cart

            const paymentCollection = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            const response = await api
              .post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
              .catch((e) => e)

            expect(response.response.status).toEqual(400)
            expect(response.response.data.message).toEqual(
              "No shipping method selected but the cart contains items that require shipping."
            )
          })

          it("should fail to complete the cart if the shipping profile of a product is not supported by the shipping method", async () => {
            const stockLocation = (
              await api.post(
                `/admin/stock-locations`,
                { name: "test location" },
                adminHeaders
              )
            ).data.stock_location

            await api.post(
              `/admin/stock-locations/${stockLocation.id}/sales-channels`,
              { add: [salesChannel.id] },
              adminHeaders
            )

            const shippingProfile = (
              await api.post(
                `/admin/shipping-profiles`,
                { name: `test-${stockLocation.id}`, type: "default" },
                adminHeaders
              )
            ).data.shipping_profile

            const fulfillmentSets = (
              await api.post(
                `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
                {
                  name: `Test-${shippingProfile.id}`,
                  type: "test-type",
                },
                adminHeaders
              )
            ).data.stock_location.fulfillment_sets

            const fulfillmentSet = (
              await api.post(
                `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
                {
                  name: `Test-${shippingProfile.id}`,
                  geo_zones: [{ type: "country", country_code: "US" }],
                },
                adminHeaders
              )
            ).data.fulfillment_set

            await api.post(
              `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
              { add: ["manual_test-provider"] },
              adminHeaders
            )

            const shippingOption = (
              await api.post(
                `/admin/shipping-options`,
                {
                  name: `Test shipping option ${fulfillmentSet.id}`,
                  service_zone_id: fulfillmentSet.service_zones[0].id,
                  shipping_profile_id: shippingProfile.id,
                  provider_id: "manual_test-provider",
                  price_type: "flat",
                  type: {
                    label: "Test type",
                    description: "Test description",
                    code: "test-code",
                  },
                  prices: [{ currency_code: "usd", amount: 1000 }],
                  rules: [],
                },
                adminHeaders
              )
            ).data.shipping_option

            const specialShippingProfile = (
              await api.post(
                `/admin/shipping-profiles`,
                { name: "special-shipping-profile", type: "special" },
                adminHeaders
              )
            ).data.shipping_profile

            const product = (
              await api.post(
                `/admin/products`,
                {
                  title: "test product",
                  status: ProductStatus.PUBLISHED,
                  description: "test",
                  options: [
                    {
                      title: "Size",
                      values: ["S", "M", "L", "XL"],
                    },
                  ],
                  variants: [
                    {
                      title: "S / Black",
                      sku: "special-shirt",
                      options: {
                        Size: "S",
                      },
                      manage_inventory: false,
                      prices: [
                        {
                          amount: 1500,
                          currency_code: "usd",
                        },
                      ],
                    },
                  ],
                  shipping_profile_id: specialShippingProfile.id, // --> product has a different shipping profile than
                },
                adminHeaders
              )
            ).data.product

            const cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: shippingAddressData,
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  promo_codes: [promotion.code],
                },
                storeHeadersWithCustomer
              )
            ).data.cart

            await api.post(
              `/store/carts/${cart.id}/shipping-methods`,
              { option_id: shippingOption.id },
              storeHeaders
            )

            const paymentCollection = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            const response = await api
              .post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
              .catch((e) => e)

            expect(response.response.status).toEqual(400)
            expect(response.response.data.message).toEqual(
              "The cart items require shipping profiles that are not satisfied by the current shipping methods"
            )
          })
        })
      })

      describe("POST /store/carts/:id", () => {
        let otherRegion

        beforeEach(async () => {
          const cartData = {
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
            region_id: region.id,
            shipping_address: shippingAddressData,
            items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            promo_codes: [promotion.code],
          }

          cart = (await api.post(`/store/carts`, cartData, storeHeaders)).data
            .cart

          otherRegion = (
            await api.post(
              "/admin/regions",
              { name: "dk", currency_code: "dkk", countries: ["dk"] },
              adminHeaders
            )
          ).data.region
        })

        it("should update prices when region is changed", async () => {
          let updated = await api.post(
            `/store/carts/${cart.id}/line-items`,
            { variant_id: product.variants[0].id, quantity: 1 },
            storeHeaders
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "usd",
              items: [
                expect.objectContaining({
                  unit_price: 1500,
                  quantity: 2,
                }),
              ],
            })
          )

          updated = await api.post(
            `/store/carts/${cart.id}`,
            { region_id: otherRegion.id },
            storeHeaders
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "dkk",
              items: [
                expect.objectContaining({
                  unit_price: 1300,
                  quantity: 2,
                }),
              ],
            })
          )

          updated = await api.post(
            `/store/carts/${cart.id}/line-items`,
            { variant_id: product.variants[0].id, quantity: 1 },
            storeHeaders
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "dkk",
              items: [
                expect.objectContaining({
                  unit_price: 1300,
                  quantity: 3,
                }),
              ],
            })
          )
        })

        it("should update a cart with promo codes with a replace action", async () => {
          const newPromotion = (
            await api.post(
              `/admin/promotions`,
              {
                code: "PROMOTION_TEST",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                application_method: {
                  type: "fixed",
                  target_type: "items",
                  allocation: "across",
                  currency_code: "usd",
                  value: 1000,
                  apply_to_quantity: 1,
                  target_rules: [
                    {
                      attribute: "items.product_id",
                      operator: PromotionRuleOperator.IN,
                      values: [product.id],
                    },
                  ],
                },
              },
              adminHeaders
            )
          ).data.promotion

          await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          // Should remove earlier adjustments from other promocodes
          let updated = await api.post(
            `/store/carts/${cart.id}`,
            { promo_codes: [newPromotion.code] },
            storeHeaders
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              items: [
                expect.objectContaining({
                  adjustments: [
                    expect.objectContaining({
                      code: newPromotion.code,
                    }),
                  ],
                }),
              ],
            })
          )

          // Should remove all adjustments from other promo codes
          updated = await api.post(
            `/store/carts/${cart.id}`,
            { promo_codes: [] },
            storeHeaders
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              items: [
                expect.objectContaining({
                  adjustments: [],
                }),
              ],
            })
          )
        })

        it("should not add a promotion that belongs to a different currency than the cart", async () => {
          const newPromotion = (
            await api.post(
              `/admin/promotions`,
              {
                code: "PROMOTION_TEST",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                application_method: {
                  type: "fixed",
                  target_type: "items",
                  allocation: "across",
                  // Set for EUR currency, different from USD Currency of the cart
                  currency_code: "eur",
                  value: 1000,
                  apply_to_quantity: 1,
                },
              },
              adminHeaders
            )
          ).data.promotion

          await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          let updated = await api.post(
            `/store/carts/${cart.id}`,
            { promo_codes: [newPromotion.code] },
            storeHeaders
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              items: [
                expect.objectContaining({
                  adjustments: [],
                }),
              ],
            })
          )
        })

        it("should not generate tax lines if automatic taxes is false", async () => {
          let updated = await api.post(
            `/store/carts/${cart.id}`,
            {},
            storeHeaders
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              items: [
                expect.objectContaining({
                  tax_lines: [
                    expect.objectContaining({
                      description: "CA Default Rate",
                      code: "CADEFAULT",
                      rate: 5,
                      provider_id: "system",
                    }),
                  ],
                }),
              ],
            })
          )

          updated = await api.post(
            `/store/carts/${cart.id}`,
            { region_id: noAutomaticRegion.id },
            storeHeaders
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              items: [
                expect.objectContaining({
                  tax_lines: [],
                }),
              ],
            })
          )
        })

        it("should not generate tax lines for gift card products", async () => {
          const giftCardProduct = (
            await api.post(
              `/admin/products`,
              {
                title: "Gift Card",
                description: "test",
                status: ProductStatus.PUBLISHED,
                is_giftcard: true,
                options: [
                  {
                    title: "Denomination",
                    values: ["10", "20", "50", "100"],
                  },
                ],
                variants: [
                  {
                    title: "10",
                    sku: "special-shirt",
                    options: {
                      Denomination: "10",
                    },
                    manage_inventory: false,
                    prices: [
                      {
                        amount: 1000,
                        currency_code: "usd",
                      },
                    ],
                  },
                ],
              },
              adminHeaders
            )
          ).data.product

          let updated = await api.post(
            `/store/carts/${cart.id}/line-items?fields=+items.is_giftcard`,
            { variant_id: giftCardProduct.variants[0].id, quantity: 1 },
            storeHeaders
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              items: expect.arrayContaining([
                expect.objectContaining({
                  is_giftcard: false,
                  tax_lines: [
                    expect.objectContaining({
                      description: "CA Default Rate",
                      code: "CADEFAULT",
                      rate: 5,
                      provider_id: "system",
                    }),
                  ],
                }),
                expect.objectContaining({
                  is_giftcard: true,
                  tax_lines: [],
                }),
              ]),
            })
          )
        })

        it("should update a cart's region, sales channel, customer data and tax lines", async () => {
          const newSalesChannel = (
            await api.post(
              "/admin/sales-channels",
              { name: "Webshop", description: "channel" },
              adminHeaders
            )
          ).data.sales_channel

          let updated = await api.post(
            `/store/carts/${cart.id}`,
            {
              region_id: noAutomaticRegion.id,
              email: "tony@stark.com",
              sales_channel_id: newSalesChannel.id,
            },
            storeHeaders
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              region: expect.objectContaining({
                id: noAutomaticRegion.id,
                currency_code: "eur",
              }),
              email: "tony@stark.com",
              customer: expect.objectContaining({
                email: "tony@stark.com",
              }),
              sales_channel_id: newSalesChannel.id,
            })
          )
        })

        it("should update tax lines on cart items when region changes", async () => {
          let response = await api.post(
            `/store/carts/${cart.id}`,
            {
              region_id: otherRegion.id,
              shipping_address: {
                country_code: "dk",
              },
            },
            storeHeaders
          )

          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "dkk",
              region_id: otherRegion.id,
              items: expect.arrayContaining([
                expect.objectContaining({
                  unit_price: 1300,
                  quantity: 1,
                  tax_lines: [
                    // Uses the danish default rate
                    expect.objectContaining({
                      description: "Denmark Default Rate",
                      code: "DK_DEF",
                      rate: 25,
                      provider_id: "system",
                    }),
                  ],
                }),
              ]),
            })
          )
        })

        it("should update region + set shipping address country code to dk when region has only one country", async () => {
          const updated = await api.post(
            `/store/carts/${cart.id}`,
            {
              region_id: otherRegion.id,
            },
            storeHeaders
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "dkk",
              region: expect.objectContaining({
                id: otherRegion.id,
                currency_code: "dkk",
                countries: [expect.objectContaining({ iso_2: "dk" })],
              }),
              shipping_address: expect.objectContaining({
                country_code: "dk",
              }),
            })
          )
        })

        it("should update region + set shipping address to null when region has more than one country", async () => {
          const regionWithMultipleCountries = (
            await api.post(
              "/admin/regions",
              { name: "dks", currency_code: "dkk", countries: ["ae", "no"] },
              adminHeaders
            )
          ).data.region

          const updated = await api.post(
            `/store/carts/${cart.id}`,
            { region_id: regionWithMultipleCountries.id },
            storeHeaders
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              currency_code: "dkk",
              region: expect.objectContaining({
                currency_code: "dkk",
                countries: expect.arrayContaining([
                  expect.objectContaining({ iso_2: "ae" }),
                  expect.objectContaining({ iso_2: "no" }),
                ]),
              }),
              shipping_address: null,
            })
          )
        })

        it("should update region and shipping address when country code is within region", async () => {
          const updated = await api.post(
            `/store/carts/${cart.id}`,
            {
              region_id: region.id,
              shipping_address: {
                country_code: "us",
              },
            },
            storeHeaders
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              region: expect.objectContaining({
                id: region.id,
                countries: [expect.objectContaining({ iso_2: "us" })],
              }),
              shipping_address: expect.objectContaining({
                country_code: "us",
              }),
            })
          )
        })

        it("should throw when updating shipping address country code when country is not within region", async () => {
          let errResponse = await api
            .post(
              `/store/carts/${cart.id}`,
              {
                shipping_address: {
                  country_code: "dk",
                },
              },
              storeHeaders
            )
            .catch((e) => e)

          expect(errResponse.response.status).toEqual(400)
          expect(errResponse.response.data.message).toEqual(
            `Country with code dk is not within region ${region.name}`
          )
        })

        it("should throw when updating region and shipping address, but shipping address country code is not within region", async () => {
          let errResponse = await api
            .post(
              `/store/carts/${cart.id}`,
              {
                region_id: region.id,
                shipping_address: {
                  country_code: "dk",
                },
              },
              storeHeaders
            )
            .catch((e) => e)

          expect(errResponse.response.status).toEqual(400)
          expect(errResponse.response.data.message).toEqual(
            `Country with code dk is not within region ${region.name}`
          )
        })

        it("should remove tax lines on cart items and shipping methods when country changes and there is no tax region for that country", async () => {
          const stockLocation = (
            await api.post(
              `/admin/stock-locations`,
              { name: "test location" },
              adminHeaders
            )
          ).data.stock_location

          await api.post(
            `/admin/stock-locations/${stockLocation.id}/sales-channels`,
            { add: [salesChannel.id] },
            adminHeaders
          )

          const shippingProfile = (
            await api.post(
              `/admin/shipping-profiles`,
              { name: `test-${stockLocation.id}`, type: "default" },
              adminHeaders
            )
          ).data.shipping_profile

          const fulfillmentSets = (
            await api.post(
              `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
              {
                name: `Test-${shippingProfile.id}`,
                type: "test-type",
              },
              adminHeaders
            )
          ).data.stock_location.fulfillment_sets

          const fulfillmentSet = (
            await api.post(
              `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
              {
                name: `Test-${shippingProfile.id}`,
                geo_zones: [
                  { type: "country", country_code: "it" },
                  { type: "country", country_code: "us" },
                ],
              },
              adminHeaders
            )
          ).data.fulfillment_set

          await api.post(
            `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
            { add: ["manual_test-provider"] },
            adminHeaders
          )

          const shippingOption = (
            await api.post(
              `/admin/shipping-options`,
              {
                name: `Test shipping option ${fulfillmentSet.id}`,
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: "manual_test-provider",
                price_type: "flat",
                type: {
                  label: "Test type",
                  description: "Test description",
                  code: "test-code",
                },
                prices: [
                  { currency_code: "usd", amount: 1000 },
                  { currency_code: "eur", amount: 1000 },
                  { currency_code: "dkk", amount: 1000 },
                ],
                rules: [],
              },
              adminHeaders
            )
          ).data.shipping_option

          const regionWithoutTax = (
            await api.post(
              "/admin/regions",
              { name: "Italy", currency_code: "eur", countries: ["it"] },
              adminHeaders
            )
          ).data.region

          await api.post(
            `/store/carts/${cart.id}`,
            { region_id: regionWithoutTax.id },
            storeHeaders
          )

          await api.post(
            `/store/carts/${cart.id}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )

          const response = await api.post(
            `/store/carts/${cart.id}`,
            { region_id: regionWithoutTax.id },
            storeHeaders
          )

          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              currency_code: "eur",
              region_id: regionWithoutTax.id,
              items: expect.arrayContaining([
                expect.objectContaining({
                  tax_lines: [
                    // Italy has no tax region, so we clear the tax lines
                  ],
                }),
              ]),
              shipping_methods: expect.arrayContaining([
                expect.objectContaining({
                  tax_lines: [
                    // Italy has no tax region, so we clear the tax lines
                  ],
                }),
              ]),
            })
          )
        })

        it("should remove invalid shipping methods", async () => {
          const stockLocation = (
            await api.post(
              `/admin/stock-locations`,
              { name: "test location" },
              adminHeaders
            )
          ).data.stock_location

          await api.post(
            `/admin/stock-locations/${stockLocation.id}/sales-channels`,
            { add: [salesChannel.id] },
            adminHeaders
          )

          const shippingProfile = (
            await api.post(
              `/admin/shipping-profiles`,
              { name: `test-${stockLocation.id}`, type: "default" },
              adminHeaders
            )
          ).data.shipping_profile

          const fulfillmentSets = (
            await api.post(
              `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
              {
                name: `Test-${shippingProfile.id}`,
                type: "test-type",
              },
              adminHeaders
            )
          ).data.stock_location.fulfillment_sets

          const fulfillmentSet = (
            await api.post(
              `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
              {
                name: `Test-${shippingProfile.id}`,
                geo_zones: [{ type: "country", country_code: "it" }],
              },
              adminHeaders
            )
          ).data.fulfillment_set

          await api.post(
            `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
            { add: ["manual_test-provider"] },
            adminHeaders
          )

          const shippingOption = (
            await api.post(
              `/admin/shipping-options`,
              {
                name: `Test shipping option ${fulfillmentSet.id}`,
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: "manual_test-provider",
                price_type: "flat",
                type: {
                  label: "Test type",
                  description: "Test description",
                  code: "test-code",
                },
                prices: [
                  { currency_code: "usd", amount: 1000 },
                  { currency_code: "eur", amount: 1000 },
                ],
                rules: [
                  {
                    attribute: "enabled_in_store",
                    value: "true",
                    operator: "eq",
                  },
                  {
                    attribute: "is_return",
                    value: "false",
                    operator: "eq",
                  },
                ],
              },
              adminHeaders
            )
          ).data.shipping_option

          const regionWithoutTax = (
            await api.post(
              "/admin/regions",
              { name: "Italy", currency_code: "eur", countries: ["it"] },
              adminHeaders
            )
          ).data.region

          await api.post(
            `/store/carts/${cart.id}`,
            { region_id: regionWithoutTax.id },
            storeHeaders
          )

          await api.post(
            `/store/carts/${cart.id}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )

          let updated = await api.post(
            `/store/carts/${cart.id}`,
            { region_id: region.id },
            storeHeaders
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              shipping_methods: [],
            })
          )
        })

        it("should update email irregardless of registered customer", async () => {
          const updateEmailWithoutCustomer = await api.post(
            `/store/carts/${cart.id}`,
            { email: "tony@stark.com" },
            storeHeaders
          )

          expect(updateEmailWithoutCustomer.data.cart).toEqual(
            expect.objectContaining({
              email: "tony@stark.com",
              customer: expect.objectContaining({
                email: "tony@stark.com",
              }),
            })
          )

          const updateCartCustomer = await api.post(
            `/store/carts/${cart.id}/customer`,
            {},
            storeHeadersWithCustomer
          )

          expect(updateCartCustomer.data.cart).toEqual(
            expect.objectContaining({
              email: "tony@stark-industries.com",
              customer: expect.objectContaining({
                id: customer.id,
                email: "tony@stark-industries.com",
              }),
            })
          )

          const updateEmailWithCustomer = await api.post(
            `/store/carts/${cart.id}`,
            { email: "new@stark.com" },
            storeHeaders
          )

          expect(updateEmailWithCustomer.data.cart).toEqual(
            expect.objectContaining({
              email: "new@stark.com",
              customer: expect.objectContaining({
                id: customer.id,
                email: "tony@stark-industries.com",
              }),
            })
          )
        })

        describe("With promotions", () => {
          it("should only apply promotion on discountable items", async () => {
            const notDiscountableProduct = (
              await api.post(
                "/admin/products",
                {
                  title: "Medusa T-Shirt not discountable",
                  status: ProductStatus.PUBLISHED,
                  handle: "t-shirt-not-discountable",
                  discountable: false,
                  options: [
                    {
                      title: "Size",
                      values: ["S"],
                    },
                  ],
                  variants: [
                    {
                      title: "S",
                      sku: "s-shirt",
                      options: {
                        Size: "S",
                      },
                      manage_inventory: false,
                      prices: [
                        {
                          amount: 1000,
                          currency_code: "usd",
                        },
                      ],
                    },
                  ],

                  shipping_profile_id: shippingProfile.id,
                },
                adminHeaders
              )
            ).data.product

            const cartData = {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              shipping_address: shippingAddressData,
              items: [
                { variant_id: product.variants[0].id, quantity: 1 },
                {
                  variant_id: notDiscountableProduct.variants[0].id,
                  quantity: 1,
                },
              ],
              promo_codes: [promotion.code],
            }

            const cart = (
              await api.post(
                `/store/carts?fields=+items.is_discountable,+items.total,+items.discount_total`,
                cartData,
                storeHeaders
              )
            ).data.cart

            expect(cart).toEqual(
              expect.objectContaining({
                discount_subtotal: 100,
                items: expect.arrayContaining([
                  expect.objectContaining({
                    variant_id: product.variants[0].id,
                    is_discountable: true,
                    unit_price: 1500,
                    total: 1395,
                    discount_total: 105,
                    adjustments: [
                      expect.objectContaining({
                        promotion_id: promotion.id,
                        amount: 100,
                      }),
                    ],
                  }),
                  expect.objectContaining({
                    variant_id: notDiscountableProduct.variants[0].id,
                    is_discountable: false,
                    total: 1000,
                    unit_price: 1000,
                    discount_total: 0,
                    adjustments: [],
                  }),
                ]),
              })
            )
          })

          it("should throw an error when adding a promotion that does not exist", async () => {
            const invalidPromoCode = "SOME_INVALID_PROMO_CODE"

            const { response } = await api
              .post(
                `/store/carts/${cart.id}/promotions`,
                { promo_codes: [invalidPromoCode] },
                storeHeaders
              )
              .catch((e) => e)

            expect(response.status).toEqual(400)
            expect(response.data.type).toEqual("invalid_data")
            expect(response.data.message).toEqual(
              `The promotion code ${invalidPromoCode} is invalid`
            )
          })

          it("should remove promotion adjustments when promotion is deleted", async () => {
            let cartBeforeRemovingPromotion = (
              await api.get(`/store/carts/${cart.id}`, storeHeaders)
            ).data.cart

            expect(cartBeforeRemovingPromotion).toEqual(
              expect.objectContaining({
                id: cart.id,
                items: expect.arrayContaining([
                  expect.objectContaining({
                    adjustments: expect.arrayContaining([
                      expect.objectContaining({
                        id: expect.any(String),
                        code: "PROMOTION_APPLIED",
                        promotion_id: promotion.id,
                        amount: 100,
                      }),
                    ]),
                  }),
                ]),
              })
            )

            await api.delete(`/admin/promotions/${promotion.id}`, adminHeaders)

            let response = await api.post(
              `/store/carts/${cart.id}`,
              {
                email: "test@test.com",
              },
              storeHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.cart).toEqual(
              expect.objectContaining({
                id: cart.id,
                items: expect.arrayContaining([
                  expect.objectContaining({
                    adjustments: [],
                  }),
                ]),
              })
            )
          })

          it("should add a 100 USD tax exclusive promotion for a 105 USD tax inclusive item and logically result in a 0 total with tax 5%", async () => {
            const taxExclPromotion = (
              await api.post(
                `/admin/promotions`,
                {
                  code: "PROMOTION_TAX_EXCLUSIVE",
                  type: PromotionType.STANDARD,
                  status: PromotionStatus.ACTIVE,
                  is_tax_inclusive: false, //Here we apply a tax exclusive promotion to a tax inclusive item in a way that the total SHOULD be 0
                  application_method: {
                    type: "fixed",
                    target_type: "items",
                    allocation: "across",
                    currency_code: "usd",
                    value: 100,
                    apply_to_quantity: 1,
                  },
                },
                adminHeaders
              )
            ).data.promotion

            const product = (
              await api.post(
                `/admin/products`,
                {
                  title: "Product for free",
                  description: "test",
                  status: ProductStatus.PUBLISHED,
                  options: [
                    {
                      title: "Size",
                      values: ["S", "M", "L", "XL"],
                    },
                  ],
                  variants: [
                    {
                      title: "S / Black",
                      sku: "special-shirt",
                      options: {
                        Size: "S",
                      },
                      manage_inventory: false,
                      prices: [
                        {
                          amount: 105,
                          currency_code: "usd",
                        },
                      ],
                    },
                  ],
                },
                adminHeaders
              )
            ).data.product

            cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: shippingAddressData,
                },
                storeHeadersWithCustomer
              )
            ).data.cart

            cart = (
              await api.post(
                `/store/carts/${cart.id}/line-items`,
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
                storeHeaders
              )
            ).data.cart

            let updated = await api.post(
              `/store/carts/${cart.id}`,
              { promo_codes: [taxExclPromotion.code] },
              storeHeaders
            )

            expect(updated.status).toEqual(200)
            expect(updated.data.cart).toEqual(
              expect.objectContaining({
                discount_total: 105,
                discount_subtotal: 100,
                discount_tax_total: 5,
                original_total: 105,
                total: 0, // 105 - 100 tax excl promotion + 5 promotion tax
                items: expect.arrayContaining([
                  expect.objectContaining({
                    is_tax_inclusive: true,
                    adjustments: expect.arrayContaining([
                      expect.objectContaining({
                        code: taxExclPromotion.code,
                        amount: 100,
                      }),
                    ]),
                  }),
                ]),
                promotions: expect.arrayContaining([
                  expect.objectContaining({
                    code: "PROMOTION_TAX_EXCLUSIVE",
                    application_method: expect.objectContaining({
                      value: 100,
                    }),
                  }),
                ]),
              })
            )
          })

          it("should add a 105 USD tax inclusive promotion (fixed, across, apply_to_quantity=1) for a 105 USD tax inclusive item and logically result in a 0 total with tax 5%", async () => {
            const taxInclPromotion = (
              await api.post(
                `/admin/promotions`,
                {
                  code: "PROMOTION_TAX_INCLUSIVE",
                  type: PromotionType.STANDARD,
                  status: PromotionStatus.ACTIVE,
                  is_tax_inclusive: true, //Here we apply a tax inclusive promotion to a tax inclusive item in a way that the total SHOULD be 0
                  application_method: {
                    type: "fixed",
                    target_type: "items",
                    allocation: "across",
                    currency_code: "usd",
                    value: 105,
                    apply_to_quantity: 1,
                  },
                },
                adminHeaders
              )
            ).data.promotion

            const product = (
              await api.post(
                `/admin/products`,
                {
                  title: "Product for free",
                  description: "test",
                  status: ProductStatus.PUBLISHED,
                  options: [
                    {
                      title: "Size",
                      values: ["S", "M", "L", "XL"],
                    },
                  ],
                  variants: [
                    {
                      title: "S / Black",
                      sku: "special-shirt",
                      options: {
                        Size: "S",
                      },
                      manage_inventory: false,
                      prices: [
                        {
                          amount: 105,
                          currency_code: "usd",
                        },
                      ],
                    },
                  ],
                },
                adminHeaders
              )
            ).data.product

            cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: shippingAddressData,
                },
                storeHeadersWithCustomer
              )
            ).data.cart

            cart = (
              await api.post(
                `/store/carts/${cart.id}/line-items`,
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
                storeHeaders
              )
            ).data.cart

            let updated = await api.post(
              `/store/carts/${cart.id}`,
              { promo_codes: [taxInclPromotion.code] },
              storeHeaders
            )

            expect(updated.status).toEqual(200)
            expect(updated.data.cart).toEqual(
              expect.objectContaining({
                discount_total: 105,
                discount_subtotal: 100,
                discount_tax_total: 5,
                original_total: 105,
                total: 0, // 105 - 100 tax excl promotion + 5 promotion tax
                items: expect.arrayContaining([
                  expect.objectContaining({
                    is_tax_inclusive: true,
                    adjustments: expect.arrayContaining([
                      expect.objectContaining({
                        code: taxInclPromotion.code,
                        amount: 105,
                        is_tax_inclusive: true,
                      }),
                    ]),
                  }),
                ]),
                promotions: expect.arrayContaining([
                  expect.objectContaining({
                    code: "PROMOTION_TAX_INCLUSIVE",
                    is_tax_inclusive: true,
                    application_method: expect.objectContaining({
                      value: 105,
                    }),
                  }),
                ]),
              })
            )
          })

          it("should add a 105 USD tax inclusive promotion (fixed, across, apply_to_quantity=1) for two 105 USD tax inclusive items and logically result in a 105 total with tax 5%", async () => {
            const taxInclPromotion = (
              await api.post(
                `/admin/promotions`,
                {
                  code: "PROMOTION_TAX_INCLUSIVE",
                  type: PromotionType.STANDARD,
                  status: PromotionStatus.ACTIVE,
                  is_tax_inclusive: true, //Here we apply a tax inclusive promotion to a tax inclusive item in a way that the total SHOULD be 0
                  application_method: {
                    type: "fixed",
                    target_type: "items",
                    allocation: "across",
                    currency_code: "usd",
                    value: 105,
                    apply_to_quantity: 1,
                  },
                },
                adminHeaders
              )
            ).data.promotion

            const product = (
              await api.post(
                `/admin/products`,
                {
                  title: "Product for free",
                  description: "test",
                  status: ProductStatus.PUBLISHED,
                  options: [
                    {
                      title: "Size",
                      values: ["S", "M", "L", "XL"],
                    },
                  ],
                  variants: [
                    {
                      title: "S / Black",
                      sku: "special-shirt",
                      options: {
                        Size: "S",
                      },
                      manage_inventory: false,
                      prices: [
                        {
                          amount: 105,
                          currency_code: "usd",
                        },
                      ],
                    },
                  ],
                },
                adminHeaders
              )
            ).data.product

            cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: shippingAddressData,
                },
                storeHeadersWithCustomer
              )
            ).data.cart

            cart = (
              await api.post(
                `/store/carts/${cart.id}/line-items`,
                {
                  variant_id: product.variants[0].id,
                  quantity: 2,
                },
                storeHeaders
              )
            ).data.cart

            let updated = await api.post(
              `/store/carts/${cart.id}`,
              { promo_codes: [taxInclPromotion.code] },
              storeHeaders
            )

            expect(updated.status).toEqual(200)
            expect(updated.data.cart).toEqual(
              expect.objectContaining({
                discount_total: 105,
                discount_subtotal: 100,
                discount_tax_total: 5,
                original_total: 210,
                total: 105, // 210 - 100 tax excl promotion + 5 promotion tax
                items: expect.arrayContaining([
                  expect.objectContaining({
                    is_tax_inclusive: true,
                    adjustments: expect.arrayContaining([
                      expect.objectContaining({
                        code: taxInclPromotion.code,
                        amount: 105,
                        is_tax_inclusive: true,
                      }),
                    ]),
                  }),
                ]),
                promotions: expect.arrayContaining([
                  expect.objectContaining({
                    code: "PROMOTION_TAX_INCLUSIVE",
                    is_tax_inclusive: true,
                    application_method: expect.objectContaining({
                      value: 105,
                    }),
                  }),
                ]),
              })
            )
          })

          it("should add a 105 USD tax inclusive promotion (fixed, each, max_quantity=2) for two 105 USD tax inclusive items and logically result in a 0 total with tax 5%", async () => {
            const taxInclPromotion = (
              await api.post(
                `/admin/promotions`,
                {
                  code: "PROMOTION_TAX_INCLUSIVE",
                  type: PromotionType.STANDARD,
                  status: PromotionStatus.ACTIVE,
                  is_tax_inclusive: true, //Here we apply a tax inclusive promotion to a tax inclusive item in a way that the total SHOULD be 0
                  application_method: {
                    type: "fixed",
                    target_type: "items",
                    allocation: "each",
                    currency_code: "usd",
                    value: 105,
                    max_quantity: 2,
                  },
                },
                adminHeaders
              )
            ).data.promotion

            const product = (
              await api.post(
                `/admin/products`,
                {
                  title: "Product for free",
                  description: "test",
                  status: ProductStatus.PUBLISHED,
                  options: [
                    {
                      title: "Size",
                      values: ["S", "M", "L", "XL"],
                    },
                  ],
                  variants: [
                    {
                      title: "S / Black",
                      sku: "special-shirt",
                      options: {
                        Size: "S",
                      },
                      manage_inventory: false,
                      prices: [
                        {
                          amount: 105,
                          currency_code: "usd",
                        },
                      ],
                    },
                  ],
                },
                adminHeaders
              )
            ).data.product

            cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: shippingAddressData,
                },
                storeHeadersWithCustomer
              )
            ).data.cart

            cart = (
              await api.post(
                `/store/carts/${cart.id}/line-items`,
                {
                  variant_id: product.variants[0].id,
                  quantity: 2,
                },
                storeHeaders
              )
            ).data.cart

            let updated = await api.post(
              `/store/carts/${cart.id}`,
              { promo_codes: [taxInclPromotion.code] },
              storeHeaders
            )

            expect(updated.status).toEqual(200)
            expect(updated.data.cart).toEqual(
              expect.objectContaining({
                discount_total: 210,
                discount_subtotal: 200,
                discount_tax_total: 10,
                original_total: 210,
                total: 0, // 210 - 200 tax excl promotion + 10 promotion tax
                items: expect.arrayContaining([
                  expect.objectContaining({
                    is_tax_inclusive: true,
                    adjustments: expect.arrayContaining([
                      expect.objectContaining({
                        code: taxInclPromotion.code,
                        amount: 210,
                        is_tax_inclusive: true,
                      }),
                    ]),
                  }),
                ]),
                promotions: expect.arrayContaining([
                  expect.objectContaining({
                    code: "PROMOTION_TAX_INCLUSIVE",
                    is_tax_inclusive: true,
                    application_method: expect.objectContaining({
                      value: 105,
                    }),
                  }),
                ]),
              })
            )
          })

          it("should add two tax inclusive promotions (50,100) (fixed, across) for two 105 USD tax inclusive items", async () => {
            const taxInclPromotion50 = (
              await api.post(
                `/admin/promotions`,
                {
                  code: "PROMOTION_TAX_INCLUSIVE_50",
                  type: PromotionType.STANDARD,
                  status: PromotionStatus.ACTIVE,
                  is_tax_inclusive: true,
                  application_method: {
                    type: "fixed",
                    target_type: "items",
                    allocation: "across",
                    currency_code: "usd",
                    value: 50,
                  },
                },
                adminHeaders
              )
            ).data.promotion

            const taxInclPromotion100 = (
              await api.post(
                `/admin/promotions`,
                {
                  code: "PROMOTION_TAX_INCLUSIVE_100",
                  type: PromotionType.STANDARD,
                  status: PromotionStatus.ACTIVE,
                  is_tax_inclusive: true,
                  application_method: {
                    type: "fixed",
                    target_type: "items",
                    allocation: "across",
                    currency_code: "usd",
                    value: 100,
                  },
                },
                adminHeaders
              )
            ).data.promotion

            const product = (
              await api.post(
                `/admin/products`,
                {
                  title: "Product for free",
                  description: "test",
                  status: ProductStatus.PUBLISHED,
                  options: [
                    {
                      title: "Size",
                      values: ["S", "M", "L", "XL"],
                    },
                  ],
                  variants: [
                    {
                      title: "S / Black",
                      sku: "special-shirt",
                      options: {
                        Size: "S",
                      },
                      manage_inventory: false,
                      prices: [
                        {
                          amount: 105,
                          currency_code: "usd",
                        },
                      ],
                    },
                  ],
                },
                adminHeaders
              )
            ).data.product

            cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: shippingAddressData,
                },
                storeHeadersWithCustomer
              )
            ).data.cart

            cart = (
              await api.post(
                `/store/carts/${cart.id}/line-items`,
                {
                  variant_id: product.variants[0].id,
                  quantity: 2,
                },
                storeHeaders
              )
            ).data.cart

            let updated = await api.post(
              `/store/carts/${cart.id}`,
              {
                promo_codes: [
                  taxInclPromotion50.code,
                  taxInclPromotion100.code,
                ],
              },
              storeHeaders
            )

            expect(updated.status).toEqual(200)
            expect(updated.data.cart).toEqual(
              expect.objectContaining({
                discount_total: 150,
                original_total: 210,
                total: 60, // 210 - (100 + 50 tax incl promotion)
                items: expect.arrayContaining([
                  expect.objectContaining({
                    is_tax_inclusive: true,
                    adjustments: expect.arrayContaining([
                      expect.objectContaining({
                        code: taxInclPromotion50.code,
                        amount: 50,
                        is_tax_inclusive: true,
                      }),
                      expect.objectContaining({
                        code: taxInclPromotion100.code,
                        amount: 100,
                        is_tax_inclusive: true,
                      }),
                    ]),
                  }),
                ]),
              })
            )
          })

          it("should verify that reapplying the same promotion code after the cart total has been reduced to zero does not incorrectly remove existing adjustments", async () => {
            const taxInclPromotion = (
              await api.post(
                `/admin/promotions`,
                {
                  code: "PROMOTION_TAX_INCLUSIVE",
                  type: PromotionType.STANDARD,
                  status: PromotionStatus.ACTIVE,
                  is_tax_inclusive: true,
                  application_method: {
                    type: "fixed",
                    target_type: "items",
                    allocation: "across",
                    currency_code: "usd",
                    value: 50,
                  },
                },
                adminHeaders
              )
            ).data.promotion

            const product = (
              await api.post(
                `/admin/products`,
                {
                  title: "Product for free",
                  description: "test",
                  status: ProductStatus.PUBLISHED,
                  options: [
                    {
                      title: "Size",
                      values: ["S", "M", "L", "XL"],
                    },
                  ],
                  variants: [
                    {
                      title: "S / Black",
                      sku: "special-shirt",
                      options: {
                        Size: "S",
                      },
                      manage_inventory: false,
                      prices: [
                        {
                          amount: 50,
                          currency_code: "usd",
                        },
                      ],
                    },
                  ],
                },
                adminHeaders
              )
            ).data.product

            cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: shippingAddressData,
                },
                storeHeadersWithCustomer
              )
            ).data.cart

            cart = (
              await api.post(
                `/store/carts/${cart.id}/line-items`,
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
                storeHeaders
              )
            ).data.cart

            let updated = await api.post(
              `/store/carts/${cart.id}`,
              {
                promo_codes: [taxInclPromotion.code],
              },
              storeHeaders
            )

            expect(updated.status).toEqual(200)
            expect(updated.data.cart).toEqual(
              expect.objectContaining({
                discount_total: 50,
                original_total: 50,
                total: 0,
                items: expect.arrayContaining([
                  expect.objectContaining({
                    is_tax_inclusive: true,
                    adjustments: expect.arrayContaining([
                      expect.objectContaining({
                        code: taxInclPromotion.code,
                        amount: 50,
                        is_tax_inclusive: true,
                      }),
                    ]),
                  }),
                ]),
              })
            )

            let updatedAgain = await api.post(
              `/store/carts/${cart.id}`,
              {
                promo_codes: [taxInclPromotion.code],
              },
              storeHeaders
            )

            expect(updatedAgain.status).toEqual(200)
            expect(updatedAgain.data.cart).toEqual(
              expect.objectContaining({
                discount_total: 50,
                original_total: 50,
                total: 0,
                items: expect.arrayContaining([
                  expect.objectContaining({
                    is_tax_inclusive: true,
                    adjustments: expect.arrayContaining([
                      expect.objectContaining({
                        code: taxInclPromotion.code,
                        amount: 50,
                        is_tax_inclusive: true,
                      }),
                    ]),
                  }),
                ]),
              })
            )
          })

          it("should add a 1500 USD tax inclusive promotion (fixed, across) for 50x 29,95 USD tax inclusive items and logically result in a 0 total with tax 5%", async () => {
            const taxInclPromotion = (
              await api.post(
                `/admin/promotions`,
                {
                  code: "PROMOTION_TAX_INCLUSIVE",
                  type: PromotionType.STANDARD,
                  status: PromotionStatus.ACTIVE,
                  is_tax_inclusive: true, //Here we apply a tax inclusive promotion to a tax inclusive item in a way that the total SHOULD be 0
                  application_method: {
                    type: "fixed",
                    target_type: "items",
                    allocation: "across",
                    currency_code: "usd",
                    value: 1500,
                  },
                },
                adminHeaders
              )
            ).data.promotion

            const product = (
              await api.post(
                `/admin/products`,
                {
                  title: "Product for free",
                  description: "test",
                  status: ProductStatus.PUBLISHED,
                  options: [
                    {
                      title: "Size",
                      values: ["S", "M", "L", "XL"],
                    },
                  ],
                  variants: [
                    {
                      title: "S / Black",
                      sku: "special-shirt",
                      options: {
                        Size: "S",
                      },
                      manage_inventory: false,
                      prices: [
                        {
                          amount: 29.95,
                          currency_code: "usd",
                        },
                      ],
                    },
                  ],
                },
                adminHeaders
              )
            ).data.product

            cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: shippingAddressData,
                },
                storeHeadersWithCustomer
              )
            ).data.cart

            cart = (
              await api.post(
                `/store/carts/${cart.id}/line-items`,
                {
                  variant_id: product.variants[0].id,
                  quantity: 50,
                },
                storeHeaders
              )
            ).data.cart

            let updated = await api.post(
              `/store/carts/${cart.id}`,
              { promo_codes: [taxInclPromotion.code] },
              storeHeaders
            )

            expect(updated.status).toEqual(200)
            expect(updated.data.cart).toEqual(
              expect.objectContaining({
                discount_total: 1497.5,
                original_total: 1497.5,
                total: 0,
                items: expect.arrayContaining([
                  expect.objectContaining({
                    is_tax_inclusive: true,
                    adjustments: expect.arrayContaining([
                      expect.objectContaining({
                        code: taxInclPromotion.code,
                        amount: 1497.5,
                        is_tax_inclusive: true,
                      }),
                    ]),
                  }),
                ]),
                promotions: expect.arrayContaining([
                  expect.objectContaining({
                    code: "PROMOTION_TAX_INCLUSIVE",
                    is_tax_inclusive: true,
                    application_method: expect.objectContaining({
                      value: 1500,
                    }),
                  }),
                ]),
              })
            )
          })

          it("should apply promotions to multiple quantity of the same product", async () => {
            const product = (
              await api.post(
                `/admin/products`,
                {
                  title: "Product for free",
                  status: ProductStatus.PUBLISHED,
                  description: "test",
                  options: [
                    {
                      title: "Size",
                      values: ["S"],
                    },
                  ],
                  variants: [
                    {
                      title: "S / Black",
                      sku: "special-shirt",
                      options: {
                        Size: "S",
                      },
                      manage_inventory: false,
                      prices: [
                        {
                          amount: 100,
                          currency_code: "eur",
                        },
                      ],
                    },
                  ],
                },
                adminHeaders
              )
            ).data.product

            const sameProductPromotion = (
              await api.post(
                `/admin/promotions`,
                {
                  code: "SAME_PRODUCT_PROMOTION",
                  type: PromotionType.STANDARD,
                  status: PromotionStatus.ACTIVE,
                  is_tax_inclusive: false,
                  is_automatic: true,
                  application_method: {
                    type: "fixed",
                    target_type: "items",
                    allocation: "each",
                    value: 100,
                    max_quantity: 5,
                    currency_code: "eur",
                    target_rules: [
                      {
                        attribute: "items.product_id",
                        operator: "in",
                        values: [product.id],
                      },
                    ],
                  },
                },
                adminHeaders
              )
            ).data.promotion

            cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "eur",
                  sales_channel_id: salesChannel.id,
                  region_id: noAutomaticRegion.id,
                  shipping_address: shippingAddressData,
                  items: [{ variant_id: product.variants[0].id, quantity: 2 }],
                },
                storeHeadersWithCustomer
              )
            ).data.cart

            expect(cart).toEqual(
              expect.objectContaining({
                discount_total: 200,
                original_total: 200,
                total: 0,
                items: expect.arrayContaining([
                  expect.objectContaining({
                    adjustments: expect.arrayContaining([
                      expect.objectContaining({
                        code: sameProductPromotion.code,
                        amount: 200,
                      }),
                    ]),
                  }),
                ]),
                promotions: expect.arrayContaining([
                  expect.objectContaining({
                    code: sameProductPromotion.code,
                  }),
                ]),
              })
            )
          })

          describe("Percentage promotions", () => {
            it("should apply a percentage promotion to a cart", async () => {
              const percentagePromotion = (
                await api.post(
                  `/admin/promotions`,
                  {
                    code: "PERCENTAGE_PROMOTION",
                    type: PromotionType.STANDARD,
                    status: PromotionStatus.ACTIVE,
                    is_automatic: false,
                    application_method: {
                      type: "percentage",
                      target_type: "items",
                      allocation: "each",
                      value: 100,
                      max_quantity: 1,
                      currency_code: "usd",
                      target_rules: [],
                    },
                  },
                  adminHeaders
                )
              ).data.promotion

              cart = (
                await api.post(
                  `/store/carts`,
                  {
                    currency_code: "usd",
                    sales_channel_id: salesChannel.id,
                    region_id: region.id,
                    shipping_address: shippingAddressData,
                    items: [
                      { variant_id: product.variants[0].id, quantity: 1 },
                    ],
                  },
                  storeHeadersWithCustomer
                )
              ).data.cart

              let updated = await api.post(
                `/store/carts/${cart.id}`,
                {
                  promo_codes: [percentagePromotion.code],
                },
                storeHeadersWithCustomer
              )

              expect(updated.status).toEqual(200)
              expect(updated.data.cart).toEqual(
                expect.objectContaining({
                  items: expect.arrayContaining([
                    expect.objectContaining({
                      adjustments: expect.arrayContaining([
                        expect.objectContaining({
                          code: percentagePromotion.code,
                        }),
                      ]),
                    }),
                  ]),
                })
              )
            })

            it("should not apply a percentage promotion to a cart if cart currency is not the same as the promotion currency", async () => {
              const percentagePromotion = (
                await api.post(
                  `/admin/promotions`,
                  {
                    code: "PERCENTAGE_PROMOTION",
                    type: PromotionType.STANDARD,
                    status: PromotionStatus.ACTIVE,
                    is_automatic: false,
                    application_method: {
                      type: "percentage",
                      target_type: "items",
                      allocation: "each",
                      value: 100,
                      max_quantity: 1,
                      currency_code: "eur",
                      target_rules: [],
                    },
                  },
                  adminHeaders
                )
              ).data.promotion

              cart = (
                await api.post(
                  `/store/carts`,
                  {
                    currency_code: "usd",
                    sales_channel_id: salesChannel.id,
                    region_id: region.id,
                    shipping_address: shippingAddressData,
                    items: [
                      { variant_id: product.variants[0].id, quantity: 1 },
                    ],
                  },
                  storeHeadersWithCustomer
                )
              ).data.cart

              let updated = await api.post(
                `/store/carts/${cart.id}`,
                {
                  promo_codes: [percentagePromotion.code],
                },
                storeHeadersWithCustomer
              )

              expect(updated.status).toEqual(200)
              expect(updated.data.cart).toEqual(
                expect.objectContaining({
                  items: expect.arrayContaining([
                    expect.objectContaining({
                      adjustments: [],
                    }),
                  ]),
                })
              )
            })
          })

          describe("ONCE allocation promotions", () => {
            it("should apply fixed promotion to lowest priced items first and respect max_quantity across cart", async () => {
              // Create two products with different prices
              const expensiveProduct = (
                await api.post(
                  "/admin/products",
                  {
                    title: "Expensive Product",
                    status: ProductStatus.PUBLISHED,
                    options: [{ title: "Size", values: ["L"] }],
                    variants: [
                      {
                        title: "Large",
                        sku: "expensive-l",
                        options: { Size: "L" },
                        manage_inventory: false,
                        prices: [{ amount: 10000, currency_code: "usd" }], // $100
                      },
                    ],
                    shipping_profile_id: shippingProfile.id,
                  },
                  adminHeaders
                )
              ).data.product

              const cheapProduct = (
                await api.post(
                  "/admin/products",
                  {
                    title: "Cheap Product",
                    status: ProductStatus.PUBLISHED,
                    options: [{ title: "Size", values: ["M"] }],
                    variants: [
                      {
                        title: "Medium",
                        sku: "cheap-m",
                        options: { Size: "M" },
                        manage_inventory: false,
                        prices: [{ amount: 5000, currency_code: "usd" }], // $50
                      },
                    ],
                    shipping_profile_id: shippingProfile.id,
                  },
                  adminHeaders
                )
              ).data.product

              const oncePromotion = (
                await api.post(
                  `/admin/promotions`,
                  {
                    code: "ONCE_PROMO_FIXED",
                    type: PromotionType.STANDARD,
                    status: PromotionStatus.ACTIVE,
                    is_automatic: false,
                    application_method: {
                      type: "fixed",
                      target_type: "items",
                      allocation: "once",
                      value: 1000, // $10 off
                      max_quantity: 2,
                      currency_code: "usd",
                      target_rules: [],
                    },
                  },
                  adminHeaders
                )
              ).data.promotion

              cart = (
                await api.post(
                  `/store/carts`,
                  {
                    currency_code: "usd",
                    sales_channel_id: salesChannel.id,
                    region_id: region.id,
                    shipping_address: shippingAddressData,
                    items: [
                      {
                        variant_id: expensiveProduct.variants[0].id,
                        quantity: 3,
                      },
                      { variant_id: cheapProduct.variants[0].id, quantity: 5 },
                    ],
                    promo_codes: [oncePromotion.code],
                  },
                  storeHeadersWithCustomer
                )
              ).data.cart

              // Should apply $10 discount twice to the cheap product only (lowest price)
              const cheapItem = cart.items.find(
                (i) => i.variant_id === cheapProduct.variants[0].id
              )
              const expensiveItem = cart.items.find(
                (i) => i.variant_id === expensiveProduct.variants[0].id
              )

              expect(cheapItem.adjustments).toHaveLength(1)
              expect(cheapItem.adjustments[0].amount).toBe(2000) // 2 * $10
              expect(cheapItem.adjustments[0].code).toBe(oncePromotion.code)

              expect(expensiveItem.adjustments).toHaveLength(0)
            })

            it("should distribute promotion across multiple items when max_quantity exceeds first item quantity", async () => {
              const product1 = (
                await api.post(
                  "/admin/products",
                  {
                    title: "Product 1",
                    status: ProductStatus.PUBLISHED,
                    options: [{ title: "Size", values: ["S"] }],
                    variants: [
                      {
                        title: "Small",
                        sku: "prod1-s",
                        options: { Size: "S" },
                        manage_inventory: false,
                        prices: [{ amount: 5000, currency_code: "usd" }], // $50
                      },
                    ],
                    shipping_profile_id: shippingProfile.id,
                  },
                  adminHeaders
                )
              ).data.product

              const product2 = (
                await api.post(
                  "/admin/products",
                  {
                    title: "Product 2",
                    status: ProductStatus.PUBLISHED,
                    options: [{ title: "Size", values: ["M"] }],
                    variants: [
                      {
                        title: "Medium",
                        sku: "prod2-m",
                        options: { Size: "M" },
                        manage_inventory: false,
                        prices: [{ amount: 6000, currency_code: "usd" }], // $60
                      },
                    ],
                    shipping_profile_id: shippingProfile.id,
                  },
                  adminHeaders
                )
              ).data.product

              const oncePromotion = (
                await api.post(
                  `/admin/promotions`,
                  {
                    code: "ONCE_PROMO_DISTRIBUTE",
                    type: PromotionType.STANDARD,
                    status: PromotionStatus.ACTIVE,
                    is_automatic: false,
                    application_method: {
                      type: "fixed",
                      target_type: "items",
                      allocation: "once",
                      value: 500, // $5 off
                      max_quantity: 4,
                      currency_code: "usd",
                      target_rules: [],
                    },
                  },
                  adminHeaders
                )
              ).data.promotion

              cart = (
                await api.post(
                  `/store/carts`,
                  {
                    currency_code: "usd",
                    sales_channel_id: salesChannel.id,
                    region_id: region.id,
                    shipping_address: shippingAddressData,
                    items: [
                      { variant_id: product1.variants[0].id, quantity: 2 },
                      { variant_id: product2.variants[0].id, quantity: 3 },
                    ],
                    promo_codes: [oncePromotion.code],
                  },
                  storeHeadersWithCustomer
                )
              ).data.cart

              // Should apply: 2 units to product1 ($50), 2 units to product2 ($60)
              const item1 = cart.items.find(
                (i) => i.variant_id === product1.variants[0].id
              )
              const item2 = cart.items.find(
                (i) => i.variant_id === product2.variants[0].id
              )

              expect(item1.adjustments).toHaveLength(1)
              expect(item1.adjustments[0].amount).toBe(1000) // 2 * $5

              expect(item2.adjustments).toHaveLength(1)
              expect(item2.adjustments[0].amount).toBe(1000) // 2 * $5
            })

            it("should apply percentage promotion with once allocation to lowest priced items", async () => {
              const product1 = (
                await api.post(
                  "/admin/products",
                  {
                    title: "Expensive Product",
                    status: ProductStatus.PUBLISHED,
                    options: [{ title: "Size", values: ["L"] }],
                    variants: [
                      {
                        title: "Large",
                        sku: "expensive-prod",
                        options: { Size: "L" },
                        manage_inventory: false,
                        prices: [{ amount: 10000, currency_code: "usd" }], // $100
                      },
                    ],
                    shipping_profile_id: shippingProfile.id,
                  },
                  adminHeaders
                )
              ).data.product

              const product2 = (
                await api.post(
                  "/admin/products",
                  {
                    title: "Cheap Product",
                    status: ProductStatus.PUBLISHED,
                    options: [{ title: "Size", values: ["S"] }],
                    variants: [
                      {
                        title: "Small",
                        sku: "cheap-prod",
                        options: { Size: "S" },
                        manage_inventory: false,
                        prices: [{ amount: 5000, currency_code: "usd" }], // $50
                      },
                    ],
                    shipping_profile_id: shippingProfile.id,
                  },
                  adminHeaders
                )
              ).data.product

              const oncePromotion = (
                await api.post(
                  `/admin/promotions`,
                  {
                    code: "ONCE_PROMO_PERCENTAGE",
                    type: PromotionType.STANDARD,
                    status: PromotionStatus.ACTIVE,
                    is_automatic: false,
                    application_method: {
                      type: "percentage",
                      target_type: "items",
                      allocation: "once",
                      value: 20, // 20% off
                      max_quantity: 3,
                      currency_code: "usd",
                      target_rules: [],
                    },
                  },
                  adminHeaders
                )
              ).data.promotion

              cart = (
                await api.post(
                  `/store/carts`,
                  {
                    currency_code: "usd",
                    sales_channel_id: salesChannel.id,
                    region_id: region.id,
                    shipping_address: shippingAddressData,
                    items: [
                      { variant_id: product1.variants[0].id, quantity: 5 },
                      { variant_id: product2.variants[0].id, quantity: 4 },
                    ],
                    promo_codes: [oncePromotion.code],
                  },
                  storeHeadersWithCustomer
                )
              ).data.cart

              // Should apply 20% to 3 units of the cheap product
              // Tax-inclusive calculation: (($50 * 1.05) * 3 * 20%) / 1.05 ≈ $28.57 per unit * 3 = ~$2857
              // The promotion inherits tax_inclusive from the cart's currency settings
              const cheapItem = cart.items.find(
                (i) => i.variant_id === product2.variants[0].id
              )
              const expensiveItem = cart.items.find(
                (i) => i.variant_id === product1.variants[0].id
              )

              expect(cheapItem.adjustments).toHaveLength(1)
              // Tax-inclusive: 20% of (3 units * $50 tax-inclusive) accounting for 5% tax
              expect(cheapItem.adjustments[0].amount).toBeCloseTo(2857.14, 0)
              expect(cheapItem.adjustments[0].code).toBe(oncePromotion.code)

              expect(expensiveItem.adjustments).toHaveLength(0)
            })
          })
        })
      })

      describe("POST /store/carts/:id/promotions", () => {
        it("should add promotions and refresh payment collection", async () => {
          cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: shippingAddressData,
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
              },
              storeHeaders
            )
          ).data.cart

          const paymentCollection = (
            await api.post(
              `/store/payment-collections`,
              { cart_id: cart.id },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          cart = (await api.get(`/store/carts/${cart.id}`, storeHeaders)).data
            .cart
          expect(cart.total).toEqual(1500)
          expect(cart.payment_collection.amount).toEqual(1500)

          const cartAfterPromotion = (
            await api.post(
              `/store/carts/${cart.id}/promotions`,
              { promo_codes: [promotion.code] },
              storeHeaders
            )
          ).data.cart

          expect(cartAfterPromotion).toEqual(
            expect.objectContaining({
              id: cart.id,
              total: 1395,
              discount_total: 105,
              payment_collection: expect.objectContaining({
                amount: 1395,
              }),
              items: expect.arrayContaining([
                expect.objectContaining({
                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      code: "PROMOTION_APPLIED",
                      promotion_id: promotion.id,
                      amount: 100,
                    }),
                  ]),
                }),
              ]),
            })
          )
        })
      })

      describe("DELETE /store/carts/:id/promotions", () => {
        it("should remove promotions and recalculate payment_collection amount", async () => {
          cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: shippingAddressData,
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                promo_codes: [promotion.code],
              },
              storeHeaders
            )
          ).data.cart

          const paymentCollection = await api
            .post(
              `/store/payment-collections`,
              { cart_id: cart.id },
              storeHeaders
            )
            .then((response) => response.data.payment_collection)

          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          cart = (await api.get(`/store/carts/${cart.id}`, storeHeaders)).data
            .cart

          expect(cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              total: 1395,
              discount_total: 105,
              payment_collection: expect.objectContaining({
                amount: 1395,
              }),
              items: expect.arrayContaining([
                expect.objectContaining({
                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      code: "PROMOTION_APPLIED",
                      promotion_id: promotion.id,
                      amount: 100,
                    }),
                  ]),
                }),
              ]),
            })
          )

          const cartAfterDeletion = await api
            .delete(`/store/carts/${cart.id}/promotions`, {
              data: { promo_codes: [promotion.code] },
              ...storeHeaders,
            })
            .then((response) => response.data.cart)

          expect(cartAfterDeletion).toEqual(
            expect.objectContaining({
              id: cart.id,
              total: 1500,
              discount_total: 0,
              payment_collection: expect.objectContaining({
                amount: 1500,
              }),
              items: expect.arrayContaining([
                expect.objectContaining({
                  adjustments: [],
                }),
              ]),
            })
          )
        })
      })

      describe("POST /store/carts/:id/customer", () => {
        beforeEach(async () => {
          cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
              },
              storeHeaders
            )
          ).data.cart
        })

        it("should throw 401 when user is not logged in as a customer", async () => {
          const { response } = await api
            .post(`/store/carts/${cart.id}/customer`, {}, storeHeaders)
            .catch((e) => e)

          expect(response.status).toEqual(401)
        })

        it("should throw error when cart does not exist", async () => {
          const { response } = await api
            .post(
              `/store/carts/does-not-exist/customer`,
              {},
              storeHeadersWithCustomer
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data.message).toEqual(
            "Cart id not found: does-not-exist"
          )
        })

        it("should successfully update cart customer when cart is without customer", async () => {
          const updated = await api.post(
            `/store/carts/${cart.id}/customer`,
            {},
            storeHeadersWithCustomer
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              email: customer.email,
              customer: expect.objectContaining({
                id: customer.id,
                email: customer.email,
              }),
            })
          )
        })

        it("should successfully update cart customer when cart has a guest customer", async () => {
          const guestEmail = "tony@guest.com"
          const updatedCart = await api.post(
            `/store/carts/${cart.id}`,
            { email: guestEmail },
            storeHeadersWithCustomer
          )

          expect(updatedCart.status).toEqual(200)
          expect(updatedCart.data.cart).toEqual(
            expect.objectContaining({
              email: guestEmail,
              customer: expect.objectContaining({
                email: guestEmail,
              }),
            })
          )

          const updated = await api.post(
            `/store/carts/${cart.id}/customer`,
            {},
            storeHeadersWithCustomer
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              email: customer.email,
              customer: expect.objectContaining({
                id: customer.id,
                email: customer.email,
              }),
            })
          )
        })

        it("should successfully update cart customer when customer already owns the cart", async () => {
          const guestEmail = "tony@guest.com"

          await api.post(
            `/store/carts/${cart.id}/customer`,
            {},
            storeHeadersWithCustomer
          )

          const updatedCart = await api.post(
            `/store/carts/${cart.id}`,
            { email: guestEmail },
            storeHeadersWithCustomer
          )

          expect(updatedCart.status).toEqual(200)
          expect(updatedCart.data.cart).toEqual(
            expect.objectContaining({
              email: guestEmail,
              customer: expect.objectContaining({
                email: customer.email,
              }),
            })
          )

          const updated = await api.post(
            `/store/carts/${cart.id}/customer`,
            {},
            storeHeadersWithCustomer
          )

          expect(updated.status).toEqual(200)
          expect(updated.data.cart).toEqual(
            expect.objectContaining({
              email: guestEmail,
              customer: expect.objectContaining({
                id: customer.id,
                email: customer.email,
              }),
            })
          )
        })
      })

      describe("POST /store/carts/:id/shipping-methods", () => {
        let shippingOption

        beforeEach(async () => {
          const stockLocation = (
            await api.post(
              `/admin/stock-locations`,
              { name: "test location" },
              adminHeaders
            )
          ).data.stock_location

          await api.post(
            `/admin/stock-locations/${stockLocation.id}/sales-channels`,
            { add: [salesChannel.id] },
            adminHeaders
          )

          const shippingProfile = (
            await api.post(
              `/admin/shipping-profiles`,
              { name: `test-${stockLocation.id}`, type: "default" },
              adminHeaders
            )
          ).data.shipping_profile

          const fulfillmentSets = (
            await api.post(
              `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
              {
                name: `Test-${shippingProfile.id}`,
                type: "test-type",
              },
              adminHeaders
            )
          ).data.stock_location.fulfillment_sets

          const fulfillmentSet = (
            await api.post(
              `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
              {
                name: `Test-${shippingProfile.id}`,
                geo_zones: [
                  { type: "country", country_code: "it" },
                  { type: "country", country_code: "us" },
                ],
              },
              adminHeaders
            )
          ).data.fulfillment_set

          await api.post(
            `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
            { add: ["manual_test-provider"] },
            adminHeaders
          )

          shippingOption = (
            await api.post(
              `/admin/shipping-options`,
              {
                name: `Test shipping option ${fulfillmentSet.id}`,
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: "manual_test-provider",
                price_type: "flat",
                type: {
                  label: "Test type",
                  description: "Test description",
                  code: "test-code",
                },
                prices: [
                  { currency_code: "usd", amount: 1000 },
                  {
                    currency_code: "usd",
                    amount: 500,
                    rules: [
                      {
                        attribute: "item_total",
                        operator: "gt",
                        value: 3000,
                      },
                    ],
                  },
                ],
                rules: [
                  {
                    attribute: "enabled_in_store",
                    value: "true",
                    operator: "eq",
                  },
                  {
                    attribute: "is_return",
                    value: "false",
                    operator: "eq",
                  },
                ],
              },
              adminHeaders
            )
          ).data.shipping_option

          cart = (
            await api.post(
              `/store/carts?fields=+total`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
              },
              storeHeadersWithCustomer
            )
          ).data.cart
        })

        it("should add shipping method to cart", async () => {
          let response = await api.post(
            `/store/carts/${cart.id}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              shipping_methods: expect.arrayContaining([
                expect.objectContaining({
                  shipping_option_id: shippingOption.id,
                  amount: 1000,
                  is_tax_inclusive: true,
                }),
              ]),
            })
          )

          // Total is over the amount 3000 to enable the second pricing rule
          const cart2 = (
            await api.post(
              `/store/carts?fields=+total`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                items: [{ variant_id: product.variants[0].id, quantity: 5 }],
              },
              storeHeadersWithCustomer
            )
          ).data.cart

          response = await api.post(
            `/store/carts/${cart2.id}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )

          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart2.id,
              shipping_methods: expect.arrayContaining([
                expect.objectContaining({
                  shipping_option_id: shippingOption.id,
                  amount: 500,
                  is_tax_inclusive: true,
                }),
              ]),
            })
          )
        })

        it("should add shipping method with tax rate override to cart", async () => {
          let taxRegion = (
            await api.get(`/admin/tax-regions?country_code=us`, adminHeaders)
          ).data.tax_regions[0]

          // Create tax rate override for shipping option
          await api.post(
            `/admin/tax-rates`,
            {
              name: "Shipping Option Override",
              tax_region_id: taxRegion.id,
              rate: 25,
              code: "T25",
              is_combinable: false,
              rules: [
                {
                  reference: "shipping_option",
                  reference_id: shippingOption.id,
                },
              ],
              is_default: false,
            },
            adminHeaders
          )

          let response = await api.post(
            `/store/carts/${cart.id}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              shipping_methods: expect.arrayContaining([
                expect.objectContaining({
                  shipping_option_id: shippingOption.id,
                  amount: 1000,
                  is_tax_inclusive: true,
                  tax_lines: expect.arrayContaining([
                    expect.objectContaining({
                      id: expect.any(String),
                      description: "Shipping Option Override",
                      code: "T25",
                      rate: 25,
                      provider_id: "system",
                    }),
                  ]),
                }),
              ]),
            })
          )
        })

        it("should throw when prices are not setup for shipping option", async () => {
          cart = (
            await api.post(
              `/store/carts?fields=+total`,
              {
                currency_code: "eur",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                items: [{ variant_id: product.variants[0].id, quantity: 5 }],
              },
              storeHeadersWithCustomer
            )
          ).data.cart

          let { response } = await api
            .post(
              `/store/carts/${cart.id}/shipping-methods`,
              { option_id: shippingOption.id },
              storeHeaders
            )
            .catch((e) => e)

          expect(response.data).toEqual({
            type: "invalid_data",
            message: `Shipping options with IDs ${shippingOption.id} do not have a price`,
          })
        })

        it("should throw when shipping option id is not found", async () => {
          let { response } = await api
            .post(
              `/store/carts/${cart.id}/shipping-methods`,
              { option_id: "does-not-exist" },
              storeHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Shipping Options are invalid for cart.",
          })
        })
      })
    })

    describe("workflows", () => {
      it("updateCartsStep - should not call listCarts when data is empty", async () => {
        const cartService = appContainer.resolve(Modules.CART)
        const listCartsSpy = jest.spyOn(cartService, "listCarts")

        const workflow = createWorkflow("test-workflow", () => {
          return new WorkflowResponse(updateCartsStep([]))
        })

        const { result } = await workflow(appContainer).run({
          input: [],
        })

        expect(result).toEqual([])
        expect(listCartsSpy).not.toHaveBeenCalled()

        listCartsSpy.mockRestore()
      })
    })
  },
})
