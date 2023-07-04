import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data/index"
import { useProductTags } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useProductTags hook", () => {
  test("gets a list of products", async () => {
    const { result, waitFor } = renderHook(() => useProductTags(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.product_tags).toEqual(
      fixtures.list("product_tag", 10)
    )
  })
})
