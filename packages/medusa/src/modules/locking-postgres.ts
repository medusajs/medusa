import PostgresLockingProvider from "@zjedene-medusa/locking-postgres"

export * from "@zjedene-medusa/locking-postgres"

export default PostgresLockingProvider
export const discoveryPath = require.resolve("@zjedene-medusa/locking-postgres")
