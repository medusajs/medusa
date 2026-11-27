import { refundPaymentsWorkflow } from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ClaimType, Modules, OrderStatus } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let container
    let order
    let adminUser

    const createClaim = async ({ order }) => {
      const claim = (
        await api.post(
          "/admin/claims",
          {
            order_id: order.id,
            type: ClaimType.REPLACE,
            description: "Base claim",
          },
          adminHeaders
        )
      ).data.claim

      await api.post(
        `/admin/claims/${claim.id}/inbound/items`,
        { items: [{ id: order.items[0].id, quantity: 1 }] },
        adminHeaders
      )

      const createdClaim = await api.post(
        `/admin/claims/${claim.id}/request`,
        {},
        adminHeaders
      )

      const returnOrder = createdClaim.data.return
      const returnId = returnOrder.id
      await api.post(`/admin/returns/${returnId}/receive`, {}, adminHeaders)

      let lineItem = returnOrder.items[0].item
      await api.post(
        `/admin/returns/${returnId}/receive-items`,
        {
          items: [
            {
              id: lineItem.id,
              quantity: returnOrder.items[0].quantity,
            },
          ],
        },
        adminHeaders
      )

      await api.post(
        `/admin/returns/${returnId}/receive/confirm`,
        {},
        adminHeaders
      )
    }

    beforeAll(async () => {
      container = getContainer()
      ;({ user: adminUser } = await createAdminUser(
        dbConnection,
        adminHeaders,
        container
      ))

      const inventoryItemOverride = (
        await api.post(
          `/admin/inventory-items`,
          { sku: "test-variant", requires_shipping: false },
          adminHeaders
        )
      ).data.inventory_item

      const seeders = await createOrderSeeder({
        api,
        container,
        inventoryItemOverride,
        withoutShipping: true,
      })

      order = seeders.order

      await api.post(
        `/admin/orders/${order.id}/fulfillments`,
        { items: [{ id: order.items[0].id, quantity: 1 }] },
        adminHeaders
      )

      await dbUtils.snapshot()
    })

    describe("with outstanding amount due to claim", () => {
      it("should capture an authorized payment", async () => {
        const payment = order.payment_collections[0].payments[0]

        const response = await api.post(
          `/admin/payments/${payment.id}/capture?fields=+captures.created_by`,
          undefined,
          adminHeaders
        )

        expect(response.data.payment).toEqual(
          expect.objectContaining({
            id: payment.id,
            captured_at: expect.any(String),
            captures: [
              expect.objectContaining({
                id: expect.any(String),
                amount: 100,
                created_by: adminUser.id,
              }),
            ],
            refunds: [],
            amount: 100,
          })
        )
        expect(response.status).toEqual(200)
      })

      it("should throw if capture amount is greater than authorized amount", async () => {
        const payment = order.payment_collections[0].payments[0]

        const response = await api.post(
          `/admin/payments/${payment.id}/capture`,
          { amount: 75 },
          adminHeaders
        )

        expect(response.data.payment).toEqual(
          expect.objectContaining({
            id: payment.id,
            captured_at: null, // not fully captured yet
            captures: [
              expect.objectContaining({
                id: expect.any(String),
                amount: 75,
              }),
            ],
            refunds: [],
            amount: 100,
          })
        )
        expect(response.status).toEqual(200)

        const errResponse = await api
          .post(
            `/admin/payments/${payment.id}/capture`,
            { amount: 75 },
            adminHeaders
          )
          .catch((e) => e)

        expect(errResponse.response.data.message).toEqual(
          "You cannot capture more than the authorized amount substracted by what is already captured."
        )
      })

      it("should return payment if payment is already fully captured", async () => {
        const payment = order.payment_collections[0].payments[0]

        const response = await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        expect(response.data.payment).toEqual(
          expect.objectContaining({
            id: payment.id,
            captured_at: expect.any(String),
            captures: [
              expect.objectContaining({
                id: expect.any(String),
                amount: 100,
              }),
            ],
            refunds: [],
            amount: 100,
          })
        )
        expect(response.status).toEqual(200)

        const anotherResponse = await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        expect(anotherResponse.data.payment).toEqual(
          expect.objectContaining({
            id: payment.id,
            captured_at: expect.any(String),
            captures: [
              expect.objectContaining({
                id: expect.any(String),
                amount: 100,
              }),
            ],
            refunds: [],
            amount: 100,
          })
        )
        expect(anotherResponse.status).toEqual(200)
      })

      it("should refund a captured payment", async () => {
        const payment = order.payment_collections[0].payments[0]

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        await createClaim({ order })

        const refundReason = (
          await api.post(
            `/admin/refund-reasons`,
            { label: "test", code: "test" },
            adminHeaders
          )
        ).data.refund_reason

        // BREAKING: reason is now refund_reason_id
        const response = await api.post(
          `/admin/payments/${payment.id}/refund`,
          {
            amount: 50,
            refund_reason_id: refundReason.id,
            note: "Do not like it",
          },
          adminHeaders
        )

        // BREAKING: Response was `data.refund` in V1 with payment ID, reason, and amount
        expect(response.status).toEqual(200)
        expect(response.data.payment).toEqual(
          expect.objectContaining({
            id: payment.id,
            captured_at: expect.any(String),
            captures: [
              expect.objectContaining({
                id: expect.any(String),
                amount: 100,
              }),
            ],
            refunds: [
              expect.objectContaining({
                id: expect.any(String),
                amount: 50,
                note: "Do not like it",
                refund_reason_id: refundReason.id,
                refund_reason: expect.objectContaining({
                  label: "test",
                  code: "test",
                }),
              }),
            ],
            amount: 100,
          })
        )
      })

      it("should forward a caller-supplied idempotency key to the provider", async () => {
        const paymentModule = container.resolve(Modules.PAYMENT)
        const payment = order.payment_collections[0].payments[0]

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        const providerRefundSpy = jest.spyOn(
          (paymentModule as any).paymentProviderService_,
          "refundPayment"
        )

        const response = await api.post(
          `/admin/payments/${payment.id}/refund`,
          { amount: 50, idempotency_key: "rma_42_refund" },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(providerRefundSpy.mock.calls[0][1].context.idempotency_key).toEqual(
          "rma_42_refund"
        )

        const refunds = await paymentModule.listRefunds({
          payment_id: payment.id,
        })
        expect(refunds).toHaveLength(1)
        expect(refunds[0].idempotency_key).toEqual("rma_42_refund")

        jest.restoreAllMocks()
      })

      it("should not refund twice when the same idempotency key is replayed", async () => {
        const paymentModule = container.resolve(Modules.PAYMENT)
        const payment = order.payment_collections[0].payments[0]

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        const providerRefundSpy = jest.spyOn(
          (paymentModule as any).paymentProviderService_,
          "refundPayment"
        )

        const body = { amount: 50, idempotency_key: "rma_42_refund" }

        await api.post(`/admin/payments/${payment.id}/refund`, body, adminHeaders)
        const replay = await api.post(
          `/admin/payments/${payment.id}/refund`,
          body,
          adminHeaders
        )

        expect(replay.status).toEqual(200)
        expect(providerRefundSpy).toHaveBeenCalledTimes(1)
        expect(replay.data.payment.refunds).toHaveLength(1)

        jest.restoreAllMocks()
      })

      it("should not duplicate the order bookkeeping when a refund is replayed", async () => {
        const payment = order.payment_collections[0].payments[0]

        const refundReason = (
          await api.post(
            `/admin/refund-reasons`,
            { label: "Test", code: "test" },
            adminHeaders
          )
        ).data.refund_reason

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        const body = {
          amount: 50,
          refund_reason_id: refundReason.id,
          idempotency_key: "rma_42_refund",
        }

        await api.post(`/admin/payments/${payment.id}/refund`, body, adminHeaders)

        const afterFirst = (
          await api.get(`/admin/orders/${order.id}`, adminHeaders)
        ).data.order

        await api.post(`/admin/payments/${payment.id}/refund`, body, adminHeaders)

        const afterReplay = (
          await api.get(`/admin/orders/${order.id}`, adminHeaders)
        ).data.order

        // A replay moves no funds, so it must not add a credit line or shift
        // what the order says is still owed.
        expect(afterReplay.credit_lines).toHaveLength(
          afterFirst.credit_lines.length
        )
        expect(afterReplay.credit_line_total).toEqual(
          afterFirst.credit_line_total
        )
        expect(afterReplay.summary.pending_difference).toEqual(
          afterFirst.summary.pending_difference
        )
      })

      it("should finish the order bookkeeping when a retry follows a half-written refund", async () => {
        const orderModule = container.resolve(Modules.ORDER)
        const payment = order.payment_collections[0].payments[0]

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        // The provider refunds, then the order bookkeeping blows up: the money
        // is gone but the order doesn't know about it yet.
        const addTransactionsSpy = jest
          .spyOn(orderModule, "addOrderTransactions")
          .mockRejectedValueOnce(new Error("order bookkeeping failed"))

        const body = { amount: 50, idempotency_key: "rma_42_refund" }

        const failure = await api
          .post(`/admin/payments/${payment.id}/refund`, body, adminHeaders)
          .catch((e) => e)

        expect(failure.response.status).toEqual(500)
        expect(addTransactionsSpy).toHaveBeenCalledTimes(1)

        expect(
          await orderModule.listOrderTransactions({
            order_id: order.id,
            reference: "refund",
          })
        ).toHaveLength(0)

        // The retry must finish the job, not treat it as already done.
        const retry = await api.post(
          `/admin/payments/${payment.id}/refund`,
          body,
          adminHeaders
        )

        expect(retry.status).toEqual(200)

        const transactions = await orderModule.listOrderTransactions({
          order_id: order.id,
          reference: "refund",
        })

        expect(transactions).toHaveLength(1)
        expect(transactions[0].amount).toEqual(-50)
        expect(retry.data.payment.refunds).toHaveLength(1)

        jest.restoreAllMocks()
      })

      it("should reject a replayed idempotency key used for a different amount", async () => {
        const payment = order.payment_collections[0].payments[0]

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        await api.post(
          `/admin/payments/${payment.id}/refund`,
          { amount: 50, idempotency_key: "rma_42_refund" },
          adminHeaders
        )

        const error = await api
          .post(
            `/admin/payments/${payment.id}/refund`,
            { amount: 25, idempotency_key: "rma_42_refund" },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
      })

      it("should reject an empty idempotency key", async () => {
        const payment = order.payment_collections[0].payments[0]

        const error = await api
          .post(
            `/admin/payments/${payment.id}/refund`,
            { amount: 50, idempotency_key: "" },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
      })

      it("should reject a refund with an amount of 0", async () => {
        const payment = order.payment_collections[0].payments[0]

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        const error = await api
          .post(
            `/admin/payments/${payment.id}/refund`,
            { amount: 0 },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
      })

      it("should reject a refund with a negative amount", async () => {
        const payment = order.payment_collections[0].payments[0]

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        const error = await api
          .post(
            `/admin/payments/${payment.id}/refund`,
            { amount: -50 },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
      })

      it("should issue multiple refunds", async () => {
        const payment = order.payment_collections[0].payments[0]

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        const refundReason = (
          await api.post(
            `/admin/refund-reasons`,
            { label: "test", code: "test" },
            adminHeaders
          )
        ).data.refund_reason

        await createClaim({ order })

        await api.post(
          `/admin/payments/${payment.id}/refund`,
          {
            amount: 25,
            refund_reason_id: refundReason.id,
            note: "Do not like it",
          },
          adminHeaders
        )

        await api.post(
          `/admin/payments/${payment.id}/refund`,
          {
            amount: 25,
            refund_reason_id: refundReason.id,
            note: "Do not like it",
          },
          adminHeaders
        )

        const refundedPayment = (
          await api.get(`/admin/payments/${payment.id}`, adminHeaders)
        ).data.payment

        expect(refundedPayment).toEqual(
          expect.objectContaining({
            id: payment.id,
            currency_code: "usd",
            amount: 100,
            captured_at: expect.any(String),
            captures: [
              expect.objectContaining({
                amount: 100,
              }),
            ],
            refunds: [
              expect.objectContaining({
                amount: 25,
                note: "Do not like it",
              }),
              expect.objectContaining({
                amount: 25,
                note: "Do not like it",
              }),
            ],
          })
        )
      })

      it("should create credit lines if issuing a refund when outstanding amount if >= 0", async () => {
        const payment = order.payment_collections[0].payments[0]

        const refundReason = (
          await api.post(
            `/admin/refund-reasons`,
            { label: "Test", code: "test" },
            adminHeaders
          )
        ).data.refund_reason

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        await api.post(
          `/admin/payments/${payment.id}/refund`,
          {
            amount: 50,
            refund_reason_id: refundReason.id,
          },
          adminHeaders
        )

        const updatedOrder = (
          await api.get(`/admin/orders/${order.id}`, adminHeaders)
        ).data.order

        expect(updatedOrder.credit_line_total).toEqual(50)
        expect(updatedOrder.credit_lines).toEqual([
          expect.objectContaining({
            reference: "Test",
            reference_id: "test",
          }),
        ])
      })

      it("should not refund the payment when the order has an active order change", async () => {
        const paymentModule = container.resolve(Modules.PAYMENT)
        const payment = order.payment_collections[0].payments[0]

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        await api.post(
          "/admin/order-edits",
          { order_id: order.id, description: "Pending edit" },
          adminHeaders
        )

        const providerRefundSpy = jest.spyOn(
          (paymentModule as any).paymentProviderService_,
          "refundPayment"
        )
        providerRefundSpy.mockClear()

        const error = await api
          .post(
            `/admin/payments/${payment.id}/refund`,
            { amount: 50 },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          `Order (${order.id}) already has an existing active order change`
        )
        expect(providerRefundSpy).not.toHaveBeenCalled()

        const updatedPayment = await paymentModule.retrievePayment(payment.id, {
          relations: ["refunds"],
        })
        expect(updatedPayment.refunds).toHaveLength(0)

        const updatedOrder = (
          await api.get(`/admin/orders/${order.id}`, adminHeaders)
        ).data.order
        expect(updatedOrder.credit_lines).toEqual([])
      })

      it("should refund the payment and create a credit line once the order change is cancelled", async () => {
        const payment = order.payment_collections[0].payments[0]

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        await api.post(
          "/admin/order-edits",
          { order_id: order.id, description: "Pending edit" },
          adminHeaders
        )
        await api.delete(`/admin/order-edits/${order.id}`, adminHeaders)

        const response = await api.post(
          `/admin/payments/${payment.id}/refund`,
          { amount: 50 },
          adminHeaders
        )

        expect(response.status).toEqual(200)

        const updatedOrder = (
          await api.get(`/admin/orders/${order.id}`, adminHeaders)
        ).data.order
        expect(updatedOrder.credit_line_total).toEqual(50)
        expect(updatedOrder.credit_lines).toHaveLength(1)
      })

      it("should not refund the payment when the order is canceled", async () => {
        const paymentModule = container.resolve(Modules.PAYMENT)
        const orderModule = container.resolve(Modules.ORDER)
        const payment = order.payment_collections[0].payments[0]

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        // Canceling through the API refunds the captured payment, which would
        // leave nothing to refund, so set the status directly.
        await orderModule.updateOrders(order.id, {
          status: OrderStatus.CANCELED,
        })

        const providerRefundSpy = jest.spyOn(
          (paymentModule as any).paymentProviderService_,
          "refundPayment"
        )
        providerRefundSpy.mockClear()

        try {
          const error = await api
            .post(
              `/admin/payments/${payment.id}/refund`,
              { amount: 50 },
              adminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(400)
          expect(error.response.data.message).toEqual(
            `Order with id ${order.id} has been canceled.`
          )
          expect(providerRefundSpy).not.toHaveBeenCalled()
        } finally {
          providerRefundSpy.mockRestore()
        }

        const updatedPayment = await paymentModule.retrievePayment(payment.id, {
          relations: ["refunds"],
        })
        expect(updatedPayment.refunds).toHaveLength(0)
      })

      it("should not let an order change be created while the provider refund is in flight", async () => {
        const paymentModule = container.resolve(Modules.PAYMENT)
        const orderModule = container.resolve(Modules.ORDER)
        const lockingModule = container.resolve(Modules.LOCKING)
        const payment = order.payment_collections[0].payments[0]
        const orderChangeLockKey = `order-change:${order.id}`

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        const waitUntil = async (
          condition: () => Promise<boolean> | boolean,
          message: string,
          timeoutMs = 10000
        ) => {
          const deadline = Date.now() + timeoutMs
          while (!(await condition())) {
            if (Date.now() > deadline) {
              throw new Error(`Timed out waiting: ${message}`)
            }
            await new Promise((resolve) => setTimeout(resolve, 50))
          }
        }

        const providerService = (paymentModule as any).paymentProviderService_
        const originalRefund =
          providerService.refundPayment.bind(providerService)
        let releaseProvider: () => void = () => {}
        const providerGate = new Promise<void>((resolve) => {
          releaseProvider = resolve
        })
        const providerRefundSpy = jest
          .spyOn(providerService, "refundPayment")
          .mockImplementation(async (...args: any[]) => {
            await providerGate
            return originalRefund(...args)
          })
        const lockAcquireSpy = jest.spyOn(lockingModule, "acquire")
        const orderChangeLockAttempts = () =>
          lockAcquireSpy.mock.calls.filter(([keys]) =>
            [keys].flat().includes(orderChangeLockKey)
          ).length

        let refundRequest: Promise<any> = Promise.resolve()
        let orderEditRequest: Promise<any> = Promise.resolve()

        try {
          refundRequest = api
            .post(
              `/admin/payments/${payment.id}/refund`,
              { amount: 50 },
              adminHeaders
            )
            .catch((e) => e.response)

          await waitUntil(
            () => providerRefundSpy.mock.calls.length > 0,
            "the provider refund to start"
          )

          let orderEditSettled = false
          orderEditRequest = api
            .post(
              "/admin/order-edits",
              { order_id: order.id, description: "Concurrent edit" },
              adminHeaders
            )
            .catch((e) => e.response)
            .finally(() => {
              orderEditSettled = true
            })

          // Wait until the order edit either created its order change (the
          // race) or is waiting on the lock the refund holds.
          await waitUntil(async () => {
            const activeChanges = await orderModule.listOrderChanges({
              order_id: order.id,
              status: ["pending", "requested"],
            })
            return (
              orderEditSettled ||
              activeChanges.length > 0 ||
              orderChangeLockAttempts() > 1
            )
          }, "the order edit to create its order change or wait on the lock")
        } finally {
          releaseProvider()
        }

        const refundResponse = await refundRequest
        const orderEditResponse = await orderEditRequest
        const providerRefundCalls = providerRefundSpy.mock.calls.length
        const lockAttempts = orderChangeLockAttempts()
        providerRefundSpy.mockRestore()
        lockAcquireSpy.mockRestore()

        expect(refundResponse.status).toEqual(200)
        expect(providerRefundCalls).toEqual(1)
        // The refund took the lock, and the order edit waited on it.
        expect(lockAttempts).toBeGreaterThan(1)

        // The order edit waited for the refund to finish, then went through.
        expect(orderEditResponse.status).toEqual(200)

        const updatedPayment = await paymentModule.retrievePayment(payment.id, {
          relations: ["refunds"],
        })
        expect(updatedPayment.refunds).toHaveLength(1)

        const updatedOrder = (
          await api.get(
            `/admin/orders/${order.id}?fields=+summary`,
            adminHeaders
          )
        ).data.order
        expect(updatedOrder.credit_line_total).toEqual(50)
        expect(updatedOrder.credit_lines).toHaveLength(1)
        expect(updatedOrder.summary.refunded_total).toEqual(50)
      })

      it("should throw if the refund amount exceeds the payment amount", async () => {
        const payment = order.payment_collections[0].payments[0]

        const refundReason = (
          await api.post(
            `/admin/refund-reasons`,
            { label: "Test", code: "test" },
            adminHeaders
          )
        ).data.refund_reason

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        await api.post(
          `/admin/payments/${payment.id}/refund`,
          {
            amount: 50,
            refund_reason_id: refundReason.id,
          },
          adminHeaders
        )

        const updatedOrder = (
          await api.get(`/admin/orders/${order.id}`, adminHeaders)
        ).data.order

        expect(updatedOrder.credit_line_total).toEqual(50)
        expect(updatedOrder.credit_lines).toEqual([
          expect.objectContaining({
            reference: "Test",
            reference_id: "test",
          }),
        ])

        try {
          await api.post(
            `/admin/payments/${payment.id}/refund`,
            {
              amount: 5000,
              refund_reason_id: refundReason.id,
            },
            adminHeaders
          )
        } catch (error) {
          expect(error.response.status).toBe(400)
          expect(error.response.data.message).toBe(
            "You are not allowed to refund more than the captured amount"
          )
        }

        const updatedUpdatedOrder = (
          await api.get(`/admin/orders/${order.id}`, adminHeaders)
        ).data.order

        expect(updatedUpdatedOrder.credit_line_total).toEqual(50)
        expect(updatedUpdatedOrder.credit_lines).toEqual([
          expect.objectContaining({
            reference: "Test",
            reference_id: "test",
          }),
        ])
      })

      it("should allow refund slightly exceeding captured amount within currency epsilon", async () => {
        const payment = order.payment_collections[0].payments[0]

        const refundReason = (
          await api.post(
            `/admin/refund-reasons`,
            { label: "test", code: "test" },
            adminHeaders
          )
        ).data.refund_reason

        // Capture with sub-cent precision amount (more decimals than USD supports)
        await api.post(
          `/admin/payments/${payment.id}/capture`,
          { amount: 87.957975 },
          adminHeaders
        )

        // 87.96 > 87.957975 but the difference (0.002025) is within USD epsilon (0.01)
        const response = await api.post(
          `/admin/payments/${payment.id}/refund`,
          {
            amount: 87.96,
            refund_reason_id: refundReason.id,
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.payment).toEqual(
          expect.objectContaining({
            id: payment.id,
            refunds: [
              expect.objectContaining({
                amount: 87.96,
              }),
            ],
          })
        )
      })

      it("refundPaymentsWorkflow allows refund slightly exceeding captured amount within currency epsilon", async () => {
        const payment = order.payment_collections[0].payments[0]

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          { amount: 87.957975 },
          adminHeaders
        )

        const { result } = await refundPaymentsWorkflow(container).run({
          input: [{ payment_id: payment.id, amount: 87.96 }],
        })

        expect(result).toEqual([
          expect.objectContaining({
            id: payment.id,
            refunds: expect.arrayContaining([
              expect.objectContaining({ amount: 87.96 }),
            ]),
          }),
        ])
      })

      it("refundPaymentsWorkflow rejects refund exceeding captured amount beyond currency epsilon", async () => {
        const payment = order.payment_collections[0].payments[0]

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          { amount: 87.957975 },
          adminHeaders
        )

        // 87.98 - 87.957975 = 0.022025, which is beyond USD epsilon (0.01)
        await expect(
          refundPaymentsWorkflow(container).run({
            input: [{ payment_id: payment.id, amount: 87.98 }],
          })
        ).rejects.toMatchObject({
          message: expect.stringContaining(
            "is trying to refund amount greater than the refundable amount"
          ),
        })
      })

      it("refundPaymentsWorkflow should not record an order transaction for a refund the provider rejected", async () => {
        const payment = order.payment_collections[0].payments[0]
        const paymentModule = container.resolve(Modules.PAYMENT)
        const orderModule = container.resolve(Modules.ORDER)

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        jest
          .spyOn(paymentModule, "refundPayment")
          .mockRejectedValueOnce(new Error("Provider returned HTTP 503"))

        const { result } = await refundPaymentsWorkflow(container).run({
          input: [{ payment_id: payment.id, amount: 50 }],
        })

        jest.restoreAllMocks()

        expect(result).toEqual([])
        expect(
          (await paymentModule.retrievePayment(payment.id, {
            relations: ["refunds"],
          })).refunds
        ).toHaveLength(0)
        expect(
          await orderModule.listOrderTransactions({
            order_id: order.id,
            reference: "refund",
          })
        ).toHaveLength(0)

        // A successful refund still records its transaction
        await refundPaymentsWorkflow(container).run({
          input: [{ payment_id: payment.id, amount: 50 }],
        })

        const transactions = await orderModule.listOrderTransactions({
          order_id: order.id,
          reference: "refund",
        })
        expect(transactions).toHaveLength(1)
        expect(transactions[0].amount).toEqual(-50)
      })
    })
  },
})
