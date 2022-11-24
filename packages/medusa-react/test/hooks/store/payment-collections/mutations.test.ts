import {
  useManagePaymentSessions,
  useAuthorizePayment,
  usePaymentCollectionRefreshPaymentSession,
} from "../../../../src"
import { renderHook } from "@testing-library/react-hooks"
import { createWrapper } from "../../../utils"

describe("useManagePaymentSessions hook", () => {
  test("Manage payment session of a payment collection", async () => {
    const { result, waitFor } = renderHook(
      () => useManagePaymentSessions("payment_collection_id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      sessions: {
        provider_id: "manual",
        customer_id: "customer-1",
        amount: 900,
      },
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data?.payment_collection).toEqual(
      expect.objectContaining({
        id: "payment_collection_id",
        amount: 900,
      })
    )
  })
})

describe("useAuthorizePayment hook", () => {
  test("Authorize all payment sessions of a Payment Collection", async () => {
    const { result, waitFor } = renderHook(
      () => useAuthorizePayment("payment_collection_id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.payment_collection).toEqual(
      expect.objectContaining({
        id: "payment_collection_id",
        payment_sessions: expect.arrayContaining([
          expect.objectContaining({
            amount: 900,
          }),
        ]),
      })
    )
  })
})

describe("usePaymentCollectionRefreshPaymentSession hook", () => {
  test("Refresh a payment sessions of a Payment Collection", async () => {
    const { result, waitFor } = renderHook(
      () => usePaymentCollectionRefreshPaymentSession("payment_collection_id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      session_id: "session_id",
      provider_id: "manual",
      customer_id: "customer-1",
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.payment_session).toEqual(
      expect.objectContaining({
        id: "new_session_id",
        amount: 900,
      })
    )
  })
})
