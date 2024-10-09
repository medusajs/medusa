import PostgresLockingProvider from "@medusajs/locking-postgres"

export * from "@medusajs/locking-postgres"

export default PostgresLockingProvider
export const discoveryPath = require.resolve("@medusajs/locking-postgres")
