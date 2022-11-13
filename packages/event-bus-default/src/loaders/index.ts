import { ConfigModule, Logger, MedusaContainer } from "@medusajs/medusa"

type LoaderOptions = {
  container: MedusaContainer
  configModule: ConfigModule
  logger: Logger
}

export default async ({
  container,
  configModule,
  logger,
}: LoaderOptions): Promise<void> => {
  logger.warn(
    "Default event bus module installed. Event bus will not be available."
  )
}
