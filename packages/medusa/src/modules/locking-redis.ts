import RedisLockingProvider from "@zjedene-medusa/locking-redis"

export * from "@zjedene-medusa/locking-redis"

export default RedisLockingProvider
export const discoveryPath = require.resolve("@zjedene-medusa/locking-redis")
