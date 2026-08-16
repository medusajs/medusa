# PostgreSQL search provider

Search provider for Medusa backed by PostgreSQL, with two engines:

| Engine             | When to use                              | Keyword                     | Vector               |
| ------------------ | ---------------------------------------- | --------------------------- | -------------------- |
| `native` (default) | Local / self-hosted / any Postgres       | GIN + `ts_rank` + `pg_trgm` | Not supported        |
| `lakebase`         | Medusa Cloud / Neon with Lakebase Search | `lakebase_bm25` (BM25)      | `lakebase_ann` (ANN) |

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

The migration always enables `pg_trgm` + `unaccent` and creates the catalog. Lakebase extensions are created at runtime when `engine: "lakebase"` (they need preloaded libraries that migrations alone cannot enable).

## Provider options

| Option            | Default     | Description                                                                            |
| ----------------- | ----------- | -------------------------------------------------------------------------------------- |
| `engine`          | `"native"`  | `"native"` or `"lakebase"`                                                             |
| `language`        | `"english"` | Text search config. With `unaccent`, creates `medusa_search_<language>`.               |
| `embedder`        | —           | `(text) => Promise<number[]>`. Required for `search_options.vector.query` on lakebase. |
| `vector_distance` | `"cosine"`  | ANN metric: `cosine`, `l2`, or `inner_product`.                                        |

## Vector fields (lakebase only)

```ts
defineSearchIndex({
  name: "product",
  entity: "product",
  fields: {
    id: { type: "keyword", filterable: true },
    title: { type: "text", searchable: { weight: 3 } },
    embedding: { type: "vector", dimensions: 1536 },
  },
  // ...
})
```

Documents must include the embedding array on upsert. Query with:

```ts
await query.search({
  entity: "product",
  filters: { q: "red shoes" },
  search_options: {
    vector: {
      field: "embedding",
      value: embeddingArray, // or query: "red shoes" with embedder configured
      semantic_ratio: 0.5, // 0 = keyword, 1 = vector, in between = RRF hybrid
    },
  },
})
```

## What it supports

|                  | native                                                  | lakebase                 |
| ---------------- | ------------------------------------------------------- | ------------------------ |
| Free text        | `ts_rank` + weights                                     | BM25 via `lakebase_bm25` |
| Typo tolerance   | `pg_trgm` (`word_similarity`)                           | `pg_trgm` (same)         |
| `match_strategy` | `"all"` (default), `"any"`                              | same                     |
| Filters          | `$eq` `$ne` `$in` `$nin` ranges, `$and`/`$or`/`$not`, … | same                     |
| Facets           | value, range, stats — scoped to the query matches       | same                     |
| `distinct`       | one hit per value, count follows                        | same                     |
| `min_score`      | yes, keeps the requested sort                           | same                     |
| Vector / hybrid  | —                                                       | ANN + RRF                |
| `swapIndex`      | yes                                                     | yes                      |

Unsupported on both (rejected explicitly): highlighting, geo, cursor pagination, correlated nested predicates, query-time locales, `match_strategy: "last"`.

### Filter semantics

- Equality and `$in` compile to jsonb containment (`indexed @> …`), which the
  `jsonb_path_ops` GIN index accelerates and which compares numbers and
  booleans natively.
- On array fields, a bare value or `$eq` means membership — `{ tags: "sale" }`
  matches documents whose `tags` array contains `"sale"`, the same collapse the
  local provider uses.
- Range operators (`$gt`, …), `$prefix` and `$like` are rejected on array
  fields.

### Hybrid queries (lakebase)

- Results are rank-fused (RRF), so they can only be ordered by `_score`.
- `min_score` applies to the fused RRF score (per-arm contributions are at most
  `weight / 61`).
- `metadata.count` is the exact size of the union of both arms' match sets;
  the fused hit list itself is a bounded candidate window.
