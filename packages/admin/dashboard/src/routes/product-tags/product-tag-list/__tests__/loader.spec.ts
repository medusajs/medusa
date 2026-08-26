import { beforeEach, describe, expect, it, vi } from "vitest"

const { listMock, getQueryDataMock, fetchQueryMock } = vi.hoisted(() => ({
  listMock: vi.fn(),
  getQueryDataMock: vi.fn(),
  fetchQueryMock: vi.fn(),
}))

vi.mock("../../../../lib/client", () => ({
  sdk: {
    admin: {
      productTag: {
        list: listMock,
      },
    },
  },
}))

vi.mock("../../../../lib/query-client", () => ({
  queryClient: {
    getQueryData: getQueryDataMock,
    fetchQuery: fetchQueryMock,
  },
}))

vi.mock("../../../../hooks/api", () => ({
  productTagsQueryKeys: {
    list: (query?: unknown) => ["product_tags", "list", { query }],
  },
}))

import { productTagListLoader } from "../loader"

const load = (search: string) =>
  productTagListLoader({
    request: new Request(`http://localhost/app/product-tags${search}`),
    params: {},
    context: {} as never,
  } as never)

/** The query object the loader handed to `sdk.admin.productTag.list`. */
const forwardedQuery = () => listMock.mock.calls[0][0]

describe("productTagListLoader", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    listMock.mockResolvedValue({ product_tags: [], count: 0 })
    getQueryDataMock.mockReturnValue(undefined)
    // The real client runs the query function; the cache itself is not under test.
    fetchQueryMock.mockImplementation((query: { queryFn: () => unknown }) =>
      query.queryFn()
    )
  })

  it("drops prefixed UI params that the endpoint would reject", async () => {
    await load("?offset=0&limit=20&ptag_order=created_at&ptag_q=shoes")

    expect(listMock).toHaveBeenCalledTimes(1)
    expect(forwardedQuery()).toEqual({ offset: 0, limit: 20 })
    expect(Object.keys(forwardedQuery())).not.toContain("ptag_order")
    expect(Object.keys(forwardedQuery())).not.toContain("ptag_q")
  })

  it("forwards the params the endpoint declares", async () => {
    await load("?q=shoes&order=-created_at&offset=20&limit=50")

    expect(forwardedQuery()).toEqual({
      q: "shoes",
      order: "-created_at",
      offset: 20,
      limit: 50,
    })
  })

  it("deserializes JSON-encoded filter values", async () => {
    const created_at = encodeURIComponent('{"$gte":"2026-01-01T00:00:00.000Z"}')
    await load(`?created_at=${created_at}`)

    expect(forwardedQuery()).toEqual({
      created_at: { $gte: "2026-01-01T00:00:00.000Z" },
    })
  })

  it("keeps values that are not valid JSON as strings", async () => {
    await load("?q=shoes")

    expect(forwardedQuery()).toEqual({ q: "shoes" })
  })

  it("keys the query on the filtered params, not the raw URL", async () => {
    await load("?limit=20&ptag_order=created_at")

    expect(fetchQueryMock.mock.calls[0][0].queryKey).toEqual([
      "product_tags",
      "list",
      { query: { limit: 20 } },
    ])
  })

  it("serves cached data without calling the API", async () => {
    getQueryDataMock.mockReturnValue({ product_tags: [{ id: "ptag_1" }] })

    const result = await load("?limit=20")

    expect(result).toEqual({ product_tags: [{ id: "ptag_1" }] })
    expect(fetchQueryMock).not.toHaveBeenCalled()
    expect(listMock).not.toHaveBeenCalled()
  })
})
