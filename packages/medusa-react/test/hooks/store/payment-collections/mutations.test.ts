import { renderHook } from "@testing-library/react-hooks/dom"
import {
  useAuthorizePaymentSession,
  useAuthorizePaymentSessionsBatch,
  useManageMultiplePaymentSessions,
  useManagePaymentSession,
  usePaymentCollectionRefreshPaymentSession,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useManageMultiplePaymentSessions hook", () => {
  test("Manage multiple payment sessions of a payment collection", async () => {
    const { result, waitFor } = renderHook(
      () => useManageMultiplePaymentSessions("payment_collection_id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      sessions: {
        provider_id: "manual",
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

describe("useManagePaymentSession hook", () => {
  test("Manage payment session of a payment collection", async () => {
    const { result, waitFor } = renderHook(
      () => useManagePaymentSession("payment_collection_id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      provider_id: "manual",
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

describe("useAuthorizePaymentSession hook", () => {
  test("Authorize a payment session of a Payment Collection", async () => {
    const { result, waitFor } = renderHook(
      () => useAuthorizePaymentSession("payment_collection_id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate("123")

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.payment_session).toEqual(
      expect.objectContaining({
        id: "123",
        amount: 900,
      })
    )
  })
})

describe("authorizePaymentSessionsBatch hook", () => {
  test("Authorize all payment sessions of a Payment Collection", async () => {
    const { result, waitFor } = renderHook(
      () => useAuthorizePaymentSessionsBatch("payment_collection_id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      session_ids: ["abc"],
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(207)

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

    result.current.mutate("session_id")

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
