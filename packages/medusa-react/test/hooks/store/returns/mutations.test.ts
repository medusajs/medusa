import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useCreateReturn } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useCreateReturn hook", () => {
  test("creates a return", async () => {
    const ret = {
      order_id: "order_38",
      items: [
        {
          item_id: "test-item",
          quantity: 1,
        },
      ],
    }

    const { result, waitFor } = renderHook(() => useCreateReturn(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(ret)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.return).toEqual(
      expect.objectContaining({
        ...fixtures.get("return"),
        order_id: ret.order_id,
      })
    )
  })
})
