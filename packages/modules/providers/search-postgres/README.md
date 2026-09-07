# PostgreSQL search provider

Search provider for Medusa backed by PostgreSQL, with two engines:

| Engine             | When to use                        | Keyword                     | Vector               |
| ------------------ | ---------------------------------- | --------------------------- | -------------------- |
| `native` (default) | Local / self-hosted / any Postgres | GIN + `ts_rank` + `pg_trgm` | Not supported        |
| `lakebase`         | Medusa Cloud / Lakebase Search     | `lakebase_bm25` (BM25)      | `lakebase_ann` (ANN) |

## Enable it

### Native (default, works locally and on Medusa Cloud)

```ts
modules: [
  {
    resolve: "@medusajs/medusa/search",
    options: {
      providers: [
        {
          resolve: "@medusajs/medusa/search-postgres",
          id: "postgres",
          options: {
            // engine: "native", // default
            // language: "english",
          },
        },
      ],
    },
  },
]
```

### Lakebase (works only on Medusa Cloud)

```ts
{
  resolve: "@medusajs/medusa/search-postgres",
  id: "postgres",
  options: {
    engine: "lakebase",
    // Optional: embed text for search_options.vector.query
    // embedder: async (text) => { ... return number[] },
    // vector_distance: "cosine", // or "l2" | "inner_product"
  },
}
```

Then:

```bash
npx medusa db:migrate
npx medusa db:migrate-search
```

The migration enables `pg_trgm` + `unaccent` and creates the catalog. On Medusa Cloud it also enables `lakebase_vector` and `lakebase_text` (`CREATE EXTENSION ... CASCADE`). Those statements soft-fail on engines that do not ship Lakebase Search.

## Provider options

| Option            | Default     | Description                                                                            |
| ----------------- | ----------- | -------------------------------------------------------------------------------------- |
| `engine`          | `"native"`  | `"native"` or `"lakebase"`                                                             |
| `language`        | `"english"` | Text search config. With `unaccent`, creates `medusa_search_<language>`.               |
| `embedder`        | —           | `(text) => Promise<number[]>`. Required for `search_options.vector.query` on lakebase. |
| `vector_distance` | `"cosine"`  | ANN metric: `cosine`, `l2`, or `inner_product`.                                        |

## Vector fields (lakebase only)

Supply embeddings yourself:

```ts
defineSearchIndex({
  name: "product",
  entity: "product",
  fields: search.define({
    id: search.keyword().filterable(),
    title: search.text().searchable({ weight: 3 }),
    embedding: search.vector(1536),
  }),
  // ...
})
```

Documents must include the embedding array on upsert. Query with `search_options.vector.value`.

Or let the provider embed a string on the same field (`.embed()` requires `embedder`):

```ts
embedding: search.vector(1536).embed()

// documents: { embedding: "title and description to encode" }

await query.search({
  entity: "product",
  search_options: {
    vector: {
      field: "embedding",
      query: "red shoes",
      semantic_ratio: 0.5, // 0 = keyword, 1 = vector, in between = RRF hybrid
    },
  },
})
```

Query with a client-supplied embedding against either kind of field:

```ts
await query.search({
  entity: "product",
  filters: { q: "red shoes" },
  search_options: {
    vector: {
      field: "embedding",
      value: embeddingArray,
      semantic_ratio: 0.5,
    },
  },
})
```

## What it supports

|                  | native                                                  | lakebase                 |
| ---------------- | ------------------------------------------------------- | ------------------------ |
| Free text        | `ts_rank` + weights                                     | BM25 via `lakebase_bm25` |
| Typo tolerance   | `pg_trgm` (`word_similarity`)                           | `pg_trgm` (same)         |
| `match_strategy` | `"all"` (default), `"any"`, `"last"`                    | same                     |
| Filters          | `$eq` `$ne` `$in` `$nin` ranges, `$and`/`$or`/`$not`, … | same                     |
| Facets           | value, range, stats — scoped to the query matches       | same                     |
| `distinct`       | one hit per value, count follows                        | same                     |
| `min_score`      | yes, keeps the requested sort                           | same                     |
| Vector / hybrid  | —                                                       | ANN + RRF                |

Unsupported on both (rejected explicitly): highlighting, geo, cursor pagination, query-time locales.

`"last"` is typeahead: completed terms must match in full and the last term is a prefix, so `"dtc sta"` matches `"Dtc starter"`.

### Filter semantics

- Equality and `$in` compile to jsonb containment (`indexed @> …`), which the
  `jsonb_path_ops` GIN index accelerates and which compares numbers and
  booleans natively.
- On array fields, a bare value or `$eq` means membership — `{ tags: "sale" }`
  matches documents whose `tags` array contains `"sale"`.
- Range operators (`$gt`, …), `$prefix` and `$like` are rejected on array
  fields.

### Hybrid queries (lakebase)

- Results are rank-fused (RRF), so they can only be ordered by `_score`.
- `min_score` applies to the fused RRF score (per-arm contributions are at most
  `weight / 61`).
- `metadata.count` is the exact size of the union of both arms' match sets;
  the fused hit list itself is a bounded candidate window.
