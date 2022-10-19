import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"
import { useOrderEdit } from "../../../../src/hooks/store/order-edits"

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
