import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminDraftOrder, useAdminDraftOrders } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminDraftOrders hook", () => {
  test("returns a list of draft orders", async () => {
    const draftOrders = fixtures.list("draft_order")
    const { result, waitFor } = renderHook(() => useAdminDraftOrders(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.draft_orders).toEqual(draftOrders)
  })
})

describe("useAdminDraftOrder hook", () => {
  test("returns a draft order", async () => {
    const draftOrder = fixtures.get("draft_order")
    const { result, waitFor } = renderHook(
      () => useAdminDraftOrder(draftOrder.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.draft_order).toEqual(draftOrder)
  })
})
