import { CreateOrderDTO, IOrderModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { moduleIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(1000000)

moduleIntegrationTestRunner<IOrderModuleService>({
  moduleName: Modules.ORDER,
  testSuite: ({ service }) => {
    describe("Order Module Service - Return flows", () => {
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

      it("should create an order, fulfill, ship and return the items", async function () {
        const createdOrder = await service.createOrders(input)

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

        let getOrder = await service.retrieveOrder(createdOrder.id, {
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
            items: [
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 0,
                }),
              }),
              expect.objectContaining({
                quantity: 2,
                detail: expect.objectContaining({
                  quantity: 2,
                  fulfilled_quantity: 2,
                  shipped_quantity: 0,
                }),
              }),
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
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
          items: createdOrder.items!.map((item) => {
            return {
              id: item.id,
              quantity: item.quantity,
            }
          }),
        })

        getOrder = await service.retrieveOrder(createdOrder.id, {
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
            items: [
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 1,
                }),
              }),
              expect.objectContaining({
                quantity: 2,
                detail: expect.objectContaining({
                  quantity: 2,
                  fulfilled_quantity: 2,
                  shipped_quantity: 2,
                }),
              }),
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 1,
                }),
              }),
            ],
          })
        )

        // Return
        const reason = await service.createReturnReasons({
          value: "wrong-size",
          label: "Wrong Size",
        })
        const reason2 = await service.createReturnReasons({
          value: "disliked",
          label: "Disliled",
        })

        const orderReturn = await service.createReturn({
          order_id: createdOrder.id,
          reference: Modules.FULFILLMENT,
          description: "Return all the items",
          internal_note: "user wants to return all items",
          shipping_method: {
            name: "Return method",
            amount: 35,
          },
          items: createdOrder.items!.map((item) => {
            return {
              id: item.id,
              quantity: 1,
              reason_id: reason.id,
            }
          }),
        })

        const secondReturn = await service.createReturn({
          order_id: createdOrder.id,
          reference: Modules.FULFILLMENT,
          description: "Return remaining item",
          shipping_method: {
            name: "Return method",
            amount: 5,
          },
          items: [
            {
              id: createdOrder.items![1].id,
              quantity: 1,
              reason_id: reason2.id,
            },
          ],
        })

        getOrder = await service.retrieveOrder(createdOrder.id, {
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
          relations: ["items", "items.detail", "shipping_methods"],
        })

        serializedOrder = JSON.parse(JSON.stringify(getOrder))

        expect(serializedOrder.shipping_methods).toHaveLength(3)
        expect(serializedOrder).toEqual(
          expect.objectContaining({
            items: [
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 1,
                  return_requested_quantity: 1,
                }),
              }),
              expect.objectContaining({
                quantity: 2,
                detail: expect.objectContaining({
                  quantity: 2,
                  fulfilled_quantity: 2,
                  shipped_quantity: 2,
                  return_requested_quantity: 2,
                }),
              }),
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 1,
                  return_requested_quantity: 1,
                }),
              }),
            ],
          })
        )

        // Receive Return
        const allItems = createdOrder.items!.map((item) => {
          return {
            id: item.id,
            quantity: 1,
          }
        })
        const lastItem = allItems.pop()!

        const receive = await service.receiveReturn({
          return_id: orderReturn.id,
          internal_note: "received some items",
          items: allItems,
        })

        const receiveComplete = await service.receiveReturn({
          return_id: orderReturn.id,
          internal_note: "received remaining items",
          items: [lastItem],
        })

        const receiveSecond = await service.receiveReturn({
          return_id: secondReturn.id,
          internal_note: "received some items",
          items: [
            {
              id: createdOrder.items![1].id,
              quantity: 1,
            },
          ],
        })

        expect(receiveSecond).toEqual(
          expect.objectContaining({
            status: "received",
            received_at: expect.any(Date),
            items: expect.arrayContaining([
              expect.objectContaining({
                item_id: createdOrder.items![1].id,
                received_quantity: 1,
              }),
            ]),
          })
        )

        expect(receive).toEqual(
          expect.objectContaining({
            id: orderReturn.id,
            status: "partially_received",
            received_at: null,
            items: expect.arrayContaining([
              expect.objectContaining({
                item_id: allItems[0].id,
                detail: expect.objectContaining({
                  return_requested_quantity: 0,
                  return_received_quantity: 1,
                }),
              }),
              expect.objectContaining({
                item_id: allItems[1].id,
                detail: expect.objectContaining({
                  return_requested_quantity: 1,
                  return_received_quantity: 1,
                }),
              }),
            ]),
          })
        )

        expect(receiveComplete).toEqual(
          expect.objectContaining({
            id: orderReturn.id,
            status: "received",
            received_at: expect.any(Date),
            items: expect.arrayContaining([
              expect.objectContaining({
                item_id: allItems[0].id,
                detail: expect.objectContaining({
                  return_requested_quantity: 0,
                  return_received_quantity: 1,
                }),
              }),
              expect.objectContaining({
                item_id: allItems[1].id,
                detail: expect.objectContaining({
                  return_requested_quantity: 1,
                  return_received_quantity: 1,
                }),
              }),
              expect.objectContaining({
                item_id: lastItem.id,
                detail: expect.objectContaining({
                  return_requested_quantity: 0,
                  return_received_quantity: 1,
                }),
              }),
            ]),
          })
        )

        getOrder = await service.retrieveOrder(createdOrder.id, {
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
            "items.detail.return_received_quantity",
          ],
          relations: ["items", "items.detail"],
        })

        serializedOrder = JSON.parse(JSON.stringify(getOrder))

        expect(serializedOrder).toEqual(
          expect.objectContaining({
            items: [
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 1,
                  return_requested_quantity: 0,
                  return_received_quantity: 1,
                }),
              }),
              expect.objectContaining({
                quantity: 2,
                detail: expect.objectContaining({
                  quantity: 2,
                  fulfilled_quantity: 2,
                  shipped_quantity: 2,
                  return_requested_quantity: 0,
                  return_received_quantity: 2,
                }),
              }),
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 1,
                  return_requested_quantity: 0,
                  return_received_quantity: 1,
                }),
              }),
            ],
          })
        )
      })

      it("should create an order, fulfill, return the items and cancel some item return", async function () {
        const createdOrder = await service.createOrders(input)

        await service.registerFulfillment({
          order_id: createdOrder.id,
          items: createdOrder.items!.map((item) => {
            return {
              id: item.id,
              quantity: item.quantity,
            }
          }),
        })

        const reason = await service.createReturnReasons({
          value: "wrong-size",
          label: "Wrong Size",
        })
        const reason2 = await service.createReturnReasons({
          value: "disliked",
          label: "Disliled",
        })

        const orderReturn = await service.createReturn({
          order_id: createdOrder.id,
          reference: Modules.FULFILLMENT,
          shipping_method: {
            name: "First return method",
            amount: 10,
          },
          items: createdOrder.items!.map((item) => {
            return {
              id: item.id,
              quantity: 1,
              reason_id: reason.id,
            }
          }),
        })

        const secondReturn = await service.createReturn({
          order_id: createdOrder.id,
          reference: Modules.FULFILLMENT,
          description: "Return remaining item",
          shipping_method: {
            name: "Second return method",
            amount: 0,
          },
          items: [
            {
              id: createdOrder.items![1].id,
              quantity: 1,
              reason_id: reason2.id,
            },
          ],
        })

        let getOrder = await service.retrieveOrder(createdOrder.id, {
          select: [
            "id",
            "version",
            "items.id",
            "items.quantity",
            "items.detail.id",
            "items.detail.version",
            "items.detail.quantity",
            "items.detail.fulfilled_quantity",
            "items.detail.return_requested_quantity",
          ],
          relations: ["items", "items.detail"],
        })

        let serializedOrder = JSON.parse(JSON.stringify(getOrder))

        expect(serializedOrder).toEqual(
          expect.objectContaining({
            items: [
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  quantity: 1,
                  fulfilled_quantity: 1,
                  return_requested_quantity: 1,
                }),
              }),
              expect.objectContaining({
                quantity: 2,
                detail: expect.objectContaining({
                  quantity: 2,
                  fulfilled_quantity: 2,
                  return_requested_quantity: 2,
                }),
              }),
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  quantity: 1,
                  fulfilled_quantity: 1,
                  return_requested_quantity: 1,
                }),
              }),
            ],
          })
        )

        // Receive second Return
        await service.receiveReturn({
          return_id: secondReturn.id,
          internal_note: "received some items",
          items: [
            {
              id: createdOrder.items![1].id,
              quantity: 1,
            },
          ],
        })

        // Cancel return
        await service.cancelReturn({
          return_id: orderReturn.id,
        })

        await expect(
          service.cancelReturn({ return_id: secondReturn.id })
        ).rejects.toThrow(
          `Cannot cancel more items than what was requested to return for item ${createdOrder.items[1].id}.`
        )

        getOrder = await service.retrieveOrder(createdOrder.id, {
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
            "items.detail.return_received_quantity",
            "shipping_methods.id",
          ],
          relations: ["items", "items.detail"],
        })

        serializedOrder = JSON.parse(JSON.stringify(getOrder))

        expect(serializedOrder.shipping_methods).toHaveLength(2)
        expect(serializedOrder).toEqual(
          expect.objectContaining({
            items: [
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 0,
                  return_requested_quantity: 0,
                  return_received_quantity: 0,
                }),
              }),
              expect.objectContaining({
                quantity: 2,
                detail: expect.objectContaining({
                  quantity: 2,
                  fulfilled_quantity: 2,
                  shipped_quantity: 0,
                  return_requested_quantity: 0,
                  return_received_quantity: 1,
                }),
              }),
              expect.objectContaining({
                quantity: 1,
                detail: expect.objectContaining({
                  quantity: 1,
                  fulfilled_quantity: 1,
                  shipped_quantity: 0,
                  return_requested_quantity: 0,
                  return_received_quantity: 0,
                }),
              }),
            ],
          })
        )
      })
    })
  },
})
