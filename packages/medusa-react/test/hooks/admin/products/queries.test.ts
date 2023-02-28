import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminProduct,
  useAdminProducts,
  useAdminProductTagUsage,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminProducts hook", () => {
  test("returns a list of products", async () => {
    const products = fixtures.list("product")
    const { result, waitFor } = renderHook(() => useAdminProducts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.products).toEqual(products)
  })
})

describe("useAdminProductTagUsage hook", () => {
  test("returns a list of product tags", async () => {
    const tags = fixtures.list("product_tag")
    const { result, waitFor } = renderHook(() => useAdminProductTagUsage(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.tags).toEqual(tags)
  })
})

describe("useAdminProduct hook", () => {
  test("returns a product", async () => {
    const product = fixtures.get("product")
    const { result, waitFor } = renderHook(() => useAdminProduct(product.id), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.product).toEqual(product)
  })
})
