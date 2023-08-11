import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminUpdateCurrency } from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminUpdateCurrency hook", () => {
  test("updates a currency and returns it", async () => {
    const update = {
      includes_tax: true,
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateCurrency(fixtures.get("currency").code),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(update)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data?.response.status).toEqual(200)
    expect(result.current.data?.currency).toEqual(
      expect.objectContaining({
        ...fixtures.get("currency"),
        ...update,
      })
    )
  })
})
