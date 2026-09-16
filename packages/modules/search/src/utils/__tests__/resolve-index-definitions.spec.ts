import { SearchTypes } from "@medusajs/framework/types"
import { resolveIndexDefinitions } from "../index"

const baseDefinition = (
  fields: Record<string, SearchTypes.SearchFieldDefinition>
): SearchTypes.SearchIndexDefinition => ({
  name: "product",
  entity: "product",
  fields: {
    id: { type: "keyword", filterable: true },
    ...fields,
  },
  async *seed() {},
})

const resolve = (fields: Record<string, SearchTypes.SearchFieldDefinition>) =>
  resolveIndexDefinitions({
    definitions: [baseDefinition(fields)],
    default_provider: "test-provider",
  })

describe("resolveIndexDefinitions validation", () => {
  test("accepts a coherent definition", () => {
    const resolved = resolve({
      title: { type: "text", searchable: true },
      embedding: { type: "vector", dimensions: 3 },
    })

    expect(resolved.get("product")?.provider).toEqual("test-provider")
  })

  test("rejects a vector field without dimensions", () => {
    expect(() => resolve({ embedding: { type: "vector" } })).toThrow(
      /must declare its "dimensions"/
    )
  })

  test("rejects an array of vectors", () => {
    expect(() =>
      resolve({ embedding: { type: "vector", dimensions: 3, array: true } })
    ).toThrow(/cannot be an array/)
  })

  test("accepts a vector field that embeds its own text", () => {
    const resolved = resolve({
      embedding: {
        type: "vector",
        dimensions: 1536,
        embed: true,
      },
    })

    expect(resolved.get("product")?.fields.embedding.embed).toEqual(true)
  })

  test("rejects embedding a source field path", () => {
    expect(() =>
      resolve({
        embedding: {
          type: "vector",
          dimensions: 3,
          embed: "title" as unknown as true,
        },
      })
    ).toThrow(/must be true/)
  })

  test("rejects free-text search on non-string fields", () => {
    expect(() =>
      resolve({ price: { type: "float", searchable: true } })
    ).toThrow(/cannot be searched as free text/)
  })
})
