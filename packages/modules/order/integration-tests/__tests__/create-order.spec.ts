import { CreateOrderDTO, IOrderModuleService } from "@medusajs/framework/types"
import { Modules, promiseAll } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IOrderModuleService>({
  moduleName: Modules.ORDER,
  moduleOptions: {
    generateCustomDisplayId: async (order: CreateOrderDTO): Promise<string> => {
      return order.currency_code + "_1234567890"
    },
  },
  testSuite: ({ service, MikroOrmWrapper }) => {
    describe("Order Module Service", () => {
      const input = {
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
            product_type_id: "type_1",
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
            unit_price: 20,
            tax_lines: [
              {
                description: "Tax 1",
                tax_rate_id: "tax_usa",
                code: "code",
                rate: 10,
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
            amount: 48.9,
            currency_code: "USD",
            reference: "payment",
            reference_id: "pay_123",
          },
        ],
        currency_code: "usd",
        customer_id: "joe",
      } as CreateOrderDTO

      const expectation = expect.objectContaining({
        id: expect.stringContaining("order_"),
        version: 1,
        display_id: 1,
        custom_display_id: "usd_1234567890",
        summary: expect.objectContaining({
          // TODO: add all summary fields
        }),
        shipping_address: expect.objectContaining({
          id: expect.stringContaining("ordaddr_"),
        }),
        billing_address: expect.objectContaining({
          id: expect.stringContaining("ordaddr_"),
        }),
        items: expect.arrayContaining([
          expect.objectContaining({
            id: expect.stringContaining("ordli_"),
            quantity: 1,
            tax_lines: [
              expect.objectContaining({
                id: expect.stringContaining("ordlitxl_"),
              }),
            ],
            adjustments: [
              expect.objectContaining({
                id: expect.stringContaining("ordliadj_"),
              }),
            ],
            detail: expect.objectContaining({
              id: expect.stringContaining("orditem_"),
              version: 1,
              quantity: 1,
              shipped_quantity: 0,
            }),
          }),
          expect.objectContaining({
            id: expect.stringContaining("ordli_"),
            quantity: 2,
            tax_lines: [],
            adjustments: [],
            detail: expect.objectContaining({
              id: expect.stringContaining("orditem_"),
              version: 1,
              quantity: 2,
              fulfilled_quantity: 0,
            }),
          }),
          expect.objectContaining({
            id: expect.stringContaining("ordli_"),
            tax_lines: [],
            adjustments: [],
            detail: expect.objectContaining({
              id: expect.stringContaining("orditem_"),
              version: 1,
            }),
          }),
        ]),
        shipping_methods: [
          expect.objectContaining({
            id: expect.stringContaining("ordsm_"),
            tax_lines: [
              expect.objectContaining({
                id: expect.stringContaining("ordsmtxl_"),
              }),
            ],
            adjustments: [
              expect.objectContaining({
                id: expect.stringContaining("ordsmadj_"),
              }),
            ],
          }),
        ],
      })

      it("should create an order, shipping method and items. Including taxes and adjustments associated with them", async function () {
        const createdOrder = await service.createOrders(input)

        expect(createdOrder).toEqual(expectation)
      })

      it("should create an order, shipping method and items. Including taxes and adjustments associated with them and add new transactions", async function () {
        const inpCopy = JSON.parse(JSON.stringify(input)) as CreateOrderDTO
        inpCopy.transactions!.push({
          amount: 10,
          currency_code: "USD",
        })
        const created = await service.createOrders(inpCopy)

        expect(created.summary).toEqual(
          expect.objectContaining({
            transaction_total: 58.9,
            pending_difference: 0,
            paid_total: 58.9,
            refunded_total: 0,
          })
        )

        const refund = await service.addOrderTransactions([
          {
            order_id: created.id,
            amount: -20,
            currency_code: "USD",
          },
        ])

        const serializedOrder = JSON.parse(
          JSON.stringify(
            await service.retrieveOrder(created.id, {
              select: ["id", "summary", "total"],
            })
          )
        )

        expect(serializedOrder.summary).toEqual(
          expect.objectContaining({
            transaction_total: 38.9,
            pending_difference: 20,
            paid_total: 58.9,
            refunded_total: 20,
          })
        )

        await service.softDeleteOrderTransactions([refund[0].id])

        const serializedOrder2 = JSON.parse(
          JSON.stringify(
            await service.retrieveOrder(created.id, {
              select: ["id", "summary", "total"],
            })
          )
        )

        expect(serializedOrder2.summary).toEqual(
          expect.objectContaining({
            transaction_total: 58.9,
            pending_difference: 0,
            paid_total: 58.9,
            refunded_total: 0,
          })
        )

        await service.addOrderTransactions([
          {
            order_id: created.id,
            amount: -50,
            currency_code: "USD",
          },
        ])

        const serializedOrder3 = JSON.parse(
          JSON.stringify(
            await service.retrieveOrder(created.id, {
              select: ["id", "summary", "total"],
            })
          )
        )

        expect(serializedOrder3.summary).toEqual(
          expect.objectContaining({
            paid_total: 58.9,
            refunded_total: 50,
            transaction_total: 8.9,
            pending_difference: 50,
          })
        )

        await service.restoreOrderTransactions([refund[0].id])

        const serializedOrder4 = JSON.parse(
          JSON.stringify(
            await service.retrieveOrder(created.id, {
              select: ["id", "summary", "total"],
            })
          )
        )

        expect(serializedOrder4.summary).toEqual(
          expect.objectContaining({
            paid_total: 58.9,
            refunded_total: 70,
            transaction_total: -11.1,
            pending_difference: 70,
          })
        )
      })

      it("should delete entirely an order, shipping method and items. Including taxes and adjustments associated with them and credit lines", async function () {
        const inpCopy = JSON.parse(JSON.stringify(input)) as CreateOrderDTO
        inpCopy.transactions!.push({
          amount: 10,
          currency_code: "USD",
        })
        const created = await service.createOrders(inpCopy)

        await service.createOrderCreditLines([
          {
            order_id: created.id,
            amount: 10,
            reference_id: "credit_line_1",
          },
        ])

        await service.addOrderTransactions([
          {
            order_id: created.id,
            amount: -20,
            currency_code: "USD",
          },
        ])

        async function findAllOrderRelatedEntities(orderId: string) {
          const orderIdClause = { order_id: orderId }
          const manager = MikroOrmWrapper.forkManager()
          const [
            order,
            orderItems,
            orderSummary,
            orderShippingMethods,
            orderTransactions,
            orderCreditLines,
            orderShippingAddress,
            orderBillingAddress,
            orderChange,
            orderChangeAction,
          ] = await promiseAll([
            manager.findOne("Order", {
              id: created.id,
            }),
            manager.findOne("OrderItem", orderIdClause),
            manager.findOne("OrderSummary", orderIdClause),
            manager.findOne("OrderShipping", orderIdClause),
            manager.findOne("OrderTransaction", orderIdClause),
            manager.findOne("OrderCreditLine", orderIdClause),
            manager.findOne("OrderAddress", {
              first_name: "Test",
              last_name: "Test",
              address_1: "Test",
              city: "Test",
              country_code: "US",
              postal_code: "12345",
              phone: "12345",
            }),
            manager.findOne("OrderAddress", {
              first_name: "Test",
              last_name: "Test",
              address_1: "Test",
              city: "Test",
              country_code: "US",
              postal_code: "12345",
            }),
          ])

          return {
            order,
            orderItems,
            orderSummary,
            orderShippingMethods,
            orderTransactions,
            orderCreditLines,
            orderShippingAddress,
            orderBillingAddress,
          }
        }

        let orderRelatedEntities = await findAllOrderRelatedEntities(created.id)
        expect(orderRelatedEntities.order).not.toBeNull()
        expect(orderRelatedEntities.orderItems).not.toBeNull()
        expect(orderRelatedEntities.orderSummary).not.toBeNull()
        expect(orderRelatedEntities.orderShippingMethods).not.toBeNull()
        expect(orderRelatedEntities.orderTransactions).not.toBeNull()
        expect(orderRelatedEntities.orderCreditLines).not.toBeNull()
        expect(orderRelatedEntities.orderShippingAddress).not.toBeNull()
        expect(orderRelatedEntities.orderBillingAddress).not.toBeNull()

        await service.deleteOrders([created.id])

        orderRelatedEntities = await findAllOrderRelatedEntities(created.id)
        expect(orderRelatedEntities.order).toBeNull()
        expect(orderRelatedEntities.orderItems).toBeNull()
        expect(orderRelatedEntities.orderSummary).toBeNull()
        expect(orderRelatedEntities.orderShippingMethods).toBeNull()
        expect(orderRelatedEntities.orderTransactions).toBeNull()
        expect(orderRelatedEntities.orderCreditLines).toBeNull()
        expect(orderRelatedEntities.orderShippingAddress).toBeNull()
        expect(orderRelatedEntities.orderBillingAddress).toBeNull()
      })

      it("should transform requested fields and relations to match the db schema and return the order", async function () {
        const createdOrder = await service.createOrders(input)
        const getOrder = await service.retrieveOrder(createdOrder.id, {
          select: [
            "id",
            "display_id",
            "version",
            "custom_display_id",
            "items.id",
            "summary",
            "items.quantity",
            "items.detail.id",
            "items.detail.version",
            "items.detail.quantity",
            "items.detail.shipped_quantity",
            "items.detail.fulfilled_quantity",
            "items.tax_lines.id",
            "items.adjustments.id",
            "shipping_address.id",
            "billing_address.id",
            "shipping_methods.id",
            "shipping_methods.tax_lines.id",
            "shipping_methods.adjustments.id",
          ],
          relations: [
            "shipping_address",
            "billing_address",
            "items",
            "items.detail",
            "items.tax_lines",
            "items.adjustments",
            "shipping_methods",
            "shipping_methods.tax_lines",
            "shipping_methods.adjustments",
          ],
        })

        const serializedOrder = JSON.parse(JSON.stringify(getOrder))
        expect(serializedOrder).toEqual(expectation)
      })

      it("should return order transactions", async function () {
        const createdOrder = await service.createOrders(input)
        const getOrder = await service.retrieveOrder(createdOrder.id, {
          select: [
            "id",
            "transactions.amount",
            "transactions.reference",
            "transactions.reference_id",
          ],
          relations: ["transactions"],
        })

        const serializedOrder = JSON.parse(JSON.stringify(getOrder))
        expect(serializedOrder).toEqual(
          expect.objectContaining({
            id: createdOrder.id,
            transactions: [
              expect.objectContaining({
                amount: 48.9,
                reference: "payment",
                reference_id: "pay_123",
              }),
            ],
          })
        )
      })

      it("should transform where clause to match the db schema and return the order", async function () {
        await service.createOrders(input)
        const orders = await service.listOrders(
          {
            items: {
              quantity: 2,
            },
          },
          {
            select: ["id"],
            relations: ["items"],
          }
        )
        expect(orders.length).toEqual(1)

        const orders2 = await service.listOrders(
          {
            items: {
              quantity: 5,
            },
          },
          {
            select: ["items.quantity"],
            relations: ["items"],
          }
        )
        expect(orders2.length).toEqual(0)

        const orders3 = await service.listOrders(
          {
            items: {
              detail: {
                shipped_quantity: 0,
              },
            },
          },
          {
            select: ["id"],
            relations: ["items.detail"],
          }
        )
        expect(orders3.length).toEqual(1)

        const orders4 = await service.listOrders(
          {
            items: {
              detail: {
                shipped_quantity: 1,
              },
            },
          },
          {
            select: ["id"],
            relations: ["items.detail"],
          }
        )
        expect(orders4.length).toEqual(0)
      })
    })
  },
})
