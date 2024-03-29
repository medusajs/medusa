import { FilterableRegionProps, UpdateRegionDTO } from "../../region"

export interface AddRegionPaymentProvidersWorkflowInput {
  region_id: string
  payment_provider_id: string[]
}

export interface UpdateRegionsWorkflowInput {
  selector: FilterableRegionProps
  update: UpdateRegionDTO & {
    payment_provider_ids?: string[]
  }
}
