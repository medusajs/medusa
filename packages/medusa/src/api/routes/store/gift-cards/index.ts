import { Router } from "express"
import middlewares from "../../../middlewares"
import { GiftCard } from "./../../../../"

const route = Router()

export default (app) => {
  app.use("/gift-cards", route)

  route.get("/:code", middlewares.wrap(require("./get-gift-card").default))

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

/**
 * @schema StoreGiftCardsRes
 * type: object
 * properties:
 *   gift_card:
 *     $ref: "#/components/schemas/GiftCard"
 */
export type StoreGiftCardsRes = {
  gift_card: GiftCard
}

export * from "./get-gift-card"
