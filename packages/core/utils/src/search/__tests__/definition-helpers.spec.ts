import { graphConsume, graphSeed } from "../definition-helpers"
import { search } from "../model"

const fields = search.define({
  id: search.keyword().filterable(),
  title: search.text().searchable(),
})

const index = {
  name: "product",
  entity: "product",
  primary_key: "id",
} as any

function createContext(graph: jest.Mock, extra: Record<string, any> = {}) {
  return {
    container: { query: { graph } as any },
    index,
    ...extra,
  } as any
}

async function collect<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const batches: T[] = []
  for await (const batch of iterable) {
    batches.push(batch)
  }
  return batches
}

describe("graphSeed", () => {
  it("pages with a keyset cursor and stops on a short page", async () => {
    const graph = jest
      .fn()
      .mockResolvedValueOnce({
        data: [
          { id: "prod_1", title: "One" },
          { id: "prod_2", title: "Two" },
        ],
      })
      .mockResolvedValueOnce({ data: [{ id: "prod_3", title: "Three" }] })

    const seed = graphSeed<typeof fields>({
      fields: ["id", "title"],
      batch_size: 2,
    })

    const batches = await collect(seed(createContext(graph)))

    expect(batches).toEqual([
      [
        {
          action: "upsert",
          documents: [
            { id: "prod_1", title: "One" },
            { id: "prod_2", title: "Two" },
          ],
        },
      ],
      [{ action: "upsert", documents: [{ id: "prod_3", title: "Three" }] }],
    ])

    expect(graph).toHaveBeenCalledTimes(2)
    expect(graph.mock.calls[0][0]).toEqual({
      entity: "product",
      fields: ["id", "title"],
      filters: {},
      pagination: { take: 2, order: { id: "ASC" } },
      withDeleted: false,
    })
    // The second page starts after the last row of the first one.
    expect(graph.mock.calls[1][0].filters).toEqual({ id: { $gt: "prod_2" } })
  })

  it("resumes from the context's last_key", async () => {
    const graph = jest.fn().mockResolvedValue({ data: [] })

    const seed = graphSeed<typeof fields>({ fields: ["id", "title"] })
    await collect(seed(createContext(graph, { last_key: "prod_9" })))

    expect(graph.mock.calls[0][0].filters).toEqual({ id: { $gt: "prod_9" } })
  })

  it("merges the source's filters with the reindex filters", async () => {
    const graph = jest.fn().mockResolvedValue({ data: [] })

    const seed = graphSeed<typeof fields>({
      fields: ["id", "title"],
      filters: { status: "published" },
    })
    await collect(
      seed(createContext(graph, { filters: { collection_id: "pcol_1" } }))
    )

    expect(graph.mock.calls[0][0].filters).toEqual({
      status: "published",
      collection_id: "pcol_1",
    })
  })

  it("deletes soft-deleted and rejected rows on the catch-up pass", async () => {
    const since = new Date("2026-01-01")
    const graph = jest.fn().mockResolvedValue({
      data: [
        { id: "prod_1", title: "One", deleted_at: null },
        { id: "prod_2", title: "Two", deleted_at: new Date() },
        { id: "prod_3", title: "", deleted_at: null },
      ],
    })

    const seed = graphSeed<typeof fields>({
      fields: ["id", "title"],
      // A row that no longer qualifies has to leave the index.
      transform: (row) => (row.title ? { id: row.id, title: row.title } : null),
    })

    const batches = await collect(
      seed(createContext(graph, { catchup: { since } }))
    )

    expect(graph.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        fields: ["id", "title", "deleted_at"],
        filters: { updated_at: { $gte: since } },
        withDeleted: true,
      })
    )
    expect(batches[0]).toEqual([
      { action: "upsert", documents: [{ id: "prod_1", title: "One" }] },
      { action: "delete", filters: { id: ["prod_2", "prod_3"] } },
    ])
  })

  it("skips rejected rows without deleting on a full seed", async () => {
    const graph = jest.fn().mockResolvedValue({
      data: [
        { id: "prod_1", title: "One" },
        { id: "prod_2", title: "" },
      ],
    })

    const seed = graphSeed<typeof fields>({
      fields: ["id", "title"],
      transform: (row) => (row.title ? { id: row.id, title: row.title } : null),
    })

    const batches = await collect(seed(createContext(graph)))

    expect(batches).toEqual([
      [{ action: "upsert", documents: [{ id: "prod_1", title: "One" }] }],
    ])
  })

  it("yields nothing for an empty page", async () => {
    const graph = jest.fn().mockResolvedValue({ data: [] })

    const seed = graphSeed<typeof fields>({ fields: ["id", "title"] })

    expect(await collect(seed(createContext(graph)))).toEqual([])
  })
})

describe("graphConsume", () => {
  it("reads the event's ids back and upserts them", async () => {
    const graph = jest
      .fn()
      .mockResolvedValue({ data: [{ id: "prod_1", title: "One" }] })

    const consume = graphConsume<typeof fields>({ fields: ["id", "title"] })
    const mutations = await consume(
      { name: "product.updated", data: { id: "prod_1" } } as any,
      createContext(graph)
    )

    expect(graph).toHaveBeenCalledWith({
      entity: "product",
      fields: ["id", "title"],
      filters: { id: ["prod_1"] },
    })
    expect(mutations).toEqual([
      { action: "upsert", documents: [{ id: "prod_1", title: "One" }] },
    ])
  })

  it("deletes by id without reading back on a deletion event", async () => {
    const graph = jest.fn()

    const consume = graphConsume<typeof fields>({ fields: ["id", "title"] })
    const mutations = await consume(
      { name: "product.deleted", data: { id: ["prod_1", "prod_2"] } } as any,
      createContext(graph)
    )

    expect(graph).not.toHaveBeenCalled()
    expect(mutations).toEqual([
      { action: "delete", filters: { id: ["prod_1", "prod_2"] } },
    ])
  })

  it("deletes ids the read back doesn't return or the transform rejects", async () => {
    const graph = jest.fn().mockResolvedValue({
      data: [
        { id: "prod_1", title: "One" },
        { id: "prod_2", title: "" },
      ],
    })

    const consume = graphConsume<typeof fields>({
      fields: ["id", "title"],
      filters: { status: "published" },
      transform: (row) => (row.title ? { id: row.id, title: row.title } : null),
    })
    const mutations = await consume(
      {
        name: "product.updated",
        data: { id: ["prod_1", "prod_2", "prod_3"] },
      } as any,
      createContext(graph)
    )

    expect(graph.mock.calls[0][0].filters).toEqual({
      status: "published",
      id: ["prod_1", "prod_2", "prod_3"],
    })
    expect(mutations).toEqual([
      { action: "upsert", documents: [{ id: "prod_1", title: "One" }] },
      // prod_2 stopped qualifying, prod_3 was never returned.
      { action: "delete", filters: { id: ["prod_2", "prod_3"] } },
    ])
  })

  it("ignores an event carrying no id", async () => {
    const graph = jest.fn()

    const consume = graphConsume<typeof fields>({ fields: ["id", "title"] })

    expect(
      await consume(
        { name: "product.updated", data: {} } as any,
        createContext(graph)
      )
    ).toEqual([])
    expect(graph).not.toHaveBeenCalled()
  })
})
