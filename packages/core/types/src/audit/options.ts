import { ModuleProviderExports } from "../modules-sdk"

/**
 * The options of the Audit Module.
 */
export interface AuditModuleOptions {
  /**
   * Whether audit logs are recorded. When `false`, `createAuditLogs` does nothing and
   * nothing is buffered, so callers need no change. Reading audit logs still works.
   *
   * @defaultValue true
   */
  enabled?: boolean

  /**
   * Audit logs older than this many days are deleted from the application's
   * database. When unset, they are kept forever. It only applies to the
   * built-in Postgres storage, which is used when neither `providers` nor
   * `cloud` is set.
   */
  retention_days?: number

  /**
   * Custom providers that store audit logs, replacing the built-in Postgres
   * storage. Recorded audit logs are written to the default provider only.
   */
  providers?: {
    /**
     * The provider package or its exports.
     */
    resolve: string | ModuleProviderExports
    /**
     * The provider's ID, used by `default_provider`.
     */
    id: string
    /**
     * The provider's options.
     */
    options?: Record<string, unknown>
  }[]

  /**
   * The ID of the provider that recorded audit logs are written to and read from.
   * Defaults to the Medusa Cloud provider when `cloud` is set, otherwise to the
   * only registered provider. Required when several providers are registered
   * without `cloud`.
   */
  default_provider?: string

  /**
   * Medusa Cloud audit storage. When `endpoint` is set, the module registers the
   * built-in Medusa Cloud provider with the ID `cloud` and makes it the default.
   */
  cloud?: {
    /**
     * The Medusa Cloud API key.
     */
    api_key?: string
    /**
     * The base URL of the Medusa Cloud audit service.
     */
    endpoint?: string
    /**
     * The handle of the Medusa Cloud environment.
     */
    environment_handle?: string
    /**
     * @ignore
     *
     * Replaces the HTTP transport, for tests.
     */
    fetch?: typeof fetch
  }

  /**
   * How recorded audit logs are buffered before they're written.
   */
  buffer?: {
    /**
     * The number of buffered audit logs that triggers a write, and the largest
     * batch passed to the provider.
     *
     * @defaultValue 100
     */
    max_size?: number
    /**
     * How long an audit log waits in the buffer at most before it's written, in milliseconds.
     *
     * @defaultValue 1000
     */
    flush_interval_ms?: number
    /**
     * The most audit logs held in memory, for example while the provider is
     * unavailable. When exceeded, the oldest are dropped and a warning is logged.
     *
     * @defaultValue 10000
     */
    max_buffered?: number
  }
}
