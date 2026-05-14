import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { AdminShippingOption } from "@medusajs/types"
import { ModuleRegistrationName, Modules, ProductStatus } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"
import { createOrderSeeder } from "../../fixtures/order"
import { createShippingOptionSeeder } from "../../fixtures/shipping"
import {
  updateOrderChangeActionsWorkflow,
  updateOrderChangesWorkflow,
  updateOrderShippingMethodsStep,
} from "@medusajs/core-flows"
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let order,
      seeder,
      inventoryItemOverride3,
      productOverride3,
      shippingProfile,
      productOverride4,
      container

    beforeEach(async () => {
      container = getContainer()

      await setupTaxStructure(container.resolve(ModuleRegistrationName.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)

      shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "Test", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile
    })

    describe("GET /admin/orders", () => {
      beforeEach(async () => {
        seeder = await createOrderSeeder({
          api,
          container: getContainer(),
        })
        order = seeder.order
      })

      it("should search orders by display_id", async () => {
        let response = await api.get(`/admin/orders`, adminHeaders)

        expect(response.data.orders).toHaveLength(1)
        expect(response.data.orders).toEqual([
          expect.objectContaining({
            id: order.id,
          }),
        ])

        response = await api.get(
          `/admin/orders?q=${order.display_id}`,
          adminHeaders
        )

        expect(response.data.orders).toHaveLength(1)
        expect(response.data.orders).toEqual([
          expect.objectContaining({
            id: order.id,
          }),
        ])

        response = await api.get(`/admin/orders?q=2345`, adminHeaders)

        expect(response.data.orders).toHaveLength(0)
        expect(response.data.orders).toEqual([])
      })

      it("should search orders by shipping address", async () => {
        let response = await api.get(
          `/admin/orders?fields=+shipping_address.address_1,+shipping_address.address_2`,
          adminHeaders
        )

        expect(response.data.orders).toHaveLength(1)
        expect(response.data.orders).toEqual([
          expect.objectContaining({
            id: order.id,
          }),
        ])

        response = await api.get(
          `/admin/orders?fields=+shipping_address.address_1,+shipping_address.address_2&q=${order.shipping_address.address_1}`,
          adminHeaders
        )

        expect(response.data.orders).toHaveLength(1)
        expect(response.data.orders).toEqual([
          expect.objectContaining({
            id: order.id,
          }),
        ])

        response = await api.get(
          `/admin/orders?q=${order.shipping_address.address_2}`,
          adminHeaders
        )

        expect(response.data.orders).toHaveLength(1)
        expect(response.data.orders).toEqual([
          expect.objectContaining({
            id: order.id,
          }),
        ])

        response = await api.get(`/admin/orders?q=does-not-exist`, adminHeaders)

        expect(response.data.orders).toHaveLength(0)
        expect(response.data.orders).toEqual([])
      })

      describe("with matching list vs detail order totals with varying request fields", () => {
        const getDetailTotal = async (query?: string) => {
          const detailResponse = await api.get(
            `/admin/orders/${order.id}${query ? `?${query}` : ""}`,
            adminHeaders
          )

          return detailResponse.data.order.total
        }

        const getListTotal = async (query: string) => {
          const listResponse = await api.get(
            `/admin/orders?${query}`,
            adminHeaders
          )

          const listedOrder = listResponse.data.orders.find(
            (listed) => listed.id === order.id
          )

          expect(listedOrder).toBeTruthy()
          return listedOrder!.total
        }

        it("should match totals across key fields with default list and detail responses", async () => {
          const detailResponse = await api.get(
            `/admin/orders/${order.id}`,
            adminHeaders
          )
          const listResponse = await api.get(`/admin/orders`, adminHeaders)

          const listedOrder = listResponse.data.orders.find(
            (listed) => listed.id === order.id
          ) as any

          expect(listedOrder).toBeTruthy()

          const detailOrder = detailResponse.data.order as any
          const fieldsToCompare = [
            // default admin order list endpoint only has total
            "total",
            // admin order detail endpoint has more fields
            // "original_total",
            // "discount_total",
            // "discount_subtotal",
            // "shipping_total",
            // "tax_total",
          ]

          for (const field of fieldsToCompare) {
            expect(listedOrder).toHaveProperty(field)
            expect(listedOrder[field]).toBeDefined()
            expect(listedOrder[field]).toBe(detailOrder[field])
          }
        })

        it("should return the same total using default list fields", async () => {
          const expectedTotal = await getDetailTotal()
          const listTotal = await getListTotal(
            // fields we use on the admin list page
            `fields=${encodeURIComponent(
              "id,status,created_at,email,display_id,custom_display_id,payment_status,fulfillment_status,total,currency_code,*customer,*sales_channel,*payment_collections"
            )}`
          )

          expect(listTotal).toBe(expectedTotal)
        })

        it("should return the same total using minimal list fields", async () => {
          const expectedTotal = await getDetailTotal()
          const listTotal = await getListTotal("fields=id,total")

          expect(listTotal).toBe(expectedTotal)
        })

        it("should return the same total when requesting item fields", async () => {
          const expectedTotal = await getDetailTotal()
          const listTotal = await getListTotal(
            `fields=${encodeURIComponent("id,total,*items,+items.detail")}`
          )

          expect(listTotal).toBe(expectedTotal)
        })

        it("should return the same total when requesting shipping fields", async () => {
          const expectedTotal = await getDetailTotal()
          const listTotal = await getListTotal(
            `fields=${encodeURIComponent(
              "id,total,*shipping_methods,+shipping_methods.tax_lines"
            )}`
          )

          expect(listTotal).toBe(expectedTotal)
        })

        it("should return the same total when using mixed list fields", async () => {
          const expectedTotal = await getDetailTotal()
          const listTotal = await getListTotal(
            `fields=${encodeURIComponent(
              "id,status,total,currency_code,*items,+items.detail,*shipping_methods,+shipping_methods.tax_lines"
            )}`
          )

          expect(listTotal).toBe(expectedTotal)
        })

        it("should return the same total when using + / - field modifiers", async () => {
          const expectedTotal = await getDetailTotal()
          const listTotal = await getListTotal(
            `fields=${encodeURIComponent("+total,-email")}`
          )

          expect(listTotal).toBe(expectedTotal)
        })

        it("should return the same total when ordering results", async () => {
          const expectedTotal = await getDetailTotal()
          const listTotal = await getListTotal(
            "fields=id,total&order=-created_at"
          )

          expect(listTotal).toBe(expectedTotal)
        })

        it("should return the same total when requesting minimal detail fields", async () => {
          const listTotal = await getListTotal(
            `fields=${encodeURIComponent(
              "id,status,created_at,email,display_id,custom_display_id,payment_status,fulfillment_status,total,currency_code,*customer,*sales_channel,*payment_collections"
            )}`
          )
          const detailTotal = await getDetailTotal("fields=id,total")

          expect(detailTotal).toBe(listTotal)
        })

        it("should return the same total when requesting item detail fields", async () => {
          const listTotal = await getListTotal(
            `fields=${encodeURIComponent(
              "id,status,created_at,email,display_id,custom_display_id,payment_status,fulfillment_status,total,currency_code,*customer,*sales_channel,*payment_collections"
            )}`
          )
          const detailTotal = await getDetailTotal(
            `fields=${encodeURIComponent("id,total,*items,+items.detail")}`
          )

          expect(detailTotal).toBe(listTotal)
        })

        it("should return the same total when requesting shipping detail fields", async () => {
          const listTotal = await getListTotal(
            `fields=${encodeURIComponent(
              "id,status,created_at,email,display_id,custom_display_id,payment_status,fulfillment_status,total,currency_code,*customer,*sales_channel,*payment_collections"
            )}`
          )
          const detailTotal = await getDetailTotal(
            `fields=${encodeURIComponent(
              "id,total,*shipping_methods,+shipping_methods.tax_lines"
            )}`
          )

          expect(detailTotal).toBe(listTotal)
        })

        it("should return the same total when using + / - field modifiers on detail", async () => {
          const listTotal = await getListTotal(
            `fields=${encodeURIComponent(
              "id,status,created_at,email,display_id,custom_display_id,payment_status,fulfillment_status,total,currency_code,*customer,*sales_channel,*payment_collections"
            )}`
          )
          const detailTotal = await getDetailTotal(
            `fields=${encodeURIComponent("+total,-email")}`
          )

          expect(detailTotal).toBe(listTotal)
        })
      })

      it("should search orders by billing address", async () => {
        let response = await api.get(
          `/admin/orders?fields=+billing_address.address_1,+billing_address.address_2`,
          adminHeaders
        )

        expect(response.data.orders).toHaveLength(1)
        expect(response.data.orders).toEqual([
          expect.objectContaining({
            id: order.id,
          }),
        ])

        response = await api.get(
          `/admin/orders?fields=+billing_address.address_1,+billing_address.address_2&q=${order.billing_address.address_1}`,
          adminHeaders
        )

        expect(response.data.orders).toHaveLength(1)
        expect(response.data.orders).toEqual([
          expect.objectContaining({
            id: order.id,
          }),
        ])

        response = await api.get(
          `/admin/orders?q=${order.billing_address.address_2}`,
          adminHeaders
        )

        expect(response.data.orders).toHaveLength(1)
        expect(response.data.orders).toEqual([
          expect.objectContaining({
            id: order.id,
          }),
        ])
      })

      describe("filter by total using operators", () => {
        it.each([
          {
            operator: "$eq",
            matchType: "matching",
            getValue: (orderTotal: number) => orderTotal,
            expectedLength: 1,
            shouldMatchOrder: true,
          },
          {
            operator: "$eq",
            matchType: "non-matching",
            getValue: (orderTotal: number) => orderTotal + 1000,
            expectedLength: 0,
            shouldMatchOrder: false,
          },
          {
            operator: "$gte",
            matchType: "matching",
            getValue: (orderTotal: number) => orderTotal - 100,
            expectedLength: 1,
            shouldMatchOrder: true,
          },
          {
            operator: "$gte",
            matchType: "non-matching",
            getValue: (orderTotal: number) => orderTotal + 1000,
            expectedLength: 0,
            shouldMatchOrder: false,
          },
          {
            operator: "$lte",
            matchType: "matching",
            getValue: (orderTotal: number) => orderTotal + 100,
            expectedLength: 1,
            shouldMatchOrder: true,
          },
          {
            operator: "$lte",
            matchType: "non-matching",
            getValue: (_orderTotal: number) => 0,
            expectedLength: 0,
            shouldMatchOrder: false,
          },
        ])(
          "should filter orders by total using $operator operator - $matchType value",
          async ({ operator, getValue, expectedLength, shouldMatchOrder }) => {
            let filterValue: number

            const orderResponse = await api.get(
              `/admin/orders/${order.id}?fields=+summary`,
              adminHeaders
            )
            const orderTotal =
              orderResponse.data.order.summary.current_order_total
            filterValue = getValue(orderTotal)

            const queryParams = `total[${operator}]=${filterValue}`

            const response = await api.get(
              `/admin/orders?${queryParams}`,
              adminHeaders
            )

            expect(response.data.orders).toHaveLength(expectedLength)
            if (shouldMatchOrder) {
              expect(response.data.orders).toEqual([
                expect.objectContaining({
                  id: order.id,
                }),
              ])
            } else {
              expect(response.data.orders).toEqual([])
            }
          }
        )
      })

      it("should return shipping_address when pagination included", async () => {
        const response = await api.get(
          `/admin/orders?fields=*shipping_address&offset=0`,
          adminHeaders
        )

        expect(response.data.orders).toHaveLength(1)
        expect(response.data.orders[0].id).toEqual(order.id)
        expect(response.data.orders[0].shipping_address).toBeDefined()
        expect(response.data.orders[0].shipping_address.address_1).toEqual(
          order.shipping_address.address_1
        )
        expect(response.data.orders[0].shipping_address.city).toEqual(
          order.shipping_address.city
        )
      })

      it("should return billing_address when pagination included", async () => {
        const response = await api.get(
          `/admin/orders?fields=*billing_address&offset=0`,
          adminHeaders
        )

        expect(response.data.orders).toHaveLength(1)
        expect(response.data.orders[0].id).toEqual(order.id)
        expect(response.data.orders[0].billing_address).toBeDefined()
        expect(response.data.orders[0].billing_address.address_1).toEqual(
          order.billing_address.address_1
        )
        expect(response.data.orders[0].billing_address.city).toEqual(
          order.billing_address.city
        )
      })

      it("should return specific address fields when pagination included", async () => {
        const response = await api.get(
          `/admin/orders?fields=+shipping_address.address_1,+shipping_address.city,+billing_address.address_1,+billing_address.city&offset=0`,
          adminHeaders
        )

        expect(response.data.orders).toHaveLength(1)
        const responseOrder = response.data.orders[0]
        expect(responseOrder.id).toEqual(order.id)
        expect(responseOrder.shipping_address).toBeDefined()
        expect(responseOrder.shipping_address.address_1).toEqual(
          order.shipping_address.address_1
        )
        expect(responseOrder.shipping_address.city).toEqual(
          order.shipping_address.city
        )
        expect(responseOrder.billing_address).toBeDefined()
        expect(responseOrder.billing_address.address_1).toEqual(
          order.billing_address.address_1
        )
        expect(responseOrder.billing_address.city).toEqual(
          order.billing_address.city
        )
      })
    })

    describe("POST /orders/:id", () => {
      beforeEach(async () => {
        seeder = await createOrderSeeder({
          api,
          container: getContainer(),
        })
        order = seeder.order

        order = (
          await api.get(
            `/admin/orders/${order.id}?fields=+email,+customer_id`,
            adminHeaders
          )
        ).data.order
      })

      it("should update shipping address on an order (by creating a new Address record)", async () => {
        const addressBefore = order.shipping_address

        const response = await api.post(
          `/admin/orders/${order.id}`,
          {
            shipping_address: {
              city: "New New York",
              address_1: "New Main street 123",
            },
          },
          adminHeaders
        )

        expect(response.data.order.shipping_address.id).not.toEqual(
          addressBefore.id
        ) // new addres created
        expect(response.data.order.shipping_address).toEqual(
          expect.objectContaining({
            customer_id: addressBefore.customer_id,
            company: addressBefore.company,
            first_name: addressBefore.first_name,
            last_name: addressBefore.last_name,
            address_1: "New Main street 123",
            address_2: addressBefore.address_2,
            city: "New New York",
            country_code: addressBefore.country_code,
            province: addressBefore.province,
            postal_code: addressBefore.postal_code,
            phone: addressBefore.phone,
          })
        )

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(1)
        expect(orderChangesResult[0]).toEqual(
          expect.objectContaining({
            version: 1,
            change_type: "update_order",
            status: "confirmed",
            created_by: expect.any(String),
            confirmed_by: expect.any(String),
            confirmed_at: expect.any(String),
            actions: expect.arrayContaining([
              expect.objectContaining({
                version: 1,
                applied: true,
                action: "UPDATE_ORDER_PROPERTIES",
                details: expect.objectContaining({
                  type: "shipping_address",
                  old: expect.objectContaining({
                    address_1: addressBefore.address_1,
                    city: addressBefore.city,
                    country_code: addressBefore.country_code,
                    province: addressBefore.province,
                    postal_code: addressBefore.postal_code,
                    phone: addressBefore.phone,
                    company: addressBefore.company,
                    first_name: addressBefore.first_name,
                    last_name: addressBefore.last_name,
                    address_2: addressBefore.address_2,
                  }),
                  new: expect.objectContaining({
                    address_1: "New Main street 123",
                    city: "New New York",
                    country_code: addressBefore.country_code,
                    province: addressBefore.province,
                    postal_code: addressBefore.postal_code,
                    phone: addressBefore.phone,
                    company: addressBefore.company,
                    first_name: addressBefore.first_name,
                    last_name: addressBefore.last_name,
                    address_2: addressBefore.address_2,
                  }),
                }),
              }),
            ]),
          })
        )
      })

      it("should fail to update shipping address if country code has been changed", async () => {
        const response = await api
          .post(
            `/admin/orders/${order.id}`,
            {
              shipping_address: {
                country_code: "HR",
              },
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(response.response.status).toBe(400)
        expect(response.response.data.message).toBe(
          "Country code cannot be changed"
        )

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(0)
      })

      it("should update billing address on an order (by creating a new Address record)", async () => {
        const addressBefore = order.billing_address

        const response = await api.post(
          `/admin/orders/${order.id}`,
          {
            billing_address: {
              city: "New New York",
              address_1: "New Main street 123",
            },
          },
          adminHeaders
        )

        expect(response.data.order.billing_address.id).not.toEqual(
          addressBefore.id
        ) // new addres created
        expect(response.data.order.billing_address).toEqual(
          expect.objectContaining({
            customer_id: addressBefore.customer_id,
            company: addressBefore.company,
            first_name: addressBefore.first_name,
            last_name: addressBefore.last_name,
            address_1: "New Main street 123",
            address_2: addressBefore.address_2,
            city: "New New York",
            country_code: addressBefore.country_code,
            province: addressBefore.province,
            postal_code: addressBefore.postal_code,
            phone: addressBefore.phone,
          })
        )

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(1)
        expect(orderChangesResult[0]).toEqual(
          expect.objectContaining({
            version: 1,
            change_type: "update_order",
            status: "confirmed",
            created_by: expect.any(String),
            confirmed_by: expect.any(String),
            confirmed_at: expect.any(String),
            actions: expect.arrayContaining([
              expect.objectContaining({
                version: 1,
                applied: true,
                action: "UPDATE_ORDER_PROPERTIES",
                details: expect.objectContaining({
                  type: "billing_address",
                  old: expect.objectContaining({
                    address_1: addressBefore.address_1,
                    city: addressBefore.city,
                    country_code: addressBefore.country_code,
                    province: addressBefore.province,
                    postal_code: addressBefore.postal_code,
                    phone: addressBefore.phone,
                  }),
                  new: expect.objectContaining({
                    address_1: "New Main street 123",
                    city: "New New York",
                    country_code: addressBefore.country_code,
                    province: addressBefore.province,
                    postal_code: addressBefore.postal_code,
                    phone: addressBefore.phone,
                  }),
                }),
              }),
            ]),
          })
        )
      })

      it("should fail to update billing address if country code has been changed", async () => {
        const response = await api
          .post(
            `/admin/orders/${order.id}`,
            {
              billing_address: {
                country_code: "HR",
              },
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(response.response.status).toBe(400)
        expect(response.response.data.message).toBe(
          "Country code cannot be changed"
        )

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(0)
      })

      it("should update orders email and shipping address and create 2 change records", async () => {
        const response = await api.post(
          `/admin/orders/${order.id}?fields=+email,*shipping_address`,
          {
            email: "new-email@example.com",
            shipping_address: {
              address_1: "New Main street 123",
            },
          },
          adminHeaders
        )

        expect(response.data.order.email).toBe("new-email@example.com")
        expect(response.data.order.shipping_address.id).not.toEqual(
          order.shipping_address.id
        )
        expect(response.data.order.shipping_address).toEqual(
          expect.objectContaining({
            address_1: "New Main street 123",
          })
        )

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(2)
        expect(orderChangesResult).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              version: 1,
              change_type: "update_order",
              status: "confirmed",
              confirmed_at: expect.any(String),
              created_by: expect.any(String),
              confirmed_by: expect.any(String),
              actions: expect.arrayContaining([
                expect.objectContaining({
                  version: 1,
                  applied: true,
                  action: "UPDATE_ORDER_PROPERTIES",
                  details: expect.objectContaining({
                    type: "shipping_address",
                    old: expect.objectContaining({
                      address_1: order.shipping_address.address_1,
                      city: order.shipping_address.city,
                    }),
                    new: expect.objectContaining({
                      address_1: "New Main street 123",
                    }),
                  }),
                }),
              ]),
            }),
            expect.objectContaining({
              version: 1,
              change_type: "update_order",
              status: "confirmed",
              confirmed_at: expect.any(String),
              created_by: expect.any(String),
              confirmed_by: expect.any(String),
              actions: expect.arrayContaining([
                expect.objectContaining({
                  version: 1,
                  applied: true,
                  action: "UPDATE_ORDER_PROPERTIES",
                  details: expect.objectContaining({
                    type: "email",
                    old: order.email,
                    new: "new-email@example.com",
                  }),
                }),
              ]),
            }),
          ])
        )
      })

      it("should fail to update email if it is invalid", async () => {
        const response = await api
          .post(
            `/admin/orders/${order.id}`,
            {
              email: "invalid-email",
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(response.response.status).toBe(400)
        expect(response.response.data.message).toBe("The email is not valid")

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(0)
      })

      describe("conditional customer creation", () => {
        it("should create or find a customer when order email is unset and input email is provided", async () => {
          const container = getContainer()
          const orderService = container.resolve(ModuleRegistrationName.ORDER)
          const customerService = container.resolve(
            ModuleRegistrationName.CUSTOMER
          )

          const orderWithoutEmail = await orderService.createOrders({
            region_id: seeder.region.id,
            currency_code: "usd",
            items: [
              {
                title: "Test Item",
                quantity: 1,
                unit_price: 100,
              },
            ],
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
          })

          expect(orderWithoutEmail.email).toBeNull()

          const newEmail = "newcustomer@example.com"

          const customersBefore = await customerService.listCustomers()
          const customerCountBefore = customersBefore.length

          const response = await api.post(
            `/admin/orders/${orderWithoutEmail.id}?fields=+email,+customer_id`,
            {
              email: newEmail,
            },
            adminHeaders
          )

          expect(response.data.order.email).toBe(newEmail)
          expect(response.data.order.customer_id).toBeDefined()

          const customersAfter = await customerService.listCustomers()
          expect(customersAfter.length).toBe(customerCountBefore + 1)

          const customer = await customerService.retrieveCustomer(
            response.data.order.customer_id
          )
          expect(customer.email).toBe(newEmail)
        })

        it("should NOT create or find a customer when order email is already set and input email is provided", async () => {
          const container = getContainer()
          const customerService = container.resolve(
            ModuleRegistrationName.CUSTOMER
          )

          const existingEmail = order.email

          expect(existingEmail).toBeDefined()

          const originalCustomerId = order.customer_id
          const newEmail = "updated@example.com"

          const customersBefore = await customerService.listCustomers()
          const customerCountBefore = customersBefore.length

          const response = await api.post(
            `/admin/orders/${order.id}?fields=+email,+customer_id`,
            {
              email: newEmail,
            },
            adminHeaders
          )

          expect(response.data.order.email).toBe(newEmail)
          expect(response.data.order.customer_id).toBe(originalCustomerId)

          const customersAfter = await customerService.listCustomers()
          expect(customersAfter.length).toBe(customerCountBefore)
        })

        it("should NOT create or find a customer when order email is unset and input email is not provided", async () => {
          const container = getContainer()
          const orderService = container.resolve(ModuleRegistrationName.ORDER)
          const customerService = container.resolve(
            ModuleRegistrationName.CUSTOMER
          )

          const orderWithoutEmail = await orderService.createOrders({
            region_id: seeder.region.id,
            currency_code: "usd",
            email: undefined,
            items: [
              {
                title: "Test Item",
                quantity: 1,
                unit_price: 100,
              },
            ],
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
          })

          const customersBefore = await customerService.listCustomers()
          const customerCountBefore = customersBefore.length

          const response = await api.post(
            `/admin/orders/${orderWithoutEmail.id}?fields=+customer_id`,
            {
              metadata: {
                test: "value",
              },
            },
            adminHeaders
          )

          expect(response.data.order.customer_id).toBeNull()

          const customersAfter = await customerService.listCustomers()
          expect(customersAfter.length).toBe(customerCountBefore)
        })

        it("should find existing customer when order email is unset and input email matches existing customer", async () => {
          const container = getContainer()
          const orderService = container.resolve(ModuleRegistrationName.ORDER)
          const customerService = container.resolve(
            ModuleRegistrationName.CUSTOMER
          )

          const existingEmail = "existingcustomer@example.com"

          const existingCustomer = await customerService.createCustomers({
            email: existingEmail,
          })

          const orderWithoutEmail = await orderService.createOrders({
            region_id: seeder.region.id,
            currency_code: "usd",
            items: [
              {
                title: "Test Item",
                quantity: 1,
                unit_price: 100,
              },
            ],
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
          })

          const customersBefore = await customerService.listCustomers()
          const customerCountBefore = customersBefore.length

          const response = await api.post(
            `/admin/orders/${orderWithoutEmail.id}?fields=+email,+customer_id`,
            {
              email: existingEmail,
            },
            adminHeaders
          )

          expect(response.data.order.email).toBe(existingEmail)
          expect(response.data.order.customer_id).toBe(existingCustomer.id)

          const customersAfter = await customerService.listCustomers()
          expect(customersAfter.length).toBe(customerCountBefore)
        })
      })
    })

    describe("POST /orders/:id/cancel", () => {
      beforeEach(async () => {
        const inventoryItemOverride = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant", requires_shipping: false },
            adminHeaders
          )
        ).data.inventory_item

        seeder = await createOrderSeeder({
          api,
          container: getContainer(),
          inventoryItemOverride,
          withoutShipping: true,
        })
        order = seeder.order

        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order
      })

      it("should successfully cancel an order and its authorized but not captured payments", async () => {
        const response = await api.post(
          `/admin/orders/${order.id}/cancel`,
          {},
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.order).toEqual(
          expect.objectContaining({
            id: order.id,
            status: "canceled",

            summary: expect.objectContaining({
              current_order_total: 106,
              accounting_total: 106,
            }),

            payment_collections: [
              expect.objectContaining({
                status: "canceled",
                captured_amount: 0,
                refunded_amount: 0,
                amount: 106,
                payments: [
                  expect.objectContaining({
                    canceled_at: expect.any(String),
                    refunds: [],
                    captures: [],
                  }),
                ],
              }),
            ],
          })
        )
      })

      it("should successfully cancel an order with a captured payment", async () => {
        const payment = order.payment_collections[0].payments[0]

        const paymentResponse = await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        expect(paymentResponse.data.payment).toEqual(
          expect.objectContaining({
            id: payment.id,
            captured_at: expect.any(String),
            captures: [
              expect.objectContaining({
                id: expect.any(String),
                amount: 106,
              }),
            ],
            refunds: [],
            amount: 106,
          })
        )

        const response = await api.post(
          `/admin/orders/${order.id}/cancel`,
          {},
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.order).toEqual(
          expect.objectContaining({
            id: order.id,
            status: "canceled",

            summary: expect.objectContaining({
              current_order_total: 0,
              accounting_total: 0,
            }),

            payment_collections: [
              expect.objectContaining({
                status: "canceled",
                captured_amount: 106,
                refunded_amount: 106,
                amount: 106,
                payments: [
                  expect.objectContaining({
                    canceled_at: null,
                    refunds: [
                      expect.objectContaining({
                        id: expect.any(String),
                        amount: 106,
                        created_by: expect.any(String),
                      }),
                    ],
                    captures: [
                      expect.objectContaining({
                        id: expect.any(String),
                        amount: 106,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        )
      })

      it("should successfully cancel an order with a partially captured payment", async () => {
        const payment = order.payment_collections[0].payments[0]

        const paymentResponse = await api.post(
          `/admin/payments/${payment.id}/capture`,
          { amount: 50 },
          adminHeaders
        )

        expect(paymentResponse.data.payment).toEqual(
          expect.objectContaining({
            id: payment.id,
            captured_at: null,
            captures: [
              expect.objectContaining({
                id: expect.any(String),
                amount: 50,
              }),
            ],
            refunds: [],
            amount: 106,
          })
        )

        const response = await api
          .post(`/admin/orders/${order.id}/cancel`, {}, adminHeaders)
          .catch((e) => e)

        expect(response.status).toBe(200)
        expect(response.data.order).toEqual(
          expect.objectContaining({
            id: order.id,
            status: "canceled",

            summary: expect.objectContaining({
              current_order_total: 56,
              accounting_total: 56,
            }),

            payment_collections: [
              expect.objectContaining({
                status: "canceled",
                captured_amount: 50,
                refunded_amount: 50,
                amount: 106,
                payments: [
                  expect.objectContaining({
                    refunds: [
                      expect.objectContaining({
                        id: expect.any(String),
                        amount: 50,
                        created_by: expect.any(String),
                      }),
                    ],
                    captures: [
                      expect.objectContaining({
                        id: expect.any(String),
                        amount: 50,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        )
      })

      it("should only create credit lines for successfully refunded payments when some refunds fail", async () => {
        const paymentModule = container.resolve(Modules.PAYMENT)
        const payment = order.payment_collections[0].payments[0]
        const paymentCollectionId = order.payment_collections[0].id

        // Capture the original payment for 50
        await api.post(
          `/admin/payments/${payment.id}/capture`,
          { amount: 50 },
          adminHeaders
        )

        // Create a second payment session, authorize it, and capture it for 30
        const session2 = await paymentModule.createPaymentSession(
          paymentCollectionId,
          {
            provider_id: "pp_system_default",
            amount: 100,
            currency_code: "usd",
            data: {},
          }
        )
        const payment2 = await paymentModule.authorizePaymentSession(
          session2.id,
          {}
        )
        await paymentModule.capturePayment({
          payment_id: payment2.id,
          amount: 30,
        })

        // Verify both payments are captured before canceling
        const orderBeforeCancel = (
          await api.get(
            `/admin/orders/${order.id}?fields=*payment_collections.payments.amount,*payment_collections.payments.captures.amount`,
            adminHeaders
          )
        ).data.order

        const capturedPayments =
          orderBeforeCancel.payment_collections[0].payments.filter(
            (p) => p.captures.length > 0
          )
        expect(capturedPayments).toHaveLength(2)

        // Mock refundPayment to fail for the second payment
        const originalRefundPayment =
          paymentModule.refundPayment.bind(paymentModule)
        jest
          .spyOn(paymentModule, "refundPayment")
          .mockImplementation(async (data: any, sharedContext?: any) => {
            if (data.payment_id === payment2.id) {
              throw new Error("Refund failed at payment provider")
            }
            return originalRefundPayment(data, sharedContext)
          })

        // Cancel the order
        const cancelResponse = await api.post(
          `/admin/orders/${order.id}/cancel`,
          {},
          adminHeaders
        )

        expect(cancelResponse.status).toBe(200)

        // Restore the mock
        jest.restoreAllMocks()

        // Get the canceled order with credit lines and summary
        const canceledOrder = (
          await api.get(
            `/admin/orders/${order.id}?fields=*credit_lines.amount,*payment_collections.payments.amount,*payment_collections.payments.captures.amount,*payment_collections.payments.refunds.amount`,
            adminHeaders
          )
        ).data.order

        expect(canceledOrder.status).toBe("canceled")

        // Only the first payment (50) was successfully refunded
        // The second payment (30) refund failed, so it should NOT be in credit lines
        const totalCreditLineAmount = canceledOrder.credit_lines.reduce(
          (sum, cl) => sum + cl.amount,
          0
        )

        // Credit line should only reflect the successful refund (50), not both (50 + 30)
        expect(totalCreditLineAmount).toBe(50)
        expect(canceledOrder.summary.credit_line_total).toBe(50)

        // Verify only the first payment has a refund record
        const originalPaymentAfter =
          canceledOrder.payment_collections[0].payments.find(
            (p) => p.id === payment.id
          )
        const payment2After =
          canceledOrder.payment_collections[0].payments.find(
            (p) => p.id === payment2.id
          )

        expect(originalPaymentAfter.refunds).toHaveLength(1)
        expect(originalPaymentAfter.refunds[0].amount).toBe(50)

        // The failed payment should have no refund records
        expect(payment2After.refunds).toHaveLength(0)
      })
    })

    describe("POST /orders/:id/fulfillments", () => {
      let productOverride4WithOverrideShippingProfile,
        shippingProfileOverride,
        stockChannelOverride

      beforeEach(async () => {
        stockChannelOverride = (
          await api.post(
            `/admin/stock-locations`,
            { name: "test location" },
            adminHeaders
          )
        ).data.stock_location

        const inventoryItemOverride = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant", requires_shipping: true },
            adminHeaders
          )
        ).data.inventory_item

        const productOverride = (
          await api.post(
            "/admin/products",
            {
              title: `Test fixture`,
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              variants: [
                {
                  title: "Test variant",
                  sku: "w-inv-override-1",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemOverride.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                  ],
                  options: {
                    size: "large",
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        const inventoryItemOverride2 = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant-2", requires_shipping: false },
            adminHeaders
          )
        ).data.inventory_item

        inventoryItemOverride3 = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant-3", requires_shipping: false },
            adminHeaders
          )
        ).data.inventory_item

        const inventoryItemOverride4RequiresShipping = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant-4", requires_shipping: true },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItemOverride2.id}/location-levels`,
          {
            location_id: stockChannelOverride.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItemOverride3.id}/location-levels`,
          {
            location_id: stockChannelOverride.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItemOverride4RequiresShipping.id}/location-levels`,
          {
            location_id: stockChannelOverride.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        const productOverride2 = (
          await api.post(
            "/admin/products",
            {
              title: `Test fixture 2`,
              status: ProductStatus.PUBLISHED,
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              variants: [
                {
                  title: "Test variant 2",
                  sku: "w-inv-override-2",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemOverride2.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                  ],
                  options: {
                    size: "large",
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        productOverride3 = (
          await api.post(
            "/admin/products",
            {
              title: `Test fixture 3`,
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              variants: [
                {
                  title: "Test variant 3",
                  sku: "test-variant-3",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemOverride3.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                  ],
                  options: {
                    size: "small",
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        const inventoryItemOverride4 = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant-4-no-shipping", requires_shipping: false },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItemOverride4.id}/location-levels`,
          {
            location_id: stockChannelOverride.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        productOverride4 = (
          await api.post(
            "/admin/products",
            {
              title: `Test override 4`,
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "size", values: ["large"] }],
              variants: [
                {
                  title: "Test variant 4",
                  sku: "test-variant-4-override",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemOverride4.id,
                      required_quantity: 3,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                  ],
                  options: {
                    size: "large",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        shippingProfileOverride = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: `test-${stockChannelOverride.id}`, type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        productOverride4WithOverrideShippingProfile = (
          await api.post(
            "/admin/products",
            {
              title: `Test fixture 4`,
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfileOverride.id,
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              variants: [
                {
                  title: "Test variant 4",
                  sku: "test-variant-4",
                  inventory_items: [
                    {
                      inventory_item_id:
                        inventoryItemOverride4RequiresShipping.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                  ],
                  options: {
                    size: "small",
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        seeder = await createOrderSeeder({
          api,
          container: getContainer(),
          productOverride,
          additionalProducts: [
            { variant_id: productOverride2.variants[0].id, quantity: 1 },
            { variant_id: productOverride3.variants[0].id, quantity: 3 },
            { variant_id: productOverride4.variants[0].id, quantity: 1 },
            {
              variant_id:
                productOverride4WithOverrideShippingProfile.variants[0].id,
              quantity: 1,
            },
          ],
          stockChannelOverride,
          inventoryItemOverride,
          shippingProfileOverride: [shippingProfile, shippingProfileOverride],
        })
        order = seeder.order
        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order
      })

      it("should update stock levels correctly when creating partial fulfillment on an order", async () => {
        const orderItemId = order.items.find(
          (i) => i.variant_id === productOverride3.variants[0].id
        ).id

        let iitem = (
          await api.get(
            `/admin/inventory-items/${inventoryItemOverride3.id}?fields=stocked_quantity,reserved_quantity`,
            adminHeaders
          )
        ).data.inventory_item

        expect(iitem.stocked_quantity).toBe(10)
        expect(iitem.reserved_quantity).toBe(3)

        await api.post(
          `/admin/orders/${order.id}/fulfillments`,
          {
            shipping_option_id: seeder.shippingOption.id,
            location_id: seeder.stockLocation.id,
            items: [{ id: orderItemId, quantity: 1 }],
          },
          adminHeaders
        )

        iitem = (
          await api.get(
            `/admin/inventory-items/${inventoryItemOverride3.id}?fields=stocked_quantity,reserved_quantity`,
            adminHeaders
          )
        ).data.inventory_item

        expect(iitem.stocked_quantity).toBe(9)
        expect(iitem.reserved_quantity).toBe(2)

        await api.post(
          `/admin/orders/${order.id}/fulfillments`,
          {
            shipping_option_id: seeder.shippingOption.id,
            location_id: seeder.stockLocation.id,
            items: [{ id: orderItemId, quantity: 1 }],
          },
          adminHeaders
        )

        iitem = (
          await api.get(
            `/admin/inventory-items/${inventoryItemOverride3.id}?fields=stocked_quantity,reserved_quantity`,
            adminHeaders
          )
        ).data.inventory_item

        expect(iitem.stocked_quantity).toBe(8)
        expect(iitem.reserved_quantity).toBe(1)

        const {
          data: { order: fulfillableOrder },
        } = await api.post(
          `/admin/orders/${order.id}/fulfillments?fields=fulfillments.id`,
          {
            shipping_option_id: seeder.shippingOption.id,
            location_id: seeder.stockLocation.id,
            items: [{ id: orderItemId, quantity: 1 }],
          },
          adminHeaders
        )

        expect(fulfillableOrder.fulfillments).toHaveLength(3)

        iitem = (
          await api.get(
            `/admin/inventory-items/${inventoryItemOverride3.id}?fields=stocked_quantity,reserved_quantity`,
            adminHeaders
          )
        ).data.inventory_item

        expect(iitem.stocked_quantity).toBe(7)
        expect(iitem.reserved_quantity).toBe(0)
      })

      it("should throw if trying to fulfillment more items than it is reserved", async () => {
        const orderItemId = order.items.find(
          (i) => i.variant_id === productOverride3.variants[0].id
        ).id

        const res = await api
          .post(
            `/admin/orders/${order.id}/fulfillments`,
            {
              shipping_option_id: seeder.shippingOption.id,
              location_id: seeder.stockLocation.id,
              items: [{ id: orderItemId, quantity: 5 }],
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(res.response.status).toBe(400)
        expect(res.response.data.message).toBe(
          `Quantity to fulfill exceeds the reserved quantity for the item: ${orderItemId}`
        )
      })

      it("should throw if trying to fulfillment more items than it is reserved when item has required quantity", async () => {
        const orderItemId = order.items.find(
          (i) => i.variant_id === productOverride4.variants[0].id
        ).id

        let reservation = (
          await api.get(
            `/admin/reservations?line_item_id=${orderItemId}`,
            adminHeaders
          )
        ).data.reservations[0]

        expect(reservation.quantity).toBe(3) // one item with required quantity 3

        reservation = (
          await api.post(
            `/admin/reservations/${reservation.id}`,
            {
              quantity: 2,
            },
            adminHeaders
          )
        ).data.reservation

        expect(reservation.quantity).toBe(2)

        const res = await api
          .post(
            `/admin/orders/${order.id}/fulfillments`,
            {
              shipping_option_id: seeder.shippingOption.id,
              location_id: seeder.stockLocation.id,
              items: [{ id: orderItemId, quantity: 1 }], // fulfill 1 orer item which requires 3 inventor items
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(res.response.status).toBe(400)
        expect(res.response.data.message).toBe(
          `Quantity to fulfill exceeds the reserved quantity for the item: ${orderItemId}`
        )
      })

      it("should throw if shipping profile of the product doesn't match the shipping profile of the shipping option", async () => {
        const orderItemId = order.items.find(
          (i) =>
            i.variant_id ===
            productOverride4WithOverrideShippingProfile.variants[0].id
        ).id

        const res = await api
          .post(
            `/admin/orders/${order.id}/fulfillments`,
            {
              shipping_option_id: seeder.shippingOption.id, // shipping option with the "regular" shipping profile
              location_id: stockChannelOverride.id,
              items: [{ id: orderItemId, quantity: 1 }],
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(res.response.status).toBe(400)
        expect(res.response.data.message).toBe(
          `Shipping profile ${seeder.shippingProfile.id} does not match the shipping profile of the order item ${orderItemId}`
        )
      })

      it("should only create fulfillments grouped by shipping requirement", async () => {
        const i1 = order.items.find((i) => i.variant_sku === `w-inv-override-1`)
        const i2 = order.items.find((i) => i.variant_sku === `w-inv-override-2`)

        const {
          response: { data },
        } = await api
          .post(
            `/admin/orders/${order.id}/fulfillments`,
            {
              shipping_option_id: seeder.shippingOption.id,
              location_id: seeder.stockLocation.id,
              items: [
                {
                  id: i1.id,
                  quantity: 1,
                },
                {
                  id: i2.id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(data).toEqual({
          type: "invalid_data",
          message: `Fulfillment can only be created entirely with items with shipping or items without shipping. Split this request into 2 fulfillments.`,
        })

        const {
          data: { order: fulfillableOrder },
        } = await api.post(
          `/admin/orders/${order.id}/fulfillments?fields=+fulfillments.id,fulfillments.requires_shipping`,
          {
            shipping_option_id: seeder.shippingOption.id,
            location_id: seeder.stockLocation.id,
            items: [{ id: i1.id, quantity: 1 }],
          },
          adminHeaders
        )

        expect(fulfillableOrder.fulfillments).toHaveLength(1)

        const {
          data: { order: fulfillableOrder2 },
        } = await api.post(
          `/admin/orders/${order.id}/fulfillments?fields=+fulfillments.id,fulfillments.requires_shipping`,
          {
            shipping_option_id: seeder.shippingOption.id,
            location_id: seeder.stockLocation.id,
            items: [{ id: i2.id, quantity: 1 }],
          },
          adminHeaders
        )

        expect(fulfillableOrder2.fulfillments).toHaveLength(2)
      })
    })

    describe("POST /orders/:id/fulfillments/:id/cancel", () => {
      let inventoryItemDesk
      let inventoryItemLeg

      let region
      let salesChannel
      let stockLocation
      let shippingOption
      let storeHeaders

      beforeEach(async () => {
        const container = getContainer()

        const publishableKey = await generatePublishableKey(container)

        storeHeaders = generateStoreHeaders({
          publishableKey,
        })

        region = (
          await api.post(
            "/admin/regions",
            { name: "Test region", currency_code: "usd" },
            adminHeaders
          )
        ).data.region

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "first channel", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel

        stockLocation = (
          await api.post(
            `/admin/stock-locations`,
            { name: "test location" },
            adminHeaders
          )
        ).data.stock_location

        inventoryItemDesk = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "table-desk" },
            adminHeaders
          )
        ).data.inventory_item

        inventoryItemLeg = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "table-leg" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItemDesk.id}/location-levels`,
          {
            location_id: stockLocation.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItemLeg.id}/location-levels`,
          {
            location_id: stockLocation.id,
            stocked_quantity: 40,
          },
          adminHeaders
        )

        await api.post(
          `/admin/stock-locations/${stockLocation.id}/sales-channels`,
          { add: [salesChannel.id] },
          adminHeaders
        )

        shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: `test-${stockLocation.id}`, type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        const product = (
          await api.post(
            "/admin/products",
            {
              title: `Wooden table`,
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "color", values: ["green"] }],
              variants: [
                {
                  title: "Green table",
                  sku: "green-table",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemDesk.id,
                      required_quantity: 1,
                    },
                    {
                      inventory_item_id: inventoryItemLeg.id,
                      required_quantity: 4,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                  ],
                  options: {
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        const fulfillmentSets = (
          await api.post(
            `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
            {
              name: `Test-${shippingProfile.id}`,
              type: "test-type",
            },
            adminHeaders
          )
        ).data.stock_location.fulfillment_sets

        const fulfillmentSet = (
          await api.post(
            `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
            {
              name: `Test-${shippingProfile.id}`,
              geo_zones: [{ type: "country", country_code: "us" }],
            },
            adminHeaders
          )
        ).data.fulfillment_set

        await api.post(
          `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
          { add: ["manual_test-provider"] },
          adminHeaders
        )

        shippingOption = (
          await api.post(
            `/admin/shipping-options`,
            {
              name: `Test shipping option ${fulfillmentSet.id}`,
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: "manual_test-provider",
              price_type: "flat",
              type: {
                label: "Test type",
                description: "Test description",
                code: "test-code",
              },
              prices: [
                { currency_code: "usd", amount: 1000 },
                { region_id: region.id, amount: 1100 },
              ],
              rules: [],
            },
            adminHeaders
          )
        ).data.shipping_option

        const cart = (
          await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              email: "tony@stark-industries.com",
              region_id: region.id,
              shipping_address: {
                address_1: "test address 1",
                address_2: "test address 2",
                city: "ny",
                country_code: "us",
                province: "ny",
                postal_code: "94016",
              },
              billing_address: {
                address_1: "test billing address 1",
                address_2: "test billing address 2",
                city: "ny",
                country_code: "us",
                province: "ny",
                postal_code: "94016",
              },
              sales_channel_id: salesChannel.id,
              items: [{ quantity: 2, variant_id: product.variants[0].id }],
            },
            storeHeaders
          )
        ).data.cart

        await api.post(
          `/store/carts/${cart.id}/shipping-methods`,
          { option_id: shippingOption.id },
          storeHeaders
        )

        const paymentCollection = (
          await api.post(
            `/store/payment-collections`,
            {
              cart_id: cart.id,
            },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        order = (
          await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
        ).data.order
      })

      it("should create and cancel a fulfillment with reservations recreation multiple times", async () => {
        const inventoryItemTablet = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "tablet" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItemTablet.id}/location-levels`,
          {
            location_id: stockLocation.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        const productTablet = (
          await api.post(
            "/admin/products",
            {
              title: `Tablet`,
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "color", values: ["green"] }],
              variants: [
                {
                  title: "Green tablet",
                  sku: "green-tablet",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemTablet.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 1000,
                    },
                  ],
                  options: {
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        const cartTablet = (
          await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              email: "tony@stark-industries.com",
              region_id: region.id,
              shipping_address: {
                address_1: "test address 1",
                address_2: "test address 2",
                city: "ny",
                country_code: "us",
                province: "ny",
                postal_code: "94016",
              },
              billing_address: {
                address_1: "test billing address 1",
                address_2: "test billing address 2",
                city: "ny",
                country_code: "us",
                province: "ny",
                postal_code: "94016",
              },
              sales_channel_id: salesChannel.id,
              items: [
                { quantity: 1, variant_id: productTablet.variants[0].id },
              ],
            },
            storeHeaders
          )
        ).data.cart

        await api.post(
          `/store/carts/${cartTablet.id}/shipping-methods`,
          { option_id: shippingOption.id },
          storeHeaders
        )

        const paymentCollectionTablet = (
          await api.post(
            `/store/payment-collections`,
            {
              cart_id: cartTablet.id,
            },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollectionTablet.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        const tabletOrder = (
          await api.post(
            `/store/carts/${cartTablet.id}/complete`,
            {},
            storeHeaders
          )
        ).data.order

        const lineItemId = tabletOrder.items[0].id

        let reservations = (await api.get(`/admin/reservations`, adminHeaders))
          .data.reservations

        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              line_item_id: lineItemId,
              inventory_item_id: inventoryItemTablet.id,
              quantity: 1,
            }),
          ])
        )

        // create a fulfillment for the entire tablet order
        const fulOrder = (
          await api.post(
            `/admin/orders/${tabletOrder.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
            {
              items: [{ id: tabletOrder.items[0].id, quantity: 1 }],
            },
            adminHeaders
          )
        ).data.order

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemId}`,
            adminHeaders
          )
        ).data.reservations

        // no more reservations since everything is fuliflled
        expect(reservations.length).toEqual(0)

        // cancel the fulfillment
        await api.post(
          `/admin/orders/${tabletOrder.id}/fulfillments/${fulOrder.fulfillments[0].id}/cancel`,
          {},
          adminHeaders
        )

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id=${lineItemId}`,
            adminHeaders
          )
        ).data.reservations

        // reservations are recreated after the fulfillment is canceled
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              line_item_id: lineItemId,
              inventory_item_id: inventoryItemTablet.id,
              quantity: 1,
            }),
          ])
        )

        // create a fulfillment for the entire tablet order again
        const fulOrder2 = (
          await api.post(
            `/admin/orders/${tabletOrder.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
            {
              items: [{ id: tabletOrder.items[0].id, quantity: 1 }],
            },
            adminHeaders
          )
        ).data.order

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemId}`,
            adminHeaders
          )
        ).data.reservations

        // no more reservations since everything is fuliflled again
        expect(reservations.length).toEqual(0)

        // cancel the fulfillment
        await api.post(
          `/admin/orders/${tabletOrder.id}/fulfillments/${
            fulOrder2.fulfillments.find((f) => !f.canceled_at).id
          }/cancel`,
          {},
          adminHeaders
        )

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id=${lineItemId}`,
            adminHeaders
          )
        ).data.reservations

        // reservations are recreated again
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              line_item_id: lineItemId,
              inventory_item_id: inventoryItemTablet.id,
              quantity: 1,
            }),
          ])
        )
      })

      it("should manage reservations when canceling a fulfillment (with allow_backorder item)", async () => {
        const inventoryItemTablet = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "tablet" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItemTablet.id}/location-levels`,
          {
            location_id: stockLocation.id,
            stocked_quantity: 1,
          },
          adminHeaders
        )

        const productTablet = (
          await api.post(
            "/admin/products",
            {
              title: `Tablet`,
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "color", values: ["green"] }],
              variants: [
                {
                  title: "Green tablet",
                  sku: "green-tablet",
                  allow_backorder: true,
                  manage_inventory: true,
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemTablet.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 1000,
                    },
                  ],
                  options: {
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        const cartTablet = (
          await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              email: "tony@stark-industries.com",
              region_id: region.id,
              shipping_address: {
                address_1: "test address 1",
                address_2: "test address 2",
                city: "ny",
                country_code: "us",
                province: "ny",
                postal_code: "94016",
              },
              billing_address: {
                address_1: "test billing address 1",
                address_2: "test billing address 2",
                city: "ny",
                country_code: "us",
                province: "ny",
                postal_code: "94016",
              },
              sales_channel_id: salesChannel.id,
              items: [
                { quantity: 2, variant_id: productTablet.variants[0].id },
              ],
            },
            storeHeaders
          )
        ).data.cart

        await api.post(
          `/store/carts/${cartTablet.id}/shipping-methods`,
          { option_id: shippingOption.id },
          storeHeaders
        )

        const paymentCollectionTablet = (
          await api.post(
            `/store/payment-collections`,
            {
              cart_id: cartTablet.id,
            },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollectionTablet.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        const tabletOrder = (
          await api.post(
            `/store/carts/${cartTablet.id}/complete`,
            {},
            storeHeaders
          )
        ).data.order

        const lineItemId = tabletOrder.items[0].id

        let reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemId}`,
            adminHeaders
          )
        ).data.reservations

        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              line_item_id: lineItemId,
              inventory_item_id: inventoryItemTablet.id,
              quantity: 2,
              inventory_item: expect.objectContaining({
                reserved_quantity: 2,
                stocked_quantity: 1,
              }),
            }),
          ])
        )

        const fulOrder = (
          await api.post(
            `/admin/orders/${tabletOrder.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
            {
              items: [{ id: tabletOrder.items[0].id, quantity: 2 }],
            },
            adminHeaders
          )
        ).data.order

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemId}`,
            adminHeaders
          )
        ).data.reservations

        expect(reservations.length).toEqual(0)

        const inventoryItem = (
          await api.get(
            `/admin/inventory-items/${inventoryItemTablet.id}`,
            adminHeaders
          )
        ).data.inventory_item

        expect(inventoryItem).toEqual(
          expect.objectContaining({
            reserved_quantity: 0,
            stocked_quantity: -1,
            location_levels: [
              expect.objectContaining({
                available_quantity: -1,
                reserved_quantity: 0,
                stocked_quantity: -1,
              }),
            ],
          })
        )

        await api.post(
          `/admin/orders/${tabletOrder.id}/fulfillments/${fulOrder.fulfillments[0].id}/cancel`,
          {},
          adminHeaders
        )

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemId}`,
            adminHeaders
          )
        ).data.reservations

        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              line_item_id: lineItemId,
              inventory_item_id: inventoryItemTablet.id,
              quantity: 2,
              inventory_item: expect.objectContaining({
                reserved_quantity: 2,
                stocked_quantity: 1,
              }),
            }),
          ])
        )
      })

      it("should correctly manage reservations when canceling a fulfillment (with inventory kit)", async () => {
        let reservations = (await api.get(`/admin/reservations`, adminHeaders))
          .data.reservations

        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 2,
              inventory_item: expect.objectContaining({
                reserved_quantity: 2,
                stocked_quantity: 10,
              }),
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 8,
              inventory_item: expect.objectContaining({
                reserved_quantity: 8,
                stocked_quantity: 40,
              }),
            }),
          ])
        )

        const lineItemId = order.items[0].id

        // 1. create a partial fulfillment
        const fulOrder = (
          await api.post(
            `/admin/orders/${order.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
            {
              items: [{ id: order.items[0].id, quantity: 1 }],
            },
            adminHeaders
          )
        ).data.order

        // 2. two fulfillment items are created for a single (inventory kit) line item
        expect(fulOrder.fulfillments[0].items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 1,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 4,
            }),
          ])
        )

        expect(fulOrder.items[0].detail.fulfilled_quantity).toEqual(1)

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemId}`,
            adminHeaders
          )
        ).data.reservations

        // 3. reservations need to be reduced by half since we fulfilled 1 item out of 2 in the order
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 1,
              inventory_item: expect.objectContaining({
                reserved_quantity: 1,
                stocked_quantity: 9,
              }),
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 4,
              inventory_item: expect.objectContaining({
                reserved_quantity: 4,
                stocked_quantity: 36,
              }),
            }),
          ])
        )

        const { data } = await api.post(
          `/admin/orders/${fulOrder.id}/fulfillments/${fulOrder.fulfillments[0].id}/cancel?fields=*fulfillments,*fulfillments.items`,
          {},
          adminHeaders
        )

        expect(data.order.fulfillments[0].canceled_at).toBeDefined()
        expect(data.order.items[0].detail.fulfilled_quantity).toEqual(0)

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemId}`,
            adminHeaders
          )
        ).data.reservations

        // 4. reservation qunatities are restored after partial fulfillment is canceled
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 2,
              inventory_item: expect.objectContaining({
                reserved_quantity: 2,
                stocked_quantity: 10,
              }),
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 8,
              inventory_item: expect.objectContaining({
                reserved_quantity: 8,
                stocked_quantity: 40,
              }),
            }),
          ])
        )

        // 5. create a fullfillment for the entier quantity
        const fulOrderFull = (
          await api.post(
            `/admin/orders/${order.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
            {
              items: [{ id: order.items[0].id, quantity: 2 }],
            },
            adminHeaders
          )
        ).data.order

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemId}`,
            adminHeaders
          )
        ).data.reservations

        // 6. no more reservations since the entier quantity is fulfilled
        expect(reservations).toEqual([])

        expect(
          fulOrderFull.fulfillments.find((f) => !f.canceled_at)!.items
        ).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 2,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 8,
            }),
          ])
        )

        expect(fulOrderFull.items[0].detail.fulfilled_quantity).toEqual(2)

        // 7. cancel the entire fulfillment once again
        await api.post(
          `/admin/orders/${fulOrderFull.id}/fulfillments/${
            fulOrderFull.fulfillments.find((f) => !f.canceled_at)!.id
          }/cancel?fields=*fulfillments,*fulfillments.items`,
          {},
          adminHeaders
        )

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemId}`,
            adminHeaders
          )
        ).data.reservations

        // 8. reservation need to be restored to the initiall quantities
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 2,
              inventory_item: expect.objectContaining({
                reserved_quantity: 2,
                stocked_quantity: 10,
              }),
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 8,
              inventory_item: expect.objectContaining({
                reserved_quantity: 8,
                stocked_quantity: 40,
              }),
            }),
          ])
        )
      })

      it("should correctly manage reservations (with shared inventory item case)", async () => {
        const inventoryItemBottle = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "bottle" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItemBottle.id}/location-levels`,
          {
            location_id: stockLocation.id,
            stocked_quantity: 100,
          },
          adminHeaders
        )

        const productBottle = (
          await api.post(
            "/admin/products",
            {
              title: `Bottle Packs`,
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "packs", values: ["one", "two", "three"] }],
              variants: [
                {
                  title: "One Pack",
                  sku: "one-pack",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemBottle.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 10,
                    },
                  ],
                  options: {
                    packs: "one",
                  },
                },
                {
                  title: "Two Pack",
                  sku: "two-pack",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemBottle.id,
                      required_quantity: 2,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 20,
                    },
                  ],
                  options: {
                    packs: "two",
                  },
                },
                {
                  title: "Three Pack",
                  sku: "three-pack",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemBottle.id,
                      required_quantity: 3,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 30,
                    },
                  ],
                  options: {
                    packs: "three",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        const cartBottle = (
          await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              email: "tony@stark-industries.com",
              region_id: region.id,
              shipping_address: {
                address_1: "test address 1",
                address_2: "test address 2",
                city: "ny",
                country_code: "us",
                province: "ny",
                postal_code: "94016",
              },
              billing_address: {
                address_1: "test billing address 1",
                address_2: "test billing address 2",
                city: "ny",
                country_code: "us",
                province: "ny",
                postal_code: "94016",
              },
              sales_channel_id: salesChannel.id,
              items: [
                { quantity: 2, variant_id: productBottle.variants[0].id },
                { quantity: 2, variant_id: productBottle.variants[1].id },
                { quantity: 2, variant_id: productBottle.variants[2].id },
              ],
            },
            storeHeaders
          )
        ).data.cart

        await api.post(
          `/store/carts/${cartBottle.id}/shipping-methods`,
          { option_id: shippingOption.id },
          storeHeaders
        )

        const paymentCollectionBottle = (
          await api.post(
            `/store/payment-collections`,
            {
              cart_id: cartBottle.id,
            },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollectionBottle.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        const bottleOrder = (
          await api.post(
            `/store/carts/${cartBottle.id}/complete`,
            {},
            storeHeaders
          )
        ).data.order

        const lineItemIds = bottleOrder.items.map((i) => i.id).join(",")

        const onePackItemId = bottleOrder.items.find(
          (i) => i.subtitle === "One Pack"
        )!.id

        const twoPackItemId = bottleOrder.items.find(
          (i) => i.subtitle === "Two Pack"
        )!.id

        const threePackItemId = bottleOrder.items.find(
          (i) => i.subtitle === "Three Pack"
        )!.id

        let reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemIds}`,
            adminHeaders
          )
        ).data.reservations

        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              line_item_id: onePackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 2,
            }),
            expect.objectContaining({
              line_item_id: twoPackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 4,
            }),
            expect.objectContaining({
              line_item_id: threePackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 6,
            }),
          ])
        )

        expect(reservations[0].inventory_item).toEqual(
          expect.objectContaining({
            id: inventoryItemBottle.id,
            reserved_quantity: 12, // 2 * (onepack + twopack + threepack)
            stocked_quantity: 100,
          })
        )

        // create a partial fulfillment only for one "Three Pack"
        const fulOrder = (
          await api.post(
            `/admin/orders/${bottleOrder.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
            {
              items: [
                {
                  id: threePackItemId,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )
        ).data.order

        expect(
          fulOrder.items.find((i) => i.id === threePackItemId)!.detail
            .fulfilled_quantity
        ).toEqual(1)

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemIds}`,
            adminHeaders
          )
        ).data.reservations

        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              line_item_id: onePackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 2,
            }),
            expect.objectContaining({
              line_item_id: twoPackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 4,
            }),
            expect.objectContaining({
              line_item_id: threePackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 3, // This was partially fulfilled
            }),
          ])
        )

        expect(reservations[0].inventory_item).toEqual(
          expect.objectContaining({
            id: inventoryItemBottle.id,
            reserved_quantity: 9,
            stocked_quantity: 97,
          })
        )

        // cancel the first partial fulfillment
        await api.post(
          `/admin/orders/${bottleOrder.id}/fulfillments/${fulOrder.fulfillments[0].id}/cancel`,
          {},
          adminHeaders
        )

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemIds}`,
            adminHeaders
          )
        ).data.reservations

        // reservations are restored to the initial quantities
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              line_item_id: onePackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 2,
            }),
            expect.objectContaining({
              line_item_id: twoPackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 4,
            }),
            expect.objectContaining({
              line_item_id: threePackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 6,
            }),
          ])
        )

        expect(reservations[0].inventory_item).toEqual(
          expect.objectContaining({
            id: inventoryItemBottle.id,
            reserved_quantity: 12, // 2 * (onepack + twopack + threepack)
            stocked_quantity: 100,
          })
        )

        // create a partial fulfillment only for the entier "Two Pack" item
        const fulOrder2 = (
          await api.post(
            `/admin/orders/${bottleOrder.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
            {
              items: [
                {
                  id: bottleOrder.items.find((i) => i.subtitle === "Two Pack")!
                    .id,
                  quantity: 2,
                },
              ],
            },
            adminHeaders
          )
        ).data.order

        expect(
          fulOrder2.items.find((i) => i.id === twoPackItemId)!.detail
            .fulfilled_quantity
        ).toEqual(2)

        expect(
          fulOrder2.items.find((i) => i.id === threePackItemId)!.detail
            .fulfilled_quantity
        ).toEqual(0)

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemIds}`,
            adminHeaders
          )
        ).data.reservations

        expect(reservations.length).toEqual(2)
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              line_item_id: onePackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 2,
            }),

            // Two pack was fully fulfilled

            expect.objectContaining({
              line_item_id: threePackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 6,
            }),
          ])
        )

        expect(reservations[0].inventory_item).toEqual(
          expect.objectContaining({
            id: inventoryItemBottle.id,
            reserved_quantity: 8,
            stocked_quantity: 96,
          })
        )

        const latestFulfillment = fulOrder2.fulfillments.find(
          (f) => !f.canceled_at
        )!

        // cancel the second partial fulfillment of the "Two Pack" item
        await api.post(
          `/admin/orders/${bottleOrder.id}/fulfillments/${latestFulfillment.id}/cancel`,
          {},
          adminHeaders
        )

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemIds}`,
            adminHeaders
          )
        ).data.reservations

        // reservations are restored to the initial quantities
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              line_item_id: onePackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 2,
            }),
            expect.objectContaining({
              line_item_id: twoPackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 4,
            }),
            expect.objectContaining({
              line_item_id: threePackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 6,
            }),
          ])
        )

        expect(reservations[0].inventory_item).toEqual(
          expect.objectContaining({
            id: inventoryItemBottle.id,
            reserved_quantity: 12, // 2 * (onepack + twopack + threepack)
            stocked_quantity: 100,
          })
        )

        // finally create a full fulfillment for the entire order
        const fulOrder3 = (
          await api.post(
            `/admin/orders/${bottleOrder.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
            {
              items: [
                {
                  id: onePackItemId,
                  quantity: 2,
                },
                {
                  id: twoPackItemId,
                  quantity: 2,
                },
                {
                  id: threePackItemId,
                  quantity: 2,
                },
              ],
            },
            adminHeaders
          )
        ).data.order

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemIds}`,
            adminHeaders
          )
        ).data.reservations

        expect(reservations.length).toEqual(0)

        expect(fulOrder3.items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: onePackItemId,
              detail: expect.objectContaining({
                fulfilled_quantity: 2,
              }),
            }),
            expect.objectContaining({
              id: twoPackItemId,
              detail: expect.objectContaining({
                fulfilled_quantity: 2,
              }),
            }),
            expect.objectContaining({
              id: threePackItemId,
              detail: expect.objectContaining({
                fulfilled_quantity: 2,
              }),
            }),
          ])
        )

        // cancel the fulfillment for the entire order
        await api.post(
          `/admin/orders/${bottleOrder.id}/fulfillments/${
            fulOrder3.fulfillments.find((f) => !f.canceled_at)!.id
          }/cancel`,
          {},
          adminHeaders
        )

        reservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${lineItemIds}`,
            adminHeaders
          )
        ).data.reservations

        // reservations are restored to the initial quantities
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              line_item_id: onePackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 2,
            }),
            expect.objectContaining({
              line_item_id: twoPackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 4,
            }),
            expect.objectContaining({
              line_item_id: threePackItemId,
              inventory_item_id: inventoryItemBottle.id,
              quantity: 6,
            }),
          ])
        )

        // inventory is back to the initial quantities
        expect(reservations[0].inventory_item).toEqual(
          expect.objectContaining({
            id: inventoryItemBottle.id,
            reserved_quantity: 12,
            stocked_quantity: 100,
          })
        )

        const finalOrder = (
          await api.get(`/admin/orders/${bottleOrder.id}`, adminHeaders)
        ).data.order

        expect(finalOrder.fulfillments.every((f) => f.canceled_at)).toEqual(
          true
        )
        expect(
          finalOrder.items.every((i) => i.detail.fulfilled_quantity === 0)
        ).toEqual(true)
      })

      it("should throw an error if the quantity to fulfill exceeds the reserved quantity (inventory kit case)", async () => {
        let reservations = (await api.get(`/admin/reservations`, adminHeaders))
          .data.reservations

        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 2,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 8,
            }),
          ])
        )

        // 1. create a partial fulfillment
        const fulOrder = (
          await api.post(
            `/admin/orders/${order.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
            {
              items: [{ id: order.items[0].id, quantity: 1 }],
            },
            adminHeaders
          )
        ).data.order

        // 2. two fulfillment items are created for a single (inventory kit) line item
        expect(fulOrder.fulfillments[0].items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 1,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 4,
            }),
          ])
        )

        expect(fulOrder.items[0].detail.fulfilled_quantity).toEqual(1)

        reservations = (await api.get(`/admin/reservations`, adminHeaders)).data
          .reservations

        // 3. reservations need to be reduced by half since we fulfilled 1 item out of 2 in the order
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemDesk.id,
              quantity: 1,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemLeg.id,
              quantity: 4,
            }),
          ])
        )

        const res = await api
          .post(
            `/admin/orders/${order.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
            {
              items: [{ id: order.items[0].id, quantity: 2 }],
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(res.response.status).toBe(400)
        expect(res.response.data).toEqual({
          type: "invalid_data",
          message: `Quantity to fulfill exceeds the reserved quantity for the item: ${order.items[0].id}`,
        })
      })
    })

    describe("GET /orders/:id/shipping-options", () => {
      let so1: AdminShippingOption
      let so2: AdminShippingOption
      let so3: AdminShippingOption

      beforeEach(async () => {
        seeder = await createOrderSeeder({ api, container: getContainer() })
        order = seeder.order
        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order

        so1 = (
          await createShippingOptionSeeder({
            api,
            container: getContainer(),
            salesChannelOverride: seeder.salesChannel,
            countries: ["us"],
          })
        ).shippingOption

        so2 = (
          await createShippingOptionSeeder({
            api,
            container: getContainer(),
            salesChannelOverride: seeder.salesChannel,
            countries: ["us", "ca"],
          })
        ).shippingOption

        so3 = (
          await createShippingOptionSeeder({
            api,
            container: getContainer(),
            salesChannelOverride: seeder.salesChannel,
            countries: ["de"],
          })
        ).shippingOption
      })

      it("should return the shipping options applicable for the order", async () => {
        const { data } = await api.get(
          `/admin/orders/${order.id}/shipping-options`,
          adminHeaders
        )

        const originalShippingOptionId =
          order.shipping_methods[0].shipping_option_id

        expect(order.shipping_address.country_code).toEqual("us")

        expect(data.shipping_options.length).toEqual(3)
        expect(data.shipping_options).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: so1.id,
              insufficient_inventory: true,
            }),
            expect.objectContaining({
              id: so2.id,
              insufficient_inventory: true, // new SO without location levels for the order item, should have insufficient inventory
            }),
            expect.objectContaining({
              id: originalShippingOptionId,
              insufficient_inventory: false, // order is created with this SO, location has to have enough inventory
            }),
          ])
        )
      })
    })

    describe("POST /orders/:id/fulfillments/:id/mark-as-delivered", () => {
      beforeEach(async () => {
        seeder = await createOrderSeeder({ api, container: getContainer() })
        order = seeder.order
        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order
      })

      it("should mark fulfillable item as delivered", async () => {
        let fulfillableItem = order.items.find(
          (item) => item.detail.fulfilled_quantity < item.detail.quantity
        )

        await api.post(
          `/admin/orders/${order.id}/fulfillments`,
          {
            location_id: seeder.stockLocation.id,
            items: [
              {
                id: fulfillableItem.id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order

        expect(order.items[0].detail).toEqual(
          expect.objectContaining({
            fulfilled_quantity: 1,
            delivered_quantity: 0,
          })
        )

        await api.post(
          `/admin/orders/${order.id}/fulfillments/${order.fulfillments[0].id}/mark-as-delivered`,
          {},
          adminHeaders
        )

        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order

        expect(order.items[0].detail).toEqual(
          expect.objectContaining({
            fulfilled_quantity: 1,
            delivered_quantity: 1,
          })
        )

        const { response } = await api
          .post(
            `/admin/orders/${order.id}/fulfillments/${order.fulfillments[0].id}/mark-as-delivered`,
            {},
            adminHeaders
          )
          .catch((e) => e)

        expect(response.data).toEqual({
          type: "not_allowed",
          message: "Fulfillment has already been marked delivered",
        })
      })

      describe("with inventory kit items", () => {
        let inventoryItemDesk
        let inventoryItemLeg

        beforeEach(async () => {
          const container = getContainer()

          const publishableKey = await generatePublishableKey(container)

          const storeHeaders = generateStoreHeaders({
            publishableKey,
          })

          const region = (
            await api.post(
              "/admin/regions",
              { name: "Test region", currency_code: "usd" },
              adminHeaders
            )
          ).data.region

          const salesChannel = (
            await api.post(
              "/admin/sales-channels",
              { name: "first channel", description: "channel" },
              adminHeaders
            )
          ).data.sales_channel

          const stockLocation = (
            await api.post(
              `/admin/stock-locations`,
              { name: "test location" },
              adminHeaders
            )
          ).data.stock_location

          inventoryItemDesk = (
            await api.post(
              `/admin/inventory-items`,
              { sku: "table-desk" },
              adminHeaders
            )
          ).data.inventory_item

          inventoryItemLeg = (
            await api.post(
              `/admin/inventory-items`,
              { sku: "table-leg" },
              adminHeaders
            )
          ).data.inventory_item

          await api.post(
            `/admin/inventory-items/${inventoryItemDesk.id}/location-levels`,
            {
              location_id: stockLocation.id,
              stocked_quantity: 10,
            },
            adminHeaders
          )

          await api.post(
            `/admin/inventory-items/${inventoryItemLeg.id}/location-levels`,
            {
              location_id: stockLocation.id,
              stocked_quantity: 40,
            },
            adminHeaders
          )

          await api.post(
            `/admin/stock-locations/${stockLocation.id}/sales-channels`,
            { add: [salesChannel.id] },
            adminHeaders
          )

          const shippingProfile = (
            await api.post(
              `/admin/shipping-profiles`,
              { name: `test-${stockLocation.id}`, type: "default" },
              adminHeaders
            )
          ).data.shipping_profile

          const product = (
            await api.post(
              "/admin/products",
              {
                title: `Wooden table`,
                status: ProductStatus.PUBLISHED,
                shipping_profile_id: shippingProfile.id,
                options: [{ title: "color", values: ["green"] }],
                variants: [
                  {
                    title: "Green table",
                    sku: "green-table",
                    inventory_items: [
                      {
                        inventory_item_id: inventoryItemDesk.id,
                        required_quantity: 1,
                      },
                      {
                        inventory_item_id: inventoryItemLeg.id,
                        required_quantity: 4,
                      },
                    ],
                    prices: [
                      {
                        currency_code: "usd",
                        amount: 100,
                      },
                    ],
                    options: {
                      color: "green",
                    },
                  },
                ],
              },
              adminHeaders
            )
          ).data.product

          const fulfillmentSets = (
            await api.post(
              `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
              {
                name: `Test-${shippingProfile.id}`,
                type: "test-type",
              },
              adminHeaders
            )
          ).data.stock_location.fulfillment_sets

          const fulfillmentSet = (
            await api.post(
              `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
              {
                name: `Test-${shippingProfile.id}`,
                geo_zones: [{ type: "country", country_code: "us" }],
              },
              adminHeaders
            )
          ).data.fulfillment_set

          await api.post(
            `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
            { add: ["manual_test-provider"] },
            adminHeaders
          )

          const shippingOption = (
            await api.post(
              `/admin/shipping-options`,
              {
                name: `Test shipping option ${fulfillmentSet.id}`,
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                provider_id: "manual_test-provider",
                price_type: "flat",
                type: {
                  label: "Test type",
                  description: "Test description",
                  code: "test-code",
                },
                prices: [{ currency_code: "usd", amount: 1000 }],
                rules: [],
              },
              adminHeaders
            )
          ).data.shipping_option

          const cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                email: "tony@stark-industries.com",
                region_id: region.id,
                shipping_address: {
                  address_1: "test address 1",
                  address_2: "test address 2",
                  city: "ny",
                  country_code: "us",
                  province: "ny",
                  postal_code: "94016",
                },
                billing_address: {
                  address_1: "test billing address 1",
                  address_2: "test billing address 2",
                  city: "ny",
                  country_code: "us",
                  province: "ny",
                  postal_code: "94016",
                },
                sales_channel_id: salesChannel.id,
                items: [{ quantity: 2, variant_id: product.variants[0].id }],
              },
              storeHeaders
            )
          ).data.cart

          await api.post(
            `/store/carts/${cart.id}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )

          const paymentCollection = (
            await api.post(
              `/store/payment-collections`,
              {
                cart_id: cart.id,
              },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          order = (
            await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
          ).data.order
        })

        it("set correct quantity as delivered on the line item when marking fulfillment as delivered", async () => {
          let reservations = (
            await api.get(`/admin/reservations`, adminHeaders)
          ).data.reservations

          expect(reservations).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                inventory_item_id: inventoryItemDesk.id,
                quantity: 2,
              }),
              expect.objectContaining({
                inventory_item_id: inventoryItemLeg.id,
                quantity: 8,
              }),
            ])
          )

          // 1. create a partial fulfillment
          const fulOrder = (
            await api.post(
              `/admin/orders/${order.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
              {
                items: [{ id: order.items[0].id, quantity: 1 }],
              },
              adminHeaders
            )
          ).data.order

          // 2. two fulfillment items are created for a single (inventory kit) line item
          expect(fulOrder.fulfillments[0].items).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                inventory_item_id: inventoryItemDesk.id,
                quantity: 1,
              }),
              expect.objectContaining({
                inventory_item_id: inventoryItemLeg.id,
                quantity: 4,
              }),
            ])
          )

          expect(fulOrder.items[0].detail.fulfilled_quantity).toEqual(1)

          // 3. mark the fulfillment as shipped
          const shippedOrder = (
            await api.post(
              `/admin/orders/${fulOrder.id}/fulfillments/${fulOrder.fulfillments[0].id}/shipments`,
              {
                items: [
                  {
                    id: fulOrder.items[0].id,
                    quantity: 1,
                  },
                ],
              },
              adminHeaders
            )
          ).data.order

          expect(shippedOrder.items[0].detail.fulfilled_quantity).toEqual(1)
          expect(shippedOrder.items[0].detail.shipped_quantity).toEqual(1)

          // 4. mark the fulfillment as delivered
          const deliveredOrder = (
            await api.post(
              `/admin/orders/${fulOrder.id}/fulfillments/${fulOrder.fulfillments[0].id}/mark-as-delivered`,
              {},
              adminHeaders
            )
          ).data.order

          // 5. 1 line item was fulfilled so 1 line item is delivered
          expect(deliveredOrder.items[0].detail.fulfilled_quantity).toEqual(1)
          expect(deliveredOrder.items[0].detail.shipped_quantity).toEqual(1)
          expect(deliveredOrder.items[0].detail.delivered_quantity).toEqual(1)

          // 6. repeat the same steps for the rest of the line items

          // 7. create a partial fulfillment
          const fulOrder2 = (
            await api.post(
              `/admin/orders/${order.id}/fulfillments?fields=*fulfillments,*fulfillments.items`,
              {
                items: [{ id: order.items[0].id, quantity: 1 }],
              },
              adminHeaders
            )
          ).data.order

          expect(fulOrder2.items[0].detail.fulfilled_quantity).toEqual(2)

          const secondFulfillment = fulOrder2.fulfillments.find(
            (f) => !f.shipped_at
          )!

          // 8. mark the fulfillment as shipped
          const shippedOrder2 = (
            await api.post(
              `/admin/orders/${fulOrder2.id}/fulfillments/${secondFulfillment.id}/shipments`,
              {
                items: [
                  {
                    id: fulOrder2.items[0].id,
                    quantity: 1,
                  },
                ],
              },
              adminHeaders
            )
          ).data.order

          expect(shippedOrder2.items[0].detail.fulfilled_quantity).toEqual(2)
          expect(shippedOrder2.items[0].detail.shipped_quantity).toEqual(2)
          expect(shippedOrder2.items[0].detail.delivered_quantity).toEqual(1)

          // 9. mark the fulfillment as delivered
          const deliveredOrder2 = (
            await api.post(
              `/admin/orders/${fulOrder2.id}/fulfillments/${secondFulfillment.id}/mark-as-delivered`,
              {},
              adminHeaders
            )
          ).data.order

          // 10. both items are fulfilled, shipped and delivered
          expect(deliveredOrder2.items[0].detail.fulfilled_quantity).toEqual(2)
          expect(deliveredOrder2.items[0].detail.shipped_quantity).toEqual(2)
          expect(deliveredOrder2.items[0].detail.delivered_quantity).toEqual(2)
        })
      })
    })

    describe("POST /orders/:id/credit-lines", () => {
      let storeHeaders

      beforeEach(async () => {
        const publishableKey = await generatePublishableKey(container)

        storeHeaders = generateStoreHeaders({
          publishableKey,
        })

        const inventoryItemOverride = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant", requires_shipping: false },
            adminHeaders
          )
        ).data.inventory_item

        seeder = await createOrderSeeder({
          api,
          container: getContainer(),
          inventoryItemOverride,
          withoutShipping: true,
        })
        order = seeder.order

        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order
      })

      it("should successfully create credit lines", async () => {
        const error = await api
          .post(
            `/admin/orders/${order.id}/credit-lines`,
            {
              amount: -106,
              reference: "order",
              reference_id: order.id,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toBe(400)
        expect(error.response.data.message).toBe(
          "Can only create positive credit lines if the order has a positive pending difference"
        )

        const error2 = await api
          .post(
            `/admin/orders/${order.id}/credit-lines`,
            {
              amount: 10000,
              reference: "order",
              reference_id: order.id,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error2.response.status).toBe(400)
        expect(error2.response.data.message).toBe(
          "Cannot create more positive credit lines with amount more than the pending difference"
        )

        const response = await api.post(
          `/admin/orders/${order.id}/credit-lines`,
          {
            amount: 106,
            reference: "order",
            reference_id: order.id,
          },
          adminHeaders
        )

        expect(response.status).toBe(200)
        expect(response.data.order).toEqual(
          expect.objectContaining({
            id: order.id,
            total: 0,
            subtotal: 100,
            summary: expect.objectContaining({
              current_order_total: 0,
              accounting_total: 0,
              pending_difference: 0,
            }),
          })
        )

        await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        const item = order.items[0]

        let result = (
          await api.post(
            `/admin/order-edits/${order.id}/items/item/${item.id}`,
            { quantity: 0 },
            adminHeaders
          )
        ).data.order_preview

        result = (
          await api.post(
            `/admin/order-edits/${order.id}/request`,
            {},
            adminHeaders
          )
        ).data.order_preview

        result = (
          await api.post(
            `/admin/order-edits/${order.id}/confirm`,
            {},
            adminHeaders
          )
        ).data.order_preview

        result = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order

        const errorResponse = await api
          .post(
            `/admin/orders/${order.id}/credit-lines`,
            {
              amount: 106,
              reference: "order",
              reference_id: order.id,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(errorResponse.response.status).toBe(400)
        expect(errorResponse.response.data.message).toBe(
          "Can only create negative credit lines if the order has a negative pending difference"
        )

        const error3 = await api
          .post(
            `/admin/orders/${order.id}/credit-lines`,
            {
              amount: -10000,
              reference: "order",
              reference_id: order.id,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error3.response.status).toBe(400)
        expect(error3.response.data.message).toBe(
          "Cannot create more negative credit lines with amount more than the pending difference"
        )

        const error4 = await api
          .post(
            `/admin/orders/${order.id}/credit-lines`,
            {
              amount: -106,
              reference: "order",
              reference_id: order.id,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error4.response.status).toBe(400)
        expect(error4.response.data.message).toBe(
          "Store credit refunds can only be issued to registered customers"
        )

        const registeredCustomerToken = (
          await api.post("/auth/customer/emailpass/register", {
            email: "registered@medusajs.com",
            password: "password",
          })
        ).data.token

        const customer = (
          await api.post(
            "/store/customers",
            { email: "registered@medusajs.com" },
            {
              headers: {
                ...storeHeaders.headers,
                Authorization: `Bearer ${registeredCustomerToken}`,
              },
            }
          )
        ).data.customer

        await api.post(
          `/admin/orders/${order.id}/transfer`,
          { customer_id: customer.id },
          adminHeaders
        )

        const orderChanges = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        await api.post(
          `/store/orders/${order.id}/transfer/accept`,
          {
            token:
              orderChanges[orderChanges.length - 1].actions[0].details.token,
          },
          storeHeaders
        )

        const response2 = await api.post(
          `/admin/orders/${order.id}/credit-lines`,
          {
            amount: -106,
            reference: "order",
            reference_id: order.id,
          },
          adminHeaders
        )

        expect(response2.data.order.summary.pending_difference).toEqual(0)

        const response3 = await api
          .post(
            `/admin/orders/${order.id}/credit-lines`,
            {
              amount: -106,
              reference: "order",
              reference_id: order.id,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(response3.response.status).toBe(400)
        expect(response3.response.data.message).toBe(
          "Can only create credit lines if the order has a positive or negative pending difference"
        )
      })
    })

    describe("workflows", () => {
      it("updateOrderChangeActionsWorkflow - should not call listOrderChangeActions when orderChangeActions is empty", async () => {
        const orderService = container.resolve(Modules.ORDER)
        const listOrderChangeActionsSpy = jest.spyOn(
          orderService,
          "listOrderChangeActions"
        )

        const { result } = await updateOrderChangeActionsWorkflow(
          container
        ).run({
          input: [],
        })

        expect(result).toEqual([])

        expect(listOrderChangeActionsSpy).not.toHaveBeenCalled()
        listOrderChangeActionsSpy.mockRestore()
      })

      it("updateOrderChangesWorkflow - should not call listOrderChanges when orderChanges is empty", async () => {
        const orderService = container.resolve(Modules.ORDER)
        const listOrderChangesSpy = jest.spyOn(orderService, "listOrderChanges")

        const { result } = await updateOrderChangesWorkflow(container).run({
          input: [],
        })

        expect(result).toEqual([])

        expect(listOrderChangesSpy).not.toHaveBeenCalled()
        listOrderChangesSpy.mockRestore()
      })

      it("updateOrderShippingMethodsStep - should not call listOrderShippingMethods when shipping methods is empty", async () => {
        const orderService = container.resolve(Modules.ORDER)
        const listOrderShippingMethodsSpy = jest.spyOn(
          orderService,
          "listOrderShippingMethods"
        )

        const workflow = createWorkflow("test-workflow", () => {
          return new WorkflowResponse(updateOrderShippingMethodsStep([]))
        })

        const { result } = await workflow(container).run()

        expect(result).toEqual([])

        expect(listOrderShippingMethodsSpy).not.toHaveBeenCalled()
        listOrderShippingMethodsSpy.mockRestore()
      })
    })
  },
})
