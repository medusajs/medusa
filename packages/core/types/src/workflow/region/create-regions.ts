import { CreateRegionDTO, RegionDTO } from "../../region"

export interface CreateRegionsWorkflowInput {
  regions: (CreateRegionDTO & {
    payment_providers?: string[]
  })[]
}

export type CreateRegionsWorkflowOutput = RegionDTO[]
