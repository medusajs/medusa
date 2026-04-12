import {
  CreateOrderChangeActionDTO,
  CreateOrderChangeDTO,
  CreateOrderDTO,
  IOrderModuleService,
} from "@medusajs/framework/types"
import { BigNumber, ChangeActionType, Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IOrderModuleService>({
  debug: false,
  moduleName: Modules.ORDER,
  testSuite: ({ service }) => {
    describe("Order Module Service - Order Edits", () => {
      const input = {
        email: "foo@bar.com",
        items: [
          {
            title: "Item 1",
            subtitle: "Subtitle 1",
            thumbnail: "thumbnail1.jpg",
            quantity: new BigNumber(1),
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

      it("should change an order by adding actions to it", async function () {
        const createdOrder = await service.createOrders(input)
        createdOrder.items = createdOrder.items!.sort((a, b) =>
          a.title.localeCompare(b.title)
        )

        await service.addOrderAction([
          {
            action: ChangeActionType.ITEM_ADD,
            order_id: createdOrder.id,
            version: createdOrder.version,
            internal_note: "adding an item",
            reference: "order_line_item",
            reference_id: createdOrder.items![0].id,
            amount:
              createdOrder.items![0].unit_price *
              createdOrder.items![0].quantity,
            details: {
              reference_id: createdOrder.items![0].id,
              quantity: 1,
            },
          },
          {
            action: ChangeActionType.ITEM_ADD,
            order_id: createdOrder.id,
            version: createdOrder.version,
            reference: "order_line_item",
            reference_id: createdOrder.items![1].id,
            amount:
              createdOrder.items![1].unit_price *
              createdOrder.items![1].quantity,
            details: {
              reference_id: createdOrder.items![1].id,
              quantity: 3,
            },
          },
          {
            action: ChangeActionType.FULFILL_ITEM,
            order_id: createdOrder.id,
            version: createdOrder.version,
            reference: "fullfilment",
            reference_id: "fulfill_123",
            details: {
              reference_id: createdOrder.items![2].id,
              quantity: 1,
            },
          },
          {
            action: ChangeActionType.SHIP_ITEM,
            order_id: createdOrder.id,
            version: createdOrder.version,
            reference: "fullfilment",
            reference_id: "shipping_123",
            details: {
              reference_id: createdOrder.items![2].id,
              quantity: 1,
            },
          },
          {
            action: ChangeActionType.RETURN_ITEM,
            order_id: createdOrder.id,
            version: createdOrder.version,
            internal_note: "client has called and wants to return an item",
            reference: "return",
            reference_id: "return_123",
            details: {
              reference_id: createdOrder.items![2].id,
              quantity: 1,
            },
          },
          {
            action: ChangeActionType.RECEIVE_DAMAGED_RETURN_ITEM,
            order_id: createdOrder.id,
            version: createdOrder.version,
            internal_note: "Item broken",
            reference: "return",
            reference_id: "return_123",
            details: {
              reference_id: createdOrder.items![2].id,
              quantity: 1,
            },
          },
        ] as CreateOrderChangeActionDTO[])

        await service.applyPendingOrderActions(createdOrder.id)

        const finalOrder = await service.retrieveOrder(createdOrder.id, {
          select: [
            "id",
            "version",
            "items.detail",
            "summary",
            "shipping_methods",
            "transactions",
          ],
          relations: ["items", "shipping_methods", "transactions"],
        })

        const serializedFinalOrder = JSON.parse(JSON.stringify(finalOrder))

        const serializedCreatedOrder = JSON.parse(JSON.stringify(createdOrder))
        expect(serializedCreatedOrder.items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: "Item 1",
              unit_price: 8,
              quantity: 1,
              detail: expect.objectContaining({
                version: 1,
                quantity: 1,
                fulfilled_quantity: 0,
                shipped_quantity: 0,
                return_requested_quantity: 0,
                return_received_quantity: 0,
                return_dismissed_quantity: 0,
                written_off_quantity: 0,
              }),
            }),
            expect.objectContaining({
              title: "Item 2",
              compare_at_unit_price: null,
              unit_price: 5,
              quantity: 2,
            }),
            expect.objectContaining({
              title: "Item 3",
              unit_price: 30,
              quantity: 1,
              detail: expect.objectContaining({
                version: 1,
                quantity: 1,
                fulfilled_quantity: 0,
                shipped_quantity: 0,
                return_requested_quantity: 0,
                return_received_quantity: 0,
                return_dismissed_quantity: 0,
                written_off_quantity: 0,
              }),
            }),
          ])
        )

        expect(serializedFinalOrder).toEqual(
          expect.objectContaining({
            version: 1,
          })
        )
        expect(serializedFinalOrder.items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: "Item 1",
              subtitle: "Subtitle 1",
              thumbnail: "thumbnail1.jpg",
              variant_id: "variant1",
              product_id: "product1",
              product_title: "Product 1",
              product_description: "Description 1",
              product_subtitle: "Product Subtitle 1",
              product_type: "Type 1",
              product_type_id: "type_1",
              product_collection: "Collection 1",
              product_handle: "handle1",
              variant_sku: "SKU1",
              variant_barcode: "Barcode1",
              variant_title: "Variant 1",
              variant_option_values: { size: "Large", color: "Red" },
              requires_shipping: true,
              is_discountable: true,
              is_tax_inclusive: true,
              compare_at_unit_price: 10,
              unit_price: 8,
              quantity: 2,
              detail: expect.objectContaining({
                version: 1,
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
              title: "Item 2",
              compare_at_unit_price: null,
              unit_price: 5,
              quantity: 5,
              detail: expect.objectContaining({
                version: 1,
                quantity: 5,
                fulfilled_quantity: 0,
                shipped_quantity: 0,
                return_requested_quantity: 0,
                return_received_quantity: 0,
                return_dismissed_quantity: 0,
                written_off_quantity: 0,
              }),
            }),
            expect.objectContaining({
              title: "Item 3",
              unit_price: 30,
              quantity: 1,
              detail: expect.objectContaining({
                version: 1,
                quantity: 1,
                fulfilled_quantity: 1,
                shipped_quantity: 1,
                return_requested_quantity: 0,
                return_received_quantity: 0,
                return_dismissed_quantity: 1,
                written_off_quantity: 1,
              }),
            }),
          ])
        )
      })

      it("should create an order change, add actions to it and confirm the changes.", async function () {
        const createdOrder = await service.createOrders(input)
        createdOrder.items = createdOrder.items!.sort((a, b) =>
          a.title.localeCompare(b.title)
        )

        const orderChange = await service.createOrderChange({
          order_id: createdOrder.id,
          actions: [
            {
              action: ChangeActionType.FULFILL_ITEM,
              details: {
                reference_id: createdOrder.items![1].id,
                quantity: 2,
              },
            },
            {
              action: ChangeActionType.ITEM_UPDATE,
              details: {
                reference_id: createdOrder.items![1].id,
                quantity: 1,
              },
            },
          ],
        })

        await expect(
          service.confirmOrderChange({
            id: orderChange.id,
          })
        ).rejects.toThrow(
          `Item ${
            createdOrder.items![1].id
          } has already been fulfilled and quantity cannot be lower than 2.`
        )
        await service.deleteOrderChanges([orderChange.id])

        // Create Order Change
        const orderChange2 = await service.createOrderChange({
          order_id: createdOrder.id,
          actions: [
            {
              action: ChangeActionType.FULFILL_ITEM,
              details: {
                reference_id: createdOrder.items![1].id,
                quantity: 1,
              },
            },
            {
              action: ChangeActionType.ITEM_UPDATE,
              details: {
                reference_id: createdOrder.items![1].id,
                quantity: 4,
              },
            },
            {
              action: ChangeActionType.DELIVER_ITEM,
              details: {
                reference_id: createdOrder.items![1].id,
                quantity: 1,
              },
            },
          ],
        })

        await service.confirmOrderChange({
          id: orderChange2.id,
        })

        const changedOrder = await service.retrieveOrder(createdOrder.id, {
          select: ["total", "items.detail", "summary", "total"],
          relations: ["items"],
        })

        expect(
          JSON.parse(
            JSON.stringify(
              changedOrder.items?.find(
                (i) => i.id === createdOrder.items![1].id
              )?.detail
            )
          )
        ).toEqual(
          expect.objectContaining({
            quantity: 4,
            fulfilled_quantity: 1,
            delivered_quantity: 1,
          })
        )

        // Create Order Change
        const orderChange3 = await service.createOrderChange({
          order_id: createdOrder.id,
          actions: [
            {
              action: ChangeActionType.FULFILL_ITEM,
              details: {
                reference_id: createdOrder.items![1].id,
                quantity: 3,
              },
            },
            {
              action: ChangeActionType.ITEM_UPDATE,
              details: {
                reference_id: createdOrder.items![1].id,
                quantity: 3,
              },
            },
          ],
        })

        await expect(
          service.confirmOrderChange({
            id: orderChange3.id,
          })
        ).rejects.toThrow(
          `Item ${
            createdOrder.items![1].id
          } has already been fulfilled and quantity cannot be lower than 4.`
        )
        await service.deleteOrderChanges([orderChange3.id])

        // Create Order Change
        const orderChange4 = await service.createOrderChange({
          order_id: createdOrder.id,
          actions: [
            {
              action: ChangeActionType.FULFILL_ITEM,
              details: {
                reference_id: createdOrder.items![1].id,
                quantity: 1,
              },
            },
            {
              action: ChangeActionType.ITEM_UPDATE,
              details: {
                reference_id: createdOrder.items![1].id,
                quantity: 3,
              },
            },
          ],
        })

        await service.confirmOrderChange({
          id: orderChange4.id,
        })

        const modified = await service.retrieveOrder(createdOrder.id, {
          select: ["total", "items.detail", "summary", "total"],
          relations: ["items"],
        })

        expect(
          JSON.parse(
            JSON.stringify(
              modified.items?.find((i) => i.id === createdOrder.items![1].id)
                ?.detail
            )
          )
        ).toEqual(
          expect.objectContaining({
            quantity: 3,
            fulfilled_quantity: 2,
          })
        )

        const orderChange5 = await service.createOrderChange({
          order_id: createdOrder.id,
          actions: [
            {
              action: ChangeActionType.DELIVER_ITEM,
              details: {
                reference_id: createdOrder.items![1].id,
                quantity: 5,
              },
            },
          ],
        })

        await expect(
          service.confirmOrderChange({
            id: orderChange5.id,
          })
        ).rejects.toThrow(
          `Cannot deliver more items than what was fulfilled for item ${
            createdOrder.items![1].id
          }`
        )
        await service.deleteOrderChanges([orderChange5.id])
      })

      it("should create an order change, add actions to it, confirm the changes, revert all the changes and restore the changes again.", async function () {
        const createdOrder = await service.createOrders(input)
        createdOrder.items = createdOrder.items!.sort((a, b) =>
          a.title.localeCompare(b.title)
        )

        const orderChange = await service.createOrderChange({
          order_id: createdOrder.id,
          description: "changing the order",
          internal_note: "changing the order to version 2",
          created_by: "user_123",
          actions: [
            {
              action: ChangeActionType.ITEM_ADD,
              reference: "order_line_item",
              reference_id: createdOrder.items![0].id,
              amount:
                createdOrder.items![0].unit_price *
                createdOrder.items![0].quantity,
              details: {
                reference_id: createdOrder.items![0].id,
                quantity: 1,
              },
            },
            {
              action: ChangeActionType.ITEM_ADD,
              reference: "order_line_item",
              reference_id: createdOrder.items![1].id,
              amount:
                createdOrder.items![1].unit_price *
                createdOrder.items![1].quantity,
              details: {
                reference_id: createdOrder.items![1].id,
                quantity: 3,
              },
            },
            {
              action: ChangeActionType.FULFILL_ITEM,
              reference: "fullfilment",
              reference_id: "fulfill_123",
              details: {
                reference_id: createdOrder.items![2].id,
                quantity: 1,
              },
            },
            {
              action: ChangeActionType.SHIP_ITEM,
              reference: "fullfilment",
              reference_id: "shipping_123",
              details: {
                reference_id: createdOrder.items![2].id,
                quantity: 1,
              },
            },
            {
              action: ChangeActionType.RETURN_ITEM,
              reference: "return",
              reference_id: "return_123",
              details: {
                reference_id: createdOrder.items![2].id,
                quantity: 1,
              },
            },
            {
              action: ChangeActionType.RECEIVE_DAMAGED_RETURN_ITEM,
              internal_note: "Item broken",
              reference: "return",
              reference_id: "return_123",
              details: {
                reference_id: createdOrder.items![2].id,
                quantity: 1,
              },
            },
            {
              action: ChangeActionType.CREDIT_LINE_ADD,
              order_id: createdOrder.id,
              version: createdOrder.version,
              reference: "gesture_of_goodwill",
              reference_id: "refr_123",
              amount: 10,
            },
          ],
        })

        await service.confirmOrderChange({
          id: orderChange.id,
          confirmed_by: "cx_agent_123",
        })

        await expect(
          service.confirmOrderChange(orderChange.id)
        ).rejects.toThrow(`Order Change cannot be modified: ${orderChange.id}`)

        const modified = await service.retrieveOrder(createdOrder.id, {
          select: [
            "id",
            "version",
            "items.detail",
            "summary",
            "shipping_methods",
            "credit_lines",
            "transactions",
          ],
          relations: [
            "items",
            "shipping_methods",
            "credit_lines",
            "transactions",
          ],
        })

        const serializedModifiedOrder = JSON.parse(JSON.stringify(modified))

        expect(serializedModifiedOrder).toEqual(
          expect.objectContaining({
            version: 2,
          })
        )

        expect(serializedModifiedOrder.shipping_methods).toHaveLength(1)
        expect(serializedModifiedOrder.shipping_methods[0].amount).toEqual(10)

        expect(serializedModifiedOrder.credit_lines).toHaveLength(1)
        expect(serializedModifiedOrder.credit_lines[0].amount).toEqual(10)
        expect(serializedModifiedOrder.credit_lines[0].version).toEqual(2)

        expect(serializedModifiedOrder.items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              quantity: 2,
              detail: expect.objectContaining({
                version: 2,
                quantity: 2,
              }),
            }),
            expect.objectContaining({
              title: "Item 2",
              unit_price: 5,
              quantity: 5,
              detail: expect.objectContaining({
                version: 2,
                quantity: 5,
                fulfilled_quantity: 0,
                shipped_quantity: 0,
                return_requested_quantity: 0,
                return_received_quantity: 0,
                return_dismissed_quantity: 0,
                written_off_quantity: 0,
              }),
            }),
            expect.objectContaining({
              title: "Item 3",
              unit_price: 30,
              quantity: 1,
              detail: expect.objectContaining({
                version: 2,
                quantity: 1,
                fulfilled_quantity: 1,
                shipped_quantity: 1,
                return_requested_quantity: 0,
                return_received_quantity: 0,
                return_dismissed_quantity: 1,
                written_off_quantity: 1,
              }),
            }),
          ])
        )

        // Revert Last Changes
        await service.revertLastVersion(createdOrder.id)
        const revertedOrder = await service.retrieveOrder(createdOrder.id, {
          select: [
            "id",
            "version",
            "items.detail",
            "summary",
            "shipping_methods",
            "credit_lines",
          ],
          relations: ["items", "credit_lines"],
        })

        const serializedRevertedOrder = JSON.parse(
          JSON.stringify(revertedOrder)
        )
        expect(serializedRevertedOrder).toEqual(
          expect.objectContaining({
            version: 1,
          })
        )

        expect(serializedRevertedOrder.shipping_methods).toHaveLength(1)
        expect(serializedRevertedOrder.shipping_methods[0].amount).toEqual(10)

        expect(serializedRevertedOrder.credit_lines).toHaveLength(0)

        expect(serializedRevertedOrder.items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              quantity: 1,
              unit_price: 8,
              detail: expect.objectContaining({
                version: 1,
                quantity: 1,
              }),
            }),
            expect.objectContaining({
              title: "Item 2",
              unit_price: 5,
              quantity: 2,
              detail: expect.objectContaining({
                version: 1,
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
              title: "Item 3",
              unit_price: 30,
              quantity: 1,
              detail: expect.objectContaining({
                version: 1,
                quantity: 1,
                fulfilled_quantity: 0,
                shipped_quantity: 0,
                return_requested_quantity: 0,
                return_received_quantity: 0,
                return_dismissed_quantity: 0,
                written_off_quantity: 0,
              }),
            }),
          ])
        )
      })

      it("should create order change, cancel and reject them.", async function () {
        const createdOrder = await service.createOrders(input)
        createdOrder.items = createdOrder.items!.sort((a, b) =>
          a.title.localeCompare(b.title)
        )

        const orderChange = await service.createOrderChange({
          order_id: createdOrder.id,
          description: "changing the order",
          internal_note: "changing the order to version 2",
          created_by: "user_123",
        })
        await service.cancelOrderChange({
          id: orderChange.id,
          canceled_by: "cx_agent_123",
        })

        await expect(service.cancelOrderChange(orderChange.id)).rejects.toThrow(
          "Order Change cannot be modified"
        )

        const orderChange2 = await service.createOrderChange({
          order_id: createdOrder.id,
          description: "changing the order again",
          internal_note: "trying again...",
          created_by: "user_123",
          actions: [
            {
              action: ChangeActionType.ITEM_ADD,
              reference: "order_line_item",
              reference_id: createdOrder.items![0].id,
              amount:
                createdOrder.items![0].unit_price *
                createdOrder.items![0].quantity,
              details: {
                reference_id: createdOrder.items![0].id,
                quantity: 1,
              },
            },
          ],
        } as CreateOrderChangeDTO)

        await service.declineOrderChange({
          id: orderChange2.id,
          declined_by: "user_123",
          declined_reason: "changed my mind",
        })

        await expect(
          service.declineOrderChange(orderChange2.id)
        ).rejects.toThrow("Order Change cannot be modified")

        const [change1, change2] = await (service as any).listOrderChanges(
          {
            id: [orderChange.id, orderChange2.id],
          },
          {
            select: [
              "id",
              "status",
              "canceled_by",
              "canceled_at",
              "declined_by",
              "declined_at",
              "declined_reason",
            ],
          }
        )

        expect(change1).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            status: "canceled",
            declined_by: null,
            declined_reason: null,
            declined_at: null,
            canceled_by: "cx_agent_123",
            canceled_at: expect.any(Date),
          })
        )

        expect(change2).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            status: "declined",
            declined_by: "user_123",
            declined_reason: "changed my mind",
            declined_at: expect.any(Date),
            canceled_by: null,
            canceled_at: null,
          })
        )
      })

      it("should create an order change, update items, and have the pending difference updated", async function () {
        const createdOrder = await service.createOrders({
          email: "foo@bar.com",
          items: [
            {
              title: "Item 1",
              subtitle: "Subtitle 1",
              thumbnail: "thumbnail1.jpg",
              quantity: new BigNumber(1),
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
              unit_price: 10,
              tax_lines: [],
              adjustments: [
                {
                  code: "VIP_10",
                  amount: 1,
                  description: "VIP discount",
                  promotion_id: "prom_123",
                  provider_id: "coupon_kings",
                },
              ],
            },
          ],
          sales_channel_id: "test",
          transactions: [
            {
              amount: 9,
              currency_code: "USD",
              reference: "payment",
              reference_id: "pay_123",
            },
          ],
          currency_code: "usd",
          customer_id: "joe",
        } as CreateOrderDTO)

        const orderChange = await service.createOrderChange({
          order_id: createdOrder.id,
          actions: [
            {
              action: ChangeActionType.ITEM_UPDATE,
              details: {
                reference_id: createdOrder.items![0].id,
                quantity: 0,
              },
            },
          ],
        })

        await service.confirmOrderChange({
          id: orderChange.id,
        })

        const changedOrder = await service.retrieveOrder(createdOrder.id, {
          select: ["total", "summary", "total"],
          relations: ["items"],
        })

        // @ts-ignore
        expect(changedOrder.summary?.pending_difference.numeric).toEqual(-9)
      })

      it("should create line item adjustments with version when order version increases", async () => {
        const createdOrder = await service.createOrders(input)

        expect(createdOrder.version).toBe(1)

        const itemWithAdjustments = createdOrder.items?.find(
          (item) => item.title === "Item 1"
        )!

        // Verify initial adjustments have version 1
        const initialAdjustments = await service.listOrderLineItemAdjustments({
          item_id: itemWithAdjustments.id,
        })

        expect(initialAdjustments).toHaveLength(1)
        expect(initialAdjustments[0].version).toBe(1)
        expect(initialAdjustments[0].code).toBe("VIP_10")
        expect(initialAdjustments[0].amount).toBe(10)

        // Create and confirm an order change
        const orderChange = await service.createOrderChange({
          order_id: createdOrder.id,
          description: "changing the order",
          created_by: "user_123",
          actions: [
            {
              action: ChangeActionType.ITEM_ADD,
              reference: "order_line_item",
              reference_id: itemWithAdjustments.id,
              amount:
                itemWithAdjustments.unit_price * itemWithAdjustments.quantity,
              details: {
                reference_id: itemWithAdjustments.id,
                quantity: 2,
              },
            },
          ],
        })

        await service.confirmOrderChange({
          id: orderChange.id,
          confirmed_by: "cx_agent_123",
        })

        // Verify order version incremented
        const updatedOrder = await service.retrieveOrder(createdOrder.id)
        expect(updatedOrder.version).toBe(2)

        // Verify new adjustments have version 2
        const allAdjustments = await service.listOrderLineItemAdjustments({
          item_id: itemWithAdjustments.id,
        })

        // Should have adjustments for both versions
        expect(allAdjustments.length).toBeGreaterThanOrEqual(1)

        const v2Adjustments = allAdjustments.filter((adj) => adj.version === 2)
        expect(v2Adjustments.length).toBeGreaterThan(0)

        // Verify version 1 adjustments still exist
        const v1Adjustments = allAdjustments.filter((adj) => adj.version === 1)
        expect(v1Adjustments).toHaveLength(1)
      })

      it("should create shipping method adjustments with version when order version increases", async () => {
        const createdOrder = await service.createOrders(input)

        expect(createdOrder.version).toBe(1)

        // Verify initial shipping method adjustments have version 1
        const initialAdjustments =
          await service.listOrderShippingMethodAdjustments({
            shipping_method_id: createdOrder.shipping_methods![0].id,
          })

        expect(initialAdjustments).toHaveLength(1)
        expect(initialAdjustments[0].version).toBe(1)
        expect(initialAdjustments[0].code).toBe("VIP_10")
        expect(initialAdjustments[0].amount).toBe(1)

        // Create and confirm an order change
        const orderChange = await service.createOrderChange({
          order_id: createdOrder.id,
          description: "changing the order",
          created_by: "user_123",
          actions: [
            {
              action: ChangeActionType.SHIPPING_ADD,
              reference: "shipping_method",
              reference_id: createdOrder.shipping_methods![0].id,
              amount: 15,
              details: {
                reference_id: createdOrder.shipping_methods![0].id,
              },
            },
          ],
        })

        await service.confirmOrderChange({
          id: orderChange.id,
          confirmed_by: "cx_agent_123",
        })

        // Verify order version incremented
        const updatedOrder = await service.retrieveOrder(createdOrder.id)
        expect(updatedOrder.version).toBe(2)

        // Verify new adjustments have version 2
        const allAdjustments = await service.listOrderShippingMethodAdjustments(
          {
            shipping_method_id: createdOrder.shipping_methods![0].id,
          }
        )

        // Should have adjustments for both versions
        expect(allAdjustments.length).toBeGreaterThanOrEqual(1)

        const v2Adjustments = allAdjustments.filter((adj) => adj.version === 2)
        expect(v2Adjustments.length).toBeGreaterThan(0)

        // Verify version 1 adjustments still exist
        const v1Adjustments = allAdjustments.filter((adj) => adj.version === 1)
        expect(v1Adjustments).toHaveLength(1)
      })

      it("should delete current version line item adjustments on revert", async () => {
        const createdOrder = await service.createOrders(input)

        expect(createdOrder.version).toBe(1)

        const itemWithAdjustments = createdOrder.items?.find(
          (item) => item.title === "Item 1"
        )!

        // Verify initial adjustments
        const initialAdjustments = await service.listOrderLineItemAdjustments({
          item_id: itemWithAdjustments.id,
        })

        expect(initialAdjustments).toHaveLength(1)
        expect(initialAdjustments[0].version).toBe(1)

        // Create and confirm an order change
        const orderChange = await service.createOrderChange({
          order_id: createdOrder.id,
          description: "changing the order",
          created_by: "user_123",
          actions: [
            {
              action: ChangeActionType.ITEM_ADD,
              reference: "order_line_item",
              reference_id: itemWithAdjustments.id,
              amount:
                itemWithAdjustments.unit_price * itemWithAdjustments.quantity,
              details: {
                reference_id: itemWithAdjustments.id,
                quantity: 2,
              },
            },
          ],
        })

        await service.confirmOrderChange({
          id: orderChange.id,
          confirmed_by: "cx_agent_123",
        })

        // Verify version 2 adjustments exist
        const v2Order = await service.retrieveOrder(createdOrder.id)
        expect(v2Order.version).toBe(2)

        const adjustmentsBeforeRevert =
          await service.listOrderLineItemAdjustments({
            item_id: itemWithAdjustments.id,
          })

        const v2AdjustmentsBeforeRevert = adjustmentsBeforeRevert.filter(
          (adj) => adj.version === 2
        )
        expect(v2AdjustmentsBeforeRevert.length).toBeGreaterThan(0)

        // Revert the order
        await service.revertLastVersion(createdOrder.id)

        // Verify order version reverted to 1
        const revertedOrder = await service.retrieveOrder(createdOrder.id)
        expect(revertedOrder.version).toBe(1)

        // Verify version 2 adjustments are soft-deleted (not returned in list)
        const adjustmentsAfterRevert =
          await service.listOrderLineItemAdjustments({
            item_id: itemWithAdjustments.id,
          })

        const v2AdjustmentsAfterRevert = adjustmentsAfterRevert.filter(
          (adj) => adj.version === 2
        )
        expect(v2AdjustmentsAfterRevert).toHaveLength(0)

        // Verify version 1 adjustments remain intact
        const v1AdjustmentsAfterRevert = adjustmentsAfterRevert.filter(
          (adj) => adj.version === 1
        )
        expect(v1AdjustmentsAfterRevert).toHaveLength(1)
        expect(v1AdjustmentsAfterRevert[0].code).toBe("VIP_10")
      })

      it("should delete current version shipping method adjustments on revert", async () => {
        const createdOrder = await service.createOrders(input)

        expect(createdOrder.version).toBe(1)

        // Verify initial shipping method adjustments
        const initialAdjustments =
          await service.listOrderShippingMethodAdjustments({
            shipping_method_id: createdOrder.shipping_methods![0].id,
          })

        expect(initialAdjustments).toHaveLength(1)
        expect(initialAdjustments[0].version).toBe(1)

        // Create and confirm an order change
        const orderChange = await service.createOrderChange({
          order_id: createdOrder.id,
          description: "changing the order",
          created_by: "user_123",
          actions: [
            {
              action: ChangeActionType.SHIPPING_ADD,
              reference: "shipping_method",
              reference_id: createdOrder.shipping_methods![0].id,
              amount: 15,
              details: {
                reference_id: createdOrder.shipping_methods![0].id,
              },
            },
          ],
        })

        await service.confirmOrderChange({
          id: orderChange.id,
          confirmed_by: "cx_agent_123",
        })

        // Verify version 2 adjustments exist
        const v2Order = await service.retrieveOrder(createdOrder.id)
        expect(v2Order.version).toBe(2)

        const adjustmentsBeforeRevert =
          await service.listOrderShippingMethodAdjustments({
            shipping_method_id: createdOrder.shipping_methods![0].id,
          })

        const v2AdjustmentsBeforeRevert = adjustmentsBeforeRevert.filter(
          (adj) => adj.version === 2
        )
        expect(v2AdjustmentsBeforeRevert.length).toBeGreaterThan(0)

        // Revert the order
        await service.revertLastVersion(createdOrder.id)

        // Verify order version reverted to 1
        const revertedOrder = await service.retrieveOrder(createdOrder.id)
        expect(revertedOrder.version).toBe(1)

        // Verify version 2 adjustments are soft-deleted (not returned in list)
        const adjustmentsAfterRevert =
          await service.listOrderShippingMethodAdjustments({
            shipping_method_id: createdOrder.shipping_methods![0].id,
          })

        const v2AdjustmentsAfterRevert = adjustmentsAfterRevert.filter(
          (adj) => adj.version === 2
        )
        expect(v2AdjustmentsAfterRevert).toHaveLength(0)

        // Verify version 1 adjustments remain intact
        const v1AdjustmentsAfterRevert = adjustmentsAfterRevert.filter(
          (adj) => adj.version === 1
        )
        expect(v1AdjustmentsAfterRevert).toHaveLength(1)
        expect(v1AdjustmentsAfterRevert[0].code).toBe("VIP_10")
      })
    })
  },
})
