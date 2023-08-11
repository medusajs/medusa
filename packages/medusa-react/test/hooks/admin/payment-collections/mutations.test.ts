import { renderHook } from "@testing-library/react-hooks/dom"
import {
  useAdminDeletePaymentCollection,
  useAdminMarkPaymentCollectionAsAuthorized,
  useAdminUpdatePaymentCollection,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminDeletePaymentCollection hook", () => {
  test("Delete a payment collection", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeletePaymentCollection("payment_collection_id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: "payment_collection_id",
        deleted: true,
      })
    )
  })
})

describe("useAdminUpdatePaymentCollection hook", () => {
  test("Update a Payment Collection", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminUpdatePaymentCollection("payment_collection_id"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      description: "new description",
      metadata: { demo: "obj" },
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.payment_collection).toEqual(
      expect.objectContaining({
        id: "payment_collection_id",
        description: "new description",
        metadata: { demo: "obj" },
      })
    )
  })
})

describe("useAdminMarkPaymentCollectionAsAuthorized hook", () => {
  test("Mark a Payment Collection as Authorized", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminMarkPaymentCollectionAsAuthorized("payment_collection_id"),
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
        status: "authorized",
      })
    )
  })
})
