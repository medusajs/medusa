import { Logger, SearchTypes } from "@medusajs/framework/types"
import {
  AbstractSearchProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  assertIndexSupported,
  assertQuerySupported,
  bm25IndexName,
  buildFacetQuery,
  buildIndexPlan,
  CATALOG_TABLE,
  extractPrimaryKeyFilter,
  IndexPlan,
  mapFacetResult,
  normalizeFacetRequests,
  PostgresSearchEngine,
  PostgresSearchEmbedder,
  PostgresSearchProviderOptions,
  PostgresVectorDistance,
  projectDocument,
  projectIndexedDocument,
  sameSchema,
  SqlFragment,
  tableNameForIndex,
  textSearchConfigName,
  toWhereClause,
  vectorColumnName,
  vectorDistanceOperator,
  vectorOpClass,
  weightLabel,
  wordSimilarityCall,
} from "../utils"

type DbManager = {
  execute: (sql: string, params?: unknown[]) => Promise<any[]>
  transactional?: <T>(cb: (manager: DbManager) => Promise<T>) => Promise<T>
}

type InjectedDependencies = {
  manager: DbManager
  logger?: Logger
}

type CatalogRow = {
  name: string
  table_name: string
  schema_hash: string
  plan: unknown
  document_count: number | string
  created_at: Date | string
  updated_at: Date | string
}

type StoredIndex = {
  name: string
  table_name: string
  schema_hash: string
  plan: IndexPlan
  document_count: number
  created_at: Date | string
  updated_at: Date | string
}

/**
 * Pieces of a search query that push their own placeholders. Each builder is
 * called once per statement in SQL text order, appending to the shared params
 * array, so hits and count queries stay positionally consistent.
 */
type QueryParts = {
  table: string
  /** SELECT-list relevance expression. */
  rankSql: (params: unknown[]) => string
  /** WHERE conditions (match predicate + filters). */
  conditionsSql: (params: unknown[]) => string[]
  /** Param-free ORDER BY, valid against the selected columns. */
  orderSql: string
  /**
   * Parameterized ORDER BY for the un-wrapped hits query only — lets the
   * vector path order by `col <=> ?` directly so the ANN index can serve it.
   */
  fastOrderSql?: (params: unknown[]) => string
  minScore?: number
  /** `indexed#>>...` expression to deduplicate on (one hit per value). */
  distinctExpr?: string
  count: boolean
  take: number
  skip: number
  /** Runs on the same manager before the hits query (e.g. BM25 set_config). */
  prelude?: (manager: DbManager) => Promise<void>
}

/** How many documents to write per multi-row upsert statement. */
const UPSERT_CHUNK_SIZE = 200

/**
 * PostgreSQL search provider with two engines:
 *
 * - `native` (default) — portable GIN + `ts_rank` + `pg_trgm`
 * - `lakebase` — Neon Lakebase Search (`lakebase_bm25` + `lakebase_ann`)
 *
 * Medusa Cloud uses `engine: "lakebase"`. Local / self-hosted stick to native.
 */
export class PostgresSearchService extends AbstractSearchProviderService {
  static identifier = "search-postgres"

  protected readonly manager_: DbManager
  protected readonly logger_?: Logger
  protected readonly language_: string
  protected readonly engine_: PostgresSearchEngine
  protected readonly embedder_?: PostgresSearchEmbedder
  protected readonly vectorDistance_: PostgresVectorDistance

  constructor(
    { manager, logger }: InjectedDependencies,
    options: PostgresSearchProviderOptions = {}
  ) {
    super()

    if (!manager?.execute) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "The postgres search provider requires a database manager. Ensure the Search Module is configured with a Postgres connection."
      )
    }

    this.manager_ = manager
    this.logger_ = logger
    this.language_ = this.normalizeLanguage(options.language ?? "english")
    this.engine_ = options.engine ?? "native"
    this.embedder_ = options.embedder
    this.vectorDistance_ = options.vector_distance ?? "cosine"

    if (this.engine_ !== "native" && this.engine_ !== "lakebase") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid postgres search engine "${options.engine}". Use "native" or "lakebase".`
      )
    }
  }

  protected normalizeLanguage(language: string): string {
    if (!/^[a-z0-9_]+$/i.test(language)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid postgres search language "${language}". Use a built-in text search configuration name such as "english" or "simple".`
      )
    }
    return language
  }

  protected get tsConfig_(): string {
    return textSearchConfigName(this.language_)
  }

  protected get isLakebase_(): boolean {
    return this.engine_ === "lakebase"
  }

  protected serializePlan(plan: IndexPlan): string {
    return JSON.stringify({
      primary_key: plan.primary_key,
      searchable: plan.searchable,
      vectors: plan.vectors,
      schema_hash: plan.schema_hash,
      fields: [...plan.fields.values()].map((planned) => ({
        path: planned.path,
        kind: planned.kind,
        is_array: planned.is_array,
        is_date: planned.is_date,
        dimensions: planned.dimensions,
        field: planned.field,
      })),
    })
  }

  protected deserializePlan(raw: unknown): IndexPlan {
    const data =
      typeof raw === "string" ? JSON.parse(raw) : (raw as Record<string, any>)

    const fields = new Map(
      (data.fields as any[]).map((entry) => [
        entry.path,
        {
          path: entry.path,
          kind: entry.kind,
          is_array: entry.is_array,
          is_date: entry.is_date,
          dimensions: entry.dimensions,
          field: entry.field,
        },
      ])
    )

    return {
      primary_key: data.primary_key,
      searchable: data.searchable ?? [],
      vectors:
        data.vectors ??
        [...fields.values()]
          .filter((f) => f.kind === "vector")
          .map((f) => f.path),
      schema_hash: data.schema_hash,
      fields,
    }
  }

  protected async getCatalog(
    name: string,
    manager: DbManager = this.manager_
  ): Promise<StoredIndex | null> {
    const rows = (await manager.execute(
      `SELECT * FROM "${CATALOG_TABLE}" WHERE "name" = ?`,
      [name]
    )) as CatalogRow[]

    if (!rows.length) {
      return null
    }

    const row = rows[0]
    return {
      name: row.name,
      table_name: row.table_name,
      schema_hash: row.schema_hash,
      plan: this.deserializePlan(row.plan),
      document_count: Number(row.document_count),
      created_at: row.created_at,
      updated_at: row.updated_at,
    }
  }

  protected async createDocumentTable(
    table: string,
    plan: IndexPlan,
    manager: DbManager
  ) {
    const vectorColumns = plan.vectors
      .map((path) => {
        const planned = plan.fields.get(path)!
        const col = vectorColumnName(path)
        return `"${col}" vector(${planned.dimensions})`
      })
      .join(",\n        ")

    await manager.execute(`
      CREATE TABLE IF NOT EXISTS "${table}" (
        "id" text NOT NULL,
        "document" jsonb NOT NULL,
        "indexed" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "search_vector" tsvector NOT NULL DEFAULT ''::tsvector,
        "search_text" text NOT NULL DEFAULT '',
        ${vectorColumns ? `${vectorColumns},` : ""}
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "${table}_pkey" PRIMARY KEY ("id")
      )
    `)

    // Add vector columns if the table already existed without them.
    for (const path of plan.vectors) {
      const planned = plan.fields.get(path)!
      const col = vectorColumnName(path)
      await manager.execute(`
        ALTER TABLE "${table}"
        ADD COLUMN IF NOT EXISTS "${col}" vector(${planned.dimensions})
      `)
    }

    if (this.isLakebase_) {
      // BM25 index is created lazily after documents exist (corpus stats).
      await manager.execute(`DROP INDEX IF EXISTS "${table}_fts_idx"`)
    } else {
      await manager.execute(
        `CREATE INDEX IF NOT EXISTS "${table}_fts_idx" ON "${table}" USING GIN ("search_vector")`
      )
    }

    await manager.execute(
      `CREATE INDEX IF NOT EXISTS "${table}_trgm_idx" ON "${table}" USING GIN ("search_text" gin_trgm_ops)`
    )

    await manager.execute(
      `CREATE INDEX IF NOT EXISTS "${table}_indexed_idx" ON "${table}" USING GIN ("indexed" jsonb_path_ops)`
    )

    if (this.isLakebase_) {
      const opClass = vectorOpClass(this.vectorDistance_)
      for (const path of plan.vectors) {
        const col = vectorColumnName(path)
        await manager.execute(`
          CREATE INDEX IF NOT EXISTS "${table}_${col}_ann"
          ON "${table}" USING lakebase_ann ("${col}" ${opClass})
        `)
      }
    }
  }

  protected async ensureBm25Index(
    table: string,
    manager: DbManager = this.manager_
  ) {
    if (!this.isLakebase_) {
      return
    }

    const name = bm25IndexName(table)
    await manager.execute(`
      CREATE INDEX IF NOT EXISTS "${name}"
      ON "${table}" USING lakebase_bm25 ("search_vector")
      WITH (default_limit = 1000)
    `)
  }

  protected async dropBm25Index(
    table: string,
    manager: DbManager = this.manager_
  ) {
    if (!this.isLakebase_) {
      return
    }
    await manager.execute(`DROP INDEX IF EXISTS "${bm25IndexName(table)}"`)
  }

  protected async dropDocumentTable(table: string, manager: DbManager) {
    await manager.execute(`DROP TABLE IF EXISTS "${table}" CASCADE`)
  }

  /**
   * Renaming a table leaves its constraint and index names behind, and a later
   * rebuild of the same shadow name would collide with them (or silently skip
   * `CREATE INDEX IF NOT EXISTS`). Rename every table-derived artifact too.
   */
  protected async renameTableArtifacts(
    from: string,
    to: string,
    plan: IndexPlan,
    manager: DbManager
  ) {
    await manager.execute(
      `ALTER TABLE "${to}" RENAME CONSTRAINT "${from}_pkey" TO "${to}_pkey"`
    )

    const suffixes = ["fts_idx", "trgm_idx", "indexed_idx", "bm25"]
    for (const path of plan.vectors) {
      suffixes.push(`${vectorColumnName(path)}_ann`)
    }

    for (const suffix of suffixes) {
      await manager.execute(
        `ALTER INDEX IF EXISTS "${from}_${suffix}" RENAME TO "${to}_${suffix}"`
      )
    }
  }

  protected async adjustDocumentCount(
    name: string,
    delta: number,
    manager: DbManager = this.manager_
  ) {
    if (!delta) {
      return
    }
    await manager.execute(
      `UPDATE "${CATALOG_TABLE}"
       SET "document_count" = GREATEST("document_count" + ?, 0), "updated_at" = now()
       WHERE "name" = ?`,
      [delta, name]
    )
  }

  protected async setDocumentCount(
    name: string,
    count: number,
    manager: DbManager = this.manager_
  ) {
    await manager.execute(
      `UPDATE "${CATALOG_TABLE}"
       SET "document_count" = ?, "updated_at" = now()
       WHERE "name" = ?`,
      [count, name]
    )
  }

  protected async withTransaction<T>(
    run: (manager: DbManager) => Promise<T>
  ): Promise<T> {
    if (this.manager_.transactional) {
      return await this.manager_.transactional(run)
    }
    return await run(this.manager_)
  }

  async upsertIndex({
    index,
  }: {
    index: SearchTypes.ResolvedSearchIndexDefinition
  }): Promise<SearchTypes.SearchTask> {
    assertIndexSupported(index, this.engine_)
    const plan = buildIndexPlan(index)
    const table = tableNameForIndex(index.physical_name)
    const existing = await this.getCatalog(index.physical_name)
    const rebuilt =
      !!existing && !sameSchema(existing.plan, plan) && !!existing.table_name

    await this.withTransaction(async (manager) => {
      if (rebuilt) {
        await this.dropDocumentTable(existing!.table_name, manager)
      }

      await this.createDocumentTable(table, plan, manager)

      const planJson = this.serializePlan(plan)

      if (existing) {
        await manager.execute(
          `UPDATE "${CATALOG_TABLE}"
           SET "table_name" = ?, "schema_hash" = ?, "plan" = ?::jsonb,
               ${rebuilt ? `"document_count" = 0,` : ""}
               "updated_at" = now()
           WHERE "name" = ?`,
          [table, plan.schema_hash, planJson, index.physical_name]
        )
      } else {
        await manager.execute(
          `INSERT INTO "${CATALOG_TABLE}"
            ("name", "table_name", "schema_hash", "plan", "document_count")
           VALUES (?, ?, ?, ?::jsonb, 0)`,
          [index.physical_name, table, plan.schema_hash, planJson]
        )
      }
    })

    return this.task(index.physical_name)
  }

  async deleteIndex({
    index,
  }: {
    index: string
  }): Promise<SearchTypes.SearchTask> {
    const existing = await this.getCatalog(index)

    if (existing) {
      await this.dropDocumentTable(existing.table_name, this.manager_)
      await this.manager_.execute(
        `DELETE FROM "${CATALOG_TABLE}" WHERE "name" = ?`,
        [index]
      )
    }

    return this.task(index)
  }

  async listIndexes(): Promise<SearchTypes.SearchIndexInfo[]> {
    const rows = (await this.manager_.execute(
      `SELECT "name", "document_count", "created_at", "updated_at"
       FROM "${CATALOG_TABLE}"
       ORDER BY "name"`
    )) as CatalogRow[]

    return rows.map((row) => ({
      name: row.name,
      provider: PostgresSearchService.identifier,
      document_count: Number(row.document_count),
      created_at:
        row.created_at instanceof Date
          ? row.created_at
          : new Date(row.created_at),
      updated_at:
        row.updated_at instanceof Date
          ? row.updated_at
          : new Date(row.updated_at),
    }))
  }

  async swapIndex({
    alias,
    index,
  }: {
    alias: string
    index: string
  }): Promise<SearchTypes.SearchTask> {
    const shadow = await this.getCatalog(index)
    if (!shadow) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `The postgres search provider has no index "${index}" to swap from`
      )
    }

    const live = await this.getCatalog(alias)
    const aliasTable = tableNameForIndex(alias)

    await this.withTransaction(async (manager) => {
      if (live) {
        await this.dropDocumentTable(live.table_name, manager)
        await manager.execute(
          `DELETE FROM "${CATALOG_TABLE}" WHERE "name" = ?`,
          [alias]
        )
      }

      if (shadow.table_name !== aliasTable) {
        await manager.execute(
          `ALTER TABLE "${shadow.table_name}" RENAME TO "${aliasTable}"`
        )
        await this.renameTableArtifacts(
          shadow.table_name,
          aliasTable,
          shadow.plan,
          manager
        )
      }

      await manager.execute(`DELETE FROM "${CATALOG_TABLE}" WHERE "name" = ?`, [
        index,
      ])

      await manager.execute(
        `INSERT INTO "${CATALOG_TABLE}"
          ("name", "table_name", "schema_hash", "plan", "document_count", "created_at", "updated_at")
         VALUES (?, ?, ?, ?::jsonb, ?, ?, now())`,
        [
          alias,
          aliasTable,
          shadow.plan.schema_hash,
          this.serializePlan(shadow.plan),
          shadow.document_count,
          shadow.created_at instanceof Date
            ? shadow.created_at
            : new Date(shadow.created_at),
        ]
      )

      if (shadow.document_count > 0) {
        await this.ensureBm25Index(aliasTable, manager)
      }
    })

    return this.task(alias)
  }

  protected buildSearchVectorSql(
    weightedParts: { text: string; weight: "A" | "B" | "C" | "D" }[],
    params: unknown[]
  ): string {
    if (!weightedParts.length) {
      return `''::tsvector`
    }

    return weightedParts
      .map((part) => {
        params.push(part.text)
        return `setweight(to_tsvector('${this.tsConfig_}', coalesce(?, '')), '${part.weight}')`
      })
      .join(" || ")
  }

  async upsertDocuments({
    index,
    documents,
  }: {
    index: string
    definition: SearchTypes.ResolvedSearchIndexDefinition
    documents: SearchTypes.SearchDocument[]
  }): Promise<SearchTypes.SearchTask> {
    const catalog = await this.retrieve(index)

    if (!documents.length) {
      return this.task(index)
    }

    // Last write wins on duplicate ids — a multi-row upsert cannot touch the
    // same id twice within one statement.
    const projections = new Map<
      string,
      {
        document: SearchTypes.SearchDocument
        projection: ReturnType<typeof projectIndexedDocument>
      }
    >()
    for (const document of documents) {
      const projection = projectIndexedDocument(document, catalog.plan)
      projections.set(projection.id, { document, projection })
    }

    const vectors = catalog.plan.vectors
    const entries = [...projections.values()]

    await this.withTransaction(async (manager) => {
      let inserted = 0

      for (
        let offset = 0;
        offset < entries.length;
        offset += UPSERT_CHUNK_SIZE
      ) {
        const chunk = entries.slice(offset, offset + UPSERT_CHUNK_SIZE)
        const rowsSql: string[] = []
        const params: unknown[] = []

        for (const { document, projection } of chunk) {
          params.push(
            projection.id,
            JSON.stringify(document),
            JSON.stringify(projection.indexed)
          )
          const vectorSql = this.buildSearchVectorSql(
            projection.weighted_parts,
            params
          )
          params.push(projection.search_text)

          const vectorPlaceholders = vectors.map((path) => {
            const embedding = projection.vectors[path]
            params.push(embedding ? `[${embedding.join(",")}]` : null)
            return `?::vector`
          })

          rowsSql.push(
            `(?, ?::jsonb, ?::jsonb, ${vectorSql}, ?${
              vectorPlaceholders.length
                ? `, ${vectorPlaceholders.join(", ")}`
                : ""
            }, now())`
          )
        }

        const vectorCols = vectors.map(
          (path) => `"${vectorColumnName(path)}"`
        )
        const vectorUpdates = vectorCols.map(
          (col) => `${col} = EXCLUDED.${col}`
        )

        const rows = await manager.execute(
          `
          INSERT INTO "${catalog.table_name}"
            ("id", "document", "indexed", "search_vector", "search_text"${
              vectorCols.length ? `, ${vectorCols.join(", ")}` : ""
            }, "updated_at")
          VALUES ${rowsSql.join(",\n")}
          ON CONFLICT ("id") DO UPDATE SET
            "document" = EXCLUDED."document",
            "indexed" = EXCLUDED."indexed",
            "search_vector" = EXCLUDED."search_vector",
            "search_text" = EXCLUDED."search_text"${
              vectorUpdates.length ? `, ${vectorUpdates.join(", ")}` : ""
            },
            "updated_at" = now()
          RETURNING (xmax = 0)::int AS inserted
          `,
          params
        )

        for (const row of rows) {
          inserted += Number(row.inserted ?? 0)
        }
      }

      await this.adjustDocumentCount(index, inserted, manager)
    })

    // Create the BM25 index once documents exist (corpus stats need rows).
    if (this.isLakebase_) {
      await this.ensureBm25Index(catalog.table_name)
    }

    return this.task(index)
  }

  async deleteDocuments({
    index,
    filters,
  }: SearchTypes.SearchDeleteDocumentsInput): Promise<SearchTypes.SearchTask> {
    const catalog = await this.retrieve(index)

    await this.withTransaction(async (manager) => {
      const ids = extractPrimaryKeyFilter(filters, catalog.plan)
      let deleted: any[] = []

      if (ids) {
        if (ids.length) {
          deleted = await manager.execute(
            `DELETE FROM "${catalog.table_name}" WHERE "id" = ANY(?::text[]) RETURNING "id"`,
            [ids]
          )
        }
      } else {
        const where = toWhereClause(filters, catalog.plan)
        if (where?.sql) {
          deleted = await manager.execute(
            `DELETE FROM "${catalog.table_name}" WHERE ${where.sql} RETURNING "id"`,
            where.params
          )
        }
      }

      await this.adjustDocumentCount(index, -deleted.length, manager)
    })

    return this.task(index)
  }

  async clearIndex({
    index,
  }: {
    index: string
  }): Promise<SearchTypes.SearchTask> {
    const catalog = await this.retrieve(index)

    await this.dropBm25Index(catalog.table_name)
    await this.manager_.execute(`TRUNCATE TABLE "${catalog.table_name}"`)
    await this.setDocumentCount(index, 0)

    return this.task(index)
  }

  async search(
    input: SearchTypes.ProviderSearchQuery
  ): Promise<SearchTypes.SearchResult> {
    assertQuerySupported(input, this.engine_)

    const catalog = await this.retrieve(input.index.physical_name)
    const plan = catalog.plan
    const options = input.search_options ?? {}
    const skip = input.pagination?.skip ?? 0
    const take = input.pagination?.take ?? 20
    const started = Date.now()

    for (const path of options.attributes_to_search_on ?? []) {
      if (!plan.searchable.includes(path)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Field "${path}" is not searchable on search index "${input.index.name}"`
        )
      }
    }

    // Fails early on unknown / unsupported distinct fields.
    this.resolveDistinct(options.distinct, plan, input.index.name)

    const q = input.q?.trim()
    const vectorOpts = options.vector
    const semanticRatio =
      vectorOpts?.semantic_ratio ??
      (q && vectorOpts ? 0.5 : vectorOpts ? 1 : 0)

    if (q && !plan.searchable.length && semanticRatio < 1) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Search index "${input.index.name}" has no searchable fields, so it cannot be queried by text`
      )
    }

    let queryEmbedding: number[] | undefined
    if (vectorOpts && semanticRatio > 0) {
      queryEmbedding = await this.resolveQueryEmbedding(vectorOpts, plan)
    }

    const useKeyword = !!q && semanticRatio < 1
    const useVector = !!queryEmbedding && semanticRatio > 0

    let hitRows: any[]
    let count: number | null

    if (useKeyword && useVector) {
      ;({ hitRows, count } = await this.searchHybrid({
        input,
        catalog,
        queryEmbedding: queryEmbedding!,
        semanticRatio,
        skip,
        take,
      }))
    } else if (useVector) {
      ;({ hitRows, count } = await this.searchVector({
        input,
        catalog,
        queryEmbedding: queryEmbedding!,
        skip,
        take,
      }))
    } else {
      ;({ hitRows, count } = await this.searchKeyword({
        input,
        catalog,
        skip,
        take,
      }))
    }

    const facets = await this.resolveFacets({
      table: catalog.table_name,
      plan,
      scopeWhere: this.buildFacetScope({
        input,
        catalog,
        useKeyword,
        useVector,
      }),
      requests: options.facets as
        | (string | SearchTypes.SearchFacetRequest)[]
        | undefined,
    })

    return {
      hits: hitRows.map((row: any) => {
        const document =
          typeof row.document === "string"
            ? JSON.parse(row.document)
            : row.document

        return {
          id: row.id,
          score: options.include_score ? Number(row.score) : undefined,
          document: projectDocument(document, input.attributes_to_retrieve),
        }
      }),
      facets,
      metadata: {
        skip,
        take,
        count: options.count === "none" ? null : count,
        query: input.q,
        processing_time_ms: Date.now() - started,
      },
    }
  }

  protected async resolveQueryEmbedding(
    vectorOpts: NonNullable<SearchTypes.SearchOptions["vector"]>,
    plan: IndexPlan
  ): Promise<number[]> {
    const field = vectorOpts.field
    const planned = plan.fields.get(field)

    if (!planned || planned.kind !== "vector") {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Vector search field "${field}" is not a vector field on this index`
      )
    }

    if (vectorOpts.value) {
      if (vectorOpts.value.length !== planned.dimensions) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Vector value for "${field}" expected ${planned.dimensions} dimensions, got ${vectorOpts.value.length}`
        )
      }
      return vectorOpts.value
    }

    if (!vectorOpts.query) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `search_options.vector requires either "value" (embedding) or "query" (text to embed)`
      )
    }

    if (!this.embedder_) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `search_options.vector.query requires an "embedder" function on the postgres search provider options`
      )
    }

    const embedding = await this.embedder_(vectorOpts.query)
    if (embedding.length !== planned.dimensions) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Embedder returned ${embedding.length} dimensions for "${field}", expected ${planned.dimensions}`
      )
    }
    return embedding
  }

  /**
   * The keyword match/rank fragments, shared by the keyword path, the hybrid
   * count and the facet scope so they always describe the same result set.
   * Each fragment pushes its own placeholders when invoked.
   */
  protected keywordFragments(input: {
    query: SearchTypes.ProviderSearchQuery
    catalog: StoredIndex
  }): {
    q?: string
    needsBm25Limit: boolean
    rankSql: (params: unknown[]) => string
    matchSql?: (params: unknown[]) => string
  } {
    const { query, catalog } = input
    const plan = catalog.plan
    const options = query.search_options ?? {}
    const q = query.q?.trim() || undefined
    const typo = !!(q && options.typo_tolerance)
    const matchAny = options.match_strategy === "any"
    const searchOn = options.attributes_to_search_on ?? plan.searchable
    const searchAllFields =
      searchOn.length === plan.searchable.length &&
      searchOn.every((path) => plan.searchable.includes(path))
    const tsConfig = this.tsConfig_
    const vectorExpr = searchAllFields
      ? `"search_vector"`
      : this.onTheFlyVectorExpr(searchOn, plan)
    const textExpr = searchAllFields
      ? `"search_text"`
      : this.onTheFlyTextExpr(searchOn)
    const useBm25 = this.isLakebase_ && !!q && searchAllFields

    const tsquery = (params: unknown[]) => {
      params.push(q)
      // plainto_tsquery ANDs every term; match_strategy "any" flips it to OR.
      return matchAny
        ? `replace(plainto_tsquery('${tsConfig}', ?)::text, ' & ', ' | ')::tsquery`
        : `plainto_tsquery('${tsConfig}', ?)`
    }

    const wordSim = (params: unknown[]) => {
      params.push(q)
      return wordSimilarityCall("?", textExpr)
    }

    const rankSql = (params: unknown[]) => {
      if (!q) {
        return `0::float4`
      }

      let base: string
      if (useBm25) {
        params.push(q)
        const bm25 = bm25IndexName(catalog.table_name)
        // Negative BM25 → negate so higher scores are better (API convention).
        base = `-1 * (${vectorExpr} <@> to_bm25query(to_tsvector('${tsConfig}', ?), '${bm25}'::regclass))`
      } else {
        base = `ts_rank_cd(${vectorExpr}, ${tsquery(params)})`
      }

      return typo ? `GREATEST(${base}, ${wordSim(params)})` : base
    }

    const matchSql = q
      ? (params: unknown[]) => {
          const match = `${vectorExpr} @@ ${tsquery(params)}`
          return typo ? `(${match} OR ${wordSim(params)} > 0.3)` : match
        }
      : undefined

    return { q, needsBm25Limit: useBm25, rankSql, matchSql }
  }

  protected async searchKeyword(input: {
    input: SearchTypes.ProviderSearchQuery
    catalog: StoredIndex
    skip: number
    take: number
  }): Promise<{ hitRows: any[]; count: number | null }> {
    const { input: query, catalog, skip, take } = input
    const plan = catalog.plan
    const options = query.search_options ?? {}
    const filterWhere = toWhereClause(query.filters, plan)
    const fragments = this.keywordFragments({ query, catalog })

    const conditionsSql = (params: unknown[]) => {
      const conditions: string[] = []
      if (fragments.matchSql) {
        conditions.push(fragments.matchSql(params))
      }
      if (filterWhere?.sql) {
        conditions.push(`(${filterWhere.sql})`)
        params.push(...filterWhere.params)
      }
      return conditions
    }

    const prelude = fragments.needsBm25Limit
      ? async (manager: DbManager) => {
          const bm25 = bm25IndexName(catalog.table_name)
          const [row] = await manager.execute(
            `SELECT to_regclass(?) IS NOT NULL AS exists`,
            [bm25]
          )
          if (!row?.exists) {
            await this.ensureBm25Index(catalog.table_name, manager)
          }
          await manager.execute(
            `SELECT set_config('lakebase_bm25.default_limit', ?, true)`,
            [String(take + skip)]
          )
        }
      : undefined

    return await this.executeQuery({
      table: catalog.table_name,
      rankSql: fragments.rankSql,
      conditionsSql,
      orderSql: this.resolveOrderBy(query, plan, !!fragments.q),
      minScore: options.min_score,
      distinctExpr: this.resolveDistinct(
        options.distinct,
        plan,
        query.index.name
      ),
      count: options.count !== "none",
      take,
      skip,
      prelude,
    })
  }

  protected async searchVector(input: {
    input: SearchTypes.ProviderSearchQuery
    catalog: StoredIndex
    queryEmbedding: number[]
    skip: number
    take: number
  }): Promise<{ hitRows: any[]; count: number | null }> {
    const { input: query, catalog, queryEmbedding, skip, take } = input
    const options = query.search_options ?? {}
    const field = options.vector?.field
    if (!field) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `search_options.vector.field is required for vector search`
      )
    }

    const col = vectorColumnName(field)
    const op = vectorDistanceOperator(this.vectorDistance_)
    const filterWhere = toWhereClause(query.filters, catalog.plan)
    const embeddingLiteral = `[${queryEmbedding.join(",")}]`

    const rankSql = (params: unknown[]) => {
      params.push(embeddingLiteral)
      // Distance → relevance (higher is better).
      return `(1.0 / (1.0 + ("${col}" ${op} ?::vector)))`
    }

    const conditionsSql = (params: unknown[]) => {
      const conditions: string[] = [`"${col}" IS NOT NULL`]
      if (filterWhere?.sql) {
        conditions.push(`(${filterWhere.sql})`)
        params.push(...filterWhere.params)
      }
      return conditions
    }

    const hasCustomOrder = !!Object.keys(query.pagination?.order ?? {}).length
    // The default order is distance ASC; expressed directly (instead of via
    // the score alias) so the ANN index can serve the scan.
    const fastOrderSql = hasCustomOrder
      ? undefined
      : (params: unknown[]) => {
          params.push(embeddingLiteral)
          return `"${col}" ${op} ?::vector ASC, "id" ASC`
        }

    return await this.executeQuery({
      table: catalog.table_name,
      rankSql,
      conditionsSql,
      orderSql: this.resolveOrderBy(query, catalog.plan, true),
      fastOrderSql,
      minScore: options.min_score,
      distinctExpr: this.resolveDistinct(
        options.distinct,
        catalog.plan,
        query.index.name
      ),
      count: options.count !== "none",
      take,
      skip,
    })
  }

  protected async searchHybrid(input: {
    input: SearchTypes.ProviderSearchQuery
    catalog: StoredIndex
    queryEmbedding: number[]
    semanticRatio: number
    skip: number
    take: number
  }): Promise<{ hitRows: any[]; count: number | null }> {
    const {
      input: query,
      catalog,
      queryEmbedding,
      semanticRatio,
      skip,
      take,
    } = input
    const options = query.search_options ?? {}
    const plan = catalog.plan

    const order = query.pagination?.order ?? {}
    const fieldOrderKeys = Object.keys(order).filter((key) => key !== "_score")
    if (fieldOrderKeys.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Hybrid search results are rank-fused, so they can only be ordered by "_score" (got "${fieldOrderKeys.join(
          ", "
        )}"). Drop the vector option or the field order.`
      )
    }

    // Arms are relevance-ranked candidate lists; page-level options (distinct,
    // min_score, count, order) apply to the fused list instead.
    const candidateLimit = Math.max(take + skip, 40) * 2
    const armQuery: SearchTypes.ProviderSearchQuery = {
      ...query,
      pagination: {},
      search_options: {
        ...options,
        min_score: undefined,
        distinct: undefined,
        count: "none",
      },
    }

    const [keyword, vector] = await Promise.all([
      this.searchKeyword({
        input: armQuery,
        catalog,
        skip: 0,
        take: candidateLimit,
      }),
      this.searchVector({
        input: armQuery,
        catalog,
        queryEmbedding,
        skip: 0,
        take: candidateLimit,
      }),
    ])

    // Reciprocal Rank Fusion over keyword + vector candidate lists. Fused
    // scores live on the RRF scale (≤ ~1/60 per arm), which is also the scale
    // `min_score` is compared against for hybrid queries.
    const k = 60
    const keywordWeight = 1 - semanticRatio
    const vectorWeight = semanticRatio
    const scores = new Map<
      string,
      { id: string; document: unknown; indexed: unknown; score: number }
    >()

    keyword.hitRows.forEach((row, rank) => {
      scores.set(row.id, {
        id: row.id,
        document: row.document,
        indexed: row.indexed,
        score: keywordWeight * (1 / (k + rank + 1)),
      })
    })

    vector.hitRows.forEach((row, rank) => {
      const rrf = vectorWeight * (1 / (k + rank + 1))
      const existing = scores.get(row.id)
      if (existing) {
        existing.score += rrf
      } else {
        scores.set(row.id, {
          id: row.id,
          document: row.document,
          indexed: row.indexed,
          score: rrf,
        })
      }
    })

    let ranked = [...scores.values()].sort((a, b) => b.score - a.score)

    if (options.distinct) {
      const seen = new Set<string>()
      ranked = ranked.filter((row) => {
        const key = this.readIndexedValue(row.indexed, options.distinct!)
        if (key === undefined) {
          return true
        }
        if (seen.has(key)) {
          return false
        }
        seen.add(key)
        return true
      })
    }

    if (options.min_score !== undefined) {
      ranked = ranked.filter((row) => row.score >= options.min_score!)
    }

    if (order._score === "ASC") {
      ranked.reverse()
    }

    const page = ranked.slice(skip, skip + take)

    // The fused list is a bounded candidate window, so its length is not a
    // usable total — count the union of both arms' match sets instead.
    let count: number | null = null
    if (options.count !== "none") {
      const fragments = this.keywordFragments({ query, catalog })
      const col = vectorColumnName(options.vector!.field)
      const filterWhere = toWhereClause(query.filters, plan)
      const params: unknown[] = []
      const conditions = [
        `(${fragments.matchSql!(params)} OR "${col}" IS NOT NULL)`,
      ]
      if (filterWhere?.sql) {
        conditions.push(`(${filterWhere.sql})`)
        params.push(...filterWhere.params)
      }

      const distinctExpr = this.resolveDistinct(
        options.distinct,
        plan,
        query.index.name
      )
      const countExpr = distinctExpr
        ? `COUNT(DISTINCT ${distinctExpr})`
        : `COUNT(*)`

      const rows = await this.manager_.execute(
        `SELECT ${countExpr}::int AS count FROM "${catalog.table_name}" WHERE ${conditions.join(
          " AND "
        )}`,
        params
      )
      count = Number(rows[0]?.count ?? 0)
    }

    return { hitRows: page, count }
  }

  /**
   * Runs the hits + count statements for a single-arm search. Wraps the base
   * select in subqueries when `min_score` or `distinct` need to see the score
   * as a real column.
   */
  protected async executeQuery(
    parts: QueryParts
  ): Promise<{ hitRows: any[]; count: number | null }> {
    const { table, minScore, distinctExpr, take, skip } = parts
    const wrap = minScore !== undefined || !!distinctExpr

    const buildBase = (params: unknown[]) => {
      const rank = parts.rankSql(params)
      const conditions = parts.conditionsSql(params)
      const whereSql = conditions.length
        ? `WHERE ${conditions.join(" AND ")}`
        : ""
      return `SELECT "id", "document", "indexed", ${rank} AS score FROM "${table}" ${whereSql}`
    }

    const buildWrappedFrom = (params: unknown[]) => {
      let from = `(${buildBase(params)}) ranked`
      if (distinctExpr) {
        // One representative row per value, picked by the requested order.
        from = `(
          SELECT ranked.*, ROW_NUMBER() OVER (
            PARTITION BY ${distinctExpr} ORDER BY ${parts.orderSql}
          ) AS __rn
          FROM ${from}
        ) deduped`
      }
      return from
    }

    const wrappedConditions = () => {
      const outer: string[] = []
      if (distinctExpr) {
        outer.push(`__rn = 1`)
      }
      if (minScore !== undefined) {
        outer.push(`score >= ?`)
      }
      return outer
    }

    let hitsSql: string
    const hitsParams: unknown[] = []

    if (!wrap) {
      const base = buildBase(hitsParams)
      const orderSql = parts.fastOrderSql
        ? parts.fastOrderSql(hitsParams)
        : parts.orderSql
      hitsSql = `${base} ORDER BY ${orderSql} LIMIT ? OFFSET ?`
      hitsParams.push(take, skip)
    } else {
      const from = buildWrappedFrom(hitsParams)
      const outer = wrappedConditions()
      hitsSql = `
        SELECT * FROM ${from}
        ${outer.length ? `WHERE ${outer.join(" AND ")}` : ""}
        ORDER BY ${parts.orderSql}
        LIMIT ? OFFSET ?
      `
      if (minScore !== undefined) {
        hitsParams.push(minScore)
      }
      hitsParams.push(take, skip)
    }

    let countSql: string | null = null
    const countParams: unknown[] = []

    if (parts.count) {
      if (!wrap) {
        const conditions = parts.conditionsSql(countParams)
        countSql = `SELECT COUNT(*)::int AS count FROM "${table}" ${
          conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""
        }`
      } else {
        const from = buildWrappedFrom(countParams)
        const outer = wrappedConditions()
        countSql = `
          SELECT COUNT(*)::int AS count FROM ${from}
          ${outer.length ? `WHERE ${outer.join(" AND ")}` : ""}
        `
        if (minScore !== undefined) {
          countParams.push(minScore)
        }
      }
    }

    const run = async (manager: DbManager) => {
      if (parts.prelude) {
        await parts.prelude(manager)
      }

      const hitRows = await manager.execute(hitsSql, hitsParams)
      const count = countSql
        ? Number(
            (await manager.execute(countSql, countParams))[0]?.count ?? 0
          )
        : null

      return { hitRows, count }
    }

    // set_config in the prelude is transaction-local, so it needs the hits
    // query inside the same transaction. Plain reads skip the overhead.
    return parts.prelude ? await this.withTransaction(run) : await run(this.manager_)
  }

  async searchMany(
    inputs: SearchTypes.ProviderSearchQuery[]
  ): Promise<SearchTypes.SearchResult[]> {
    return await Promise.all(inputs.map((input) => this.search(input)))
  }

  /**
   * The WHERE fragment facets are scoped by: the filters plus the same match
   * predicate as the hits, so facet counts describe the result set.
   */
  protected buildFacetScope(input: {
    input: SearchTypes.ProviderSearchQuery
    catalog: StoredIndex
    useKeyword: boolean
    useVector: boolean
  }): SqlFragment | undefined {
    const { input: query, catalog, useKeyword, useVector } = input
    const params: unknown[] = []
    const conditions: string[] = []

    const matchSql = useKeyword
      ? this.keywordFragments({ query, catalog }).matchSql
      : undefined
    const vectorCond = useVector
      ? `"${vectorColumnName(query.search_options!.vector!.field)}" IS NOT NULL`
      : undefined

    if (matchSql && vectorCond) {
      conditions.push(`(${matchSql(params)} OR ${vectorCond})`)
    } else if (matchSql) {
      conditions.push(matchSql(params))
    } else if (vectorCond) {
      conditions.push(vectorCond)
    }

    const filterWhere = toWhereClause(query.filters, catalog.plan)
    if (filterWhere?.sql) {
      conditions.push(`(${filterWhere.sql})`)
      params.push(...filterWhere.params)
    }

    return conditions.length
      ? { sql: conditions.join(" AND "), params }
      : undefined
  }

  protected async resolveFacets(input: {
    table: string
    plan: IndexPlan
    scopeWhere?: SqlFragment
    requests?: (string | SearchTypes.SearchFacetRequest)[]
  }): Promise<Record<string, SearchTypes.SearchFacetResult> | undefined> {
    const requests = normalizeFacetRequests(input.requests, input.plan)
    if (!requests.length) {
      return undefined
    }

    const result: Record<string, SearchTypes.SearchFacetResult> = {}

    for (const request of requests) {
      const query = buildFacetQuery({
        table: input.table,
        whereSql: input.scopeWhere?.sql,
        whereParams: input.scopeWhere?.params ?? [],
        request,
        plan: input.plan,
      })
      const rows = await this.manager_.execute(query.sql, query.params)
      result[request.field] = mapFacetResult(request, rows)
    }

    return result
  }

  protected onTheFlyTextExpr(paths: string[]): string {
    if (!paths.length) {
      return `''`
    }

    return paths
      .map((path) => {
        const jsonPath = `'{${path.split(".").join(",")}}'`
        return `coalesce(indexed#>>${jsonPath}, '')`
      })
      .join(` || ' ' || `)
  }

  protected onTheFlyVectorExpr(paths: string[], plan: IndexPlan): string {
    if (!paths.length) {
      return `''::tsvector`
    }

    return paths
      .map((path) => {
        const planned = plan.fields.get(path)
        const weight = planned ? weightLabel(planned.field.searchable) : "D"
        const jsonPath = `'{${path.split(".").join(",")}}'`
        return `setweight(to_tsvector('${this.tsConfig_}', coalesce(indexed#>>${jsonPath}, '')), '${weight}')`
      })
      .join(" || ")
  }

  protected resolveOrderBy(
    input: SearchTypes.ProviderSearchQuery,
    plan: IndexPlan,
    hasScore: boolean
  ): string {
    const order = Object.entries(input.pagination?.order ?? {})

    if (!order.length) {
      return hasScore
        ? `score DESC NULLS LAST, "id" ASC`
        : `"id" ASC`
    }

    const clauses: string[] = []

    for (const [property, direction] of order) {
      const dir = direction === "ASC" ? "ASC" : "DESC"

      if (property === "_score") {
        clauses.push(`score ${dir} NULLS LAST`)
        continue
      }

      const planned = plan.fields.get(property)
      if (!planned) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Cannot sort search index "${input.index.name}" by unknown field "${property}"`
        )
      }

      if (planned.is_array || planned.kind === "vector") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `The postgres search provider cannot sort by "${property}"`
        )
      }

      const jsonPath = `'{${property.split(".").join(",")}}'`

      if (planned.kind === "number") {
        clauses.push(`(indexed#>>${jsonPath})::float8 ${dir} NULLS LAST`)
      } else if (planned.kind === "boolean") {
        clauses.push(`(indexed#>>${jsonPath})::boolean ${dir} NULLS LAST`)
      } else {
        clauses.push(`indexed#>>${jsonPath} ${dir} NULLS LAST`)
      }
    }

    return clauses.join(", ")
  }

  /**
   * Validates `search_options.distinct` and returns the SQL expression to
   * deduplicate on, or undefined when not requested.
   */
  protected resolveDistinct(
    distinct: string | undefined,
    plan: IndexPlan,
    indexName: string
  ): string | undefined {
    if (!distinct) {
      return undefined
    }

    const planned = plan.fields.get(distinct)
    if (!planned) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot deduplicate search index "${indexName}" by unknown field "${distinct}"`
      )
    }

    if (planned.is_array || planned.kind === "vector") {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `The postgres search provider cannot deduplicate by "${distinct}"`
      )
    }

    return `indexed#>>'{${distinct.split(".").join(",")}}'`
  }

  /** Reads a dotted path from an `indexed` jsonb value returned by a query. */
  protected readIndexedValue(
    indexed: unknown,
    path: string
  ): string | undefined {
    const parsed =
      typeof indexed === "string" ? JSON.parse(indexed) : indexed

    const value = path
      .split(".")
      .reduce<any>(
        (acc, segment) => (acc == null ? undefined : acc[segment]),
        parsed
      )

    return value == null ? undefined : String(value)
  }

  protected async retrieve(index: string): Promise<StoredIndex> {
    const catalog = await this.getCatalog(index)

    if (!catalog) {
      const known = await this.listIndexes()
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `The postgres search provider has no index "${index}". Known indexes: ${
          known.map((entry) => entry.name).join(", ") || "(none)"
        }`
      )
    }

    return catalog
  }

  protected task(index: string): SearchTypes.SearchTask {
    return { index, status: "succeeded" }
  }
}
