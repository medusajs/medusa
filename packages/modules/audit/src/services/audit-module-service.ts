import {
  AuditLogDTO,
  AuditLogFindConfig,
  CreateAuditLogDTO,
  FilterableAuditLogProps,
  IAuditModuleService,
  Logger,
} from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { AuditModuleOptions } from "@types"
import { AuditBuffer, normalizeAuditLog } from "@utils"
import { AuditProviderService } from "./audit-provider"

type InjectedDependencies = {
  logger?: Logger
  auditProviderService: AuditProviderService
}

export const DEFAULT_LIST_TAKE = 20

export class AuditModuleService implements IAuditModuleService {
  protected readonly logger_: Logger
  protected readonly provider_: AuditProviderService
  protected readonly buffer_?: AuditBuffer

  constructor(
    container: InjectedDependencies,
    options: AuditModuleOptions = {}
  ) {
    this.logger_ = container.logger ?? (console as unknown as Logger)
    this.provider_ = container.auditProviderService

    if (options.enabled !== false) {
      this.buffer_ = new AuditBuffer({
        write: (entries) => this.provider_.write(entries),
        logger: this.logger_,
        maxSize: options.buffer?.max_size,
        flushIntervalMs: options.buffer?.flush_interval_ms,
        maxBuffered: options.buffer?.max_buffered,
      })
    }
  }

  __hooks = {
    onApplicationPrepareShutdown: async () => {
      await this.flush()
    },
    onApplicationShutdown: async () => {
      await this.flush()
      this.buffer_?.stop()
    },
  }

  record(data: CreateAuditLogDTO | CreateAuditLogDTO[]): void {
    if (!this.buffer_) {
      return
    }

    try {
      const input = Array.isArray(data) ? data : [data]
      const now = new Date()
      const entries: AuditLogDTO[] = []
      const errors = new Set<string>()

      for (const item of input) {
        const { entry, error } = normalizeAuditLog(item, now)
        if (entry) {
          entries.push(entry)
        } else {
          errors.add(error)
        }
      }

      const invalid = input.length - entries.length
      if (invalid) {
        this.logger_.warn(
          `Audit: dropped ${invalid} invalid audit log(s): ${[...errors].join(
            "; "
          )}`
        )
      }

      this.buffer_.push(entries)
    } catch (error) {
      this.logger_.error(
        `Audit: failed to record audit logs: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  async flush(): Promise<void> {
    try {
      await this.buffer_?.flush()
    } catch (error) {
      this.logger_.error(
        `Audit: failed to flush audit logs: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  async list(
    filters: FilterableAuditLogProps = {},
    config: AuditLogFindConfig = {}
  ): Promise<AuditLogDTO[]> {
    return await this.provider_.list(filters, this.listConfig_(config))
  }

  async listAndCount(
    filters: FilterableAuditLogProps = {},
    config: AuditLogFindConfig = {}
  ): Promise<[AuditLogDTO[], number]> {
    return await this.provider_.listAndCount(filters, this.listConfig_(config))
  }

  async retrieve(
    id: string,
    config: AuditLogFindConfig = {}
  ): Promise<AuditLogDTO> {
    const auditLog = id ? await this.provider_.retrieve(id, config) : null

    if (!auditLog) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Audit log with id: ${id} was not found`
      )
    }

    return auditLog
  }

  protected listConfig_(config: AuditLogFindConfig): AuditLogFindConfig {
    return {
      ...config,
      skip: config.skip ?? 0,
      take: config.take ?? DEFAULT_LIST_TAKE,
      order: config.order?.started_at ? config.order : { started_at: "DESC" },
    }
  }
}
