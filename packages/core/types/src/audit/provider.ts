import {
  AuditLogDTO,
  AuditLogFindConfig,
  FilterableAuditLogProps,
} from "./common"

/**
 * The interface an Audit Module provider implements. A provider stores audit
 * logs and reads them back. It never updates or deletes a single audit log.
 *
 * Every provider must have a static `identifier` property.
 */
export interface IAuditProvider {
  /**
   * Stores a batch of audit logs. The Audit Module buffers recorded audit logs
   * and calls this method with up to `buffer.max_size` of them at a time. The
   * audit logs already have their ID and dates set.
   *
   * Throw when the batch can't be stored: the module retries a few times
   * before it drops the batch, so the write should be safe to repeat.
   *
   * @param {AuditLogDTO[]} entries - The audit logs to store.
   * @returns {Promise<void>} Resolves when the batch is stored.
   */
  write(entries: AuditLogDTO[]): Promise<void>

  /**
   * Retrieves a page of audit logs, newest first unless `config.order` says otherwise.
   *
   * @param {FilterableAuditLogProps} filters - The filters to apply.
   * @param {AuditLogFindConfig} config - Pagination, sorting, and field selection.
   * @returns {Promise<AuditLogDTO[]>} The audit logs.
   */
  list(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<AuditLogDTO[]>

  /**
   * Retrieves a page of audit logs and the total count of audit logs matching the filters.
   *
   * @param {FilterableAuditLogProps} filters - The filters to apply.
   * @param {AuditLogFindConfig} config - Pagination, sorting, and field selection.
   * @returns {Promise<[AuditLogDTO[], number]>} The audit logs and their total count.
   */
  listAndCount(
    filters: FilterableAuditLogProps,
    config: AuditLogFindConfig
  ): Promise<[AuditLogDTO[], number]>

  /**
   * Retrieves an audit log by its ID.
   *
   * @param {string} id - The ID of the audit log.
   * @param {AuditLogFindConfig} config - Field selection.
   * @returns {Promise<AuditLogDTO | null>} The audit log, or `null` if it doesn't exist.
   */
  retrieve(id: string, config: AuditLogFindConfig): Promise<AuditLogDTO | null>
}
