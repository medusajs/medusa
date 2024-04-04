import { CurrencyDTO, StoreDTO } from "@medusajs/types"

export type Store = StoreDTO & {
  default_currency: CurrencyDTO | null
}
