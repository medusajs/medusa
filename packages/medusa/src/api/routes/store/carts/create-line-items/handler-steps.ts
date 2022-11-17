import { Cart, IdempotencyKey } from "../../../../../models"
import { AwilixContainer } from "awilix"
import { EntityManager, In } from "typeorm"
import { CartService, LineItemService } from "../../../../../services"
import { FlagRouter } from "../../../../../utils/flag-router"
import { defaultStoreCartFields, defaultStoreCartRelations } from "../index"
import IdempotencyKeyService from "../../../../../services/idempotency-key"
import { Request, Response } from "express"

export const CreateLineItemSteps = {
  STARTED: "started",
  RESET_LINE_ITEMS_HAS_SHIPPING: "reset_line_items_has_shipping",
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
  handler: ({ manager: EntityManager }) => Promise<{
    recovery_point?: string | undefined
    response_code?: number | undefined
    response_body?: Record<string, unknown> | undefined
  }>,
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
      idempotencyKey = await idempotencyKeyService
        .withTransaction(transactionManager)
        .workStage(idempotencyKey.idempotency_key, async (stageManager) => {
          return await handler({ manager: stageManager })
        })
    }
  )
}

export async function handleAddOrUpdateLineItem(
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
    recovery_point: CreateLineItemSteps.RESET_LINE_ITEMS_HAS_SHIPPING,
  }
}

export async function handleResetLineItemsHasShipping(
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
