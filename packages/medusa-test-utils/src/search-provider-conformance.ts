import { SearchTypes } from "@medusajs/framework/types"

export interface SearchProviderConformanceOptions {
  /**
   * A fresh provider per test. Conformance never reuses an instance across
   * tests, so state cannot bleed between them.
   */
  createProvider: () =>
    | SearchTypes.ISearchProvider
    | Promise<SearchTypes.ISearchProvider>
  /**
   * Per-provider options merged into the fixture definition, e.g.
   * `{ provider_options: { "my-search": { ... } } }` on fields or settings.
   */
  settings?: SearchTypes.SearchIndexSettings
}

type Outcome<T> = { ok: true; value: T } | { ok: false; error: Error }

// The contract every optional capability is held to: either the provider
// answers exactly, or it throws. Silently approximating is the one failure
// callers cannot detect, so it is the one thing conformance rules out.
async function attempt<T>(run: () => Promise<T>): Promise<Outcome<T>> {
  try {
    return { ok: true, value: await run() }
  } catch (error) {
    return { ok: false, error }
  }
}

const documents: SearchTypes.SearchDocument[] = [
  {
    id: "prod_1",
    title: "Red running shoe",
    description: "A breathable shoe for long distances",
    status: "published",
    brand: "acme",
    price: 100,
    tags: ["shoe", "sport"],
  },
  {
    id: "prod_2",
    title: "Blue running shirt",
    description: "A light shirt for warm weather",
    status: "published",
    brand: "borg",
    price: 50,
    tags: ["shirt", "sport"],
  },
  {
    id: "prod_3",
    title: "Green wool hat",
    description: "A warm hat for the winter",
    status: "draft",
    brand: "acme",
    price: 200,
    tags: ["hat"],
  },
]

const RETRIEVABLE = ["id", "title", "status", "brand", "price", "tags"]

/**
 * Runs a provider against the parts of `ISearchProvider` the Search Module
 * relies on. Required behaviour must pass outright. Optional capabilities —
 * ranges, negation, facets, sorting, `$or`, highlighting — pass either by
 * answering exactly or by throwing; what fails conformance is a wrong answer
 * that looks like a right one.
 *
 * ```ts
 * searchProviderConformanceSuite({
 *   createProvider: () => new MySearchProviderService({}, { host: "..." }),
 * })
 * ```
 */
export function searchProviderConformanceSuite({
  createProvider,
  settings = {},
}: SearchProviderConformanceOptions): void {
  let provider: SearchTypes.ISearchProvider
  let definition: SearchTypes.ResolvedSearchIndexDefinition
  let sequence = 0

  const buildDefinition = (
    physicalName: string
  ): SearchTypes.ResolvedSearchIndexDefinition => ({
    name: "conformance_product",
    entity: "product",
    primary_key: "id",
    provider: "conformance",
    physical_name: physicalName,
    definition_hash: "conformance",
    settings,
    fields: {
      id: { type: "keyword", filterable: true },
      title: { type: "text", searchable: { weight: 3 }, sortable: true },
      description: { type: "text", searchable: true, retrievable: false },
      status: { type: "keyword", filterable: true, facetable: true },
      brand: { type: "keyword", filterable: true, facetable: true },
      price: { type: "float", filterable: true, sortable: true, facetable: true },
      tags: { type: "keyword", array: true, filterable: true },
    },
    // Providers never call `seed`; it belongs to the module.
    // eslint-disable-next-line require-yield
    async *seed() {},
  })

  // A deferred write is not visible until its task settles, and every read in
  // this suite asserts on what a write produced.
  const settle = async (task: SearchTypes.SearchTask) => {
    expect(task.status).not.toEqual("failed")

    if (task.status !== "succeeded" && provider.waitForTask) {
      const settled = await provider.waitForTask(task)
      expect(settled.status).toEqual("succeeded")
    }
  }

  const search = (
    overrides: Partial<SearchTypes.ProviderSearchQuery> = {}
  ): Promise<SearchTypes.SearchResult> =>
    provider.search({
      index: definition,
      attributes_to_retrieve: RETRIEVABLE,
      ...overrides,
    })

  const ids = (result: SearchTypes.SearchResult) =>
    result.hits.map((hit) => hit.id).sort()

  describe("search provider conformance", () => {
    beforeEach(async () => {
      provider = await createProvider()
      definition = buildDefinition(`conformance_product_${sequence++}`)

      await settle(await provider.upsertIndex({ index: definition }))
      await settle(
        await provider.upsertDocuments({
          index: definition.physical_name,
          documents,
        })
      )
    })

    afterEach(async () => {
      await attempt(() =>
        provider.deleteIndex({ index: definition.physical_name })
      )
    })

    describe("index lifecycle (required)", () => {
      it("reports the index and its document count through listIndexes", async () => {
        const indexes = await provider.listIndexes()
        const info = indexes.find(
          (candidate) => candidate.name === definition.physical_name
        )

        expect(info).toBeDefined()
        expect(info!.document_count).toEqual(documents.length)
      })

      it("upserts an unchanged index without dropping its documents", async () => {
        await settle(await provider.upsertIndex({ index: definition }))

        expect(ids(await search())).toEqual(["prod_1", "prod_2", "prod_3"])
      })

      it("empties an index on clearIndex but keeps it queryable", async () => {
        await settle(
          await provider.clearIndex({ index: definition.physical_name })
        )

        const result = await search()
        expect(result.hits).toHaveLength(0)
      })

      it("removes the index on deleteIndex", async () => {
        await settle(
          await provider.deleteIndex({ index: definition.physical_name })
        )

        const indexes = await provider.listIndexes()
        expect(
          indexes.find((info) => info.name === definition.physical_name)
        ).toBeUndefined()
      })
    })

    describe("documents (required)", () => {
      it("returns every document to an unfiltered search, with a count", async () => {
        const result = await search()

        expect(ids(result)).toEqual(["prod_1", "prod_2", "prod_3"])
        expect(result.metadata.count).toEqual(3)
      })

      it("replaces a document written under an existing id", async () => {
        await settle(
          await provider.upsertDocuments({
            index: definition.physical_name,
            documents: [{ ...documents[0], title: "Crimson walking shoe" }],
          })
        )

        expect(ids(await search({ q: "crimson" }))).toEqual(["prod_1"])
        expect((await search()).metadata.count).toEqual(3)
      })

      it("projects hits onto attributes_to_retrieve", async () => {
        const result = await search({
          attributes_to_retrieve: ["id", "title"],
          q: "breathable",
        })

        expect(result.hits).toHaveLength(1)
        expect(Object.keys(result.hits[0].document).sort()).toEqual([
          "id",
          "title",
        ])
      })

      it("deletes by a primary-key filter", async () => {
        await settle(
          await provider.deleteDocuments({
            index: definition.physical_name,
            filters: { id: ["prod_1", "prod_3"] },
          })
        )

        expect(ids(await search())).toEqual(["prod_2"])
      })
    })

    describe("matching and filtering (required)", () => {
      it("matches free text on searchable fields only", async () => {
        expect(ids(await search({ q: "running" }))).toEqual([
          "prod_1",
          "prod_2",
        ])

        // `acme` only appears in `brand`, which is not searchable.
        const result = await search({ q: "acme" })
        expect(result.hits).toHaveLength(0)
      })

      it("matches on a non-retrievable field without returning it", async () => {
        const result = await search({ q: "breathable" })

        expect(ids(result)).toEqual(["prod_1"])
        expect(result.hits[0].document.description).toBeUndefined()
      })

      it("filters keywords exactly, without token matching", async () => {
        expect(ids(await search({ filters: { status: "published" } }))).toEqual(
          ["prod_1", "prod_2"]
        )

        // A fragment of a keyword value must not match.
        const fragment = await search({ filters: { brand: "acm" } })
        expect(fragment.hits).toHaveLength(0)
      })

      it("combines free text with filters", async () => {
        expect(
          ids(await search({ q: "running", filters: { brand: "borg" } }))
        ).toEqual(["prod_2"])
      })

      it("paginates while counting the whole result set", async () => {
        const page = await search({ pagination: { skip: 1, take: 1 } })

        expect(page.hits).toHaveLength(1)
        expect(page.metadata.count).toEqual(3)
      })
    })

    describe("optional capabilities (exact answer or throw)", () => {
      it("numeric comparisons", async () => {
        const outcome = await attempt(() =>
          search({ filters: { price: { $gte: 60, $lte: 150 } } })
        )

        if (outcome.ok) {
          expect(ids(outcome.value)).toEqual(["prod_1"])
        }
      })

      it("negation with $ne", async () => {
        const outcome = await attempt(() =>
          search({ filters: { status: { $ne: "draft" } } })
        )

        if (outcome.ok) {
          expect(ids(outcome.value)).toEqual(["prod_1", "prod_2"])
        }
      })

      it("array membership with $overlaps and $contains", async () => {
        const overlaps = await attempt(() =>
          search({ filters: { tags: { $overlaps: ["hat", "shirt"] } } })
        )
        if (overlaps.ok) {
          expect(ids(overlaps.value)).toEqual(["prod_2", "prod_3"])
        }

        const contains = await attempt(() =>
          search({ filters: { tags: { $contains: ["shoe", "sport"] } } })
        )
        if (contains.ok) {
          expect(ids(contains.value)).toEqual(["prod_1"])
        }
      })

      it("disjunction with $or", async () => {
        const outcome = await attempt(() =>
          search({
            filters: { $or: [{ status: "draft" }, { brand: "borg" }] },
          })
        )

        if (outcome.ok) {
          expect(ids(outcome.value)).toEqual(["prod_2", "prod_3"])
        }
      })

      it("sorting on a numeric field", async () => {
        const outcome = await attempt(() =>
          search({ pagination: { order: { price: "ASC" } } })
        )

        if (outcome.ok) {
          expect(outcome.value.hits.map((hit) => hit.id)).toEqual([
            "prod_2",
            "prod_1",
            "prod_3",
          ])
        }
      })

      it("value facets over the filtered set", async () => {
        const outcome = await attempt(() =>
          search({
            filters: { status: "published" },
            search_options: { facets: [{ field: "brand", type: "value" }] },
          })
        )

        if (outcome.ok) {
          const facet = outcome.value.facets?.brand
          expect(facet?.type).toEqual("value")
          expect(
            (facet as { values: { value: string; count: number }[] }).values
          ).toEqual(
            expect.arrayContaining([
              { value: "acme", count: 1 },
              { value: "borg", count: 1 },
            ])
          )
        }
      })

      it("range facets with the requested keys", async () => {
        const outcome = await attempt(() =>
          search({
            search_options: {
              facets: [
                {
                  field: "price",
                  type: "range",
                  ranges: [
                    { key: "cheap", from: 0, to: 99 },
                    { key: "premium", from: 100, to: 1000 },
                  ],
                },
              ],
            },
          })
        )

        if (outcome.ok) {
          const facet = outcome.value.facets?.price
          expect(facet).toEqual({
            type: "range",
            ranges: [
              { key: "cheap", from: 0, to: 99, count: 1 },
              { key: "premium", from: 100, to: 1000, count: 2 },
            ],
          })
        }
      })

      it("stats facets", async () => {
        const outcome = await attempt(() =>
          search({
            search_options: { facets: [{ field: "price", type: "stats" }] },
          })
        )

        if (outcome.ok) {
          const facet = outcome.value.facets?.price
          expect(facet).toEqual(
            expect.objectContaining({ type: "stats", min: 50, max: 200 })
          )
        }
      })

      it("highlighting", async () => {
        const outcome = await attempt(() =>
          search({
            q: "running",
            search_options: { highlight: { fields: ["title"] } },
          })
        )

        if (outcome.ok) {
          for (const hit of outcome.value.hits) {
            expect(hit.highlights?.title?.join(" ")).toMatch(/running/i)
          }
        }
      })

      it("deleting by a non-primary-key filter", async () => {
        const outcome = await attempt(async () => {
          await settle(
            await provider.deleteDocuments({
              index: definition.physical_name,
              filters: { status: "published" },
            })
          )
        })

        if (outcome.ok) {
          expect(ids(await search())).toEqual(["prod_3"])
        }
      })
    })

    // `swapIndex` is what zero-downtime reindexing hangs off, so when a
    // provider declares it, it has to actually repoint reads.
    describe("swapIndex (when implemented)", () => {
      it("aliases the filled replacement over the live name", async () => {
        if (!provider.swapIndex) {
          return
        }

        const shadow = { ...definition, physical_name: `${definition.physical_name}_shadow` }

        await settle(await provider.upsertIndex({ index: shadow }))
        await settle(
          await provider.upsertDocuments({
            index: shadow.physical_name,
            documents: [documents[0]],
          })
        )

        await settle(
          await provider.swapIndex({
            alias: definition.physical_name,
            index: shadow.physical_name,
          })
        )

        // Reads under the live name now see the replacement.
        expect(ids(await search())).toEqual(["prod_1"])
      })
    })
  })
}
