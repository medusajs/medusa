import { FilterableRegionProps, UpdateRegionDTO } from "../../region"

export interface UpdateRegionsWorkflowInput {
  selector: FilterableRegionProps
  update: UpdateRegionDTO & {
    payment_providers?: string[]
  }
}
