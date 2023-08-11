import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useOrderEdit } from "../../../../src/hooks/store/order-edits"
import { createWrapper } from "../../../utils"

describe("useOrderEdit hook", () => {
  test("returns an order", async () => {
    const store_order_edit = fixtures.get("store_order_edit")
    const { result, waitFor } = renderHook(
      () => useOrderEdit(store_order_edit.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.order_edit).toEqual(store_order_edit)
  })
})
