import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminReturnReason, useAdminReturnReasons } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminReturnReasons hook", () => {
  test("returns a list of return reasons", async () => {
    const returnReasons = fixtures.list("return_reason")
    const { result, waitFor } = renderHook(() => useAdminReturnReasons(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.return_reasons).toEqual(returnReasons)
  })
})

describe("useAdminReturnReason hook", () => {
  test("returns a return reason", async () => {
    const returnReason = fixtures.get("return_reason")
    const { result, waitFor } = renderHook(
      () => useAdminReturnReason(returnReason.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.return_reason).toEqual(returnReason)
  })
})
