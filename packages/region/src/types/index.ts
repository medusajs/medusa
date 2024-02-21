import { Logger } from "@medusajs/types"
import { Country } from "@models"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

export type UpdateCountryRegion = {
  id: string
  region_id: string
}

export type CreateCurrencyDTO = {
  code: string
  symbol: string
  name: string
  symbol_native: string
}

export type CreateCountryDTO = {
  iso_2: string
  iso_3: string
  num_code: string
  name: string
  display_name: string
}
