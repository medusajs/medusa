import { IdempotencyKey } from "../../../../../models"
import { AwilixContainer } from "awilix"
import { EntityManager } from "typeorm"
import { CartService, LineItemService } from "../../../../../services"
import { FlagRouter } from "../../../../../utils/flag-router"
import { defaultStoreCartFields, defaultStoreCartRelations } from "../index"
import IdempotencyKeyService from "../../../../../services/idempotency-key"
import { Request, Response } from "express"
import { IdempotencyCallbackResult } from "../../../../../types/idempotency-key"

export const CreateLineItemSteps = {
  STARTED: "started",
  FINISHED: "finished",
}

export async function initializeIdempotencyRequest(
  req: Request,
  res: Response
): Promise<IdempotencyKey> {
  const idempotencyKeyService: IdempotencyKeyService = req.scope.resolve(
    "idempotencyKeyService"
  )
  const manager: EntityManager = req.scope.resolve("manager")

  const headerKey = req.get("Idempotency-Key") || ""

  let idempotencyKey
  await manager.transaction(async (transactionManager) => {
    idempotencyKey = await idempotencyKeyService
      .withTransaction(transactionManager)
      .initializeRequest(headerKey, req.method, req.params, req.path)
  })

  res.setHeader("Access-Control-Expose-Headers", "Idempotency-Key")
  res.setHeader("Idempotency-Key", idempotencyKey.idempotency_key)

  return idempotencyKey
}

export async function runStep(
  handler: ({ manager: EntityManager }) => Promise<IdempotencyCallbackResult>,
  {
    manager,
    idempotencyKey,
    container,
  }: {
    manager: EntityManager
    idempotencyKey: IdempotencyKey
    container: AwilixContainer
  }
) {
  const idempotencyKeyService: IdempotencyKeyService = container.resolve(
    "idempotencyKeyService"
  )
  return await manager.transaction(
    "SERIALIZABLE",
    async (transactionManager) => {
      const idempotencyKey_ = await idempotencyKeyService
        .withTransaction(transactionManager)
        .workStage(idempotencyKey.idempotency_key, async (stageManager) => {
          return await handler({ manager: stageManager })
        })
      idempotencyKey.response_code = idempotencyKey_.response_code
      idempotencyKey.response_body = idempotencyKey_.response_body
      idempotencyKey.recovery_point = idempotencyKey_.recovery_point
    }
  )
}

export async function handleAddOrUpdateLineItem(
  cartId: string,
  data: {
    metadata?: Record<string, unknown>
    customer_id?: string
    variant_id: string
    quantity: number
  },
  { container, manager }: { container: AwilixContainer; manager: EntityManager }
): Promise<IdempotencyCallbackResult> {
  const cartService: CartService = container.resolve("cartService")
  const lineItemService: LineItemService = container.resolve("lineItemService")
  const featureFlagRouter: FlagRouter = container.resolve("featureFlagRouter")

  const txCartService = cartService.withTransaction(manager)

  let cart = await txCartService.retrieve(cartId, {
    relations: ["items", "items.variant", "payment_sessions"],
  })

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

  cart = await cartService.retrieveWithTotals(cart.id, {
    select: defaultStoreCartFields,
    relations: defaultStoreCartRelations,
  })

  return {
    response_code: 200,
    response_body: { cart },
  }
}
