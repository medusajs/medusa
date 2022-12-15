import { LoaderOptions } from "@medusajs/medusa"

export default async ({
  container,
  configModule,
}: LoaderOptions): Promise<void> => {
  const redisUrl = configModule.projectConfig?.redis_url

  if (!redisUrl) {
    throw Error(
      "No `redis_url` provided in project config. It is required for the Redis Background Job module"
    )
  }
}
