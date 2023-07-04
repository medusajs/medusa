import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useCreateSwap } from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useCreateSwap hook", () => {
  test("creates a return", async () => {
    const swap = {
      order_id: "order_test",
      additional_items: [
        {
          variant_id: "new-item",
          quantity: 1,
        },
      ],
      return_items: [
        {
          item_id: "return-item",
          quantity: 1,
        },
      ],
    }

    const { result, waitFor } = renderHook(() => useCreateSwap(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(swap)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.swap).toEqual(
      expect.objectContaining({
        ...fixtures.get("swap"),
        order_id: swap.order_id,
      })
    )
  })
})
