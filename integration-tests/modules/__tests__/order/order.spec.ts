import {
  createOrderChangeWorkflow,
  createOrderWorkflow,
} from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  CreateOrderLineItemDTO,
  IOrderModuleService,
  OrderDTO,
} from "@medusajs/types"
import { Modules, ProductStatus } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = {}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer
    let orderModule: IOrderModuleService

    beforeAll(async () => {
      appContainer = getContainer()
      orderModule = appContainer.resolve(Modules.ORDER)
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, appContainer)
    })

    describe("CreateOrderWorkflow", () => {
      it("should create an order with items quantity and no unit price and calculate prices based on the correct pricing context including quantity", async () => {
        const salesChannel = await api.post(
          "/admin/sales-channels",
          {
            name: "Test Sales Channel",
            description: "Test Sales Channel Description",
          },
          adminHeaders
        )

        const productData = {
          title: "Medusa T-Shirt based quantity",
          handle: "t-shirt-with-quantity-prices",
          status: ProductStatus.PUBLISHED,
          sales_channels: [
            {
              id: salesChannel.data.sales_channel.id,
            },
          ],
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
        const salesChannelId = salesChannel.data.sales_channel.id
        const customer = (
          await api.post(
            "/admin/customers",
            {
              email: "test1@email.com",
            },
            adminHeaders
          )
        ).data.customer
        const region = (
          await api.post(
            "/admin/regions",
            { name: "US", currency_code: "usd", countries: ["us"] },
            adminHeaders
          )
        ).data.region

        const { result: created } = await createOrderWorkflow(appContainer).run(
          {
            input: {
              email: customer.email,
              metadata: {
                foo: "bar",
              },
              items: [
                {
                  title: "Medusa T-Shirt based quantity",
                  variant_id: variantId,
                  quantity: 6,
                } as CreateOrderLineItemDTO,
              ],
              sales_channel_id: salesChannelId,
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
              customer_id: customer.id,
            },
          }
        )

        const order = (
          await api.get(
            "/admin/orders/" +
              created.id +
              "?fields=+raw_total,+raw_subtotal,+raw_discount_total",
            adminHeaders
          )
        ).data.order

        expect(order).toEqual(
          expect.objectContaining({
            original_item_subtotal: 6000,
            original_item_tax_total: 0,
            original_item_total: 6000,
            original_shipping_subtotal: 10,
            original_shipping_tax_total: 1,
            original_shipping_total: 11,
            original_tax_total: 1,
            original_total: 6011,
            item_subtotal: 6000,
            item_tax_total: 0,
            item_total: 6000,
          })
        )
      })
    })

    describe("Orders - Admin", () => {
      it("should get an order", async () => {
        const created = await orderModule.createOrders({
          region_id: "test_region_id",
          email: "foo@bar.com",
          metadata: {
            foo: "bar",
          },
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

        const response = await api.get(
          "/admin/orders/" +
            created.id +
            "?fields=+raw_total,+raw_subtotal,+raw_discount_total",
          adminHeaders
        )

        const order = response.data.order
        expect(order).toEqual({
          id: expect.any(String),
          status: "pending",
          version: 1,
          display_id: 2,
          custom_display_id: null,
          payment_collections: [],
          payment_status: "not_paid",
          region_id: "test_region_id",
          fulfillments: [],
          locale: null,
          metadata: {
            foo: "bar",
          },
          fulfillment_status: "not_fulfilled",
          summary: expect.objectContaining({
            // TODO: add all summary fields
          }),
          total: 59.9,
          subtotal: 60,
          tax_total: 0.9,
          discount_total: 1.1,
          discount_tax_total: 0.1,
          original_total: 61,
          original_subtotal: 60,
          original_tax_total: 1,
          item_total: 50,
          item_subtotal: 50,
          item_tax_total: 0,
          original_item_total: 50,
          original_item_subtotal: 50,
          original_item_tax_total: 0,
          shipping_total: 9.9,
          shipping_subtotal: 10,
          shipping_tax_total: 0.9,
          original_shipping_tax_total: 1,
          original_shipping_subtotal: 10,
          original_shipping_total: 11,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          raw_total: {
            value: "59.899999999999999995",
            precision: 20,
          },
          raw_subtotal: {
            value: "60",
            precision: 20,
          },
          raw_discount_total: {
            value: "1.100000000000000005",
            precision: 20,
          },
          items: [
            {
              id: expect.any(String),
              title: "Custom Item 2",
              subtitle: null,
              thumbnail: null,
              variant_id: null,
              product_id: null,
              product_title: null,
              product_description: null,
              product_subtitle: null,
              product_type: null,
              product_type_id: null,
              product_collection: null,
              product_handle: null,
              variant_sku: null,
              variant_barcode: null,
              variant_title: null,
              variant_option_values: null,
              requires_shipping: true,
              is_discountable: true,
              is_giftcard: false,
              is_tax_inclusive: false,
              raw_compare_at_unit_price: null,
              raw_unit_price: {
                value: "50",
                precision: 20,
              },
              is_custom_price: false,
              metadata: null,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
              tax_lines: [],
              adjustments: expect.arrayContaining([
                {
                  id: expect.any(String),
                  description: "VIP discount",
                  promotion_id: expect.any(String),
                  code: "VIP_25 ETH",
                  is_tax_inclusive: false,
                  raw_amount: {
                    value: "5e-18",
                    precision: 20,
                  },
                  version: 1,
                  provider_id: expect.any(String),
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  deleted_at: null,
                  item_id: expect.any(String),
                  amount: 0,
                  subtotal: 0,
                  total: 0,
                  raw_subtotal: {
                    value: "5e-18",
                    precision: 20,
                  },
                  raw_total: {
                    value: "5e-18",
                    precision: 20,
                  },
                },
              ]),
              compare_at_unit_price: null,
              unit_price: 50,
              quantity: 1,
              raw_quantity: {
                value: "1",
                precision: 20,
              },
              detail: expect.objectContaining({
                id: expect.any(String),
                order_id: expect.any(String),
                version: 1,
                item_id: expect.any(String),
                raw_quantity: {
                  value: "1",
                  precision: 20,
                },
                raw_fulfilled_quantity: {
                  value: "0",
                  precision: 20,
                },
                raw_shipped_quantity: {
                  value: "0",
                  precision: 20,
                },
                raw_return_requested_quantity: {
                  value: "0",
                  precision: 20,
                },
                raw_return_received_quantity: {
                  value: "0",
                  precision: 20,
                },
                raw_return_dismissed_quantity: {
                  value: "0",
                  precision: 20,
                },
                raw_written_off_quantity: {
                  value: "0",
                  precision: 20,
                },
                metadata: null,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
                quantity: 1,
                fulfilled_quantity: 0,
                shipped_quantity: 0,
                return_requested_quantity: 0,
                return_received_quantity: 0,
                return_dismissed_quantity: 0,
                written_off_quantity: 0,
              }),
              subtotal: 50,
              total: 50,
              original_total: 50,
              original_subtotal: 50,
              discount_total: 0,
              discount_tax_total: 0,
              discount_subtotal: 0,
              tax_total: 0,
              original_tax_total: 0,
              refundable_total: 50,
              refundable_total_per_unit: 50,
              fulfilled_total: 0,
              return_dismissed_total: 0,
              return_received_total: 0,
              return_requested_total: 0,
              shipped_total: 0,
              write_off_total: 0,
              raw_subtotal: {
                value: "50",
                precision: 20,
              },
              raw_total: {
                value: "49.999999999999999995",
                precision: 20,
              },
              raw_original_total: {
                value: "50",
                precision: 20,
              },
              raw_discount_total: {
                value: "5e-18",
                precision: 20,
              },
              raw_discount_subtotal: {
                precision: 20,
                value: "5e-18",
              },
              raw_discount_tax_total: {
                value: "0",
                precision: 20,
              },
              raw_tax_total: {
                value: "0",
                precision: 20,
              },
              raw_original_tax_total: {
                value: "0",
                precision: 20,
              },
              raw_refundable_total: {
                precision: 20,
                value: "49.999999999999999995",
              },
              raw_refundable_total_per_unit: {
                precision: 20,
                value: "49.999999999999999995",
              },
              raw_fulfilled_total: {
                precision: 20,
                value: "0",
              },
              raw_original_subtotal: {
                precision: 20,
                value: "50",
              },
              raw_return_dismissed_total: {
                precision: 20,
                value: "0",
              },
              raw_return_received_total: {
                precision: 20,
                value: "0",
              },
              raw_return_requested_total: {
                precision: 20,
                value: "0",
              },
              raw_shipped_total: {
                precision: 20,
                value: "0",
              },
              raw_write_off_total: {
                precision: 20,
                value: "0",
              },
            },
          ],
          shipping_address: {
            id: expect.any(String),
            customer_id: null,
            company: null,
            first_name: "Test",
            last_name: "Test",
            address_1: "Test",
            address_2: null,
            city: "Test",
            country_code: "US",
            province: null,
            postal_code: "12345",
            phone: "12345",
            metadata: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          },
          billing_address: {
            id: expect.any(String),
            customer_id: null,
            company: null,
            first_name: "Test",
            last_name: "Test",
            address_1: "Test",
            address_2: null,
            city: "Test",
            country_code: "US",
            province: null,
            postal_code: "12345",
            phone: null,
            metadata: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
          },
          shipping_methods: [
            expect.objectContaining({
              id: expect.any(String),
              order_id: expect.any(String),
              name: "Test shipping method",
              description: null,
              raw_amount: {
                value: "10",
                precision: 20,
              },
              is_tax_inclusive: false,
              shipping_option_id: null,
              data: {},
              metadata: null,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              tax_lines: expect.arrayContaining([
                {
                  id: expect.any(String),
                  description: "shipping Tax 1",
                  tax_rate_id: expect.any(String),
                  code: "code",
                  raw_rate: {
                    value: "10",
                    precision: 20,
                  },
                  provider_id: null,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  deleted_at: null,
                  shipping_method_id: expect.any(String),
                  rate: 10,
                  total: 0.9,
                  subtotal: 1,
                  raw_total: {
                    value: "0.9",
                    precision: 20,
                  },
                  raw_subtotal: {
                    value: "1",
                    precision: 20,
                  },
                },
              ]),
              adjustments: expect.arrayContaining([
                {
                  id: expect.any(String),
                  description: "VIP discount",
                  promotion_id: expect.any(String),
                  code: "VIP_10",
                  raw_amount: {
                    value: "1",
                    precision: 20,
                  },
                  provider_id: null,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  deleted_at: null,
                  shipping_method_id: expect.any(String),
                  amount: 1,
                  subtotal: 1,
                  total: 1.1,
                  raw_subtotal: {
                    value: "1",
                    precision: 20,
                  },
                  raw_total: {
                    value: "1.1",
                    precision: 20,
                  },
                },
              ]),
              amount: 10,
              subtotal: 10,
              total: 9.9,
              original_total: 11,
              discount_total: 1.1,
              discount_tax_total: 0.1,
              tax_total: 0.9,
              original_tax_total: 1,
              raw_subtotal: {
                value: "10",
                precision: 20,
              },
              raw_total: {
                value: "9.9",
                precision: 20,
              },
              raw_original_total: {
                value: "11",
                precision: 20,
              },
              raw_discount_total: {
                value: "1.1",
                precision: 20,
              },
              raw_discount_tax_total: {
                value: "0.1",
                precision: 20,
              },
              raw_tax_total: {
                value: "0.9",
                precision: 20,
              },
              raw_original_tax_total: {
                value: "1",
                precision: 20,
              },
            }),
          ],
          credit_lines: [],
          credit_line_subtotal: 0,
          credit_line_tax_total: 0,
          credit_line_total: 0,
        })
      })
    })

    it("should delete an order and related entities", async () => {
      const toDeleteOrder = await orderModule.createOrders({
        region_id: "test_region_id",
        email: "foo@bar.com",
        metadata: {
          foo: "bar",
        },
        items: [
          {
            title: "Custom Item 1",
            quantity: 1,
            unit_price: 20,
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
          first_name: "Shipping 1",
          last_name: "Test 1",
          address_1: "Test 1",
          city: "Test 1",
          country_code: "US",
          postal_code: "12345",
          phone: "12345",
        },
        billing_address: {
          first_name: "Billing 1",
          last_name: "Test 1",
          address_1: "Test 1",
          city: "Test 1",
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

      const persistedOrder = (await orderModule.createOrders({
        region_id: "test_region_id",
        email: "foo@bar.com",
        metadata: {
          foo: "bar",
        },
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
          first_name: "Shipping 2",
          last_name: "Test 2",
          address_1: "Test 2",
          city: "Test 2",
          country_code: "US",
          postal_code: "12345",
          phone: "12345",
        },
        billing_address: {
          first_name: "Billing 2",
          last_name: "Test 2",
          address_1: "Test 2",
          city: "Test 2",
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
                description: "shipping Tax 2",
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
      })) as OrderDTO & {
        shipping_address_id: string
        billing_address_id: string
      }

      const { result: toDeleteOrderEdit } = await createOrderChangeWorkflow(
        appContainer
      ).run({
        input: {
          order_id: toDeleteOrder.id,
        },
      })

      const { result: persistedOrderEdit } = await createOrderChangeWorkflow(
        appContainer
      ).run({
        input: {
          order_id: persistedOrder.id,
        },
      })

      await orderModule.deleteOrders([toDeleteOrder.id])

      const orderItems = (await dbConnection.raw("select * from order_item;"))
        .rows

      expect(orderItems.length).toBe(1)
      expect(orderItems[0].id).toBe(persistedOrder.items[0].detail.id)

      /**
       * ORDER ITEMS AND LINE ITEMS
       */

      const orderLineItems = (
        await dbConnection.raw("select * from order_line_item;")
      ).rows

      expect(orderLineItems.length).toBe(1)
      expect(orderLineItems[0].id).toBe(persistedOrder.items[0].id)

      const orderShipping = (
        await dbConnection.raw("select * from order_shipping;")
      ).rows

      expect(orderShipping.length).toBe(1)
      expect(orderShipping[0]).toEqual(
        expect.objectContaining({
          order_id: persistedOrder.id,
          shipping_method_id: persistedOrder.shipping_methods[0].id,
        })
      )

      /**
       * ORDER SHIPPING AND SHIPPING METHODS
       */

      const orderShippingMethod = (
        await dbConnection.raw("select * from order_shipping_method;")
      ).rows

      expect(orderShippingMethod.length).toBe(1)
      expect(orderShippingMethod[0]).toEqual(
        expect.objectContaining({
          id: persistedOrder.shipping_methods[0].id,
        })
      )

      /**
       * ORDER BILLING AND SHIPPING ADDRESSES
       */

      const addresses = (await dbConnection.raw("select * from order_address;"))
        .rows

      expect(addresses.length).toBe(2)
      expect(addresses.map((a) => a.id)).toEqual(
        expect.arrayContaining([
          persistedOrder.shipping_address_id,
          persistedOrder.billing_address_id,
        ])
      )

      /**
       * ORDER SUMMARY
       */

      const orderSummary = (
        await dbConnection.raw("select * from order_summary;")
      ).rows

      expect(orderSummary.length).toBe(1)
      expect(orderSummary[0].totals.original_order_total).toBe(
        persistedOrder.summary.original_order_total
      )

      /**
       * ORDER CHANGES
       */

      const orderChangeRows = (
        await dbConnection.raw("select * from order_change;")
      ).rows

      expect(orderChangeRows.length).toBe(1)
      expect(orderChangeRows[0].id).toBe(persistedOrderEdit.id)

      const orders = (
        await api.get("/admin/orders?fields=*shipping_address", adminHeaders)
      ).data.orders

      expect(orders.length).toBe(1)
      expect(orders[0].id).toBe(persistedOrder.id)
    })
  },
})
