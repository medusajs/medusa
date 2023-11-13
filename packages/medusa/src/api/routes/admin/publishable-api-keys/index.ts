import { Router } from "express"

import middlewares, {
  transformBody,
  transformQuery,
} from "../../../middlewares"
import { GetPublishableApiKeysParams } from "./list-publishable-api-keys"
import { PublishableApiKey, SalesChannel } from "../../../../models"
import { DeleteResponse, PaginatedResponse } from "../../../../types/common"
import { AdminPostPublishableApiKeysReq } from "./create-publishable-api-key"
import { AdminPostPublishableApiKeysPublishableApiKeyReq } from "./update-publishable-api-key"
import { AdminDeletePublishableApiKeySalesChannelsBatchReq } from "./delete-channels-batch"
import { AdminPostPublishableApiKeySalesChannelsBatchReq } from "./add-channels-batch"
import { GetPublishableApiKeySalesChannelsParams } from "./list-publishable-api-key-sales-channels"

const route = Router()

export default (app) => {
  app.use("/publishable-api-keys", route)

  route.post(
    "/",
    transformBody(AdminPostPublishableApiKeysReq),
    middlewares.wrap(require("./create-publishable-api-key").default)
  )

  route.get(
    "/:id",
    middlewares.wrap(require("./get-publishable-api-key").default)
  )

  route.post(
    "/:id",
    transformBody(AdminPostPublishableApiKeysPublishableApiKeyReq),
    middlewares.wrap(require("./update-publishable-api-key").default)
  )

  route.delete(
    "/:id",
    middlewares.wrap(require("./delete-publishable-api-key").default)
  )

  route.post(
    "/:id/revoke",
    middlewares.wrap(require("./revoke-publishable-api-key").default)
  )

  route.get(
    "/",
    transformQuery(GetPublishableApiKeysParams, {
      isList: true,
    }),
    middlewares.wrap(require("./list-publishable-api-keys").default)
  )

  route.get(
    "/:id/sales-channels",
    transformQuery(GetPublishableApiKeySalesChannelsParams, { isList: true }),
    middlewares.wrap(
      require("./list-publishable-api-key-sales-channels").default
    )
  )

  route.post(
    "/:id/sales-channels/batch",
    transformBody(AdminPostPublishableApiKeySalesChannelsBatchReq),
    middlewares.wrap(require("./add-channels-batch").default)
  )

  route.delete(
    "/:id/sales-channels/batch",
    transformBody(AdminDeletePublishableApiKeySalesChannelsBatchReq),
    middlewares.wrap(require("./delete-channels-batch").default)
  )
}

/**
 * @schema AdminPublishableApiKeysRes
 * type: object
 * description: "The publishable API key's details."
 * required:
 *   - publishable_api_key
 * properties:
 *   publishable_api_key:
 *     description: "Publishable API key details."
 *     $ref: "#/components/schemas/PublishableApiKey"
 */
export type AdminPublishableApiKeysRes = {
  publishable_api_key: PublishableApiKey
}

/**
 * @schema AdminPublishableApiKeysListRes
 * type: object
 * description: The list of publishable API keys with pagination fields.
 * required:
 *   - publishable_api_keys
 *   - count
 *   - offset
 *   - limit
 * properties:
 *   publishable_api_keys:
 *     type: array
 *     description: "An array of publishable API keys details."
 *     items:
 *       $ref: "#/components/schemas/PublishableApiKey"
 *   count:
 *     type: integer
 *     description: The total number of items available
 *   offset:
 *     type: integer
 *     description: The number of publishable API keys skipped when retrieving the publishable API keys.
 *   limit:
 *     type: integer
 *     description: The number of items per page
 */
export type AdminPublishableApiKeysListRes = PaginatedResponse & {
  publishable_api_keys: PublishableApiKey[]
}

/**
 * @schema AdminPublishableApiKeyDeleteRes
 * type: object
 * required:
 *   - id
 *   - object
 *   - deleted
 * properties:
 *   id:
 *     type: string
 *     description: The ID of the deleted publishable API key.
 *   object:
 *     type: string
 *     description: The type of the object that was deleted.
 *     default: publishable_api_key
 *   deleted:
 *     type: boolean
 *     description: Whether the publishable API key was deleted.
 *     default: true
 */
export type AdminPublishableApiKeyDeleteRes = DeleteResponse

/**
 * @schema AdminPublishableApiKeysListSalesChannelsRes
 * type: object
 * description: "The list of sales channel."
 * required:
 *   - sales_channels
 * properties:
 *   sales_channels:
 *     description: "An array of sales channels details."
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/SalesChannel"
 */
export type AdminPublishableApiKeysListSalesChannelsRes = {
  sales_channels: SalesChannel[]
}

export * from "./add-channels-batch"
export * from "./delete-channels-batch"
export * from "./list-publishable-api-keys"
export * from "./list-publishable-api-key-sales-channels"
export * from "./create-publishable-api-key"
export * from "./update-publishable-api-key"
