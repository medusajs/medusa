import RedisCachingProvider from "@zjedene-medusa/caching-redis"

export * from "@zjedene-medusa/caching-redis"

export default RedisCachingProvider
export const discoveryPath = require.resolve("@zjedene-medusa/caching-redis")
