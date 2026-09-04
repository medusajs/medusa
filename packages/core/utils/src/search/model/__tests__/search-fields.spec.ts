import { SearchTypes } from "@medusajs/types"
import { defineSearchIndex } from "../../define-search-index"
import { search } from "../index-builder"
import { SearchFieldsSchema } from "../search-fields-schema"

describe("search fields DSL", () => {
  const registered: { definition: any; filePath?: string }[] = []

  beforeEach(() => {
    registered.length = 0
    ;(global as any).MedusaModule = {
      setSearchIndex(definition: any, filePath?: string) {
        registered.push({ definition, filePath })
      },
    }
  })

  test("defineSearchIndex compiles a DSL schema to plain field definitions", () => {
    const fields = search.define({
      id: search.keyword().filterable(),
      title: search.text().searchable({ weight: 3 }).sortable(),
      handle: search.keyword().filterable(),
      status: search.keyword().filterable().facetable(),
      description: search.text().searchable().retrievable(false),
      min_price: search.float().filterable().sortable().facetable(),
      created_at: search.date().filterable().sortable(),
      tags: search.keyword().array().filterable().facetable(),
      variants: search
        .object({
          sku: search.keyword().searchable().filterable(),
          color: search.keyword().filterable().facetable(),
        })
        .array(),
      embedding: search.vector(1536),
    })

    expect(SearchFieldsSchema.isSearchFieldsSchema(fields)).toBe(true)

    const definition = defineSearchIndex({
      name: "product",
      entity: "product",
      fields,
      async *seed() {},
    })

    expect(definition.fields).toEqual({
      id: { type: "keyword", filterable: true },
      title: { type: "text", searchable: { weight: 3 }, sortable: true },
      handle: { type: "keyword", filterable: true },
      status: { type: "keyword", filterable: true, facetable: true },
      description: {
        type: "text",
        searchable: true,
        retrievable: false,
      },
      min_price: {
        type: "float",
        filterable: true,
        sortable: true,
        facetable: true,
      },
      created_at: { type: "date", filterable: true, sortable: true },
      tags: {
        type: "keyword",
        array: true,
        filterable: true,
        facetable: true,
      },
      variants: {
        type: "object",
        array: true,
        fields: {
          sku: {
            type: "keyword",
            searchable: true,
            filterable: true,
          },
          color: {
            type: "keyword",
            filterable: true,
            facetable: true,
          },
        },
      },
      embedding: { type: "vector", dimensions: 1536 },
    })

    // What was registered is the normalized definition, not the DSL schema.
    expect(registered).toHaveLength(1)
    expect(registered[0].definition.fields).toEqual(definition.fields)
  })

  test("vector fields opt into retrieval", () => {
    const definition = defineSearchIndex({
      name: "product",
      entity: "product",
      fields: search.define({
        id: search.keyword(),
        embedding: search.vector(1536).retrievable(),
      }),
      async *seed() {},
    })

    expect(definition.fields.embedding).toEqual({
      type: "vector",
      dimensions: 1536,
      retrievable: true,
    })
  })

  test("vector fields can ask the engine to embed their own text", () => {
    const definition = defineSearchIndex({
      name: "product",
      entity: "product",
      fields: search.define({
        id: search.keyword(),
        title: search.text().searchable(),
        embedding: search.vector(1536).embed(),
      }),
      async *seed() {},
    })

    expect(definition.fields.embedding).toEqual({
      type: "vector",
      dimensions: 1536,
      embed: true,
    })
  })

  test("range facet types are preserved on numeric fields", () => {
    const definition = defineSearchIndex({
      name: "product",
      entity: "product",
      fields: search.define({
        id: search.keyword(),
        min_price: search.float().facetable({ types: ["range", "stats"] }),
      }),
      async *seed() {},
    })

    expect(definition.fields.min_price).toEqual({
      type: "float",
      facetable: { types: ["range", "stats"] },
    })
  })

  test("defineSearchIndex rejects plain JSON fields", () => {
    expect(() =>
      defineSearchIndex({
        name: "product",
        entity: "product",
        fields: {
          // @ts-expect-error — fields must come from `search.define({ ... })`.
          id: { type: "keyword", filterable: true },
        },
        async *seed() {},
      })
    ).toThrow("`defineSearchIndex` fields must come from `search.define({ ... })`")
  })

  test("provider options on object arrays", () => {
    const definition = defineSearchIndex({
      name: "product",
      entity: "product",
      fields: search.define({
        id: search.keyword(),
        variants: search
          .object({
            sku: search.keyword(),
          })
          .array()
          .providerOptions({ meilisearch: { foo: "bar" } }),
      }),
      async *seed() {},
    })

    expect(definition.fields.variants).toEqual({
      type: "object",
      array: true,
      provider_options: { meilisearch: { foo: "bar" } },
      fields: {
        sku: { type: "keyword" },
      },
    })
  })

  test("seed documents are typed against the DSL schema", async () => {
    const definition = defineSearchIndex({
      name: "product",
      entity: "product",
      fields: search.define({
        id: search.keyword().filterable(),
        title: search.text().searchable(),
        min_price: search.float().sortable(),
        tags: search.keyword().array(),
        variants: search.object({ sku: search.keyword() }).array(),
      }),
      async *seed() {
        yield [
          {
            id: "prod_1",
            title: "Shirt",
            min_price: 10,
            tags: ["a", "b"],
            variants: [{ sku: "SHIRT-S" }],
            // Extra fields are allowed: seeds commonly spread whole entities.
            not_indexed: "ok",
          },
        ]
      },
    })

    const batches: SearchTypes.SearchDocument[][] = []
    for await (const batch of definition.seed({} as any)) {
      batches.push(batch)
    }
    expect(batches[0][0].id).toEqual("prod_1")
  })

  test("the type surface rejects what boot validation would", () => {
    // @ts-expect-error — free-text search only exists on text/keyword.
    void search.float().searchable

    // @ts-expect-error — vectors cannot hold arrays.
    void search.vector(3).array

    // @ts-expect-error — range facets only exist on numeric/date fields.
    void search.keyword().facetable({ types: ["range"] })

    // @ts-expect-error — search fields have no default value.
    void search.keyword().default

    // @ts-expect-error — search fields have no nullability.
    void search.keyword().nullable

    const typedFields = search.define({
      id: search.keyword(),
      min_price: search.float(),
    })

    const badDocument: SearchTypes.InferSearchDocumentType<
      typeof typedFields
    > = {
      id: "1",
      // @ts-expect-error — min_price is a float, not a string.
      min_price: "10",
    }
    void badDocument

    const embeddedFields = search.define({
      id: search.keyword(),
      title: search.text(),
      embedding: search.vector(3).embed(),
    })

    // Engine-embedded fields accept the source text, not a vector.
    const embeddedDocument: SearchTypes.InferSearchDocumentType<
      typeof embeddedFields
    > = {
      id: "1",
      title: "Shirt",
      embedding: "Shirt",
    }
    void embeddedDocument

    const badEmbeddedDocument: SearchTypes.InferSearchDocumentType<
      typeof embeddedFields
    > = {
      id: "1",
      title: "Shirt",
      // @ts-expect-error — embed fields accept a string, not a vector
      embedding: [0.1, 0.2, 0.3],
    }
    void badEmbeddedDocument

    // @ts-expect-error — embed() takes no source path
    void search.vector(3).embed("title")

    expect(true).toBe(true)
  })
})
