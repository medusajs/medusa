import { Router } from "express"
import { GiftCard } from "./../../../../"

const route = Router()

export default (app) => {
  app.use("/gift-cards", route)

  route.get("/:code", require("./get-gift-card").default)

  return app
}

export const defaultStoreGiftCardRelations = ["region"]

export const defaultStoreGiftCardFields: (keyof GiftCard)[] = [
  "id",
  "code",
  "value",
  "balance",
]

export const allowedStoreGiftCardRelations = ["region"]

export const allowedStoreGiftCardFields = ["id", "code", "value", "balance"]

export type StoreGiftCardsRes = {
  gift_card: GiftCard
}

export * from "./get-gift-card"
