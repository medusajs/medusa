import { LoaderOptions } from "@medusajs/medusa"

export default async ({ logger }: LoaderOptions): Promise<void> => {
  logger?.warn(
    "Local event bus module installed. Event bus will not be available."
  )
}
