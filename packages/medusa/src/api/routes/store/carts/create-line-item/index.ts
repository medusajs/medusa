import { IsInt, IsOptional, IsString } from "class-validator"
import { EntityManager } from "typeorm"
import { validator } from "../../../../../utils/validator"
import { CreateLineItemSteps } from "./utils/handler-steps"
import { Cart, IdempotencyKey } from "../../../../../models"
import {
  initializeIdempotencyRequest,
  RunIdempotencyStepOptions,
} from "../../../../../utils/idempotency"
import { cleanResponseData } from "../../../../../utils/clean-response-data"
import {
  CartService,
  LineItemService,
  ProductVariantInventoryService,
} from "../../../../../services"
import { FlagRouter } from "@medusajs/utils"
import { defaultStoreCartFields, defaultStoreCartRelations } from "../index"
import SalesChannelFeatureFlag from "../../../../../loaders/feature-flags/sales-channels"
import IdempotencyKeyService from "../../../../../services/idempotency-key"
import { WithRequiredProperty } from "../../../../../types/common"

/**
 * @oas [post] /store/carts/{id}/line-items
 * operationId: PostCartsCartLineItems
 * summary: "Add a Line Item"
 * description: "Generates a Line Item with a given Product Variant and adds it
 *   to the Cart"
 * parameters:
 *   - (path) id=* {string} The id of the Cart to add the Line Item to.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostCartsCartLineItemsReq"
 * x-codegen:
 *   method: createLineItem
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.lineItems.create(cart_id, {
 *         variant_id,
 *         quantity: 1
 *       })
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/store/carts/{id}/line-items' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *           "variant_id": "{variant_id}",
 *           "quantity": 1
 *       }'
 * tags:
 *   - Carts
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCartsRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
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

  const customerId: string | undefined = req.user?.customer_id
  const validated = await validator(StorePostCartsCartLineItemsReq, req.body)

  const manager: EntityManager = req.scope.resolve("manager")

  let idempotencyKey!: IdempotencyKey
  try {
    idempotencyKey = await initializeIdempotencyRequest(req, res)
  } catch {
    res.status(409).send("Failed to create idempotency key")
    return
  }

  let inProgress = true
  let err: unknown = false

  const stepOptions: RunIdempotencyStepOptions = {
    manager,
    idempotencyKey,
    container: req.scope,
    isolationLevel: "SERIALIZABLE",
  }

  const cartService: CartService = req.scope.resolve("cartService")
  const lineItemService: LineItemService = req.scope.resolve("lineItemService")
  const productVariantInventoryService: ProductVariantInventoryService =
    req.scope.resolve("productVariantInventoryService")
  const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
    "idempotencyKeyService"
  )
  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")

  while (inProgress) {
    switch (idempotencyKey.recovery_point) {
      case CreateLineItemSteps.STARTED: {
        try {
          const cartId = id
          const data = {
            customer_id: customerId,
            metadata: validated.metadata,
            quantity: validated.quantity,
            variant_id: validated.variant_id,
          }

          let cart = await cartService.retrieve(cartId, {
            select: ["id", "region_id", "customer_id"],
          })

          await manager.transaction(
            stepOptions.isolationLevel,
            async (transactionManager) => {
              const line = await lineItemService
                .withTransaction(transactionManager)
                .generate(data.variant_id, cart.region_id, data.quantity, {
                  customer_id: data.customer_id || cart.customer_id,
                  metadata: data.metadata,
                })

              const txCartService =
                cartService.withTransaction(transactionManager)
              await txCartService.addOrUpdateLineItems(cart.id, line, {
                validateSalesChannels:
                  featureFlagRouter.isFeatureEnabled("sales_channels"),
              })

              if (cart.payment_sessions?.length) {
                await txCartService.setPaymentSessions(
                  cart as WithRequiredProperty<Cart, "total">
                )
              }
            }
          )

          const relations = [
            ...defaultStoreCartRelations,
            "billing_address",
            "region.payment_providers",
            "payment_sessions",
            "customer",
          ]

          cart = await cartService.retrieveWithTotals(cart.id, {
            select: defaultStoreCartFields,
            relations,
          })

          const shouldSetAvailability =
            relations?.some((rel) => rel.includes("variant")) &&
            featureFlagRouter.isFeatureEnabled(SalesChannelFeatureFlag.key)

          if (shouldSetAvailability) {
            await productVariantInventoryService.setVariantAvailability(
              cart.items.map((i) => i.variant),
              cart.sales_channel_id!
            )
          }

          idempotencyKey.response_code = 200
          idempotencyKey.response_body = { cart }
          await idempotencyKeyService.update(idempotencyKey.id, {
            response_code: idempotencyKey.response_code,
            response_body: idempotencyKey.response_body,
          })
        } catch (e) {
          inProgress = false
          err = e
        }

        break
      }

      case CreateLineItemSteps.FINISHED: {
        inProgress = false
        break
      }
    }
  }

  if (err) {
    throw err
  }

  if (idempotencyKey.response_body.cart) {
    idempotencyKey.response_body.cart = cleanResponseData(
      idempotencyKey.response_body.cart,
      []
    )
  }

  res.status(idempotencyKey.response_code).json(idempotencyKey.response_body)
}

/**
 * @schema StorePostCartsCartLineItemsReq
 * type: object
 * required:
 *   - variant_id
 *   - quantity
 * properties:
 *   variant_id:
 *     type: string
 *     description: The id of the Product Variant to generate the Line Item from.
 *   quantity:
 *     type: number
 *     description: The quantity of the Product Variant to add to the Line Item.
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details about the Line Item.
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
export class StorePostCartsCartLineItemsReq {
  @IsString()
  variant_id: string

  @IsInt()
  quantity: number

  @IsOptional()
  metadata?: Record<string, unknown> | undefined
}
