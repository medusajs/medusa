import { MedusaContainer } from "@medusajs/types"
import type { Query } from "./query"

function extractCacheOptions(option: string) {
  return function extractKey(args: any[]) {
    return args[1]?.cache?.[option]
  }
}

function isCacheEnabled(args: any[]) {
  const isEnabled = extractCacheOptions("enable")(args)
  if (isEnabled === false) {
    return false
  }

  return (
    isEnabled === true ||
    extractCacheOptions("key")(args) ||
    extractCacheOptions("ttl")(args) ||
    extractCacheOptions("tags")(args) ||
    extractCacheOptions("autoInvalidate")(args) ||
    extractCacheOptions("providers")(args)
  )
}

export const queryCacheDecoratorOptions = {
  enable: isCacheEnabled,
  key: async (args, cachingModule) => {
    const key = extractCacheOptions("key")(args)
    if (key) {
      return key
    }

    const queryOptions = args[0]
    const remoteJoinerOptions = args[1] ?? {}
    const { initialData, cache, ...restOptions } = remoteJoinerOptions

    const keyInput = {
      queryOptions,
      options: restOptions,
    }
    return await cachingModule.computeKey(keyInput)
  },
  ttl: extractCacheOptions("ttl"),
  tags: extractCacheOptions("tags"),
  autoInvalidate: extractCacheOptions("autoInvalidate"),
  providers: extractCacheOptions("providers"),
  container: function (this: Query): MedusaContainer {
    return (this as unknown as { container: MedusaContainer }).container
  },
}
