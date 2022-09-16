import {
  useAdminCreateOrderEdit,
  useAdminDeleteOrderEdit,
} from "../../../../src/"
import { renderHook } from "@testing-library/react-hooks"
import { createWrapper } from "../../../utils"
import { fixtures } from "../../../../mocks/data"

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

describe("useAdminCreateOrderEdit hook", () => {
  test("Created an order edit", async () => {
    const { result, waitFor } = renderHook(() => useAdminCreateOrderEdit(), {
      wrapper: createWrapper(),
    })

    const payload = {
      order_id: "ord_1",
      internal_note: "This is an internal note",
    }

    result.current.mutate(payload)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        order_edit: {
          ...fixtures.get("order_edit"),
          ...payload,
        },
      })
    )
  })
})
