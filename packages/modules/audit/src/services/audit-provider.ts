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
  [AuditDefaultProviderRegistrationName]: string
  [key: `${typeof AuditProviderRegistrationPrefix}${string}`]: IAuditProvider
}

/**
 * The only place that knows which provider stores audit logs.
 */
export class AuditProviderService {
  protected readonly provider_: IAuditProvider

  constructor(container: InjectedDependencies) {
    this.provider_ =
      container[
        `${AuditProviderRegistrationPrefix}${container[AuditDefaultProviderRegistrationName]}`
      ]
  }

  async write(entries: AuditLogDTO[]): Promise<void> {
    await this.provider_.write(entries)
  }

  async list(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO[]> {
    return await this.provider_.list(filters, config)
  }

  async listAndCount(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<[AuditLogDTO[], number]> {
    return await this.provider_.listAndCount(filters, config)
  }

  async retrieve(
    id: string,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO | null> {
    return await this.provider_.retrieve(id, config)
  }
}
