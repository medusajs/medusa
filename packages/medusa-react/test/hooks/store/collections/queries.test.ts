import { renderHook } from "@testing-library/react-hooks/dom"
import { fixtures } from "../../../../mocks/data"
import { useCollection, useCollections } from "../../../../src/"
import { createWrapper } from "../../../utils"

describe("useCollections hook", () => {
  test("returns a list of collections", async () => {
    const collections = fixtures.list("product_collection")
    const { result, waitFor } = renderHook(() => useCollections(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.collections).toEqual(collections)
  })
})

describe("useCollection hook", () => {
  test("returns a collection", async () => {
    const collection = fixtures.get("product_collection")
    const { result, waitFor } = renderHook(() => useCollection(collection.id), {
      wrapper: createWrapper(),
    })

    await waitFor(() => result.current.isSuccess)

    expect(result.current.response.status).toEqual(200)
    expect(result.current.collection).toEqual(collection)
  })
})
