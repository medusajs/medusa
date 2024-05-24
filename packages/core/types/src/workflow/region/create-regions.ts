import { CreateRegionDTO, RegionDTO } from "../../region"

export interface CreateRegionsWorkflowInput {
  regions: CreateRegionDTO[]
}

export type CreateRegionsWorkflowOutput = RegionDTO[]
