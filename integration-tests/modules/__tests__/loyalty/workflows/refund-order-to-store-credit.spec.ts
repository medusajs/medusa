import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { refundOrderToStoreCreditWorkflow } from "@medusajs/loyalty-plugin/workflows"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { createAuthenticatedCustomer } from "../../../helpers/create-authenticated-customer"

jest.setTimeout(60 * 1000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let customer
    let region
    let salesChannel
    let storeHeaders

    // Creates an order with a single 100-priced item and a single payment
    // transaction. `transactionAmount` controls the pending difference:
    // 100 -> balanced (0), 102 -> overpaid by 2.
    const createOrder = async ({
      customerId,
      email,
      transactionAmount,
    }: {
      customerId?: string
      email: string
      transactionAmount: number
    }) => {
      const orderModule = getContainer().resolve(Modules.ORDER)

      return await orderModule.createOrders({
        region_id: region.id,
        sales_channel_id: salesChannel.id,
        email,
        customer_id: customerId,
        currency_code: "usd",
        items: [
          {
            title: "Test item",
            quantity: 1,
            unit_price: 100,
          },
        ],
        transactions: [
          {
            amount: transactionAmount,
            currency_code: "usd",
          },
        ],
        shipping_address: {
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "us",
          postal_code: "12345",
        },
        billing_address: {
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "us",
          postal_code: "12345",
        },
      } as any)
    }

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
      const publishableKey = await generatePublishableKey(getContainer())
      storeHeaders = generateStoreHeaders({ publishableKey })

      const user = await createAuthenticatedCustomer(api, storeHeaders, {
        email: "initial@customer.com",
      })
      customer = user.customer

      const regionModule = getContainer().resolve(Modules.REGION)
      region = await regionModule.createRegions({
        name: "Test region",
        currency_code: "usd",
        countries: ["us"],
      })

      const salesChannelModule = getContainer().resolve(Modules.SALES_CHANNEL)
      salesChannel = await salesChannelModule.createSalesChannels({
        name: "Test sales channel",
      })
    })

    describe("refundOrderToStoreCreditWorkflow", () => {
      it("throws if the customer is not a registered account", async () => {
        const customerModule = getContainer().resolve(Modules.CUSTOMER)
        const guest = await customerModule.createCustomers({
          email: "guest@customer.com",
        })

        // Overpaid, but the guest guard must fire first.
        const order = await createOrder({
          customerId: guest.id,
          email: guest.email,
          transactionAmount: 102,
        })

        const { errors } = await refundOrderToStoreCreditWorkflow.run({
          input: { order_id: order.id, amount: 2 },
          container: getContainer(),
          throwOnError: false,
        })

        expect(errors).toEqual([
          expect.objectContaining({
            error: expect.objectContaining({
              message:
                "Store credit refunds can only be issued to registered customers",
              type: "invalid_data",
            }),
          }),
        ])
      })

      it("throws if the order has no outstanding overpayment", async () => {
        // Balanced order: pending_difference is 0, so there is nothing to refund.
        const order = await createOrder({
          customerId: customer.id,
          email: customer.email,
          transactionAmount: 100,
        })

        const { errors } = await refundOrderToStoreCreditWorkflow.run({
          input: { order_id: order.id, amount: 2 },
          container: getContainer(),
          throwOnError: false,
        })

        expect(errors).toEqual([
          expect.objectContaining({
            error: expect.objectContaining({
              message:
                "The order has no outstanding overpayment to refund to store credit",
              type: "invalid_data",
            }),
          }),
        ])
      })

      it("credits the overpayment to store credit and settles the order, clamping the refund", async () => {
        // Overpaid by 2 (paid 102 for a 100 order).
        const order = await createOrder({
          customerId: customer.id,
          email: customer.email,
          transactionAmount: 102,
        })

        // Refund more than the overpayment to assert it is clamped to 2.
        await refundOrderToStoreCreditWorkflow.run({
          input: { order_id: order.id, amount: 5 },
          container: getContainer(),
        })

        const query = getContainer().resolve(ContainerRegistrationKeys.QUERY)

        const {
          data: [updatedOrder],
        } = await query.graph({
          entity: "order",
          fields: ["id", "summary"],
          filters: { id: order.id },
        })

        // No credit line is created and the outstanding amount returns to 0.
        expect(Number(updatedOrder.summary.pending_difference)).toEqual(0)
        expect(Number(updatedOrder.summary.credit_line_total)).toEqual(0)

        const { data: accounts } = await query.graph({
          entity: "store_credit_account",
          fields: ["id", "balance"],
          filters: { customer_id: customer.id, currency_code: "usd" },
        })

        // The account is created on the fly and credited the clamped overpayment.
        expect(accounts).toHaveLength(1)
        expect(Number(accounts[0].balance)).toEqual(2)
      })
    })
  },
})
