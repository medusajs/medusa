import { useAdminProductCategory, useAdminProductCategories } from "../../../../src"
import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminProductCategories hook", () => {
  test("returns a list of categories", async () => {
    const categories = fixtures.list("product_category")

    const { result, waitFor } = renderHook(() => useAdminProductCategories(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.product_categories).toEqual(categories)
  })
})

describe("useAdminProductCategory hook", () => {
  test("returns a category", async () => {
    const category = fixtures.get("product_category")

    const { result, waitFor } = renderHook(
      () => useAdminProductCategory(category.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.product_category).toEqual(category)
  })
})
