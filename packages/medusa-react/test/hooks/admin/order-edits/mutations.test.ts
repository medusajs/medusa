import { useAdminDeleteOrderEdit } from "../../../../src/"
import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminDelete hook", () => {
  test("Deletes an order edit", async () => {
    const id = "oe_1"
    const { result, waitFor } = renderHook(() => useAdminDeleteOrderEdit(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id,
        object: "order_edit",
        deleted: true,
      })
    )
  })
})
