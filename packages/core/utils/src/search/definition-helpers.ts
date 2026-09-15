import { SearchTypes } from "@medusajs/types"

/**
 * `seed` and `consume` implementations backed by `query.graph`.
 *
 * Nearly every index is a projection of an entity that already lives behind
 * `query.graph`, so the helpers simplify catchup, soft-deletes and similar,
 * which should be enough for most use cases.
 */

type GraphRow = Record<string, any>

// The timestamps every Medusa entity carries, which the catch-up pass reads.
const UPDATED_AT_FIELD = "updated_at"
const DELETED_AT_FIELD = "deleted_at"

export type SearchConsumeEvent = Parameters<
  NonNullable<SearchTypes.SearchIndexDefinition["consume"]>
>[0]

export interface SearchGraphSourceOptions<
  Fields extends SearchTypes.SearchIndexFieldsInput,
  TRow extends GraphRow = GraphRow
> {
  /**
   * The `query.graph` entrypoint to read from. Defaults to the index
   * definition's `entity`.
   */
  entity?: string

  /**
   * The fields to select from `query.graph`. Without a `transform` the row is
   * indexed as-is, so this should then select exactly what the index declares.
   */
  fields: string[]

  /**
   * Maps a row to the document to index. Returning `null` or `undefined`
   * excludes the row, and is how an index that only holds part of an entity
   * says so — narrowing the read with a filter instead would hide a row that
   * stops qualifying, leaving its document behind.
   *
   * `consume` and the catch-up pass turn a rejection into a delete, so an
   * excluded row leaves the index rather than going stale in it.
   *
   * Defaults to indexing the row as-is.
   */
  transform?: (
    row: TRow,
    context: SearchTypes.SearchIngestionContext
  ) => SearchTypes.InferSearchDocumentType<Fields> | null | undefined
}

export interface SearchGraphSeedOptions<
  Fields extends SearchTypes.SearchIndexFieldsInput,
  TRow extends GraphRow = GraphRow
> extends SearchGraphSourceOptions<Fields, TRow> {
  /**
   * The number of rows read from `query.graph` per page.
   *
   * @default 200
   */
  batch_size?: number
}

export interface SearchGraphConsumeOptions<
  Fields extends SearchTypes.SearchIndexFieldsInput,
  TRow extends GraphRow = GraphRow
> extends SearchGraphSourceOptions<Fields, TRow> {
  /**
   * The IDs of the documents the event affects, which are read back through
   * `query.graph` and written to the index.
   *
   * Defaults to `event.data.id`, as a single ID or an array of them.
   */
  resolve_ids?: (event: SearchConsumeEvent) => string[] | string | undefined

  /**
   * Whether the event removes its documents from the index rather than
   * updating them. A deleted row can't be read back, so it's deleted by ID
   * without going to `query.graph`.
   *
   * @default an event whose name ends in `.deleted`
   */
  is_delete?: (event: SearchConsumeEvent) => boolean
}

function toArray(value: unknown): string[] {
  if (value === null || value === undefined) {
    return []
  }
  return (Array.isArray(value) ? value : [value]).map((entry) => String(entry))
}

/**
 * The reindex filters, narrowed by the catch-up window and the paging cursor.
 *
 * Those two go under `$and` rather than beside the caller's filters: they are
 * keyed on `updated_at` and on the primary key, so overwriting would quietly
 * widen a `reindex({ filters: { id: [...] } })` into a full scan from the
 * cursor once it pages.
 */
function seedFilters(
  filters: Record<string, any> | undefined,
  constraints: Record<string, any>[]
): Record<string, any> {
  if (!constraints.length) {
    return filters ?? {}
  }

  if (!filters || !Object.keys(filters).length) {
    return Object.assign({}, ...constraints)
  }

  const existing = Array.isArray(filters.$and) ? filters.$and : []
  return { ...filters, $and: [...existing, ...constraints] }
}

function withFields(fields: string[], ...extra: string[]): string[] {
  const missing = extra.filter((field) => !fields.includes(field))
  return missing.length ? [...fields, ...missing] : fields
}

/**
 * Builds an index definition's `seed` from a `query.graph` query.
 *
 * The seed pages the entity in ascending order of the index' primary key, so
 * the next page starts after the last row and a run interrupted halfway
 * resumes from the context's `last_key` rather than restarting. The catch-up
 * pass that follows a full seed reads the rows touched since it started with
 * soft-deleted ones included, and turns those — along with any row the
 * `transform` rejects — into deletes.
 *
 * @example
 * const productFields = search.define({
 *   id: search.keyword().filterable(),
 *   title: search.text().searchable(),
 * })
 *
 * export default defineSearchIndex({
 *   name: "product",
 *   entity: "product",
 *   fields: productFields,
 *   seed: graphSeed({ fields: ["id", "title"] }),
 * })
 */
export function graphSeed<
  Fields extends SearchTypes.SearchIndexFieldsInput,
  TRow extends GraphRow = GraphRow
>(
  options: SearchGraphSeedOptions<Fields, TRow>
): NonNullable<SearchTypes.SearchIndexDefinitionInput<Fields>["seed"]> {
  const { fields, transform, batch_size: batchSize = 200 } = options

  return async function* graphSeedGenerator(context) {
    const { container, index, catchup, last_key: lastKey } = context

    const entity = options.entity ?? index.entity
    const primaryKey = index.primary_key

    // The key pages the rows and identifies them in a delete, and the
    // soft-delete marker decides which is which — both have to be readable off
    // the rows, whether or not the index itself holds them.
    const selection = catchup
      ? withFields(fields, primaryKey, DELETED_AT_FIELD)
      : withFields(fields, primaryKey)

    let cursor: string | undefined = lastKey

    while (true) {
      const { data } = (await container.query.graph({
        entity,
        fields: selection,
        filters: seedFilters(context.filters, [
          ...(catchup ? [{ [UPDATED_AT_FIELD]: { $gte: catchup.since } }] : []),
          ...(cursor !== undefined ? [{ [primaryKey]: { $gt: cursor } }] : []),
        ]),
        pagination: { take: batchSize, order: { [primaryKey]: "ASC" } },
        withDeleted: !!catchup,
      })) as { data: TRow[] }

      if (!data.length) {
        return
      }

      const documents: SearchTypes.InferSearchDocumentType<Fields>[] = []
      const deletedIds: string[] = []

      for (const row of data) {
        // Only the catch-up pass can observe a row leaving the index — a full
        // seed builds the index from nothing, so absence is enough there.
        const removed = catchup && !!row[DELETED_AT_FIELD]
        const document = removed
          ? undefined
          : transform
          ? transform(row, context)
          : (row as unknown as SearchTypes.InferSearchDocumentType<Fields>)

        if (document) {
          documents.push(document)
          continue
        }

        if (catchup) {
          deletedIds.push(String(row[primaryKey]))
        }
      }

      const mutations: SearchTypes.SearchIndexSeedMutation<Fields>[] = []
      if (documents.length) {
        mutations.push({ action: "upsert", documents })
      }

      if (deletedIds.length) {
        mutations.push({
          action: "delete",
          filters: { [primaryKey]: deletedIds },
        })
      }

      if (mutations.length) {
        yield mutations
      }

      if (data.length < batchSize) {
        return
      }

      cursor = String(data[data.length - 1][primaryKey])
    }
  }
}

/**
 * Builds an index definition's `consume` from a `query.graph` query.
 *
 * The event's IDs are read back through `query.graph` and upserted. An ID the
 * read doesn't return, or whose row the `transform` rejects, is deleted
 * instead — which is what keeps a row that was removed, unpublished, or
 * filtered out of the index from lingering in it.
 *
 * @example
 * export default defineSearchIndex({
 *   name: "product",
 *   entity: "product",
 *   fields: productFields,
 *   events: ["product.created", "product.updated", "product.deleted"],
 *   consume: graphConsume({ fields: ["id", "title"] }),
 *   seed: graphSeed({ fields: ["id", "title"] }),
 * })
 */
export function graphConsume<
  Fields extends SearchTypes.SearchIndexFieldsInput,
  TRow extends GraphRow = GraphRow
>(
  options: SearchGraphConsumeOptions<Fields, TRow>
): NonNullable<SearchTypes.SearchIndexDefinitionInput<Fields>["consume"]> {
  const {
    fields,
    transform,
    resolve_ids: resolveIds = (event) => (event.data as any)?.id,
    is_delete: isDelete = (event) => event.name.endsWith(".deleted"),
  } = options

  return async function graphConsumer(event, context) {
    const { container, index } = context

    const entity = options.entity ?? index.entity
    const primaryKey = index.primary_key
    const ids = toArray(resolveIds(event))

    if (!ids.length) {
      return []
    }

    if (isDelete(event)) {
      return [{ action: "delete", filters: { [primaryKey]: ids } }]
    }

    const { data } = (await container.query.graph({
      entity,
      fields: withFields(fields, primaryKey),
      filters: { [primaryKey]: ids },
    })) as { data: TRow[] }

    const documents: SearchTypes.InferSearchDocumentType<Fields>[] = []
    const seen = new Set<string>()

    for (const row of data) {
      const document = transform
        ? transform(row, context)
        : (row as unknown as SearchTypes.InferSearchDocumentType<Fields>)

      if (!document) {
        continue
      }

      seen.add(String(row[primaryKey]))
      documents.push(document)
    }

    const mutations: SearchTypes.SearchIndexSeedMutation<Fields>[] = []

    if (documents.length) {
      mutations.push({ action: "upsert", documents })
    }

    // Gone, or rejected by the transform — either way it has no business being
    // in the index anymore.
    const removedIds = ids.filter((id) => !seen.has(id))
    if (removedIds.length) {
      mutations.push({
        action: "delete",
        filters: { [primaryKey]: removedIds },
      })
    }

    return mutations
  }
}
