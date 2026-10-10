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

  // The connection opens on the first command. Loads that never take a lock,
  // such as migrations, then don't leave a socket open.
  const connection = new Redis(redisUrl, {
    lazyConnect: true,
    ...(redisOptions ?? {}),
  })

  container.register({
    redisClient: asValue(connection),
    prefix: asValue(namespace ?? "medusa_lock:"),
  })
}
