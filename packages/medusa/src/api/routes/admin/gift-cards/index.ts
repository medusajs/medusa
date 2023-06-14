import { Router } from "express"
import "reflect-metadata"
import { GiftCard } from "../../../.."
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { AdminGetGiftCardsParams } from "./list-gift-cards"
import { AdminPostGiftCardsReq } from "./create-gift-card"

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
    middlewares.wrap(require("./list-gift-cards").default)
  )

  route.post(
    "/",
    transformBody(AdminPostGiftCardsReq),
    middlewares.wrap(require("./create-gift-card").default)
  )

  route.get("/:id", middlewares.wrap(require("./get-gift-card").default))

  route.post("/:id", middlewares.wrap(require("./update-gift-card").default))

  route.delete("/:id", middlewares.wrap(require("./delete-gift-card").default))

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
  "tax_rate",
  "created_at",
  "updated_at",
  "deleted_at",
  "metadata",
]

export const defaultAdminGiftCardRelations = ["region", "order"]

/**
 * @schema AdminGiftCardsRes
 * type: object
 * x-expanded-relations:
 *   field: gift_card
 *   relations:
 *     - order
 *     - region
 *   eager:
 *     - region.fulfillment_providers
 *     - region.payment_providers
 * required:
 *   - gift_card
 * properties:
 *   gift_card:
 *     $ref: "#/components/schemas/GiftCard"
 */
export type AdminGiftCardsRes = {
  gift_card: GiftCard
}

/**
 * @schema AdminGiftCardsDeleteRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted Gift Card
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: gift-card
 *   deleted:
 *     type: boolean
 *     description: Whether the gift card was deleted successfully or not.
 *     default: true
 */
export type AdminGiftCardsDeleteRes = DeleteResponse

/**
 * @schema AdminGiftCardsListRes
 * type: object
 * x-expanded-relations:
 *   field: gift_cards
 *   relations:
 *     - order
 *     - region
 *   eager:
 *     - region.fulfillment_providers
 *     - region.payment_providers
 * required:
 *   - gift_cards
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   gift_cards:
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/GiftCard"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of items skipped before these items
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminGiftCardsListRes = PaginatedResponse & {
  gift_cards: GiftCard[]
}

export * from "./create-gift-card"
export * from "./list-gift-cards"
export * from "./update-gift-card"
