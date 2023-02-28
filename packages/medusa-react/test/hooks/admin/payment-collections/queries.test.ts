import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminPaymentCollection } from "../../../../src/hooks/admin/payment-collections"
import { createWrapper } from "../../../utils"

describe("useAdminPaymentCollection hook", () => {
  test("returns a payment collection", async () => {
    const payment_collection = fixtures.get("payment_collection")
    const { result, waitFor } = renderHook(
      () => useAdminPaymentCollection(payment_collection.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.payment_collection).toEqual(payment_collection)
  })
})
