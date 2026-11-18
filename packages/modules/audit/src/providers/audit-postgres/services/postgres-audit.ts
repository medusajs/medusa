import {
  AuditLogDTO,
  AuditLogFindConfig,
  DAL,
  FilterableAuditLogProps,
  InferEntityType,
  Logger,
  ModulesSdkTypes,
} from "@medusajs/framework/types"
import {
  AbstractAuditProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import { AuditLog } from "@models"

export type PostgresAuditProviderOptions = {
  /**
   * Audit logs older than this many days are deleted, at most once an hour and
   * only while new audit logs are being written. When unset, audit logs are
   * kept forever.
   */
  retention_days?: number
}

type InjectedDependencies = {
  auditLogService: ModulesSdkTypes.IMedusaInternalService<
    InferEntityType<typeof AuditLog>
  >
  baseRepository: DAL.RepositoryService
  logger?: Logger
}

const DAY_MS = 24 * 60 * 60 * 1000
export const PRUNE_INTERVAL_MS = 60 * 60 * 1000

// The data model also has created_at, updated_at and deleted_at, which are not
// part of an audit log.
const AUDIT_LOG_FIELDS: (keyof AuditLogDTO)[] = [
  "id",
  "started_at",
  "ended_at",
  "actor_type",
  "actor_id",
  "impersonator_id",
  "action",
  "resource_type",
  "resource_id",
  "outcome",
  "request",
  "request_data",
  "response_data",
  "metadata",
]

/**
 * Stores audit logs in the `audit_log` table of the application's database.
 * Registered by the module itself when no other storage is configured.
 */
export class PostgresAuditService extends AbstractAuditProviderService {
  static identifier = "audit-postgres"

  protected readonly auditLogService_: InjectedDependencies["auditLogService"]
  protected readonly baseRepository_: DAL.RepositoryService
  protected readonly logger_?: Logger
  protected readonly retentionDays_?: number
  protected lastPrunedAt_ = 0

  constructor(
    container: InjectedDependencies,
    options: PostgresAuditProviderOptions = {}
  ) {
    super()

    const days = options.retention_days
    if (
      days !== undefined &&
      days !== null &&
      !(typeof days === "number" && Number.isFinite(days) && days > 0)
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        'The audit "retention_days" option must be a positive number'
      )
    }

    this.auditLogService_ = container.auditLogService
    this.baseRepository_ = container.baseRepository
    this.logger_ = container.logger
    this.retentionDays_ = days ?? undefined
  }

  async write(entries: AuditLogDTO[]): Promise<void> {
    if (!entries.length) {
      return
    }

    await this.auditLogService_.create(entries)
    this.pruneIfDue_()
  }

  async list(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO[]> {
    const auditLogs = await this.auditLogService_.list(
      { ...filters },
      this.findConfig_(config)
    )

    return await this.baseRepository_.serialize<AuditLogDTO[]>(auditLogs)
  }

  async listAndCount(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<[AuditLogDTO[], number]> {
    const [auditLogs, count] = await this.auditLogService_.listAndCount(
      { ...filters },
      this.findConfig_(config)
    )

    return [
      await this.baseRepository_.serialize<AuditLogDTO[]>(auditLogs),
      count,
    ]
  }

  async retrieve(
    id: string,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO | null> {
    const [auditLog] = await this.list({ id }, { ...config, take: 1 })
    return auditLog ?? null
  }

  /**
   * Deletes audit logs older than `retention_days`. Safe to run from several
   * instances at once.
   */
  async prune(): Promise<void> {
    if (!this.retentionDays_) {
      return
    }

    await this.auditLogService_.delete({
      selector: {
        started_at: {
          $lt: new Date(Date.now() - this.retentionDays_ * DAY_MS),
        },
      },
    })
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

  protected findConfig_(config: AuditLogFindConfig) {
    const direction =
      config.order?.started_at?.toUpperCase() === "ASC" ? "ASC" : "DESC"

    return {
      select: config.select?.length ? config.select : AUDIT_LOG_FIELDS,
      skip: config.skip ?? undefined,
      take: config.take ?? undefined,
      // `id` breaks ties between audit logs that started in the same millisecond.
      order: { started_at: direction, id: direction },
    }
  }
}
