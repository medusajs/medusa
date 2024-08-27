import { LoaderOptions } from "@medusajs/types"

export default async ({ logger }: LoaderOptions): Promise<void> => {
  logger?.warn(
    "Local Event Bus installed. This is not recommended for production."
  )
}
