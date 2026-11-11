import {
  AuditLogDTO,
  AuditLogFindConfig,
  FilterableAuditLogProps,
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
   * Audit logs older than this many days are deleted periodically. When unset,
   * audit logs are kept forever.
   */
  retention_days?: number
}

type InjectedDependencies = {
  [ContainerRegistrationKeys.PG_CONNECTION]: Knex
}

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
