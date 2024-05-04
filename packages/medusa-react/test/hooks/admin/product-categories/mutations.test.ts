import { renderHook } from "@testing-library/react-hooks/dom"

import { fixtures } from "../../../../mocks/data"
import {
  useAdminAddProductsToCategory,
  useAdminCreateProductCategory,
  useAdminDeleteProductCategory,
  useAdminDeleteProductsFromCategory,
  useAdminUpdateProductCategory,
} from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminCreateProductCategory hook", () => {
  test("creates a product category", async () => {
    const category = {
      name: "Jeans category",
    }

    const { result, waitFor } = renderHook(
      () => useAdminCreateProductCategory(),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(category)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.product_category).toEqual(
      expect.objectContaining({
        ...fixtures.get("product_category"),
        ...category,
      })
    )
  })
})

describe("useAdminUpdateProductCategory hook", () => {
  test("updates a product category", async () => {
    const category = {
      name: "Updated name",
    }

    const categoryId = fixtures.get("product_category").id

    const { result, waitFor } = renderHook(
      () => useAdminUpdateProductCategory(categoryId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(category)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.product_category).toEqual({
      ...fixtures.get("product_category"),
      ...category,
    })
  })
})

describe("useAdminDeleteProductCategory hook", () => {
  test("deletes a product category", async () => {
    const id = fixtures.get("product_category").id

    const { result, waitFor } = renderHook(
      () => useAdminDeleteProductCategory(id),
      { wrapper: createWrapper() }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data).toEqual(
      expect.objectContaining({
        id,
        object: "product-category",
        deleted: true,
      })
    )
  })
})

describe("useAdminAddProductsToCategory hook", () => {
  test("add products to a product category", async () => {
    const id = fixtures.get("product_category").id
    const productId = fixtures.get("product").id

    const { result, waitFor } = renderHook(
      () => useAdminAddProductsToCategory(id),
      { wrapper: createWrapper() }
    )

    result.current.mutate({ product_ids: [{ id: productId }] })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data).toEqual(
      expect.objectContaining({
        product_category: fixtures.get("product_category"),
      })
    )
  })
})

describe("useAdminDeleteProductsFromCategory hook", () => {
  test("remove products from a product category", async () => {
    const id = fixtures.get("product_category").id
    const productId = fixtures.get("product").id

    const { result, waitFor } = renderHook(
      () => useAdminDeleteProductsFromCategory(id),
      { wrapper: createWrapper() }
    )

    result.current.mutate({ product_ids: [{ id: productId }] })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data).toEqual(
      expect.objectContaining({
        product_category: fixtures.get("product_category"),
      })
    )
  })
})
