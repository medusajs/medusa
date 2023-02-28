import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminCurrencies } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminCurrencies hook", () => {
  test("returns a list of currencies", async () => {
    const currencies = fixtures.list("currency", 1)
    const { result, waitFor } = renderHook(() => useAdminCurrencies(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response?.status).toEqual(200)
    expect(result.current.currencies).toEqual(currencies)
  })
})
