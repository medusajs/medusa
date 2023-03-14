import { IsInt, IsOptional, IsString } from "class-validator"
import { EntityManager } from "typeorm"
import { validator } from "../../../../../utils/validator"
import {
  CreateLineItemSteps,
  handleAddOrUpdateLineItem,
} from "./utils/handler-steps"
import { IdempotencyKey } from "../../../../../models"
import {
  initializeIdempotencyRequest,
  runIdempotencyStep,
  RunIdempotencyStepOptions,
} from "../../../../../utils/idempotency"

/**
 * @oas [post] /carts/{id}/line-items
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
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/carts/{id}/line-items' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "variant_id": "{variant_id}",
 *           "quantity": 1
 *       }'
 * tags:
 *   - Cart
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

  while (inProgress) {
    switch (idempotencyKey.recovery_point) {
      case CreateLineItemSteps.STARTED: {
        await runIdempotencyStep(async ({ manager }) => {
          return await handleAddOrUpdateLineItem(
            id,
            {
              customer_id: customerId,
              metadata: validated.metadata,
              quantity: validated.quantity,
              variant_id: validated.variant_id,
            },
            {
              manager,
              container: req.scope,
            }
          )
        }, stepOptions).catch((e) => {
          inProgress = false
          err = e
        })
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
 */
export class StorePostCartsCartLineItemsReq {
  @IsString()
  variant_id: string

  @IsInt()
  quantity: number

  @IsOptional()
  metadata?: Record<string, unknown> | undefined
}
