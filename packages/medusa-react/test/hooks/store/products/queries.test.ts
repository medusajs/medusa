import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data/index"
import { useProduct, useProducts } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useProducts hook", () => {
  test("gets a list of products", async () => {
    const { result, waitFor } = renderHook(() => useProducts(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.products).toEqual(fixtures.list("product"))
  })

  test("gets a list of products based on limit and offset", async () => {
    const { result, waitFor } = renderHook(
      () =>
        useProducts({
          limit: 2,
          offset: 5,
        }),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.products).toEqual(fixtures.list("product"))
    expect(result.current.limit).toEqual(2)
    expect(result.current.offset).toEqual(5)
  })
})

describe("useProducts hook", () => {
  test("success", async () => {
    const { result, waitFor } = renderHook(
      () => useProduct("prod_01F0YESHQ27Y31CAMD0NV6W9YP"),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.product).toEqual(fixtures.get("product"))
  })
})
