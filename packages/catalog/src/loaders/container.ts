import { CatalogRepository } from "@repositories"
import { CatalogModuleService } from "@services"

import { LoaderOptions } from "@medusajs/modules-sdk"
import { asClass, asValue } from "awilix"
import { CatalogModuleOptions } from "../types"
import { PostgresProvider } from "../services/postgres-provider"

export default async ({
  container,
  options,
}: LoaderOptions<CatalogModuleOptions>): Promise<void> => {
  container.register({
    catalogModuleService: asClass(CatalogModuleService).singleton(),
  })

  if (!options?.customAdapter) {
    container.register("storageProvider", asClass(PostgresProvider).singleton())
    container.register(
      "catalogRepository",
      asClass(CatalogRepository).singleton()
    )
  } else {
    const storageAdapter = new options.customAdapter.constructor(
      options.customAdapter.options
    )
    container.register("storageProvider", asValue(storageAdapter))
  }
}
