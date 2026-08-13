# Local search provider

Search provider for Medusa backed by [Orama](https://github.com/oramasearch/orama),
holding every index in process memory.

Nothing is persisted: a restart leaves an empty index until something reindexes
it. Intended for tests, local development, and small read-mostly datasets — not
for production traffic.

```ts
{
  resolve: "@medusajs/medusa/search",
  options: {
    providers: [{ resolve: "@medusajs/medusa/search-local", id: "local" }],
  },
}
```

## What it supports

|           |                                                                                        |
| --------- | -------------------------------------------------------------------------------------- |
| Free text | BM25, prefix matching, per-field weights, optional typo tolerance                      |
| Filters   | `$eq` `$ne` `$in` `$nin` `$lt` `$lte` `$gt` `$gte` `$contains` `$overlaps`, and `$and` |
| Facets    | value and range                                                                        |
| Sorting   | one field, or relevance                                                                |
| Deletes   | any filter; a filter on the primary key alone takes Orama's remove-by-id path          |
| Other     | `distinct`, exact counts                                                               |

## What it does not

- **`$or` and `$not`.** Orama's `where` is a flat conjunction.
- **Stats facets.** Orama has no aggregation for them.
- **More than one sort field**, and no sorting on multi-valued fields.
- **Vector and hybrid search.**
- **Highlighting and snippets.**
- **Per-element correlation** across arrays of objects — see below.

Each of these is **rejected with an explanatory error** — definitions in
`upsertIndex`, so they fail at boot; queries while translating. Nothing
unsupported is silently ignored, which is the one outcome that would leave a
storefront showing wrong results.

`@medusajs/test-utils` exports `searchProviderConformanceSuite`, which pins that
contract: for every optional feature it asserts the provider either answers
correctly or throws.

## How definitions map onto Orama

**Flat, dot-keyed schema.** `variants.color` is one schema key rather than a
nested schema, because dotted keys stay sortable while nested ones do not.

**Arrays of objects are collapsed.** Orama cannot index them, so
`variants: [{ color: "red" }, { color: "blue" }]` is indexed as
`variants.color: ["red", "blue"]`. Predicates therefore match the _document_,
not a single element: `variants.color = "red" AND variants.size = "XL"` matches a
product with a red S and a blue XL. This is what `nested_objects: "flattened"`
means, and why a definition asking for `correlated: true` is rejected at boot.

**Tokenized fields get a shadow copy.** Orama's `where` on a `string` property
matches tokens, so `{ title: "Red shoe" }` would also match "Blue shoe". A field
that is both searchable and filterable is indexed twice — as `string` for
matching, and as `enum` under `<path>__filter` for exact filters and facets.

**Dates become numbers.** Indexed as epoch milliseconds so ranges and sorting
work.

**Reads are lossless.** The original document is stored unindexed under
`__source` and returned from there, so dates come back as dates and arrays of
objects keep their shape.

## Quirks worth knowing

Orama accepts **one operation per field**. `{ $gte, $lte }` is translated to
`between`; any other multi-operator combination on a single field is rejected
with an explanatory error rather than silently dropped.
