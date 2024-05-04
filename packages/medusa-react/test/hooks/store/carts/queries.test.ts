import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useGetCart } from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useGetCart hook", () => {
  test("returns a cart", async () => {
    const cart = fixtures.get("cart")
    const { result, waitFor } = renderHook(() => useGetCart(cart.id), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.cart).toEqual(cart)
  })
})
