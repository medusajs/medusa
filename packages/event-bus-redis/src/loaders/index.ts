import { LoaderOptions } from "@medusajs/medusa"

export default async ({
  container,
  configModule,
  logger,
}: LoaderOptions): Promise<void> => {
  const redisUrl = configModule.projectConfig?.redis_url

  if (!redisUrl) {
    logger?.error(
      "No `redis_url` provided in project config. It is required for the Redis Event Bus."
    )
  }
}
