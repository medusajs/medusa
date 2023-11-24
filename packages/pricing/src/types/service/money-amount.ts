export type MoneyAmountEventData = {
  id: string[]
}

export enum MoneyAmountEvents {
  MONEY_AMOUNT_UPDATED = "money-amount.updated",
  MONEY_AMOUNT_CREATED = "money-amount.created",
  MONEY_AMOUNT_DELETED = "money-amount.deleted",
}
