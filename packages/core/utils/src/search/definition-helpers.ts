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
   * Filters applied to every read, on top of the ones the caller of a partial
   * reindex passes. A row excluded by them is never indexed, and is deleted
   * from the index when an event brings it back through `consume`.
   */
  filters?: Record<string, any>

  /**
   * Maps a row to the document to index. Returning `null` or `undefined`
   * excludes the row, which `consume` and the catch-up pass turn into a delete
   * so a row that stops qualifying leaves the index.
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

  /**
   * The field the seed pages on. Rows are read in ascending order of it and
   * the next page starts after the last row's value, so a seed interrupted
   * halfway resumes from the context's `last_key` instead of restarting.
   *
   * It has to be unique and stable, which is why it defaults to the index'
   * `primary_key`.
   */
  order_by?: string
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
 * Combines filter objects, falling back to `$and` only for the keys they
 * disagree on so the common case stays a flat, readable filter.
 */
function mergeFilters(
  ...parts: (Record<string, any> | undefined)[]
): Record<string, any> {
  const present = parts.filter(
    (part): part is Record<string, any> => !!part && !!Object.keys(part).length
  )

  const merged: Record<string, any> = {}
  const conflicting: Record<string, any>[] = []

  for (const part of present) {
    for (const [key, value] of Object.entries(part)) {
      if (key in merged) {
        conflicting.push({ [key]: value })
        continue
      }
      merged[key] = value
    }
  }

  if (!conflicting.length) {
    return merged
  }

  return {
    ...merged,
    $and: [...(Array.isArray(merged.$and) ? merged.$and : []), ...conflicting],
  }
}

function withField(fields: string[], field: string): string[] {
  return fields.includes(field) ? fields : [...fields, field]
}

/**
 * Builds an index definition's `seed` from a `query.graph` query.
 *
 * The seed pages the entity in ascending order of `order_by`, resuming from
 * the context's `last_key` when a previous run was interrupted. The catch-up
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
    const orderBy = options.order_by ?? index.primary_key
    const primaryKey = index.primary_key

    // The cursor and the soft-delete marker have to be readable off the rows,
    // whether or not the index itself holds them.
    let selection = withField(fields, orderBy)
    if (catchup) {
      selection = withField(selection, DELETED_AT_FIELD)
    }

    let cursor: string | undefined = lastKey

    while (true) {
      const { data } = (await container.query.graph({
        entity,
        fields: selection,
        filters: mergeFilters(
          options.filters,
          context.filters,
          catchup ? { [UPDATED_AT_FIELD]: { $gte: catchup.since } } : undefined,
          cursor !== undefined ? { [orderBy]: { $gt: cursor } } : undefined
        ),
        pagination: { take: batchSize, order: { [orderBy]: "ASC" } },
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
          deletedIds.push(String(row[orderBy]))
        }
      }

      const mutations: SearchTypes.SearchIndexSeedMutation<Fields>[] = []
      if (documents.length) {
        mutations.push({ action: "upsert", documents })
      }
      // A delete forces the buffered upserts to be flushed first, so it is only
      // yielded when there is something to remove.
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

      cursor = String(data[data.length - 1][orderBy])
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
      fields: withField(fields, primaryKey),
      filters: mergeFilters(options.filters, { [primaryKey]: ids }),
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

    // Gone, or no longer matching the source's filters — either way it has no
    // business being in the index anymore.
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
