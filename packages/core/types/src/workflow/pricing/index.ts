import { FilterablePricePreferenceProps } from "../../pricing"

export interface CreatePricePreferencesWorkflowInput {
  attribute?: string
  value?: string
  is_tax_inclusive?: boolean
}

interface UpdatePricePreferences {
  attribute?: string | null
  value?: string | null
  is_tax_inclusive?: boolean
}

export interface UpdatePricePreferencesWorkflowInput {
  selector: FilterablePricePreferenceProps
  update: UpdatePricePreferences
}
