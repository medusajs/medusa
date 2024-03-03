import { Modules } from "@medusajs/modules-sdk"
import { CreateOrderDTO, IOrderModuleService } from "@medusajs/types"
import { SuiteOptions, moduleIntegrationTestRunner } from "medusa-test-utils"
import { ChangeActionType, calculateOrderChange } from "../../src/utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner({
  debug: 0,
  moduleName: Modules.ORDER,
  testSuite: ({ service }: SuiteOptions<IOrderModuleService>) => {
    describe.skip("Order Module Service - Order Edits", () => {
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

      it("should create an order change", async function () {
        const createdOrder = await service.create(input)

        const orderChange = await service.createOrderChange({
          order_id: createdOrder.id,
          description: "changing the order",
          internal_note: "client called and wanted to change the order",
          created_by: "CX agent 123",
          actions: [
            {
              action: ChangeActionType.ITEM_ADD,
              internal_note: "adding an item",
              reference: "order_line_item",
              reference_id: createdOrder.items[0].id,
              amount:
                createdOrder.items[0].unit_price *
                createdOrder.items[0].quantity,
              details: {
                quantity: 1,
              },
            },
            {
              action: ChangeActionType.ITEM_ADD,
              reference: "order_line_item",
              reference_id: createdOrder.items[1].id,
              amount:
                createdOrder.items[1].unit_price *
                createdOrder.items[1].quantity,
              details: {
                quantity: 3,
              },
            },
          ],
        })

        const actions = await service.addOrderAction([
          {
            action: ChangeActionType.FULFILL_ITEM,
            order_id: createdOrder.id,
            version: createdOrder.version,
            reference: "fullfilment",
            reference_id: "fulfill_123",
            details: {
              reference_id: createdOrder.items[2].id,
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
              reference_id: createdOrder.items[2].id,
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
              reference_id: createdOrder.items[2].id,
              quantity: 1,
            },
          },
        ])

        const calculated = calculateOrderChange({
          order: createdOrder,
          actions: [...orderChange.actions, ...actions],
          transactions: createdOrder.transactions,
        })

        console.log(calculated.order.items.map((a) => a))
        console.log(calculated.order.summary)
      })
    })
  },
})
