import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import {
  useAdminCreateProduct,
  useAdminCreateProductOption,
  useAdminDeleteProduct,
  useAdminDeleteProductOption,
  useAdminUpdateProduct,
  useAdminUpdateProductOption,
} from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useAdminCreateProduct hook", () => {
  test("creates a product and returns it", async () => {
    const product = {
      title: "test-product",
      is_giftcard: false,
      discountable: false,
    }

    const { result, waitFor } = renderHook(() => useAdminCreateProduct(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(product)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.product).toEqual(
      expect.objectContaining({
        ...fixtures.get("product"),
        ...product,
      })
    )
  })
})

describe("useAdminUpdateProduct hook", () => {
  test("updates a product and returns it", async () => {
    const id = fixtures.get("product").id
    const product = {
      title: "test-product-1",
      images: [],
    }

    const { result, waitFor } = renderHook(() => useAdminUpdateProduct(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate(product)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.product).toEqual(
      expect.objectContaining({
        ...fixtures.get("product"),
        ...product,
      })
    )
  })
})

describe("useAdminDeleteProduct hook", () => {
  test("deletes a product", async () => {
    const id = fixtures.get("product").id

    const { result, waitFor } = renderHook(() => useAdminDeleteProduct(id), {
      wrapper: createWrapper(),
    })

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id,
        deleted: true,
      })
    )
  })
})

describe("useAdminCreateProductOption hook", () => {
  test("creates a product option", async () => {
    const productId = fixtures.get("product").id

    const { result, waitFor } = renderHook(
      () => useAdminCreateProductOption(productId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      title: "color",
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.product).toEqual(fixtures.get("product"))
  })
})

describe("useAdminUpdateProductOption hook", () => {
  test("updates a product option", async () => {
    const productId = fixtures.get("product").id

    const { result, waitFor } = renderHook(
      () => useAdminUpdateProductOption(productId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate({
      title: "size",
      option_id: "test-option",
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.product).toEqual(fixtures.get("product"))
  })
})

describe("useAdminDeleteProductOption hook", () => {
  test("deletes a product option", async () => {
    const productId = fixtures.get("product").id

    const { result, waitFor } = renderHook(
      () => useAdminDeleteProductOption(productId),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate("test-option")

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        option_id: "test-option",
        deleted: true,
      })
    )
  })
})
