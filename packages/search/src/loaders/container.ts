import { SearchModuleService } from "@services"

import { LoaderOptions } from "@medusajs/modules-sdk"
import { asClass, asValue } from "awilix"
import { SearchModuleOptions } from "../types"
import { PostgresProvider } from "../services/postgres-provider"
import { BaseRepository } from "@medusajs/product/dist/repositories"

export default async ({
  container,
  options,
}: LoaderOptions<SearchModuleOptions>): Promise<void> => {
  container.register({
    baseRepository: asClass(BaseRepository).singleton(),
    searchModuleService: asClass(SearchModuleService).singleton(),
  })

  container.register("storageProviderCtrOptions", asValue(undefined))

  if (!options?.customAdapter) {
    container.register("storageProviderCtr", asValue(PostgresProvider))
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
