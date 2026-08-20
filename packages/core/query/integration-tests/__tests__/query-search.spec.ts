import { ISearchModuleService } from "@medusajs/types"
import { integrationData } from "../__fixtures__/data"
import { setup, TestModules } from "../__fixtures__/setup"

/**
 * The engine only returns the fields the index was defined with, so
 * `query.search` hydrates the rest through `query.graph` and merges the two
 * sets. These tests run that merge for real, against modules that honour the
 * `select` and the filters they are called with — mocking `graph` away would
 * hide exactly what is being asserted here.
 */

const products = integrationData.products.map((product) => ({
  ...product,
  variants: integrationData.variants.filter(
    (variant) => variant.product_id === product.id
  ),
}))

// A module returning columns it was never asked for would mask a hydration
// query that forgot to select the primary key.
function project(row: any, select?: string[]): any {
  if (!select) {
    return row
  }

  const projected: any = {}

  for (const path of select) {
    if (!path.includes(".") && path in row) {
      projected[path] = row[path]
    }
  }

  const relations = new Set(
    select
      .filter((path) => path.includes("."))
      .map((path) => path.split(".")[0])
  )

  for (const relation of relations) {
    if (!(relation in row)) {
      continue
    }

    const nested = select
      .filter((path) => path.startsWith(`${relation}.`))
      .map((path) => path.slice(relation.length + 1))

    projected[relation] = Array.isArray(row[relation])
      ? row[relation].map((value: any) => project(value, nested))
      : project(row[relation], nested)
  }

  return projected
}

function matchesFilters(row: any, filters?: Record<string, any>): boolean {
  return Object.entries(filters ?? {}).every(([key, value]) => {
    const values = Array.isArray(value) ? value : [value]
    return values.includes(row[key])
  })
}

function mockProductList(modules: TestModules) {
  modules.product.list.mockImplementation(
    async (filters: any, config: any) =>
      products
        .filter((product) => matchesFilters(product, filters))
        .map((product) => project(product, config?.select)) as unknown[]
  )
}

function createSearchModule(options: {
  retrievableFields: string[]
  primaryKey?: string
  hits: { id: string; document: any }[]
}) {
  const { retrievableFields, primaryKey = "id", hits } = options

  return {
    listRetrievableFields: jest.fn().mockReturnValue(retrievableFields),
    getIndexPrimaryKey: jest.fn().mockReturnValue(primaryKey),
    search: jest.fn().mockResolvedValue({
      hits,
      metadata: { skip: 0, take: 20, count: hits.length },
    }),
  } as unknown as ISearchModuleService
}

describe("Query.search integration", () => {
  let modules: TestModules

  it("hydrates a non-indexed scalar field into the engine's documents", async () => {
    const searchModule = createSearchModule({
      retrievableFields: ["id", "title"],
      hits: [
        { id: "prod_2", document: { id: "prod_2", title: "Hoodie" } },
        { id: "prod_1", document: { id: "prod_1", title: "T-Shirt" } },
      ],
    })

    const env = setup({ searchModule })
    modules = env.modules
    mockProductList(modules)

    const result = await env.query.search({
      entity: "product",
      fields: ["id", "title", "handle"],
    })

    expect(result.data).toEqual([
      { id: "prod_2", title: "Hoodie", handle: "hoodie" },
      { id: "prod_1", title: "T-Shirt", handle: "t-shirt" },
    ])

    // The hydration query has to select the primary key, otherwise the fetched
    // rows cannot be matched back onto the documents they belong to.
    expect(modules.product.list).toHaveBeenCalledWith(
      { id: ["prod_2", "prod_1"] },
      expect.objectContaining({
        select: expect.arrayContaining(["id", "handle"]),
      })
    )
  })

  it("hydrates a nested relation and keeps the engine's relevance order", async () => {
    const searchModule = createSearchModule({
      retrievableFields: ["id", "title", "handle", "status"],
      hits: [
        {
          id: "prod_2",
          document: { id: "prod_2", title: "Hoodie", handle: "hoodie" },
        },
        {
          id: "prod_1",
          document: { id: "prod_1", title: "T-Shirt", handle: "t-shirt" },
        },
      ],
    })

    const env = setup({ searchModule })
    modules = env.modules
    mockProductList(modules)

    const result = await env.query.search({
      entity: "product",
      fields: ["id", "title", "handle", "variants.id", "variants.sku"],
    })

    expect(searchModule.search).toHaveBeenCalledWith(
      expect.objectContaining({ fields: ["id", "title", "handle"] })
    )

    // Relevance order is the engine's, not the module's.
    expect(result.data.map((row: any) => row.id)).toEqual(["prod_2", "prod_1"])
    expect(result.data).toEqual([
      {
        id: "prod_2",
        title: "Hoodie",
        handle: "hoodie",
        variants: [{ id: "variant_3", sku: "HD-OS", product_id: "prod_2" }],
      },
      {
        id: "prod_1",
        title: "T-Shirt",
        handle: "t-shirt",
        variants: [
          { id: "variant_1", sku: "TS-SM", product_id: "prod_1" },
          { id: "variant_2", sku: "TS-LG", product_id: "prod_1" },
        ],
      },
    ])
  })

  it("hydrates through an index whose primary key is not `id`", async () => {
    // The index is keyed by handle, so the hits are identified by handle and
    // the hydration has to filter on it.
    const searchModule = createSearchModule({
      retrievableFields: ["id", "handle", "title"],
      primaryKey: "handle",
      hits: [
        {
          id: "hoodie",
          document: { id: "prod_2", handle: "hoodie", title: "Hoodie" },
        },
        {
          id: "t-shirt",
          document: { id: "prod_1", handle: "t-shirt", title: "T-Shirt" },
        },
      ],
    })

    const env = setup({ searchModule })
    modules = env.modules
    mockProductList(modules)

    const result = await env.query.search({
      entity: "product",
      fields: ["id", "handle", "title", "variants.sku"],
    })

    expect(result.data).toEqual([
      {
        id: "prod_2",
        handle: "hoodie",
        title: "Hoodie",
        variants: [{ sku: "HD-OS", product_id: "prod_2" }],
      },
      {
        id: "prod_1",
        handle: "t-shirt",
        title: "T-Shirt",
        variants: [
          { sku: "TS-SM", product_id: "prod_1" },
          { sku: "TS-LG", product_id: "prod_1" },
        ],
      },
    ])

    expect(modules.product.list).toHaveBeenCalledWith(
      { handle: ["hoodie", "t-shirt"] },
      expect.objectContaining({
        select: expect.arrayContaining(["handle", "variants.sku"]),
      })
    )
  })
})
