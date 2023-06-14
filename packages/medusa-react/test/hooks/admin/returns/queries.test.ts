import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminReturns } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminReturns hook", () => {
  test("returns a list of returns", async () => {
    const returns = fixtures.list("return")
    const { result, waitFor } = renderHook(() => useAdminReturns(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.returns).toEqual(returns)
  })
})
