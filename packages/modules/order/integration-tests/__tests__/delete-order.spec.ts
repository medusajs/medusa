import {
  CreateOrderDTO,
  IOrderModuleService,
  OrderDTO,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IOrderModuleService>({
  moduleName: Modules.ORDER,
  testSuite: ({ service, MikroOrmWrapper }) => {
    describe("deleteOrders", () => {
      let order: OrderDTO

      beforeEach(async () => {
        order = await service.createOrders({
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
          ],
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
          currency_code: "usd",
          customer_id: "joe",
        } as CreateOrderDTO)
      })

      it("should delete an order, shipping method, taxes, adjustments, and items", async function () {
        const lineItemsBefore = await service.listOrderLineItems({})
        const itemAdjustmentsBefore =
          await service.listOrderLineItemAdjustments({})
        const itemTaxLinesBefore = await service.listOrderLineItemTaxLines({})
        const shippingMethodTaxLinesBefore =
          await service.listOrderShippingMethodTaxLines({})
        const shippingMethodAdjustmentsBefore =
          await service.listOrderShippingMethodAdjustments({})
        const shippingMethodsBefore = await service.listOrderShippingMethods(
          {},
          {}
        )

        expect(lineItemsBefore.length).toEqual(1)
        expect(itemAdjustmentsBefore.length).toEqual(1)
        expect(itemTaxLinesBefore.length).toEqual(1)
        expect(shippingMethodTaxLinesBefore.length).toEqual(1)
        expect(shippingMethodAdjustmentsBefore.length).toEqual(1)
        expect(shippingMethodsBefore.length).toEqual(1)

        await service.deleteOrders(order.id)

        const lineItems = await service.listOrderLineItems({})
        const itemAdjustments = await service.listOrderLineItemAdjustments({})
        const itemTaxLines = await service.listOrderLineItemTaxLines({})
        const shippingMethodTaxLines =
          await service.listOrderShippingMethodTaxLines({})
        const shippingMethodAdjustments =
          await service.listOrderShippingMethodAdjustments({})
        const shippingMethods = await service.listOrderShippingMethods({}, {})

        expect(lineItems).toEqual([])
        expect(itemAdjustments).toEqual([])
        expect(itemTaxLines).toEqual([])
        expect(shippingMethodTaxLines).toEqual([])
        expect(shippingMethodAdjustments).toEqual([])
        expect(shippingMethods).toEqual([])
      })

      // CONTEXT: The following tests checks that deleting an order without an address does not affect other orders through cascade deletes.
      //   See the following advisory for more details: https://github.com/medusajs/medusa/security/advisories/GHSA-hc6q-q5gm-w585
      it("should delete an order without an address without affecting other orders", async function () {
        const createdOrder = await service.retrieveOrder(order.id)
        expect(createdOrder).toEqual(
          expect.objectContaining({
            id: order.id,
          })
        )

        const orderWithoutAddress = await service.createOrders({
          email: "foo@bar.com",
          currency_code: "usd",
          customer_id: "joe",
        } as CreateOrderDTO)

        await service.deleteOrders(orderWithoutAddress.id)

        const orders = await service.listOrders({})
        expect(orders.length).toEqual(1)
        expect(orders[0].id).toEqual(order.id)
      })

      it("should delete an order address and set null on the order through the FK", async function () {
        const createdOrder = await service.retrieveOrder(order.id)
        expect(createdOrder).toEqual(
          expect.objectContaining({
            id: order.id,
          })
        )

        const createdOrderWithAddresses = await service.createOrders({
          email: "foo@bar.com",
          currency_code: "usd",
          customer_id: "joe",
          shipping_address: {
            first_name: "Test",
            last_name: "Test",
            address_1: "Test",
            city: "Test",
            country_code: "US",
            postal_code: "12345",
          },
          billing_address: {
            first_name: "Test",
            last_name: "Test",
            address_1: "Test",
            city: "Test",
            country_code: "US",
            postal_code: "12345",
          },
        } as CreateOrderDTO)

        const orderWithAddresses = await service.retrieveOrder(
          createdOrderWithAddresses.id,
          { relations: ["shipping_address", "billing_address"] }
        )

        await service.deleteOrderAddresses([
          orderWithAddresses.shipping_address?.id!,
          orderWithAddresses.billing_address?.id!,
        ])

        const retrievedOrder = await service.retrieveOrder(
          createdOrderWithAddresses.id,
          { relations: ["shipping_address", "billing_address"] }
        )

        expect(retrievedOrder.shipping_address).toEqual(null)
        expect(retrievedOrder.billing_address).toEqual(null)
      })
    })
  },
})
