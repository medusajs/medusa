import { asValue } from "awilix"
import Memcached from "memcached"

import { LoaderOptions } from "@medusajs/modules-sdk"

import { MemcachedCacheModuleOptions } from "../types"

export default async ({
  container,
  logger,
  options,
}: LoaderOptions): Promise<void> => {
  if (!options?.location) {
    throw Error(
      "No `options.location` was provided in `cacheService` module options. It is required for the Memcached Cache Module."
    )
  }

  try {
    const connection = new Memcached(
      (options as MemcachedCacheModuleOptions).location,
      (options as MemcachedCacheModuleOptions).options
    )

    logger?.info(`Connection to Memcached instance established`)

    container.register({
      cacheMemcachedConnection: asValue(connection),
    })
  } catch (err) {
    logger?.error(
      `An error occurred while connecting to Memcached instance in module 'cache-memcached': ${err}`
    )
  }
}
