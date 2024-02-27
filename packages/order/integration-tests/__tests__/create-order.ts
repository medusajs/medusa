import { Modules } from "@medusajs/modules-sdk"
import { CreateOrderDTO, IOrderModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner({
  moduleName: Modules.ORDER,
  testSuite: ({ service }: SuiteOptions<IOrderModuleService>) => {
    describe("Order Module Service", () => {
      it.only("should create an order, shipping method and items. Including taxes and adjustments associated with them", async function () {
        const order = await service.create({
          email: "foo@bar.com",
          /*items: [
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
          ],*/
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
        } as CreateOrderDTO)

        console.log(
          JSON.stringify(
            order.shipping_methods.map((s) => s.adjustments),
            null,
            2
          )
        )

        const getOrder = await service.retrieve(order.id, {
          select: [
            "id",
            "version",
            "items.id",
            "items.version",
            "items.item.id",
            "items.item.tax_lines.id",
            "items.item.adjustments.id",
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
            "items.item",
            "items.item.tax_lines",
            "items.item.adjustments",
            "shipping_methods",
            "shipping_methods.tax_lines",
            "shipping_methods.adjustments",
          ],
        })

        expect(getOrder).toEqual(
          expect.objectContaining({
            id: expect.stringContaining("order_"),
            version: 1,
            shipping_address: {
              id: expect.stringContaining("ordaddr_"),
            },
            billing_address: {
              id: expect.stringContaining("ordaddr_"),
            },
            items: [
              expect.objectContaining({
                id: expect.stringContaining("orddetail_"),
                version: 1,
                item: expect.objectContaining({
                  id: expect.stringContaining("ordli_"),
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
                }),
              }),
              expect.objectContaining({
                id: expect.stringContaining("orddetail_"),
                version: 1,
                item: expect.objectContaining({
                  id: expect.stringContaining("ordli_"),
                  tax_lines: [],
                  adjustments: [],
                }),
              }),
              expect.objectContaining({
                id: expect.stringContaining("orddetail_"),
                version: 1,
                item: expect.objectContaining({
                  id: expect.stringContaining("ordli_"),
                  tax_lines: [],
                  adjustments: [],
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
        )
      })
    })
  },
})
