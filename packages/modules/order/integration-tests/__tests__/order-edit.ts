import {
  CreateOrderChangeActionDTO,
  CreateOrderChangeDTO,
  CreateOrderDTO,
  IOrderModuleService,
} from "@medusajs/types"
import { BigNumber, ChangeActionType, Modules } from "@medusajs/utils"
import { moduleIntegrationTestRunner } from "medusa-test-utils"

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
        expect(serializedCreatedOrder.items).toEqual([
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

        expect(serializedFinalOrder).toEqual(
          expect.objectContaining({
            version: 1,
          })
        )
        expect(serializedFinalOrder.items).toEqual([
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
              written_off_quantity: 0,
            }),
          }),
        ])
      })

      it("should create an order change, add actions to it, confirm the changes, revert all the changes and restore the changes again.", async function () {
        const createdOrder = await service.createOrders(input)

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
            "transactions",
          ],
          relations: ["items", "shipping_methods", "transactions"],
        })

        const serializedModifiedOrder = JSON.parse(JSON.stringify(modified))

        expect(serializedModifiedOrder).toEqual(
          expect.objectContaining({
            version: 2,
          })
        )

        expect(serializedModifiedOrder.shipping_methods).toHaveLength(1)
        expect(serializedModifiedOrder.shipping_methods[0].amount).toEqual(10)

        expect(serializedModifiedOrder.items).toEqual([
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
              written_off_quantity: 0,
            }),
          }),
        ])

        // Revert Last Changes
        await service.revertLastVersion(createdOrder.id)
        const revertedOrder = await service.retrieveOrder(createdOrder.id, {
          select: [
            "id",
            "version",
            "items.detail",
            "summary",
            "shipping_methods",
          ],
          relations: ["items"],
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

        expect(serializedRevertedOrder.items).toEqual([
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
      })

      it("should create order change, cancel and reject them.", async function () {
        const createdOrder = await service.createOrders(input)

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
    })
  },
})
