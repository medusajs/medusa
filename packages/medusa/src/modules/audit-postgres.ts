import AuditPostgresProvider from "@medusajs/audit-postgres"

export * from "@medusajs/audit-postgres"

export default AuditPostgresProvider

export const discoveryPath = require.resolve("@medusajs/audit-postgres")
