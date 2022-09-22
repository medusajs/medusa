import { useDeclineOrderEdit } from "../../../../src/"
import { renderHook } from "@testing-library/react-hooks"
import { createWrapper } from "../../../utils"

describe("useCreateLineItem hook", () => {
  test("creates a line item", async () => {
    const declineBody = {
      declined_reason: "Wrong color",
    }

    const { result, waitFor } = renderHook(
      () => useDeclineOrderEdit("test-cart"),
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
