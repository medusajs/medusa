import { AdminUpdateStore } from "../../http"
import { CreateStoreDTO, FilterableStoreProps } from "../../store"

export type CreateStoreWorkflowInput = Omit<
  CreateStoreDTO,
  "supported_currencies"
> & {
  supported_currencies: {
    currency_code: string
    is_default?: boolean
    is_tax_inclusive?: boolean
  }[]
}

export interface UpdateStoreWorkflowInput {
  selector: FilterableStoreProps
  update: AdminUpdateStore
}
