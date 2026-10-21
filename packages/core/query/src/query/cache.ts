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
    extractCacheOptions("computeAutomaticTags")(args) ||
    extractCacheOptions("autoInvalidate")(args) ||
    extractCacheOptions("providers")(args)
  )
}

type QueryCacheArguments = Parameters<Query["graph"]>

// Cached resolves these options separately; share tag callback results per call.
const localizedCacheOptions = new WeakMap<
  QueryCacheArguments,
  { tags: string[]; computeAutomaticTags: boolean | undefined }
>()

function resolveLocalizedCacheOptions(args: QueryCacheArguments) {
  const existing = localizedCacheOptions.get(args)
  if (existing) {
    return existing
  }

  const tags = args[1]?.cache?.tags
  const resolvedTags = typeof tags === "function" ? tags(args) : tags
  const options = {
    tags: [...new Set([...(resolvedTags ?? []), "Translation:list:*"])],
    // Internal dependency tags must not disable the caller's automatic tags.
    computeAutomaticTags:
      resolvedTags == null ? true : args[1]?.cache?.computeAutomaticTags,
  }

  localizedCacheOptions.set(args, options)
  return options
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
  tags: (args: QueryCacheArguments) => {
    if (!args[1]?.locale || args[1]?.cache?.enable === false) {
      return extractCacheOptions("tags")(args)
    }
    return resolveLocalizedCacheOptions(args).tags
  },
  computeAutomaticTags: (args: QueryCacheArguments) => {
    if (!args[1]?.locale || args[1]?.cache?.enable === false) {
      return extractCacheOptions("computeAutomaticTags")(args)
    }
    return resolveLocalizedCacheOptions(args).computeAutomaticTags
  },
  autoInvalidate: extractCacheOptions("autoInvalidate"),
  providers: extractCacheOptions("providers"),
  container: function (this: Query): MedusaContainer {
    return (this as unknown as { container: MedusaContainer }).container
  },
}
