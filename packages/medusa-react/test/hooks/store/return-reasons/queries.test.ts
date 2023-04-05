import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useReturnReason, useReturnReasons } from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useReturnReasons hook", () => {
  test("returns a list of return reasons", async () => {
    const return_reasons = fixtures.list("return_reason")
    const { result, waitFor } = renderHook(() => useReturnReasons(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.return_reasons).toEqual(return_reasons)
  })
})

describe("useReturnReason hook", () => {
  test("returns a return reason", async () => {
    const return_reason = fixtures.get("return_reason")
    const { result, waitFor } = renderHook(
      () => useReturnReason(return_reason.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.return_reason).toEqual(return_reason)
  })
})
