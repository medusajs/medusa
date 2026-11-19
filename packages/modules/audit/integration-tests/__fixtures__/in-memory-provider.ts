import {
  AuditLogDTO,
  AuditLogFindConfig,
  FilterableAuditLogProps,
} from "@medusajs/framework/types"
import {
  AbstractAuditProviderService,
  ModuleProvider,
  Modules,
} from "@medusajs/framework/utils"

/**
 * Keeps audit logs in memory. Supports the equality filters only, which is all
 * the module-level suites need; filtering is covered by the Postgres provider.
 */
export class InMemoryAuditProvider extends AbstractAuditProviderService {
  static identifier = "audit-memory"

  records: AuditLogDTO[] = []
  writes: AuditLogDTO[][] = []
  failuresLeft = 0

  async write(entries: AuditLogDTO[]): Promise<void> {
    this.writes.push(entries)

    if (this.failuresLeft > 0) {
      this.failuresLeft--
      throw new Error("storage unavailable")
    }

    this.records.push(...entries)
  }

  async list(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO[]> {
    return (await this.listAndCount(filters, config))[0]
  }

  async listAndCount(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<[AuditLogDTO[], number]> {
    const matching = this.records
      .filter((record) =>
        Object.entries(filters).every(([key, value]) =>
          Array.isArray(value)
            ? value.includes(record[key])
            : record[key] === value
        )
      )
      .sort((a, b) => b.started_at.getTime() - a.started_at.getTime())

    const skip = config.skip ?? 0
    return [
      matching.slice(skip, skip + (config.take ?? matching.length)),
      matching.length,
    ]
  }

  async retrieve(id: string): Promise<AuditLogDTO | null> {
    return this.records.find((record) => record.id === id) ?? null
  }
}

export default ModuleProvider(Modules.AUDIT, {
  services: [InMemoryAuditProvider],
})
