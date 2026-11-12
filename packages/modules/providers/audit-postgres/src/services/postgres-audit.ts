import {
  AuditLogDTO,
  AuditLogFindConfig,
  FilterableAuditLogProps,
  Logger,
} from "@medusajs/framework/types"
import { Knex } from "@medusajs/framework/mikro-orm/knex"
import {
  AbstractAuditProviderService,
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  applyFilters,
  applyOrderAndPagination,
  AUDIT_LOG_TABLE,
  selectColumns,
  toRow,
} from "../utils"

export type PostgresAuditProviderOptions = {
  /**
   * Audit logs older than this many days are deleted, at most once an hour and
   * only while new audit logs are being written. When unset, audit logs are
   * kept forever.
   */
  retention_days?: number
}

type InjectedDependencies = {
  [ContainerRegistrationKeys.PG_CONNECTION]: Knex
  logger?: Logger
}

export const PRUNE_INTERVAL_MS = 60 * 60 * 1000

const DAY_MS = 24 * 60 * 60 * 1000

// Bounds each delete statement so pruning a large backlog never holds one
// long-running lock on the table.
export const PRUNE_BATCH_SIZE = 10_000

/**
 * Stores audit logs in the `audit_log` table of the application's database.
 */
export class PostgresAuditService extends AbstractAuditProviderService {
  static identifier = "audit-postgres"

  protected readonly knex_: Knex
  protected readonly retentionDays_?: number
  protected readonly logger_?: Logger
  protected lastPrunedAt_ = 0

  static validateOptions(options: PostgresAuditProviderOptions = {}) {
    const days = options?.retention_days
    if (
      days !== undefined &&
      days !== null &&
      !(typeof days === "number" && Number.isFinite(days) && days > 0)
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        'The audit-postgres "retention_days" option must be a positive number'
      )
    }
  }

  constructor(
    container: InjectedDependencies,
    options: PostgresAuditProviderOptions = {}
  ) {
    super()
    PostgresAuditService.validateOptions(options)

    this.knex_ = container[ContainerRegistrationKeys.PG_CONNECTION]
    this.retentionDays_ = options?.retention_days ?? undefined
    this.logger_ = container.logger
  }

  async write(entries: AuditLogDTO[]): Promise<void> {
    if (!entries.length) {
      return
    }

    // A retried batch may have been stored by an attempt that only failed to
    // answer, so existing ids are skipped rather than rejected.
    await this.knex_(AUDIT_LOG_TABLE)
      .insert(entries.map(toRow))
      .onConflict("id")
      .ignore()

    this.pruneIfDue_()
  }

  async list(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO[]> {
    const query = applyFilters(
      this.knex_(AUDIT_LOG_TABLE).select(selectColumns(config)),
      filters
    )

    return await applyOrderAndPagination(query, config)
  }

  async listAndCount(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<[AuditLogDTO[], number]> {
    const countQuery = applyFilters(
      this.knex_(AUDIT_LOG_TABLE).count({ count: "*" }),
      filters
    )

    const [rows, [{ count }]] = await Promise.all([
      this.list(filters, config),
      countQuery,
    ])

    return [rows, Number(count)]
  }

  async retrieve(
    id: string,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO | null> {
    const row = await this.knex_(AUDIT_LOG_TABLE)
      .select(selectColumns(config))
      .where("id", id)
      .first()

    return row ?? null
  }

  // Retention rides on writes, so there is no timer to manage. It is not
  // awaited: a slow delete must not hold back the batch that triggered it.
  protected pruneIfDue_(): void {
    if (
      !this.retentionDays_ ||
      Date.now() - this.lastPrunedAt_ < PRUNE_INTERVAL_MS
    ) {
      return
    }

    this.lastPrunedAt_ = Date.now()
    this.prune().catch((error) => {
      this.logger_?.warn(
        `Audit: deleting audit logs past retention failed: ${error?.message}`
      )
    })
  }

  /**
   * Deletes audit logs older than `retention_days`. Safe to run from several
   * instances at once: each statement deletes whatever is still there.
   */
  async prune(): Promise<number> {
    if (!this.retentionDays_) {
      return 0
    }

    const cutoff = new Date(Date.now() - this.retentionDays_ * DAY_MS)
    let deleted = 0

    while (true) {
      const result = await this.knex_.raw(
        `delete from "${AUDIT_LOG_TABLE}" where "id" in (
          select "id" from "${AUDIT_LOG_TABLE}" where "started_at" < ? limit ?
        )`,
        [cutoff, PRUNE_BATCH_SIZE]
      )

      const count = result?.rowCount ?? 0
      deleted += count

      if (count < PRUNE_BATCH_SIZE) {
        return deleted
      }
    }
  }
}
