import { RefundReason } from "@medusajs/medusa"
import { renderHook } from "@testing-library/react-hooks/dom"
import {
  useAdminPaymentsCapturePayment,
  useAdminPaymentsRefundPayment,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminPaymentsCapturePayment hook", () => {
  test("Capture a payment", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminPaymentsCapturePayment("payment_id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.payment).toEqual(
      expect.objectContaining({
        amount_captured: 900,
      })
    )
  })
})

describe("useAdminPaymentsRefundPayment hook", () => {
  test("Update a Payment Collection", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminPaymentsRefundPayment("payment_id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      amount: 500,
      reason: RefundReason.DISCOUNT,
      note: "note to refund",
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.refund).toEqual(
      expect.objectContaining({
        payment_id: "payment_id",
        amount: 500,
        reason: RefundReason.DISCOUNT,
        note: "note to refund",
      })
    )
  })
})
