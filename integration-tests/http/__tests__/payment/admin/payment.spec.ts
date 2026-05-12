import { refundPaymentsWorkflow } from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ClaimType } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let container
    let order

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

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

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
    })

    describe("with outstanding amount due to claim", () => {
      it("should capture an authorized payment", async () => {
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
    })
  },
})
