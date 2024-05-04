import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { ClaimReason, ClaimType } from "../../../../models"

import { Type } from "class-transformer"
import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { ClaimTypeValue } from "../../../../types/claim"
import { AddressPayload, FindParams } from "../../../../types/common"
import { cleanResponseData } from "../../../../utils/clean-response-data"

/**
 * @oas [post] /admin/orders/{id}/claims
 * operationId: "PostOrdersOrderClaims"
 * summary: "Create a Claim"
 * description: "Create a Claim for an order. If a return shipping method is specified, a return will also be created and associated with the claim. If the claim's type is `refund`,
 *  the refund is processed as well."
 * externalDocs:
 *   description: How are claims created
 *   url: https://docs.medusajs.com/modules/orders/claims#how-are-claims-created
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Order.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned order.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned order.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminPostOrdersOrderClaimsReq"
 * x-codegen:
 *   method: createClaim
 *   params: AdminPostOrdersOrderClaimsParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.orders.createClaim(orderId, {
 *         type: 'refund',
 *         claim_items: [
 *           {
 *             item_id,
 *             quantity: 1
 *           }
 *         ]
 *       })
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminCreateClaim } from "medusa-react"
 *
 *       type Props = {
 *         orderId: string
 *       }
 *
 *       const CreateClaim = ({ orderId }: Props) => {
 *
 *       const CreateClaim = (orderId: string) => {
 *         const createClaim = useAdminCreateClaim(orderId)
 *         // ...
 *
 *         const handleCreate = (itemId: string) => {
 *           createClaim.mutate({
 *             type: "refund",
 *             claim_items: [
 *               {
 *                 item_id: itemId,
 *                 quantity: 1,
 *               },
 *             ],
 *           }, {
 *             onSuccess: ({ order }) => {
 *               console.log(order.claims)
 *             }
 *           })
 *         }
 *
 *         // ...
 *       }
 *
 *       export default CreateClaim
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/admin/orders/{id}/claims' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "type": "refund",
 *           "claim_items": [
 *             {
 *               "item_id": "asdsd",
 *               "quantity": 1
 *             }
 *           ]
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Orders
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrdersRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */

export default async (req, res) => {
  const { id } = req.params

  const value = req.validatedBody

  const idempotencyKeyService = req.scope.resolve("idempotencyKeyService")
  const manager: EntityManager = req.scope.resolve("manager")

  const headerKey = req.get("Idempotency-Key") || ""

  let idempotencyKey
  try {
    await manager.transaction(async (transactionManager) => {
      idempotencyKey = await idempotencyKeyService
        .withTransaction(transactionManager)
        .initializeRequest(headerKey, req.method, req.params, req.path)
    })
  } catch (error) {
    res.status(409).send("Failed to create idempotency key")
    return
  }

  res.setHeader("Access-Control-Expose-Headers", "Idempotency-Key")
  res.setHeader("Idempotency-Key", idempotencyKey.idempotency_key)

  const orderService = req.scope.resolve("orderService")
  const claimService = req.scope.resolve("claimService")
  const returnService = req.scope.resolve("returnService")

  let inProgress = true
  let err = false

  while (inProgress) {
    switch (idempotencyKey.recovery_point) {
      case "started": {
        await manager
          .transaction("SERIALIZABLE", async (transactionManager) => {
            idempotencyKey = await idempotencyKeyService
              .withTransaction(transactionManager)
              .workStage(idempotencyKey.idempotency_key, async (manager) => {
                const order = await orderService
                  .withTransaction(manager)
                  .retrieve(id, {
                    relations: [
                      "customer",
                      "shipping_address",
                      "region",
                      "items",
                      "items.tax_lines",
                      "discounts",
                      "discounts.rule",
                      "claims",
                      "claims.additional_items",
                      "claims.additional_items.tax_lines",
                      "swaps",
                      "swaps.additional_items",
                      "swaps.additional_items.tax_lines",
                    ],
                  })

                await claimService.withTransaction(manager).create({
                  idempotency_key: idempotencyKey.idempotency_key,
                  order,
                  ...value,
                })

                return {
                  recovery_point: "claim_created",
                }
              })
          })
          .catch((e) => {
            inProgress = false
            err = e
          })
        break
      }

      case "claim_created": {
        await manager
          .transaction("SERIALIZABLE", async (transactionManager) => {
            idempotencyKey = await idempotencyKeyService
              .withTransaction(transactionManager)
              .workStage(idempotencyKey.idempotency_key, async (manager) => {
                let claim = await claimService.withTransaction(manager).list({
                  idempotency_key: idempotencyKey.idempotency_key,
                })

                if (!claim.length) {
                  throw new MedusaError(
                    MedusaError.Types.INVALID_DATA,
                    `Claim not found`
                  )
                }

                claim = claim[0]

                if (claim.type === "refund") {
                  await claimService
                    .withTransaction(manager)
                    .processRefund(claim.id)
                }

                return {
                  recovery_point: "refund_handled",
                }
              })
          })
          .catch((e) => {
            inProgress = false
            err = e
          })
        break
      }

      case "refund_handled": {
        await manager
          .transaction("SERIALIZABLE", async (transactionManager) => {
            idempotencyKey = await idempotencyKeyService
              .withTransaction(transactionManager)
              .workStage(idempotencyKey.idempotency_key, async (manager) => {
                let order = await orderService
                  .withTransaction(manager)
                  .retrieve(id, {
                    relations: ["items", "discounts"],
                  })

                let claim = await claimService.withTransaction(manager).list(
                  {
                    idempotency_key: idempotencyKey.idempotency_key,
                  },
                  {
                    relations: ["return_order"],
                  }
                )

                if (!claim.length) {
                  throw new MedusaError(
                    MedusaError.Types.INVALID_DATA,
                    `Claim not found`
                  )
                }

                claim = claim[0]

                if (claim.return_order) {
                  await returnService
                    .withTransaction(manager)
                    .fulfill(claim.return_order.id)
                }

                order = await orderService
                  .withTransaction(manager)
                  .retrieveWithTotals(id, req.retrieveConfig, {
                    includes: req.includes,
                  })

                return {
                  response_code: 200,
                  response_body: {
                    order,
                  },
                }
              })
          })
          .catch((e) => {
            inProgress = false
            err = e
          })
        break
      }

      case "finished": {
        inProgress = false
        break
      }

      default:
        await manager.transaction(async (transactionManager) => {
          idempotencyKey = await idempotencyKeyService
            .withTransaction(transactionManager)
            .update(idempotencyKey.idempotency_key, {
              recovery_point: "finished",
              response_code: 500,
              response_body: { message: "Unknown recovery point" },
            })
        })
        break
    }
  }

  if (err) {
    throw err
  }

  if (idempotencyKey.response_body.order) {
    idempotencyKey.response_body.order = cleanResponseData(
      idempotencyKey.response_body.order,
      []
    )
  }

  res.status(idempotencyKey.response_code).json(idempotencyKey.response_body)
}

/**
 * The return's shipping method details.
 */
class ReturnShipping {
  /**
   * The ID of the shipping option used for the return.
   */
  @IsString()
  @IsOptional()
  option_id?: string

  /**
   * The shipping method's price.
   */
  @IsInt()
  @IsOptional()
  price?: number
}

class ShippingMethod {
  @IsString()
  @IsOptional()
  id?: string

  @IsString()
  @IsOptional()
  option_id?: string

  @IsInt()
  @IsOptional()
  price?: number

  @IsObject()
  @IsOptional()
  data?: Record<string, unknown>
}

class Item {
  @IsString()
  @IsNotEmpty()
  item_id: string

  @IsInt()
  @IsNotEmpty()
  quantity: number

  @IsString()
  @IsOptional()
  note?: string

  @IsEnum(ClaimReason)
  @IsOptional()
  reason?: ClaimReason

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[]

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[]
}

class AdditionalItem {
  @IsString()
  @IsNotEmpty()
  variant_id: string

  @IsInt()
  @IsNotEmpty()
  quantity: number
}

/**
 * @schema AdminPostOrdersOrderClaimsReq
 * type: object
 * description: "The details of the claim to be created."
 * required:
 *   - type
 *   - claim_items
 * properties:
 *   type:
 *     description: >-
 *       The type of the Claim. This will determine how the Claim is treated: `replace` Claims will result in a Fulfillment with new items being created, while a `refund` Claim will refund the amount paid for the claimed items.
 *     type: string
 *     enum:
 *       - replace
 *       - refund
 *   claim_items:
 *     description: The Claim Items that the Claim will consist of.
 *     type: array
 *     items:
 *       type: object
 *       required:
 *         - item_id
 *         - quantity
 *       properties:
 *         item_id:
 *           description: The ID of the Line Item that will be claimed.
 *           type: string
 *         quantity:
 *           description: The number of items that will be returned
 *           type: integer
 *         note:
 *           description: Short text describing the Claim Item in further detail.
 *           type: string
 *         reason:
 *           description: The reason for the Claim
 *           type: string
 *           enum:
 *             - missing_item
 *             - wrong_item
 *             - production_failure
 *             - other
 *         tags:
 *           description: A list of tags to add to the Claim Item
 *           type: array
 *           items:
 *             type: string
 *         images:
 *           description: A list of image URL's that will be associated with the Claim
 *           items:
 *             type: string
 *   return_shipping:
 *      description: Optional details for the Return Shipping Method, if the items are to be sent back. Providing this field will result in a return being created and associated with the claim.
 *      type: object
 *      properties:
 *        option_id:
 *          type: string
 *          description: The ID of the Shipping Option to create the Shipping Method from.
 *        price:
 *          type: integer
 *          description: The price to charge for the Shipping Method.
 *   additional_items:
 *      description: The new items to send to the Customer. This is only used if the claim's type is `replace`.
 *      type: array
 *      items:
 *        type: object
 *        required:
 *          - variant_id
 *          - quantity
 *        properties:
 *          variant_id:
 *            description: The ID of the Product Variant.
 *            type: string
 *          quantity:
 *            description: The quantity of the Product Variant.
 *            type: integer
 *   shipping_methods:
 *      description: The Shipping Methods to send the additional Line Items with. This is only used if the claim's type is `replace`.
 *      type: array
 *      items:
 *         type: object
 *         properties:
 *           id:
 *             description: The ID of an existing Shipping Method
 *             type: string
 *           option_id:
 *             description: The ID of the Shipping Option to create a Shipping Method from
 *             type: string
 *           price:
 *             description: The price to charge for the Shipping Method
 *             type: integer
 *           data:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
 *   shipping_address:
 *      description: "An optional shipping address to send the claimed items to. If not provided, the parent order's shipping address will be used."
 *      $ref: "#/components/schemas/AddressPayload"
 *   refund_amount:
 *      description: The amount to refund the customer. This is used when the claim's type is `refund`.
 *      type: integer
 *   no_notification:
 *      description: If set to true no notification will be send related to this Claim.
 *      type: boolean
 *   return_location_id:
 *      description: The ID of the location used for the associated return.
 *      type: string
 *   metadata:
 *      description: An optional set of key-value pairs to hold additional information.
 *      type: object
 *      externalDocs:
 *        description: "Learn about the metadata attribute, and how to delete and update it."
 *        url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
export class AdminPostOrdersOrderClaimsReq {
  @IsEnum(ClaimType)
  @IsNotEmpty()
  type: ClaimTypeValue

  @IsArray()
  @IsNotEmpty()
  @Type(() => Item)
  @ValidateNested({ each: true })
  claim_items: Item[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReturnShipping)
  return_shipping?: ReturnShipping

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdditionalItem)
  additional_items?: AdditionalItem[]

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ShippingMethod)
  shipping_methods?: ShippingMethod[]

  @IsInt()
  @IsOptional()
  refund_amount?: number

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressPayload)
  shipping_address?: AddressPayload

  @IsBoolean()
  @IsOptional()
  no_notification?: boolean

  @IsOptional()
  @IsString()
  return_location_id?: string

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostOrdersOrderClaimsParams extends FindParams {}
