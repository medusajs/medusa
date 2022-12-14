import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"
import { useAdminPayment } from "../../../../src/hooks/admin/payments"

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
