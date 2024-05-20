import { Modules } from "@medusajs/modules-sdk"
import { CreateOrderDTO, IOrderModuleService } from "@medusajs/types"
import { SuiteOptions, moduleIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner({
  moduleName: Modules.ORDER,
  testSuite: ({ service }: SuiteOptions<IOrderModuleService>) => {
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
      } as CreateOrderDTO

      const expectation = expect.objectContaining({
        id: expect.stringContaining("order_"),
        version: 1,
        display_id: 1,
        summary: expect.objectContaining({
          // TODO: add all summary fields
        }),
        shipping_address: expect.objectContaining({
          id: expect.stringContaining("ordaddr_"),
        }),
        billing_address: expect.objectContaining({
          id: expect.stringContaining("ordaddr_"),
        }),
        items: [
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
        ],
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
        const createdOrder = await service.create(input)

        const serializedOrder = JSON.parse(JSON.stringify(createdOrder))

        expect(serializedOrder).toEqual(expectation)
      })

      it.only("should create an order, shipping method and items. Including taxes and adjustments associated with them and add new transactions", async function () {
        const created = await service.create(input)
        await service.addTransactions([
          {
            order_id: created.id,
            amount: 10,
            currency_code: "USD",
          },
          {
            order_id: created.id,
            amount: -20,
            currency_code: "USD",
          },
        ])

        const get = await service.retrieve(created.id, {
          select: ["id", "total", "summary"],
        })

        const serializedOrder = JSON.parse(JSON.stringify(get))

        console.log(
          JSON.stringify(serializedOrder, null, 2),
          "*********************"
        )

        //expect(serializedOrder).toEqual(expectation)
      })

      it("should transform requested fields and relations to match the db schema and return the order", async function () {
        const createdOrder = await service.create(input)
        const getOrder = await service.retrieve(createdOrder.id, {
          select: [
            "id",
            "display_id",
            "version",
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
        const createdOrder = await service.create(input)
        const getOrder = await service.retrieve(createdOrder.id, {
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
                amount: 58,
                reference: "payment",
                reference_id: "pay_123",
              }),
            ],
          })
        )
      })

      it("should transform where clause to match the db schema and return the order", async function () {
        await service.create(input)
        const orders = await service.list(
          {
            items: {
              quantity: 2,
            },
          },
          {
            select: ["id"],
            relations: ["items"],
            take: null,
          }
        )
        expect(orders.length).toEqual(1)

        const orders2 = await service.list(
          {
            items: {
              quantity: 5,
            },
          },
          {
            select: ["items.quantity"],
            relations: ["items"],
            take: null,
          }
        )
        expect(orders2.length).toEqual(0)

        const orders3 = await service.list(
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
            take: null,
          }
        )
        expect(orders3.length).toEqual(1)

        const orders4 = await service.list(
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
            take: null,
          }
        )
        expect(orders4.length).toEqual(0)
      })

      it("should create an order, fulfill, ship and return the items", async function () {
        const createdOrder = await service.create(input)

        // Fullfilment
        await service.registerFulfillment({
          order_id: createdOrder.id,
          items: createdOrder.items!.map((item) => {
            return {
              id: item.id,
              quantity: item.quantity,
            }
          }),
        })

        let getOrder = await service.retrieve(createdOrder.id, {
          select: [
            "id",
            "version",
            "items.id",
            "items.quantity",
            "items.detail.id",
            "items.detail.version",
            "items.detail.quantity",
            "items.detail.shipped_quantity",
            "items.detail.fulfilled_quantity",
          ],
          relations: ["items", "items.detail"],
        })

        let serializedOrder = JSON.parse(JSON.stringify(getOrder))

        expect(serializedOrder).toEqual(
          expect.objectContaining({
            version: 2,
            items: [
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  version: 2,
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 0,
                }),
              }),
              expect.objectContaining({
                quantity: 2,
                detail: expect.objectContaining({
                  version: 2,
                  quantity: 2,
                  fulfilled_quantity: 2,
                  shipped_quantity: 0,
                }),
              }),
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  version: 2,
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 0,
                }),
              }),
            ],
          })
        )

        // Shipment
        await service.registerShipment({
          order_id: createdOrder.id,
          reference: Modules.FULFILLMENT,
          shipping_method: createdOrder.shipping_methods![0].id,
          items: createdOrder.items!.map((item) => {
            return {
              id: item.id,
              quantity: item.quantity,
            }
          }),
        })

        getOrder = await service.retrieve(createdOrder.id, {
          select: [
            "id",
            "version",
            "items.id",
            "items.quantity",
            "items.detail.id",
            "items.detail.version",
            "items.detail.quantity",
            "items.detail.shipped_quantity",
            "items.detail.fulfilled_quantity",
          ],
          relations: ["items", "items.detail"],
        })

        serializedOrder = JSON.parse(JSON.stringify(getOrder))

        expect(serializedOrder).toEqual(
          expect.objectContaining({
            version: 3,
            items: [
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  version: 3,
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 1,
                }),
              }),
              expect.objectContaining({
                quantity: 2,
                detail: expect.objectContaining({
                  version: 3,
                  quantity: 2,
                  fulfilled_quantity: 2,
                  shipped_quantity: 2,
                }),
              }),
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  version: 3,
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 1,
                }),
              }),
            ],
          })
        )

        // Return
        await service.createReturn({
          order_id: createdOrder.id,
          reference: Modules.FULFILLMENT,
          description: "Return all the items",
          internal_note: "user wants to return all items",
          shipping_method: createdOrder.shipping_methods![0].id,
          items: createdOrder.items!.map((item) => {
            return {
              id: item.id,
              quantity: item.quantity,
            }
          }),
        })

        getOrder = await service.retrieve(createdOrder.id, {
          select: [
            "id",
            "version",
            "items.id",
            "items.quantity",
            "items.detail.id",
            "items.detail.version",
            "items.detail.quantity",
            "items.detail.shipped_quantity",
            "items.detail.fulfilled_quantity",
            "items.detail.return_requested_quantity",
          ],
          relations: ["items", "items.detail"],
        })

        serializedOrder = JSON.parse(JSON.stringify(getOrder))

        expect(serializedOrder).toEqual(
          expect.objectContaining({
            version: 4,
            items: [
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  version: 4,
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 1,
                  return_requested_quantity: 1,
                }),
              }),
              expect.objectContaining({
                quantity: 2,
                detail: expect.objectContaining({
                  version: 4,
                  quantity: 2,
                  fulfilled_quantity: 2,
                  shipped_quantity: 2,
                  return_requested_quantity: 2,
                }),
              }),
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  version: 4,
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 1,
                  return_requested_quantity: 1,
                }),
              }),
            ],
          })
        )
      })
    })
  },
})
