import { useAdminVariants } from "../../../../src"
import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminVariants hook", () => {
  test("returns a list of variants", async () => {
    const variants = fixtures.list("product_variant")
    const { result, waitFor } = renderHook(() => useAdminVariants(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.variants).toEqual(variants)
  })
})
