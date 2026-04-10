import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"
import { Modules } from "@medusajs/utils"
import { updateRefundReasonsWorkflow } from "@medusajs/core-flows"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let refundReason1
    let refundReason2
    let appContainer

    beforeEach(async () => {
      appContainer = getContainer()
      await createAdminUser(dbConnection, adminHeaders, appContainer)

      refundReason1 = (
        await api.post(
          "/admin/refund-reasons",
          { label: "reason 1 - too big", code: "too_big" },
          adminHeaders
        )
      ).data.refund_reason

      refundReason2 = (
        await api.post(
          "/admin/refund-reasons",
          { label: "reason 2 - too small", code: "too_small" },
          adminHeaders
        )
      ).data.refund_reason
    })

    describe("GET /admin/refund-reasons", () => {
      it("should list refund reasons and query count", async () => {
        const response = await api
          .get("/admin/refund-reasons", adminHeaders)
          .catch((err) => {
            console.log(err)
          })

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(5) // There are 3 default ones
        expect(response.data.refund_reasons).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              label: "Customer Care Adjustment",
              code: "customer_care_adjustment",
            }),
            expect.objectContaining({
              label: "Shipping Issue",
              code: "shipping_issue",
            }),
            expect.objectContaining({
              label: "Pricing Error",
              code: "pricing_error",
            }),
            expect.objectContaining({
              label: "reason 1 - too big",
              code: "too_big",
            }),
            expect.objectContaining({
              label: "reason 2 - too small",
              code: "too_small",
            }),
          ])
        )
      })

      it("should list refund-reasons with specific query", async () => {
        const response = await api.get(
          "/admin/refund-reasons?q=1",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.refund_reasons).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              label: "reason 1 - too big",
            }),
          ])
        )
      })
    })

    describe("POST /admin/refund-reasons", () => {
      it("should create a refund reason", async () => {
        const response = await api.post(
          "/admin/refund-reasons",
          {
            label: "reason test",
            code: "reason_test",
            description: "test description",
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.refund_reason).toEqual(
          expect.objectContaining({
            label: "reason test",
            code: "reason_test",
            description: "test description",
          })
        )
      })
    })

    describe("POST /admin/refund-reasons/:id", () => {
      it("should correctly update refund reason", async () => {
        const response = await api.post(
          `/admin/refund-reasons/${refundReason1.id}`,
          {
            label: "reason test",
            code: "reason_test",
            description: "test description",
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.refund_reason).toEqual(
          expect.objectContaining({
            label: "reason test",
            code: "reason_test",
            description: "test description",
          })
        )
      })
    })

    describe("GET /admin/refund-reasons/:id", () => {
      it("should fetch a refund reason", async () => {
        const response = await api.get(
          `/admin/refund-reasons/${refundReason1.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.refund_reason).toEqual(
          expect.objectContaining({
            id: refundReason1.id,
          })
        )
      })
    })

    describe("DELETE /admin/refund-reasons/:id", () => {
      it("should remove refund reasons", async () => {
        const deleteResponse = await api.delete(
          `/admin/refund-reasons/${refundReason1.id}`,
          adminHeaders
        )

        expect(deleteResponse.data).toEqual({
          id: refundReason1.id,
          object: "refund_reason",
          deleted: true,
        })

        await api
          .get(`/admin/refund-reasons/${refundReason1.id}`, adminHeaders)
          .catch((error) => {
            expect(error.response.data.type).toEqual("not_found")
            expect(error.response.data.message).toEqual(
              `Refund reason with id: ${refundReason1.id.id} not found`
            )
          })
      })
    })

    describe("workflows", () => {
      it("updateRefundReasonsWorkflow - should not call listRefundReasons when data is empty", async () => {
        const paymentService = appContainer.resolve(Modules.PAYMENT)
        const listRefundReasonsSpy = jest.spyOn(
          paymentService,
          "listRefundReasons"
        )

        const { result } = await updateRefundReasonsWorkflow(appContainer).run({
          input: [],
        })

        expect(result).toEqual([])
        expect(listRefundReasonsSpy).not.toHaveBeenCalled()

        listRefundReasonsSpy.mockRestore()
      })
    })
  },
})
