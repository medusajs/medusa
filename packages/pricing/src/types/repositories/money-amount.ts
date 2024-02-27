import { Currency } from "@models"

export interface CreateMoneyAmountDTO {
  id?: string
  currency_code: string
  currency?: Currency
  amount: number
  min_quantity?: number | null
  max_quantity?: number | null
}

export interface UpdateMoneyAmountDTO {
  id: string
  currency_code?: string
  amount?: number
  min_quantity?: number
  max_quantity?: number
}
