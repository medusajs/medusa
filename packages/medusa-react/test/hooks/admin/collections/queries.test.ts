import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useAdminCollection, useAdminCollections } from "../../../../src"
import { createWrapper } from "../../../utils"

describe("useAdminCollections hook", () => {
  test("returns a list of collections", async () => {
    const collections = fixtures.list("product_collection")
    const { result, waitFor } = renderHook(() => useAdminCollections(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.collections).toEqual(collections)
  })
})

describe("useAdminCollection hook", () => {
  test("returns a collection", async () => {
    const collection = fixtures.get("product_collection")
    const { result, waitFor } = renderHook(
      () => useAdminCollection(collection.id),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.collection).toEqual(collection)
  })
})
