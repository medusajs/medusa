import { LoaderOptions } from "@medusajs/medusa"

export default async ({ logger }: LoaderOptions): Promise<void> => {
  logger?.warn(
    "Local cron job module installed. Cron jobs will not be available."
  )
}
