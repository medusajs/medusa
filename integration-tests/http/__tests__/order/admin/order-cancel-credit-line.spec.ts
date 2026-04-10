import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ModuleRegistrationName, Modules } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let container

    beforeEach(async () => {
      container = getContainer()
      await setupTaxStructure(container.resolve(ModuleRegistrationName.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    describe("POST /admin/orders/:id/cancel - Credit Line Calculation with Multiple Payments", () => {
      describe("when order has multiple payments with different statuses", () => {
        it("should only include captured payment amounts in credit line, not other status payments", async () => {
          // Create order with initial payment
          const seeder = await createOrderSeeder({
            api,
            container,
          })
          const order = seeder.order
          const paymentModule = container.resolve(Modules.PAYMENT)

          // Get the original payment collection and payment
          const originalPayment = order.payment_collections[0].payments[0]
          const paymentCollectionId = order.payment_collections[0].id

          // Use the authorized payment amount
          // Note: Amounts in Medusa are already in the correct format (e.g., 1272 for $1272 USD)
          const paymentAmount = originalPayment.amount
          const partialCaptureAmount = 50 // Capture a fixed partial amount for testing

          // Capture the original payment for partial amount
          await api.post(
            `/admin/payments/${originalPayment.id}/capture`,
            { amount: partialCaptureAmount },
            adminHeaders
          )

          // Create additional payment sessions to simulate failed payment attempts
          // Payment session 1 - will be authorized then canceled (failed intent)
          const failedSession1 = await paymentModule.createPaymentSession(
            paymentCollectionId,
            {
              provider_id: "pp_system_default",
              amount: paymentAmount,
              currency_code: "usd",
              data: {},
            }
          )
          const failedPayment1 = await paymentModule.authorizePaymentSession(
            failedSession1.id,
            {}
          )
          await paymentModule.cancelPayment(failedPayment1.id)

          // Payment session 2 - will be authorized then canceled (another failed intent)
          const failedSession2 = await paymentModule.createPaymentSession(
            paymentCollectionId,
            {
              provider_id: "pp_system_default",
              amount: paymentAmount,
              currency_code: "usd",
              data: {},
            }
          )
          const failedPayment2 = await paymentModule.authorizePaymentSession(
            failedSession2.id,
            {}
          )
          await paymentModule.cancelPayment(failedPayment2.id)

          // Payment session 3 - authorized but not captured (pending)
          const pendingSession = await paymentModule.createPaymentSession(
            paymentCollectionId,
            {
              provider_id: "pp_system_default",
              amount: 75, // Fixed amount for pending payment
              currency_code: "usd",
              data: {},
            }
          )
          const pendingPayment = await paymentModule.authorizePaymentSession(
            pendingSession.id,
            {}
          )

          // Get updated order with all payments
          const orderBeforeCancel = (
            await api.get(
              `/admin/orders/${order.id}?fields=*payment_collections.payments.amount,*payment_collections.payments.captured_at,*payment_collections.payments.canceled_at,*payment_collections.payments.captures.amount,*credit_lines.amount`,
              adminHeaders
            )
          ).data.order

          // Verify we have the expected payment states
          expect(
            orderBeforeCancel.payment_collections[0].payments
          ).toHaveLength(4)

          const payments = orderBeforeCancel.payment_collections[0].payments

          // Find payments by their characteristics
          const capturedPayment = payments.find(
            (p) => p.id === originalPayment.id
          )
          const canceledPayments = payments.filter(
            (p) => p.canceled_at !== null
          )
          const authorizedOnlyPayments = payments.filter(
            (p) =>
              p.captured_at === null &&
              p.canceled_at === null &&
              p.captures.length === 0
          )

          expect(capturedPayment).toBeDefined()
          expect(capturedPayment.captures).toHaveLength(1)
          expect(capturedPayment.captures[0].amount).toBe(partialCaptureAmount)
          expect(canceledPayments).toHaveLength(2)
          expect(authorizedOnlyPayments).toHaveLength(1)

          // Cancel the order
          const cancelResponse = await api.post(
            `/admin/orders/${order.id}/cancel`,
            {},
            adminHeaders
          )

          expect(cancelResponse.status).toBe(200)

          // Get order with credit lines
          const canceledOrder = (
            await api.get(
              `/admin/orders/${order.id}?fields=*credit_lines.amount,*credit_lines.reference,*credit_lines.reference_id,*payment_collections.payments.amount,*payment_collections.payments.captured_at,*payment_collections.payments.canceled_at,*payment_collections.payments.captures.amount`,
              adminHeaders
            )
          ).data.order

          expect(canceledOrder.status).toBe("canceled")

          // The critical assertion: credit lines should only account for captured amounts
          // Expected: Only 50 (the partialCaptureAmount) should be credited
          // Bug behavior: Would credit all payment amounts (50 + paymentAmount + paymentAmount + 75)
          const totalCreditLineAmount = canceledOrder.credit_lines.reduce(
            (sum, cl) => sum + cl.amount,
            0
          )

          // This test expects ONLY the captured amount (50) to be credited
          // If the bug exists, this will fail because it would credit all payment amounts
          expect(totalCreditLineAmount).toBe(50)

          // Verify that credit line total matches only captured amounts, not all payment amounts
          expect(canceledOrder.summary.credit_line_total).toBe(50)

          // The order total should be properly balanced (1272 - 50 = 1222)
          expect(canceledOrder.summary.current_order_total).toBe(1222)
          expect(canceledOrder.summary.accounting_total).toBe(1222)
        })

        it("should handle order with all payments canceled - zero credit line", async () => {
          // Create order with initial payment
          const seeder = await createOrderSeeder({
            api,
            container,
          })
          const order = seeder.order
          const paymentModule = container.resolve(Modules.PAYMENT)

          // Cancel the original payment (customer never successfully paid)
          const originalPayment = order.payment_collections[0].payments[0]
          const paymentAmount = originalPayment.amount
          await paymentModule.cancelPayment(originalPayment.id)

          // Create additional canceled payment sessions (all failed)
          const paymentCollectionId = order.payment_collections[0].id

          const failedSession1 = await paymentModule.createPaymentSession(
            paymentCollectionId,
            {
              provider_id: "pp_system_default",
              amount: paymentAmount,
              currency_code: "usd",
              data: {},
            }
          )
          const failedPayment1 = await paymentModule.authorizePaymentSession(
            failedSession1.id,
            {}
          )
          await paymentModule.cancelPayment(failedPayment1.id)

          const failedSession2 = await paymentModule.createPaymentSession(
            paymentCollectionId,
            {
              provider_id: "pp_system_default",
              amount: paymentAmount,
              currency_code: "usd",
              data: {},
            }
          )
          const failedPayment2 = await paymentModule.authorizePaymentSession(
            failedSession2.id,
            {}
          )
          await paymentModule.cancelPayment(failedPayment2.id)

          // Get order before cancel
          const orderBeforeCancel = (
            await api.get(
              `/admin/orders/${order.id}?fields=*payment_collections.payments.canceled_at`,
              adminHeaders
            )
          ).data.order

          // Verify all payments are canceled
          const allPaymentsCanceled =
            orderBeforeCancel.payment_collections[0].payments.every(
              (p) => p.canceled_at !== null
            )
          expect(allPaymentsCanceled).toBe(true)

          // Try to cancel the order
          const cancelResponse = await api
            .post(`/admin/orders/${order.id}/cancel`, {}, adminHeaders)
            .catch((e) => e.response)

          // The order should cancel successfully
          expect(cancelResponse.status).toBe(200)

          // Get order with credit lines
          const canceledOrder = (
            await api.get(
              `/admin/orders/${order.id}?fields=*credit_lines.amount`,
              adminHeaders
            )
          ).data.order

          // No captured payments = no credit line amount
          // Bug behavior: Would credit sum of all canceled payment amounts
          const totalCreditLineAmount = canceledOrder.credit_lines.reduce(
            (sum, cl) => sum + cl.amount,
            0
          )

          expect(totalCreditLineAmount).toBe(0)
          expect(canceledOrder.summary.credit_line_total).toBe(0)
        })
      })
    })
  },
})
