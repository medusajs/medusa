import { GiftCard } from "./../../../../"
import { Router } from "express"
import middlewares from "../../../middlewares"

const route = Router()

export default (app) => {
  app.use("/gift-cards", route)

  route.get("/:code", middlewares.wrap(require("./get-gift-card").default))

  return app
}

export const defaultStoreGiftCardRelations = ["region"]

export const defaultStoreGiftCardFields = ["id", "code", "value", "balance"]

export const allowedStoreGiftCardRelations = ["region"]

export const allowedStoreGiftCardFields = ["id", "code", "value", "balance"]

export class StoreGiftCardsRes {
  gift_card: GiftCard
}

export * from "./get-gift-card"
