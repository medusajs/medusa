import {
  AuditLogDTO,
  AuditLogFindConfig,
  CreateAuditLogDTO,
  FilterableAuditLogProps,
  IAuditModuleService,
  IAuditProvider,
  Logger,
} from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  AuditDefaultProviderRegistrationName,
  AuditModuleOptions,
  AuditProviderIdsRegistrationName,
  AuditProviderRegistrationPrefix,
} from "@types"
import { AuditBuffer, normalizeAuditLog } from "@utils"

type InjectedDependencies = {
  logger?: Logger
  [AuditProviderIdsRegistrationName]?: string[]
  [AuditDefaultProviderRegistrationName]?: string
}

export const DEFAULT_LIST_TAKE = 20
export const PRUNE_INTERVAL_MS = 60 * 60 * 1000

export class AuditModuleService implements IAuditModuleService {
  protected readonly container_: InjectedDependencies
  protected readonly logger_: Logger
  protected readonly enabled_: boolean
  protected readonly providerIds_: string[]
  protected readonly defaultProviderId_?: string
  protected readonly buffer_?: AuditBuffer
  protected pruneTimer_?: NodeJS.Timeout

  constructor(
    container: InjectedDependencies,
    options: AuditModuleOptions = {}
  ) {
    this.container_ = container
    this.logger_ = container.logger ?? (console as unknown as Logger)
    this.enabled_ = options.enabled !== false
    this.providerIds_ = container[AuditProviderIdsRegistrationName] ?? []
    this.defaultProviderId_ = container[AuditDefaultProviderRegistrationName]

    if (this.enabled_ && this.defaultProviderId_) {
      this.buffer_ = new AuditBuffer({
        write: (entries) => this.defaultProvider_()!.write(entries),
        logger: this.logger_,
        maxSize: options.buffer?.max_size,
        flushIntervalMs: options.buffer?.flush_interval_ms,
        maxBuffered: options.buffer?.max_buffered,
      })
    }
  }

  __hooks = {
    onApplicationStart: async () => {
      this.startPruning_()
    },
    onApplicationPrepareShutdown: async () => {
      this.stopPruning_()
      await this.flush()
    },
    onApplicationShutdown: async () => {
      this.stopPruning_()
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
    const provider = this.defaultProvider_()
    if (!provider) {
      return []
    }

    return await provider.list(filters, this.listConfig_(config))
  }

  async listAndCount(
    filters: FilterableAuditLogProps = {},
    config: AuditLogFindConfig = {}
  ): Promise<[AuditLogDTO[], number]> {
    const provider = this.defaultProvider_()
    if (!provider) {
      return [[], 0]
    }

    return await provider.listAndCount(filters, this.listConfig_(config))
  }

  async retrieve(
    id: string,
    config: AuditLogFindConfig = {}
  ): Promise<AuditLogDTO> {
    const auditLog = id
      ? await this.defaultProvider_()?.retrieve(id, config)
      : null

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

  protected defaultProvider_(): IAuditProvider | undefined {
    return this.defaultProviderId_
      ? this.provider_(this.defaultProviderId_)
      : undefined
  }

  protected provider_(id: string): IAuditProvider {
    return this.container_[
      AuditProviderRegistrationPrefix + id
    ] as IAuditProvider
  }

  protected startPruning_(): void {
    if (this.pruneTimer_) {
      return
    }

    const prunable = this.providerIds_.filter(
      (id) => typeof this.provider_(id).prune === "function"
    )
    if (!prunable.length) {
      return
    }

    const run = () => {
      for (const id of prunable) {
        void this.prune_(id)
      }
    }

    run()
    this.pruneTimer_ = setInterval(run, PRUNE_INTERVAL_MS)
    this.pruneTimer_.unref?.()
  }

  protected stopPruning_(): void {
    if (this.pruneTimer_) {
      clearInterval(this.pruneTimer_)
      this.pruneTimer_ = undefined
    }
  }

  protected async prune_(id: string): Promise<void> {
    try {
      const deleted = await this.provider_(id).prune!()
      if (deleted) {
        this.logger_.info(
          `Audit: pruned ${deleted} audit log(s) past retention from the "${id}" provider`
        )
      }
    } catch (error) {
      this.logger_.warn(
        `Audit: pruning the "${id}" provider failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }
}
