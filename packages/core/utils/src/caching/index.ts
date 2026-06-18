import { ICachingModuleService, Logger, MedusaContainer } from "@medusajs/types"
import { MedusaContextType, Modules } from "../modules-sdk"
import { FeatureFlag } from "../feature-flags"
import { ContainerRegistrationKeys, isObject } from "../common"

/**
 * This function is used to cache the result of a function call.
 *
 * @param cb - The callback to execute.
 * @param options - The options for the cache.
 * @returns The result of the callback.
 */
export async function useCache<T>(
  cb: (...args: any[]) => Promise<T>,
  options: {
    enable?: boolean
    key: string | any[]
    tags?: string[]
    ttl?: number
    /**
     * Whethere the default strategy should auto invalidate the cache whenever it is possible.
     */
    autoInvalidate?: boolean
    providers?: string[]
    container: MedusaContainer
  }
): Promise<T> {
  const cachingModule = options.container.resolve<ICachingModuleService>(
    Modules.CACHING,
    {
      allowUnregistered: true,
    }
  )

  if (
    !options.enable ||
    !FeatureFlag.isFeatureEnabled("caching") ||
    !cachingModule
  ) {
    return await cb()
  }

  let key: string
  if (typeof options.key === "string") {
    key = options.key
  } else {
    key = await cachingModule.computeKey(options.key)
  }

  const data = await cachingModule.get({
    key,
    tags: options.tags,
    providers: options.providers,
  })

  if (data) {
    return data as T
  }

  const result = await cb()

  void cachingModule
    .set({
      key,
      tags: options.tags,
      ttl: options.ttl,
      data: result as object,
      options: { autoInvalidate: options.autoInvalidate },
      providers: options.providers,
    })
    .catch((e) => {
      const logger =
        options.container.resolve<Logger>(ContainerRegistrationKeys.LOGGER, {
          allowUnregistered: true,
        }) ?? (console as unknown as Logger)
      logger.error(
        `An error occurred while setting cache for key: ${key}\n${e.message}\n${e.stack}`
      )
    })

  return result
}

type TargetMethodArgs<Target, PropertyKey> = Target[PropertyKey &
  keyof Target] extends (...args: any[]) => any
  ? Parameters<Target[PropertyKey & keyof Target]>
  : never

/**
 * This function is used to cache the result of a method call.
 *
 * @param options - The options for the cache.
 * @returns The original method with the cache applied.
 */
export function Cached<
  const Target extends object,
  const PropertyKey extends keyof Target
>(options: {
  /**
   * The key to use for the cache.
   * If a function is provided, it will be called with the arguments as the first argument and the
   * container as the second argument.
   */
  key?:
    | string
    | ((
        args: TargetMethodArgs<Target, PropertyKey>,
        cachingModule: ICachingModuleService
      ) => string | Promise<string> | Promise<any[]> | any[])
  /**
   * Whether to enable the cache. This is only useful if you want to enable without providing any
   * other options.
   */
  enable?:
    | boolean
    | ((args: TargetMethodArgs<Target, PropertyKey>) => boolean | undefined)
  /**
   * The tags to use for the cache.
   */
  tags?:
    | string[]
    | ((args: TargetMethodArgs<Target, PropertyKey>) => string[] | undefined)
  /**
   * The time-to-live (TTL) value in seconds.
   */
  ttl?:
    | number
    | ((args: TargetMethodArgs<Target, PropertyKey>) => number | undefined)
  /**
   * Whether to auto invalidate the cache whenever it is possible.
   */
  autoInvalidate?:
    | boolean
    | ((args: TargetMethodArgs<Target, PropertyKey>) => boolean | undefined)
  /**
   * The providers to use for the cache.
   */
  providers?:
    | string[]
    | ((args: TargetMethodArgs<Target, PropertyKey>) => string[] | undefined)

  container: MedusaContainer | ((this: Target) => MedusaContainer)
}) {
  return function (
    target: Target,
    propertyKey: PropertyKey,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    if (typeof originalMethod !== "function") {
      throw new Error("@cached can only be applied to methods")
    }

    descriptor.value = async function (
      ...args: Target[PropertyKey & keyof Target] extends (
        ...args: any[]
      ) => any
        ? Parameters<Target[PropertyKey & keyof Target]>
        : never
    ) {
      const container: MedusaContainer =
        typeof options.container === "function"
          ? options.container.call(this)
          : options.container

      const cachingModule = container.resolve<ICachingModuleService>(
        Modules.CACHING,
        {
          allowUnregistered: true,
        }
      )

      if (!FeatureFlag.isFeatureEnabled("caching") || !cachingModule) {
        return await originalMethod.apply(this, args)
      }

      if (!options.key) {
        options.key = await cachingModule.computeKey(
          args
            .map((arg) => {
              if (isObject(arg)) {
                // Prevent any container, manager, transactionManager, etc from being included in the key
                const {
                  container,
                  manager,
                  transactionManager,
                  __type,
                  ...rest
                } = arg as any
                if (__type === MedusaContextType) {
                  return
                }
                return rest
              }
              return arg
            })
            .filter(Boolean)
        )
      }

      const resolvableKeys = [
        "enable",
        "key",
        "tags",
        "ttl",
        "autoInvalidate",
        "providers",
      ]

      const cacheOptions = {} as Parameters<typeof useCache>[1]

      const promises: Promise<any>[] = []
      for (const key of resolvableKeys) {
        if (typeof options[key] === "function") {
          const res = options[key](args, cachingModule)
          if (res instanceof Promise) {
            promises.push(
              res.then((value) => {
                cacheOptions[key] = value
              })
            )
          } else {
            cacheOptions[key] = res
          }
        } else {
          cacheOptions[key] = options[key]
        }
      }

      await Promise.all(promises)

      if (!cacheOptions.enable) {
        return await originalMethod.apply(this, args)
      }

      Object.assign(cacheOptions, {
        container,
      })

      return await useCache(
        () => originalMethod.apply(this, args),
        cacheOptions as Parameters<typeof useCache>[1]
      )
    }

    return descriptor
  }
}
