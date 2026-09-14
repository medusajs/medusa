import { SearchTypes } from "@medusajs/types"
import { MedusaModule } from "../medusa-module"

const definition = (name: string): SearchTypes.SearchIndexDefinition => ({
  name,
  entity: name,
  fields: { id: { type: "keyword", filterable: true } },
  async *seed() {},
})

describe("MedusaModule search index registry", () => {
  beforeEach(() => {
    MedusaModule.clearInstances()
  })

  it("registers definitions and hands them out in registration order", () => {
    MedusaModule.setSearchIndex(definition("product"), "/search/product.ts")
    MedusaModule.setSearchIndex(definition("customer"), "/search/customer.ts")

    expect(MedusaModule.getSearchIndexes().map((index) => index.name)).toEqual([
      "product",
      "customer",
    ])
  })

  it("keeps every index a single file declares", () => {
    MedusaModule.setSearchIndex(definition("order"), "/search/orders.ts")
    MedusaModule.setSearchIndex(definition("return"), "/search/orders.ts")

    expect(MedusaModule.getSearchIndexes().map((index) => index.name)).toEqual([
      "order",
      "return",
    ])
  })

  it("replaces rather than duplicates when the same file registers the same name", () => {
    MedusaModule.setSearchIndex(definition("product"), "/search/product.ts")
    MedusaModule.setSearchIndex(definition("product"), "/search/product.ts")

    expect(MedusaModule.getSearchIndexes().length).toBe(1)
  })

  it("accepts the same definition object arriving through a file and the options", () => {
    const productDefinition = definition("product")

    // `defineSearchIndex` registers the definition it also returns, so the
    // very same object can come back through the Search Module's options.
    MedusaModule.setSearchIndex(productDefinition, "/search/product.ts")
    MedusaModule.setSearchIndex(productDefinition)

    expect(MedusaModule.getSearchIndexes().length).toBe(1)
  })

  it("rejects two files claiming the same index name", () => {
    MedusaModule.setSearchIndex(definition("product"), "/search/product.ts")

    expect(() =>
      MedusaModule.setSearchIndex(definition("product"), "/search/products.ts")
    ).toThrow(
      'Search index "product" is defined twice: in /search/product.ts and /search/products.ts'
    )
  })

  it("replaces rather than duplicates when an inline definition re-registers", () => {
    MedusaModule.setSearchIndex(definition("product"))
    MedusaModule.setSearchIndex(definition("product"))

    expect(MedusaModule.getSearchIndexes().length).toBe(1)
  })

  it("rejects a file and the module options claiming the same index name", () => {
    MedusaModule.setSearchIndex(definition("product"), "/search/product.ts")

    expect(() => MedusaModule.setSearchIndex(definition("product"))).toThrow(
      `Search index "product" is defined twice: in /search/product.ts and the Search Module's options`
    )
  })
})
