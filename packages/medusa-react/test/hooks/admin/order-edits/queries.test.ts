import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminOrderEdit, useAdminOrderEdits } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminOrderEdit hook", () => {
  test("returns an order edit", async () => {
    const order_edit = fixtures.get("order_edit")
    const { result, waitFor } = renderHook(
      () => useAdminOrderEdit(order_edit.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.order_edit).toEqual(order_edit)
  })
})

describe("useAdminOrderEdits hook", () => {
  test("returns an order edit", async () => {
    const order_edit = fixtures.get("order_edit")
    const { result, waitFor } = renderHook(() => useAdminOrderEdits(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.order_edits).toEqual(
      expect.arrayContaining([order_edit])
    )
  })
})
