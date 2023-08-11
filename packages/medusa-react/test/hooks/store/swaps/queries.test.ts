import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useCartSwap } from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useCartSwap hook", () => {
  test("returns a swap", async () => {
    const swap = fixtures.get("swap")
    const { result, waitFor } = renderHook(() => useCartSwap("cart_test"), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.swap).toEqual(swap)
  })
})
