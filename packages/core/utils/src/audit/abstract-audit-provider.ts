import {
  AuditLogDTO,
  AuditLogFindConfig,
  FilterableAuditLogProps,
  IAuditProvider,
} from "@medusajs/types"

/**
 * An abstract class for Audit Module providers. Extend this class to store audit
 * logs somewhere other than the built-in providers.
 *
 * A provider only stores and reads audit logs. The Audit Module owns everything
 * around it: validating recorded audit logs, assigning their IDs, buffering them,
 * and retrying failed writes.
 *
 * ### constructor
 *
 * The constructor allows you to access resources from the module's container using the first parameter,
 * and the provider's options using the second parameter.
 *
 * #### Example
 *
 * ```ts
 * import { Logger } from "@medusajs/framework/types"
 * import { AbstractAuditProviderService } from "@medusajs/framework/utils"
 *
 * type InjectedDependencies = {
 *   logger: Logger
 * }
 *
 * type Options = {
 *   url: string
 * }
 *
 * class MyAuditProviderService extends AbstractAuditProviderService {
 *   static identifier = "my-audit"
 *
 *   protected logger_: Logger
 *   protected options_: Options
 *
 *   constructor({ logger }: InjectedDependencies, options: Options) {
 *     super()
 *
 *     this.logger_ = logger
 *     this.options_ = options
 *   }
 * }
 *
 * export default MyAuditProviderService
 * ```
 */
export class AbstractAuditProviderService implements IAuditProvider {
  /**
   * Each audit provider has a unique identifier used to register it.
   *
   * @example
   * class MyAuditProviderService extends AbstractAuditProviderService {
   *   static identifier = "my-audit"
   *   // ...
   * }
   */
  static identifier: string

  /**
   * @ignore
   */
  get identifier(): string {
    return (this.constructor as any).identifier
  }

  /**
   * @ignore
   */
  getIdentifier(): string {
    return (this.constructor as any).identifier
  }

  /**
   * This method stores a batch of audit logs. The Audit Module calls it with
   * buffered audit logs that already have their ID and dates set.
   *
   * Throw when the batch can't be stored. The module retries a few times before
   * it drops the batch, so the write should be safe to repeat.
   *
   * @param {AuditLogDTO[]} _entries - The audit logs to store.
   * @returns {Promise<void>} Resolves when the batch is stored.
   *
   * @example
   * class MyAuditProviderService extends AbstractAuditProviderService {
   *   // ...
   *   async write(entries: AuditLogDTO[]): Promise<void> {
   *     await this.client.insert(entries)
   *   }
   * }
   */
  async write(_entries: AuditLogDTO[]): Promise<void> {
    throw Error("write must be overridden by the child class")
  }

  /**
   * This method retrieves a page of audit logs, newest first unless `config.order`
   * says otherwise.
   *
   * @param {FilterableAuditLogProps} _filters - The filters to apply.
   * @param {AuditLogFindConfig} _config - Pagination, sorting, and field selection.
   * @returns {Promise<AuditLogDTO[]>} The audit logs.
   *
   * @example
   * class MyAuditProviderService extends AbstractAuditProviderService {
   *   // ...
   *   async list(
   *     filters: FilterableAuditLogProps,
   *     config: AuditLogFindConfig
   *   ): Promise<AuditLogDTO[]> {
   *     return await this.client.query(filters, config)
   *   }
   * }
   */
  async list(
    _filters: FilterableAuditLogProps,
    _config: AuditLogFindConfig
  ): Promise<AuditLogDTO[]> {
    throw Error("list must be overridden by the child class")
  }

  /**
   * This method retrieves a page of audit logs and the total count of audit
   * logs matching the filters.
   *
   * @param {FilterableAuditLogProps} _filters - The filters to apply.
   * @param {AuditLogFindConfig} _config - Pagination, sorting, and field selection.
   * @returns {Promise<[AuditLogDTO[], number]>} The audit logs and their total count.
   *
   * @example
   * class MyAuditProviderService extends AbstractAuditProviderService {
   *   // ...
   *   async listAndCount(
   *     filters: FilterableAuditLogProps,
   *     config: AuditLogFindConfig
   *   ): Promise<[AuditLogDTO[], number]> {
   *     const { rows, total } = await this.client.queryWithCount(filters, config)
   *     return [rows, total]
   *   }
   * }
   */
  async listAndCount(
    _filters: FilterableAuditLogProps,
    _config: AuditLogFindConfig
  ): Promise<[AuditLogDTO[], number]> {
    throw Error("listAndCount must be overridden by the child class")
  }

  /**
   * This method retrieves an audit log by its ID.
   *
   * @param {string} _id - The ID of the audit log.
   * @param {AuditLogFindConfig} _config - Field selection.
   * @returns {Promise<AuditLogDTO | null>} The audit log, or `null` if it doesn't exist.
   *
   * @example
   * class MyAuditProviderService extends AbstractAuditProviderService {
   *   // ...
   *   async retrieve(id: string): Promise<AuditLogDTO | null> {
   *     return (await this.client.get(id)) ?? null
   *   }
   * }
   */
  async retrieve(
    _id: string,
    _config: AuditLogFindConfig
  ): Promise<AuditLogDTO | null> {
    throw Error("retrieve must be overridden by the child class")
  }
}
