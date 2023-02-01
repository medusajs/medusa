import { LoaderOptions } from "@medusajs/medusa"

export default async ({
  container,
  configModule,
  logger,
  options,
}: LoaderOptions): Promise<void> => {
  const redisUrl = options?.redisUrl

  if (!redisUrl) {
    throw Error(
      "No `redis_url` provided in project config. It is required for the Redis Cache."
    )
  }
}
