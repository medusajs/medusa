import { IModuleService } from "../modules-sdk"
import {
  AuditLogDTO,
  AuditLogFindConfig,
  FilterableAuditLogProps,
} from "./common"
import { CreateAuditLogDTO } from "./mutations"

/**
 * The main service interface for the Audit Module.
 */
export interface IAuditModuleService extends IModuleService {
  /**
   * This method records one or more audit logs. Unlike other modules' create
   * methods, it returns nothing, never throws and never waits for storage: the audit logs are validated, given an ID, and buffered, then
   * written in batches by the module's default provider. An invalid audit log is
   * dropped and logged. When the module's `enabled` option is `false`, this
   * method does nothing.
   *
   * @param {CreateAuditLogDTO | CreateAuditLogDTO[]} data - The audit logs to record.
   *
   * @example
   * auditModuleService.createAuditLogs({
   *   actor_type: "system",
   *   action: "inventory.sync",
   *   resource_type: "inventory_item",
   *   resource_id: "iitem_123",
   * })
   */
  createAuditLogs(data: CreateAuditLogDTO | CreateAuditLogDTO[]): void

  /**
   * This method retrieves a paginated list of audit logs, newest first.
   *
   * @param {FilterableAuditLogProps} filters - The filters to apply.
   * @param {AuditLogFindConfig} config - Pagination, sorting, and field selection.
   * @returns {Promise<AuditLogDTO[]>} The list of audit logs.
   *
   * @example
   * const auditLogs = await auditModuleService.listAuditLogs(
   *   { resource_type: "order", resource_id: "order_123" },
   *   { take: 20 }
   * )
   */
  listAuditLogs(
    filters?: FilterableAuditLogProps,
    config?: AuditLogFindConfig
  ): Promise<AuditLogDTO[]>

  /**
   * This method retrieves a paginated list of audit logs, newest first, with
   * the total count of audit logs matching the filters.
   *
   * @param {FilterableAuditLogProps} filters - The filters to apply.
   * @param {AuditLogFindConfig} config - Pagination, sorting, and field selection.
   * @returns {Promise<[AuditLogDTO[], number]>} The list of audit logs and their total count.
   *
   * @example
   * const [auditLogs, count] = await auditModuleService.listAndCountAuditLogs(
   *   { actor_type: "user", actor_id: "user_123" },
   *   { skip: 0, take: 20 }
   * )
   */
  listAndCountAuditLogs(
    filters?: FilterableAuditLogProps,
    config?: AuditLogFindConfig
  ): Promise<[AuditLogDTO[], number]>

  /**
   * This method retrieves an audit log by its ID. It throws a `not_found` error
   * when the audit log doesn't exist.
   *
   * @param {string} id - The ID of the audit log.
   * @param {AuditLogFindConfig} config - Field selection.
   * @returns {Promise<AuditLogDTO>} The audit log.
   *
   * @example
   * const auditLog = await auditModuleService.retrieveAuditLog("audlog_123")
   */
  retrieveAuditLog(
    id: string,
    config?: AuditLogFindConfig
  ): Promise<AuditLogDTO>

  /**
   * This method writes every buffered audit log through the default provider and
   * resolves once done. It never throws. The module calls it on shutdown; call it
   * yourself when you need recorded audit logs to be readable right away, such
   * as in a script that exits afterwards.
   *
   * @example
   * auditModuleService.createAuditLogs({ action: "catalog.import" })
   * await auditModuleService.flush()
   */
  flush(): Promise<void>
}
