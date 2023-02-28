import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminSwap, useAdminSwaps } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminSwaps hook", () => {
  test("returns a list of swaps", async () => {
    const swaps = fixtures.list("swap")
    const { result, waitFor } = renderHook(() => useAdminSwaps(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.swaps).toEqual(swaps)
  })
})

describe("useAdminSwap hook", () => {
  test("returns a swap", async () => {
    const swap = fixtures.get("swap")
    const { result, waitFor } = renderHook(() => useAdminSwap(swap.id), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.swap).toEqual(swap)
  })
})
