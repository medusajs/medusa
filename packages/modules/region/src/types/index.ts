import { Logger, UpdateRegionDTO } from "@medusajs/types"
import { Country } from "@models"

export type InitializeModuleInjectableDependencies = {
  logger?: Logger
}

export type UpdateCountryRegion = {
  id: string
  region_id: string
}

export type CreateCountryDTO = {
  iso_2: string
  iso_3: string
  num_code: string
  name: string
  display_name: string
}

export type UpdateRegionInput = UpdateRegionDTO & { id: string }
