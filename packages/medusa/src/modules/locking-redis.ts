import RedisLockingProvider from "@medusajs/locking-redis"

export * from "@medusajs/locking-redis"

export default RedisLockingProvider
export const discoveryPath = require.resolve("@medusajs/locking-redis")
