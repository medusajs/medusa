import { Router } from "express"
import "reflect-metadata"
import { GiftCard } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import { transformQuery } from "../../../middlewares"
import { AdminGetGiftCardsParams } from "./list-gift-cards"

const route = Router()

export default (app) => {
  app.use("/gift-cards", route)

  route.get(
    "/",
    transformQuery(AdminGetGiftCardsParams, {
      defaultFields: defaultAdminGiftCardFields,
      defaultRelations: defaultAdminGiftCardRelations,
      isList: true,
    }),
    require("./list-gift-cards").default
  )

  route.post("/", require("./create-gift-card").default)

  route.get("/:id", require("./get-gift-card").default)

  route.post("/:id", require("./update-gift-card").default)

  route.delete("/:id", require("./delete-gift-card").default)

  return app
}

export const defaultAdminGiftCardFields: (keyof GiftCard)[] = [
  "id",
  "code",
  "value",
  "balance",
  "region_id",
  "is_disabled",
  "ends_at",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const defaultAdminGiftCardRelations = ["region", "order"]

export const allowedAdminGiftCardFields = [
  "id",
  "code",
  "value",
  "balance",
  "region_id",
  "is_disabled",
  "ends_at",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const allowedAdminGiftCardRelations = ["region"]

export type AdminGiftCardsRes = {
  gift_card: GiftCard
}

export type AdminGiftCardsDeleteRes = DeleteResponse

export type AdminGiftCardsListRes = PaginatedResponse & {
  gift_cards: GiftCard[]
}

export * from "./create-gift-card"
export * from "./list-gift-cards"
export * from "./update-gift-card"
