import { Return } from "../models"

export type FulfillmentOptions = {
  provider_id: string
  options: Record<string, unknown>[]
}

export type CreateReturnType = Omit<Return, "beforeInsert">
