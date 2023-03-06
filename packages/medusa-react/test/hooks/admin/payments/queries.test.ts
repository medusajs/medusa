import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminPayment } from "../../../../src/hooks/admin/payments"
import { createWrapper } from "../../../utils"

describe("useAdminPayment hook", () => {
  test("returns a payment collection", async () => {
    const payment = fixtures.get("payment")
    const { result, waitFor } = renderHook(() => useAdminPayment(payment.id), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.payment).toEqual(payment)
  })
})
