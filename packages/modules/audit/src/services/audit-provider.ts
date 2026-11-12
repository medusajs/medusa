import {
  AuditLogDTO,
  AuditLogFindConfig,
  FilterableAuditLogProps,
  IAuditProvider,
} from "@medusajs/framework/types"
import {
  AuditDefaultProviderRegistrationName,
  AuditProviderRegistrationPrefix,
} from "@types"

type InjectedDependencies = {
  [AuditDefaultProviderRegistrationName]?: string
  [key: `${typeof AuditProviderRegistrationPrefix}${string}`]: IAuditProvider
}

/**
 * The only place that knows which provider stores audit logs. Without a
 * provider, which only happens when auditing is turned off, writes are skipped
 * and reads are empty.
 */
export class AuditProviderService {
  protected readonly provider_?: IAuditProvider

  constructor(container: InjectedDependencies) {
    const id = container[AuditDefaultProviderRegistrationName]
    this.provider_ = id
      ? container[`${AuditProviderRegistrationPrefix}${id}`]
      : undefined
  }

  async write(entries: AuditLogDTO[]): Promise<void> {
    await this.provider_?.write(entries)
  }

  async list(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO[]> {
    return (await this.provider_?.list(filters, config)) ?? []
  }

  async listAndCount(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<[AuditLogDTO[], number]> {
    return (await this.provider_?.listAndCount(filters, config)) ?? [[], 0]
  }

  async retrieve(
    id: string,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO | null> {
    return (await this.provider_?.retrieve(id, config)) ?? null
  }
}
