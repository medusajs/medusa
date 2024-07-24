import { CreateOrderDTO, IOrderModuleService } from "@medusajs/types"
import { ClaimType, Modules } from "@medusajs/utils"
import { SuiteOptions, moduleIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner({
  moduleName: Modules.ORDER,
  testSuite: ({ service }: SuiteOptions<IOrderModuleService>) => {
    describe("Order Module Service - Claim flows", () => {
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

      it("should claim an item and add two new items to the order", async function () {
        const createdOrder = await service.createOrders(input)
        createdOrder.items = createdOrder.items!.sort((a, b) =>
          a.title.localeCompare(b.title)
        )

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

        // Claim
        const orderClaim = await service.createClaim({
          order_id: createdOrder.id,
          type: ClaimType.REPLACE,
          description: "Claim all the items",
          internal_note: "user wants to return all items",
          shipping_methods: [
            {
              name: "Claim method",
              amount: 35,
              provider_id: "dhl",
            },
          ],
          claim_items: [
            {
              id: createdOrder.items![1].id,
              quantity: 1,
              reason: "production_failure",
            },
          ],
          additional_items: [
            {
              id: createdOrder.items![2].id,
              quantity: 1,
            },
            {
              unit_price: 20,
              quantity: 1,
              title: "New item",
            },
          ],
          return_amount: 5,
          return_shipping: {
            name: "return shipping method",
            amount: 10,
            provider_id: "test_provider_id",
          },
        })

        expect(orderClaim).toEqual(
          expect.objectContaining({
            id: orderClaim.id,
            order_id: createdOrder.id,
            return: expect.objectContaining({
              order_id: createdOrder.id,
              claim_id: orderClaim.id,
              status: "requested",
              items: expect.arrayContaining([
                expect.objectContaining({
                  item_id: createdOrder.items![1].id,
                  quantity: 1,
                }),
              ]),
            }),
            type: "replace",
            additional_items: expect.arrayContaining([
              expect.objectContaining({
                claim_id: orderClaim.id,
                is_additional_item: true,
                quantity: 1,
                item: expect.objectContaining({
                  title: "New item",
                }),
                detail: expect.objectContaining({
                  quantity: 1,
                }),
              }),
              expect.objectContaining({
                claim_id: orderClaim.id,
                item_id: createdOrder.items![2].id,
                is_additional_item: true,
                quantity: 1,
                item: expect.objectContaining({
                  title: "Item 3",
                }),
                detail: expect.objectContaining({
                  quantity: 2,
                }),
              }),
            ]),
            claim_items: [
              expect.objectContaining({
                reason: "production_failure",
                claim_id: orderClaim.id,
                is_additional_item: false,
                quantity: 1,
                item: expect.objectContaining({
                  title: "Item 2",
                }),
                detail: expect.objectContaining({
                  quantity: 2,
                }),
              }),
            ],
            shipping_methods: expect.arrayContaining([
              expect.objectContaining({
                name: "return shipping method",
                amount: 10,
              }),
              expect.objectContaining({
                name: "Claim method",
                amount: 35,
              }),
            ]),
            refund_amount: null,
          })
        )
      })
    })
  },
})
