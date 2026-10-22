import { Modules } from "@medusajs/framework/utils"
import { ProviderLoaderOptions } from "@medusajs/types"
import { RedisCacheModuleOptions } from "@types"
import { asValue } from "@medusajs/framework/awilix"
import Redis from "ioredis"

export default async ({
  container,
  options,
  moduleOptions,
}: ProviderLoaderOptions): Promise<void> => {
  const { redisUrl, redisOptions, namespace } =
    options as RedisCacheModuleOptions

  if (!redisUrl) {
    throw Error(
      `No "redisUrl" provided in "${Modules.LOCKING}" module, "locking-redis" provider options. It is required for the "locking-redis" Module provider.`
    )
  }

  // Connect on the first lock command, so loads that never lock (e.g.
  // migrations) don't leave an open connection behind
  const connection = new Redis(redisUrl, {
    lazyConnect: true,
    ...(redisOptions ?? {}),
  })

  container.register({
    redisClient: asValue(connection),
    prefix: asValue(namespace ?? "medusa_lock:"),
  })
}
