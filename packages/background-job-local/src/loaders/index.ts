import { LoaderOptions } from "@medusajs/medusa"

export default async ({ logger }: LoaderOptions): Promise<void> => {
  logger?.warn(
    "Local cron job module installed. Not recommended for production."
  )
}
