import { MedusaError } from "@medusajs/utils"
import { searchEntityWithGraphFallback } from "../search-entity-with-graph-fallback"

const GRAPH_ROWS = [{ id: "prod_graph" }]
const SEARCH_ROWS = [{ id: "prod_search" }]

type Args = {
  filters?: Record<string, unknown>
  withDeleted?: boolean
  registered?: boolean
  searchError?: unknown
}

const logger = { debug: jest.fn(), warn: jest.fn() }

function setup({
  filters = { q: "shirt" },
  withDeleted,
  registered = true,
  searchError,
}: Args = {}) {
  const graph = jest.fn().mockResolvedValue({
    data: GRAPH_ROWS,
    metadata: { count: 1, skip: 0, take: 50 },
  })

  const search = jest.fn(() =>
    searchError
      ? Promise.reject(searchError)
      : Promise.resolve({
          data: SEARCH_ROWS,
          search_result: { metadata: { count: 7, skip: 0, take: 50 } },
        })
  )

  const translateGraphFilters = jest.fn((_index, given) => given)

  const scope = {
    resolve: (key: string) => {
      if (key === "logger") {
        return logger
      }
      if (key === "query") {
        return { graph, search }
      }
      return registered ? { translateGraphFilters } : undefined
    },
  } as any

  const run = () =>
    searchEntityWithGraphFallback({
      entity: "product",
      scope,
      fields: ["id"],
      filters,
      pagination: { skip: 0, take: 50 },
      withDeleted,
    })

  return { run, graph, search, translateGraphFilters }
}

beforeEach(() => {
  logger.debug.mockClear()
  logger.warn.mockClear()
})

describe("searchEntityWithGraphFallback", () => {
  it("returns the engine's result in the shared shape", async () => {
    const { run, search, graph } = setup()

    await expect(run()).resolves.toEqual({
      entity: "product",
      data: SEARCH_ROWS,
      count: 7,
      offset: 0,
      limit: 50,
    })
    expect(search).toHaveBeenCalledTimes(1)
    expect(graph).not.toHaveBeenCalled()
  })

  it("returns the database's result in the same shape", async () => {
    const { run, graph } = setup({ filters: {} })

    await expect(run()).resolves.toEqual({
      entity: "product",
      data: GRAPH_ROWS,
      count: 1,
      offset: 0,
      limit: 50,
    })
    expect(graph).toHaveBeenCalledTimes(1)
  })

  it("translates the filters before searching", async () => {
    const { run, translateGraphFilters } = setup({
      filters: { q: "shirt", variants: { sku: "A" } },
    })

    await run()

    expect(translateGraphFilters).toHaveBeenCalledWith("product", {
      q: "shirt",
      variants: { sku: "A" },
    })
  })

  it("skips the engine without a q", async () => {
    const { run, search } = setup({ filters: { status: "published" } })

    await run()

    expect(search).not.toHaveBeenCalled()
  })

  it("skips the engine for soft-deleted rows", async () => {
    const { run, search } = setup({ withDeleted: true })

    await run()

    expect(search).not.toHaveBeenCalled()
  })

  it("skips the engine when the module is not registered", async () => {
    const { run, search, graph } = setup({ registered: false })

    await run()

    expect(search).not.toHaveBeenCalled()
    expect(graph).toHaveBeenCalledTimes(1)
  })

  // An index the module does not hold is not checked up front — translating its
  // filters is what raises it, from inside the same try the search runs in.
  it("falls back when the index is not registered, logging at debug", async () => {
    const { run, translateGraphFilters, search, graph } = setup()

    translateGraphFilters.mockImplementation(() => {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `No search index registered for "product"`
      )
    })

    await expect(run()).resolves.toMatchObject({ data: GRAPH_ROWS })

    expect(search).not.toHaveBeenCalled()
    expect(graph).toHaveBeenCalledTimes(1)
    expect(logger.debug).toHaveBeenCalledTimes(1)
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("falls back when the engine declines the query, logging at debug", async () => {
    const declined = new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Unknown field collection_id"
    )
    const { run, graph } = setup({ searchError: declined })

    await expect(run()).resolves.toMatchObject({ data: GRAPH_ROWS })
    expect(graph).toHaveBeenCalledTimes(1)
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining("Unknown field collection_id")
    )
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("falls back on an unexpected failure, but logs it at warn", async () => {
    // An engine that cannot be reached is not a capability mismatch, and must
    // not be lost in debug output.
    const { run, graph } = setup({ searchError: new Error("ECONNREFUSED") })

    await expect(run()).resolves.toMatchObject({ data: GRAPH_ROWS })
    expect(graph).toHaveBeenCalledTimes(1)
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("ECONNREFUSED")
    )
    expect(logger.debug).not.toHaveBeenCalled()
  })
})
