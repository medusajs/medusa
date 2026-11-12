import { AuditModuleOptions } from "@medusajs/framework/types"

export type { AuditModuleOptions }

// Providers are registered as `aud_{id}`.
export const AuditProviderRegistrationPrefix = "aud_"
export const AuditDefaultProviderRegistrationName = "audit_default_provider"

export const MEDUSA_CLOUD_AUDIT_PROVIDER_ID = "cloud"
export const POSTGRES_AUDIT_PROVIDER_ID = "postgres"

declare module "@medusajs/types" {
  interface ModuleOptions {
    "@medusajs/audit": AuditModuleOptions
    "@medusajs/medusa/audit": AuditModuleOptions
  }
}
