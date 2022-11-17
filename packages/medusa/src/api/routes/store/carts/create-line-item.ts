import { IsInt, IsOptional, IsString } from "class-validator"
import { EntityManager, In } from "typeorm"
import { defaultStoreCartFields, defaultStoreCartRelations } from "."
import { CartService, LineItemService } from "../../../../services"
import { validator } from "../../../../utils/validator"
import { FlagRouter } from "../../../../utils/flag-router"
import IdempotencyKeyService from "../../../../services/idempotency-key"
import { AwilixContainer } from "awilix"
import { Cart } from "../../../../models"

const steps = {
  STARTED: "started",
  RESET_LINE_ITEMS_HAS_SHIPPING: "reset_line_items_has_shipping",
  FINISHED: "finished",
}

/**
 * @oas [post] /carts/{id}/line-items
 * operationId: PostCartsCartLineItems
 * summary: "Add a Line Item"
 * description: "Generates a Line Item with a given Product Variant and adds it
 *   to the Cart"
 * parameters:
 *   - (path) id=* {string} The id of the Cart to add the Line Item to.
 *   - (body) variant_id=* {string} The id of the Product Variant to generate the Line Item from.
 *   - (body) quantity=* {integer} The quantity of the Product Variant to add to the Line Item.
 *   - (body) metadata {object} An optional key-value map with additional details about the Line Item.
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
 *           properties:
 *             cart:
 *               $ref: "#/components/schemas/cart"
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

  const cartService: CartService = req.scope.resolve("cartService")
  const manager: EntityManager = req.scope.resolve("manager")

  const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
    "idempotencyKeyService"
  )

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

  let inProgress = true
  let err: unknown = false

  const cart = await cartService.retrieve(id, {
    relations: ["items", "items.variant", "payment_sessions"],
  })

  const runStep = async (
    handler: ({ manager: EntityManager }) => Promise<{
      recovery_point?: string | undefined
      response_code?: number | undefined
      response_body?: Record<string, unknown> | undefined
    }>
  ) => {
    return await manager.transaction(
      "SERIALIZABLE",
      async (transactionManager) => {
        idempotencyKey = await idempotencyKeyService
          .withTransaction(transactionManager)
          .workStage(idempotencyKey.idempotency_key, async (stageManager) => {
            return await handler({ manager: stageManager })
          })
      }
    )
  }

  while (inProgress) {
    switch (idempotencyKey.recovery_point) {
      case steps.STARTED: {
        await runStep(async ({ manager }) => {
          return await handleAddOrUpdateLineItem(
            cart,
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
        }).catch((e) => {
          inProgress = false
          err = e
        })
        break
      }

      case steps.RESET_LINE_ITEMS_HAS_SHIPPING: {
        await runStep(async ({ manager }) => {
          return await handleResetLineItemsHasShipping(id, {
            manager,
            container: req.scope,
          })
        }).catch((e) => {
          inProgress = false
          err = e
        })
        break
      }

      case steps.FINISHED: {
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

async function handleAddOrUpdateLineItem(
  cart: Cart,
  data: {
    metadata?: Record<string, unknown>
    customer_id?: string
    variant_id: string
    quantity: number
  },
  { container, manager }: { container: AwilixContainer; manager: EntityManager }
): Promise<{ recovery_point: string }> {
  const cartService: CartService = container.resolve("cartService")
  const lineItemService: LineItemService = container.resolve("lineItemService")
  const featureFlagRouter: FlagRouter = container.resolve("featureFlagRouter")

  const txCartService = cartService.withTransaction(manager)

  const line = await lineItemService
    .withTransaction(manager)
    .generate(data.variant_id, cart.region_id, data.quantity, {
      customer_id: data.customer_id || cart.customer_id,
      metadata: data.metadata,
    })

  await txCartService.addLineItem(cart, line, {
    validateSalesChannels: featureFlagRouter.isFeatureEnabled("sales_channels"),
  })

  if (cart.payment_sessions?.length) {
    await txCartService.setPaymentSessions(cart.id)
  }

  return {
    recovery_point: steps.RESET_LINE_ITEMS_HAS_SHIPPING,
  }
}

async function handleResetLineItemsHasShipping(
  cartId: string,
  {
    container,
    manager,
  }: {
    container: AwilixContainer
    manager: EntityManager
  }
) {
  const cartService: CartService = container.resolve("cartService")
  const lineItemService: LineItemService = container.resolve("lineItemService")

  let cart = await cartService.withTransaction(manager).retrieve(cartId, {
    relations: ["items"],
  })

  await lineItemService.withTransaction(manager).update(
    {
      id: In(cart.items.map((item) => item.id)),
    },
    {
      has_shipping: false,
    }
  )

  cart = await cartService.retrieveWithTotals(cartId, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  return {
    response_code: 200,
    response_body: { cart },
  }
}

export class StorePostCartsCartLineItemsReq {
  @IsString()
  variant_id: string

  @IsInt()
  quantity: number

  @IsOptional()
  metadata?: Record<string, unknown> | undefined
}
