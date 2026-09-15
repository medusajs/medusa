import { SearchTypes } from "@medusajs/framework/types"
import { normalizeSearchQuery, validateFieldUsage } from ".."

const index: SearchTypes.ResolvedSearchIndexDefinition = {
  name: "product",
  entity: "product",
  provider: "test",
  primary_key: "id",
  physical_name: "product",
  definition_hash: "hash",
  settings: {},
  fields: {
    id: { type: "keyword", filterable: true },
    title: { type: "text", searchable: true },
    embedding: { type: "vector", dimensions: 3 },
  },
  seed: async function* () {
    yield []
  },
}

describe("query.search vector options", () => {
  it("infers vector.field when the index has a single vector field", () => {
    const normalized = normalizeSearchQuery({
      query: {
        entity: "product",
        search_options: { vector: { value: [0.1, 0.2, 0.3] } },
      },
      index,
    })

    expect(normalized.search_options?.vector?.field).toBe("embedding")
    expect(() => validateFieldUsage({ index, query: normalized })).not.toThrow()
  })

  it("rejects a vector search without value or query", () => {
    const normalized = normalizeSearchQuery({
      query: {
        entity: "product",
        search_options: { vector: { field: "embedding" } },
      },
      index,
    })

    expect(() => validateFieldUsage({ index, query: normalized })).toThrow(
      /value.*query/
    )
  })

  it("rejects a vector value with the wrong dimensions", () => {
    const normalized = normalizeSearchQuery({
      query: {
        entity: "product",
        search_options: { vector: { value: [0.1, 0.2] } },
      },
      index,
    })

    expect(() => validateFieldUsage({ index, query: normalized })).toThrow(
      /expected 3 dimensions/
    )
  })

  it("allows a client embedding against an engine-embedded field", () => {
    const embedded: SearchTypes.ResolvedSearchIndexDefinition = {
      ...index,
      fields: {
        ...index.fields,
        embedding: {
          type: "vector",
          dimensions: 3,
          embed: true,
        },
      },
    }

    const normalized = normalizeSearchQuery({
      query: {
        entity: "product",
        search_options: { vector: { value: [0.1, 0.2, 0.3] } },
      },
      index: embedded,
    })

    expect(() =>
      validateFieldUsage({ index: embedded, query: normalized })
    ).not.toThrow()
  })

  it("allows vector.query when the field declares embed", () => {
    const embedded: SearchTypes.ResolvedSearchIndexDefinition = {
      ...index,
      fields: {
        ...index.fields,
        embedding: {
          type: "vector",
          dimensions: 3,
          embed: true,
        },
      },
    }

    const normalized = normalizeSearchQuery({
      query: {
        entity: "product",
        search_options: { vector: { query: "red shoes" } },
      },
      index: embedded,
    })

    expect(() =>
      validateFieldUsage({ index: embedded, query: normalized })
    ).not.toThrow()
  })

  it("rejects vector.query when the field does not declare embed", () => {
    const normalized = normalizeSearchQuery({
      query: {
        entity: "product",
        search_options: { vector: { query: "red shoes" } },
      },
      index,
    })

    expect(() => validateFieldUsage({ index, query: normalized })).toThrow(
      /declare "embed"/
    )
  })

  it("does not retrieve vector fields unless retrievable is true", () => {
    const normalized = normalizeSearchQuery({
      query: { entity: "product" },
      index,
    })

    expect(normalized.attributes_to_retrieve).not.toContain("embedding")
    expect(normalized.attributes_to_retrieve).toEqual(["id", "title"])

    const optedIn: SearchTypes.ResolvedSearchIndexDefinition = {
      ...index,
      fields: {
        ...index.fields,
        embedding: {
          type: "vector",
          dimensions: 3,
          retrievable: true,
        },
      },
    }

    const retrieved = normalizeSearchQuery({
      query: { entity: "product" },
      index: optedIn,
    })

    expect(retrieved.attributes_to_retrieve).toContain("embedding")
  })

  it("does not retrieve engine-embedded vector fields", () => {
    const embedded: SearchTypes.ResolvedSearchIndexDefinition = {
      ...index,
      fields: {
        ...index.fields,
        embedding: {
          type: "vector",
          dimensions: 3,
          embed: true,
        },
      },
    }

    const normalized = normalizeSearchQuery({
      query: { entity: "product" },
      index: embedded,
    })

    expect(normalized.attributes_to_retrieve).not.toContain("embedding")
    expect(normalized.attributes_to_retrieve).toContain("title")
  })
})
