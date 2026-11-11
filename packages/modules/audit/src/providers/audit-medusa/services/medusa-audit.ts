import {
  AuditLogDTO,
  AuditLogFindConfig,
  FilterableAuditLogProps,
} from "@medusajs/framework/types"
import { AbstractAuditProviderService } from "@medusajs/framework/utils"
import { MedusaAuditClient } from "../utils/client"
import { MedusaAuditProviderOptions } from "../utils/options"

/**
 * Stores audit logs in the Medusa Cloud audit service. Registered by the module
 * itself from its `cloud` option.
 */
export class MedusaAuditService extends AbstractAuditProviderService {
  static identifier = "audit-medusa"

  protected readonly client_: MedusaAuditClient

  constructor(_: unknown, options: MedusaAuditProviderOptions) {
    super()
    this.client_ = new MedusaAuditClient(options)
  }

  async write(entries: AuditLogDTO[]): Promise<void> {
    await this.client_.write(entries)
  }

  async list(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO[]> {
    return (await this.client_.list(filters, config)).records
  }

  async listAndCount(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<[AuditLogDTO[], number]> {
    const { records, count } = await this.client_.list(filters, config)
    return [records, count]
  }

  async retrieve(
    id: string,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO | null> {
    return await this.client_.retrieve(id, config)
  }
}
