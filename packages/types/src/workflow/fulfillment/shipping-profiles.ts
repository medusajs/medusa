import { FilterableShippingProfileProps } from "../../fulfillment"

interface CreateShippingProfile {
  name: string
  type: string
}

export interface CreateShippingProfilesWorkflowInput {
  data: CreateShippingProfile[]
}

interface UpdateShippingProfile {
  name?: string
  type?: string
}

export interface UpdateShippingProfilesWorkflowInput {
  selector: FilterableShippingProfileProps
  update: UpdateShippingProfile
}
