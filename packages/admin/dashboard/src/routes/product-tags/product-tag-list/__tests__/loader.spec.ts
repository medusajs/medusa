import { LoaderFunctionArgs } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { productTagListLoader } from "../loader"

const { list } = vi.hoisted(() => ({ list: vi.fn() }))

vi.mock("../../../../hooks/api", () => ({
  productTagsQueryKeys: {
    list: (query?: object) => ["product_tags", "list", query],
  },
}))

vi.mock("../../../../lib/client", () => ({
  sdk: { admin: { productTag: { list } } },
}))

vi.mock("../../../../lib/query-client", () => ({
  queryClient: {
    getQueryData: () => undefined,
    fetchQuery: ({ queryFn }: { queryFn: () => unknown }) => queryFn(),
  },
}))

const loadProductTags = (url: string) =>
  productTagListLoader({ request: new Request(url) } as LoaderFunctionArgs)

describe("productTagListLoader", () => {
  beforeEach(() => {
    list.mockReset()
    list.mockResolvedValue({ product_tags: [], count: 0 })
  })

  it("strips the table's query prefix from the search params", async () => {
    await loadProductTags(
      "http://localhost/settings/product-tags?ptag_order=created_at"
    )

    expect(list).toHaveBeenCalledWith({ order: "created_at" })
  })

  it("parses prefixed filter values", async () => {
    const created_at = { $gte: "2026-01-01" }

    await loadProductTags(
      `http://localhost/settings/product-tags?ptag_created_at=${encodeURIComponent(
        JSON.stringify(created_at)
      )}`
    )

    expect(list).toHaveBeenCalledWith({ created_at })
  })

  it("leaves unprefixed search params untouched", async () => {
    await loadProductTags("http://localhost/settings/product-tags?order=value")

    expect(list).toHaveBeenCalledWith({ order: "value" })
  })
})
