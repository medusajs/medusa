import { ClaimType } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
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

      await api.post(`/admin/claims/${claim.id}/request`, {}, adminHeaders)
    }

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
      const seeders = await createOrderSeeder({ api, container })
      order = seeders.order

      await api.post(
        `/admin/orders/${order.id}/fulfillments`,
        { items: [{ id: order.items[0].id, quantity: 1 }] },
        adminHeaders
      )
    })

    describe("with outstanding amount due to claim", () => {
      beforeEach(async () => {
        await createClaim({ order })
      })

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

        const refundReason = (
          await api.post(
            `/admin/refund-reasons`,
            { label: "test" },
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
            { label: "test" },
            adminHeaders
          )
        ).data.refund_reason

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

      it("should throw if refund exceeds captured total", async () => {
        const payment = order.payment_collections[0].payments[0]

        await api.post(
          `/admin/payments/${payment.id}/capture`,
          undefined,
          adminHeaders
        )

        await api.post(
          `/admin/payments/${payment.id}/refund`,
          { amount: 25 },
          adminHeaders
        )

        const e = await api
          .post(
            `/admin/payments/${payment.id}/refund`,
            { amount: 1000 },
            adminHeaders
          )
          .catch((e) => e)

        expect(e.response.data.message).toEqual(
          "Cannot refund more than pending difference - 75"
        )
      })
    })

    it("should throw if outstanding amount is not present", async () => {
      const payment = order.payment_collections[0].payments[0]

      await api.post(
        `/admin/payments/${payment.id}/capture`,
        undefined,
        adminHeaders
      )

      const e = await api
        .post(
          `/admin/payments/${payment.id}/refund`,
          { amount: 10 },
          adminHeaders
        )
        .catch((e) => e)

      expect(e.response.data.message).toEqual(
        "Order does not have an outstanding balance to refund"
      )
    })
  },
})
