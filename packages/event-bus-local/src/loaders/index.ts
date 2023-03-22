import { ModulesSdkTypes } from "@medusajs/modules-sdk"

export default async ({
  logger,
}: ModulesSdkTypes.LoaderOptions): Promise<void> => {
  logger?.warn(
    "Local Event Bus installed. This is not recommended for production."
  )
}
