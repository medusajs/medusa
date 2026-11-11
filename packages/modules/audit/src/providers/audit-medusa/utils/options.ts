export type MedusaAuditProviderOptions = {
  /**
   * The Medusa Cloud API key.
   */
  api_key: string
  /**
   * The base URL of the Medusa Cloud audit service.
   */
  endpoint: string
  /**
   * The handle of the Medusa Cloud environment the audit logs belong to.
   */
  environment_handle: string
  /**
   * @ignore
   *
   * Replaces the HTTP transport. It receives the requests that would go to the
   * Cloud audit service and must answer as the service would.
   */
  fetch?: typeof fetch
}
