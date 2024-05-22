import { FilterableShippingProfileProps, ShippingProfileDTO } from "../../fulfillment"

interface CreateShippingProfile {
  name: string
  type: string
}

export interface CreateShippingProfilesWorkflowInput {
  data: CreateShippingProfile[]
}

export type CreateShippingProfilesWorkflowOutput = ShippingProfileDTO[]

interface UpdateShippingProfile {
  name?: string
  type?: string
}

export interface UpdateShippingProfilesWorkflowInput {
  selector: FilterableShippingProfileProps
  update: UpdateShippingProfile
}
