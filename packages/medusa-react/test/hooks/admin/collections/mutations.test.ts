import {
  useAdminCreateCollection,
  useAdminUpdateCollection,
  useAdminDeleteCollection,
  useAdminAddProductsToCollection,
  useAdminRemoveProductsFromCollection,
} from "../../../../src/"
import { renderHook } from "@testing-library/react-hooks"
import { fixtures } from "../../../../mocks/data"
import { createWrapper } from "../../../utils"

describe("useAdminCreateCollection hook", () => {
  test("creates a collection and returns it", async () => {
    const collection = {
      title: "test_collection",
    }

    const { result, waitFor } = renderHook(() => useAdminCreateCollection(), {
      wrapper: createWrapper(),
    })

    result.current.mutate(collection)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.collection).toEqual(
      expect.objectContaining({
        ...fixtures.get("product_collection"),
        ...collection,
      })
    )
  })
})

describe("useAdminUpdateCollection hook", () => {
  test("updates a collection and returns it", async () => {
    const collection = {
      title: "update_collection",
    }

    const { result, waitFor } = renderHook(
      () => useAdminUpdateCollection(fixtures.get("product_collection").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(collection)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data.collection).toEqual(
      expect.objectContaining({
        ...fixtures.get("product_collection"),
        ...collection,
      })
    )
  })
})

describe("useAdminDeleteCollection hook", () => {
  test("deletes a collection", async () => {
    const { result, waitFor } = renderHook(
      () => useAdminDeleteCollection(fixtures.get("product_collection").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate()

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: fixtures.get("product_collection").id,
        deleted: true,
      })
    )
  })
})

describe("useAdminAddProductsToCollection hook", () => {
  test("add products to a collection", async () => {
    const update = {
      product_ids: [fixtures.get("product").id],
    }

    const { result, waitFor } = renderHook(
      () => useAdminAddProductsToCollection(fixtures.get("product_collection").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(update)

    await waitFor(() => result.current.isSuccess)
    expect(result.current.data?.response.status).toEqual(200)
    expect(result.current.data?.collection).toEqual(
      expect.objectContaining({
        ...fixtures.get("product_collection"),
        products: [fixtures.get("product")],
      })
    )
  })
})

describe("useAdminRemoveProductsFromCollection hook", () => {
  test("remove products from a collection", async () => {
    const remove = {
      product_ids: [fixtures.get("product").id],
    }

    const { result, waitFor } = renderHook(
      () => useAdminRemoveProductsFromCollection(fixtures.get("product_collection").id),
      {
        wrapper: createWrapper(),
      }
    )

    result.current.mutate(remove)

    await waitFor(() => result.current.isSuccess)

    expect(result.current.data?.response.status).toEqual(200)
    expect(result.current.data).toEqual(
      expect.objectContaining({
        id: fixtures.get("product_collection").id,
        object: "product-collection",
        removed_products: remove.product_ids
      })
    )
  })
})
