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

  if (!options?.customAdapter && !options?.defaultAdapterOptions) {
    throw new Error(
      "Catalog module error, either customAdapter or defaultAdapterOptions must be provided. None have been provided."
    )
  }

  if (!options?.customAdapter) {
    container.register("storageProviderCtr", asValue(PostgresProvider))
    container.register(
      "catalogRepository",
      asClass(CatalogRepository).singleton()
    )
  } else {
    container.register(
      "storageProviderCtr",
      asValue(options.customAdapter.constructor)
    )
    container.register(
      "storageProviderCtrOptions",
      asValue(options.customAdapter.options)
    )
  }
}
