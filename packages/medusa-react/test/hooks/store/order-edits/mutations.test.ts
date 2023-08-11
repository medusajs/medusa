import { renderHook } from "@testing-library/react-hooks/dom"
import { useCompleteOrderEdit, useDeclineOrderEdit } from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useDeclineOrderEdit hook", () => {
  test("decline an order edit", async () => {
    const declineBody = {
      declined_reason: "Wrong color",
    }

    const { result, waitFor } = renderHook(
      () => useDeclineOrderEdit("store_order_edit"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(declineBody)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order_edit).toEqual(
      expect.objectContaining({
        status: "declined",
        ...declineBody,
      })
    )
  })
})

describe("useCompleteOrderEdit hook", () => {
  test("complete an order edit", async () => {
    const { result, waitFor } = renderHook(
      () => useCompleteOrderEdit("store_order_edit"),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.order_edit).toEqual(
      expect.objectContaining({
        status: "confirmed",
      })
    )
  })
})
