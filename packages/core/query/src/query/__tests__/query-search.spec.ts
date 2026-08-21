import { MedusaContainer } from "@medusajs/types"
import { Query } from "../query"

// `title` lives on the index; `description` and `variants.sku` do not, so they
// have to be fetched through graph.
const RETRIEVABLE = ["id", "title", "min_price"]

function createSearchModule(
  hits: { id: string; document: any }[],
  index: { primary_key?: string; retrievable?: string[] } = {}
) {
  return {
    listRetrievableFields: jest
      .fn()
      .mockReturnValue(index.retrievable ?? RETRIEVABLE),
    getIndex: jest
      .fn()
      .mockReturnValue({ primary_key: index.primary_key ?? "id" }),
    search: jest.fn().mockResolvedValue({
      hits,
      metadata: { skip: 0, take: 20, count: hits.length },
    }),
  }
}

function createQueryInstance(searchModule?: any) {
  const query = new Query({
    remoteJoiner: { query: jest.fn().mockResolvedValue([]) } as any,
    joinerConfigs: [],
    indexModule: null as any,
    searchModule,
    container: { resolve: jest.fn() } as unknown as MedusaContainer,
  })

  const graph = jest
    .spyOn(query, "graph")
    .mockResolvedValue({ data: [] } as any)

  return { query, graph }
}

describe("Query.search", () => {
  it("throws when the search module is not loaded", async () => {
    const { query } = createQueryInstance(undefined)

    await expect(
      query.search({ entity: "product", fields: ["id"] })
    ).rejects.toThrow("Search module is not loaded.")
  })

  it("returns the engine's documents when nothing needs expanding", async () => {
    const searchModule = createSearchModule([
      { id: "prod_1", document: { id: "prod_1", title: "Red shoe" } },
    ])
    const { query, graph } = createQueryInstance(searchModule)

    const result = await query.search({
      entity: "product",
      fields: ["id", "title"],
      filters: { q: "shoe" },
    })

    expect(searchModule.search).toHaveBeenCalledWith(
      expect.objectContaining({
        entity: "product",
        fields: ["id", "title"],
        filters: { q: "shoe" },
      })
    )
    expect(graph).not.toHaveBeenCalled()
    expect(result.data).toEqual([{ id: "prod_1", title: "Red shoe" }])
  })

  it("defaults the requested fields to what the index can return", async () => {
    const searchModule = createSearchModule([
      { id: "prod_1", document: { id: "prod_1", title: "Red shoe" } },
    ])
    const { query, graph } = createQueryInstance(searchModule)

    await query.search({ entity: "product" })

    // Nothing was asked for, so everything the engine holds comes back and
    // there is nothing left over for graph.
    expect(searchModule.search).toHaveBeenCalledWith(
      expect.objectContaining({ fields: RETRIEVABLE })
    )
    expect(graph).not.toHaveBeenCalled()
  })

  it("splits the requested fields between the engine and graph", async () => {
    const searchModule = createSearchModule([
      { id: "prod_1", document: { id: "prod_1", title: "Red shoe" } },
    ])
    const { query, graph } = createQueryInstance(searchModule)

    await query.search({
      entity: "product",
      fields: ["id", "title", "description", "variants.sku"],
    })

    // Only what the index holds goes to the engine...
    expect(searchModule.search).toHaveBeenCalledWith(
      expect.objectContaining({ fields: ["id", "title"] })
    )

    // ...and the rest is fetched by id. The primary key rides along even though
    // the engine already returned it: without it the fetched rows cannot be
    // merged back onto the documents they belong to.
    expect(graph).toHaveBeenCalledWith(
      expect.objectContaining({
        entity: "product",
        fields: ["description", "variants.sku", "id"],
        filters: { id: ["prod_1"] },
      }),
      expect.anything()
    )
  })

  it("hydrates on the index' own primary key", async () => {
    // An index keyed by handle identifies its hits by handle, so that is what
    // the hydration has to filter and select.
    const searchModule = createSearchModule(
      [
        {
          id: "red-shoe",
          document: { handle: "red-shoe", title: "Red shoe" },
        },
      ],
      { primary_key: "handle", retrievable: ["handle", "title"] }
    )
    const { query, graph } = createQueryInstance(searchModule)

    await query.search({
      entity: "product",
      fields: ["handle", "title", "description"],
    })

    expect(graph).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: ["description", "handle"],
        filters: { handle: ["red-shoe"] },
      }),
      expect.anything()
    )
  })

  it("hands the engine's documents to graph so they merge and keep order", async () => {
    const hits = [
      { id: "prod_2", document: { id: "prod_2", title: "Blue shirt" } },
      { id: "prod_1", document: { id: "prod_1", title: "Red shoe" } },
    ]
    const searchModule = createSearchModule(hits)
    const { query, graph } = createQueryInstance(searchModule)

    graph.mockResolvedValue({
      data: [
        { id: "prod_2", title: "Blue shirt", description: "b" },
        { id: "prod_1", title: "Red shoe", description: "a" },
      ],
    } as any)

    const result = await query.search({
      entity: "product",
      fields: ["id", "title", "description"],
    })

    const [, graphOptions] = graph.mock.calls[0]
    expect(graphOptions).toMatchObject({
      initialData: [
        { id: "prod_2", title: "Blue shirt" },
        { id: "prod_1", title: "Red shoe" },
      ],
    })

    // Relevance order survives the expand.
    expect(result.data.map((row: any) => row.id)).toEqual(["prod_2", "prod_1"])
  })

  it("skips the expand when the search found nothing", async () => {
    const searchModule = createSearchModule([])
    const { query, graph } = createQueryInstance(searchModule)

    const result = await query.search({
      entity: "product",
      fields: ["id", "description"],
    })

    expect(graph).not.toHaveBeenCalled()
    expect(result.data).toEqual([])
  })

  it("returns the engine's own result alongside the data", async () => {
    const searchModule = createSearchModule([
      { id: "prod_1", document: { id: "prod_1" } },
    ])
    searchModule.search.mockResolvedValue({
      hits: [{ id: "prod_1", document: { id: "prod_1" }, score: 1.5 }],
      facets: {
        brand: { type: "value", values: [{ value: "acme", count: 1 }] },
      },
      metadata: { skip: 0, take: 20, count: 1 },
    })

    const { query } = createQueryInstance(searchModule)

    const result = await query.search({ entity: "product", fields: ["id"] })

    expect(result.search_result).toMatchObject({
      hits: [{ id: "prod_1", score: 1.5 }],
      facets: { brand: { type: "value" } },
      metadata: { count: 1 },
    })
  })

  it("passes filters, pagination and search options through untouched", async () => {
    const searchModule = createSearchModule([])
    const { query } = createQueryInstance(searchModule)

    await query.search({
      entity: "product",
      fields: ["id"],
      filters: { q: "shoe", status: "published" },
      pagination: { skip: 10, take: 5, order: { min_price: "DESC" } },
      search_options: { facets: ["brand"], include_score: true },
    })

    expect(searchModule.search).toHaveBeenCalledWith({
      entity: "product",
      fields: ["id"],
      filters: { q: "shoe", status: "published" },
      pagination: { skip: 10, take: 5, order: { min_price: "DESC" } },
      search_options: { facets: ["brand"], include_score: true },
    })
  })
})
