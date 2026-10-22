import type {
  Context,
  IOrderModuleService,
  OrderDTO,
} from "@medusajs/framework/types"
import {
  arrayDifference,
  MedusaContextType,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * `tags: [{ id }]` is how an order's tag associations are assigned via the
 * generic `updateOrders` DTO today - the same relation-reference shape the
 * `product` module uses for `category_ids`/`tag_ids` internally. It isn't
 * part of the public `UpdateOrderDTO` type (which only declares
 * `tag_ids?: string[]`, currently unwired - see Task 9's report), so this
 * local type documents the shape we actually send.
 */
type UpdateOrderTagsRelationDTO = {
  id: string
  tags: { id: string }[]
}

/**
 * The data to bulk add/remove tags across one or more orders.
 */
export type BulkTagOrdersStepInput = {
  /**
   * The IDs of the orders to tag.
   */
  order_ids: string[]
  /**
   * The IDs of the tags to add to each order.
   */
  add?: string[]
  /**
   * The IDs of the tags to remove from each order.
   *
   * If a tag ID appears in both `add` and `remove`, removal wins - the
   * order ends up without that tag.
   */
  remove?: string[]
}

/**
 * Builds a `sharedContext` that keeps every `IOrderModuleService` call it's
 * passed to on the same `EntityManager`/identity map instead of each
 * forking its own, and returns that manager alongside it so the caller can
 * flush it explicitly - see the `bulkTagOrdersStep` doc comment below for
 * why both of those are necessary.
 *
 * Starts from the step's own ambient `Context` (the `context` field of its
 * `StepExecutionContext`) rather than building one from scratch, so
 * `eventGroupId`/`transactionId`/`idempotencyKey` etc. - which the
 * workflow engine already put there for this run - survive onto every
 * call made through the returned context instead of silently getting
 * dropped.
 */
function buildSharedEntityManagerContext(
  service: IOrderModuleService,
  ambientContext: Context
): {
  context: Context
  manager: { flush(): Promise<void> }
} {
  const manager = (service as any).baseRepository_.getFreshManager()
  return {
    manager,
    context: {
      ...ambientContext,
      __type: MedusaContextType,
      manager,
      transactionManager: manager,
    },
  }
}

/**
 * `updateOrders`'s array-form overload only declares `sharedContext` as
 * its 2nd parameter in `IOrderModuleService`, but the real
 * implementation's `@MedusaContext`-decorated parameter is the 3rd
 * (`dataOrIdOrSelector, data?, sharedContext`) - calling through the
 * 2-arg overload silently drops the context into the unused `data` slot
 * instead (the same class of bug fixed for `updateOrderTags` in a prior
 * task). Calling with the explicit 3-arg shape below lines the context up
 * with the real parameter position so the update actually runs on the
 * manager the context carries.
 */
function updateOrdersWithContext(
  service: IOrderModuleService,
  data: UpdateOrderTagsRelationDTO[],
  sharedContext: Context
): Promise<OrderDTO[]> {
  const updateOrders = service.updateOrders as unknown as (
    data: UpdateOrderTagsRelationDTO[],
    data2: undefined,
    sharedContext: Context
  ) => Promise<OrderDTO[]>
  return updateOrders(data, undefined, sharedContext)
}

export const bulkTagOrdersStepId = "bulk-tag-orders"
/**
 * This step adds and/or removes tags across one or more orders in a single
 * transactional update.
 *
 * It validates every order id and every referenced tag id *before* making
 * any change - if any of them don't resolve, it throws
 * `MedusaError.Types.NOT_FOUND` and no order is mutated.
 *
 * The orders and tags are looked up using the same `sharedContext` that's
 * then used for the final `updateOrders` call. This matters: a bare
 * `{ id: tagId }` relation reference only resolves to the already-existing
 * `OrderTag` row - instead of MikroORM trying to create a brand new one
 * (and crashing on the non-nullable `value` column) - when that row is
 * already present in the *same* `EntityManager`'s identity map that
 * performs the update.
 *
 * Getting that sharing to actually happen takes four things, all verified
 * empirically against the real `ValidationError: Value for OrderTag.value
 * is required` crash (reproduced, then fixed, by iterating on this exact
 * step):
 *
 * 1. Resolve one `EntityManager` ourselves up front
 *    (`baseRepository_.getFreshManager()` - the same call `@InjectManager`
 *    would otherwise make per-call) and seed it onto both
 *    `sharedContext.manager` (so `@InjectManager`, used by `listOrders` /
 *    `listOrderTags` / the public `updateOrders`, finds a pre-existing
 *    manager and skips forking a new one) and `sharedContext.
 *    transactionManager` (so `updateOrders`'s internal `updateOrders_`,
 *    wrapped in `@InjectTransactionManager`, takes its early-return branch
 *    instead of calling `MikroOrmBaseRepository.transaction()` - which
 *    unconditionally forks *another* fresh manager, ignoring any `manager`
 *    option it's given).
 * 2. Build that context by *extending* the step's own ambient `Context`
 *    (`StepExecutionContext.context`, carrying `eventGroupId`/
 *    `transactionId`/`idempotencyKey`/etc. for this workflow run) rather
 *    than constructing one from scratch, and mark it with
 *    `__type: MedusaContextType`. Both parts matter: workflow steps
 *    resolve modules through a container whose `resolve()` wraps every
 *    module in a `Proxy` (`packages/core/orchestration/src/workflow/
 *    local-workflow.ts`, `contextualizedMedusaModules`) that inspects the
 *    `@MedusaContext`-decorated argument of every call and, if it doesn't
 *    already carry `__type: MedusaContextType`, *replaces* it with the
 *    workflow's own ambient context - stripping `manager`/
 *    `transactionManager` off that replacement in the process. Without
 *    the marker, a carefully built `sharedContext` never even reaches the
 *    decorators: the proxy silently substitutes it first. And without
 *    extending the ambient context first, the replacement we *do* control
 *    would itself silently drop `eventGroupId`/`transactionId`/
 *    `idempotencyKey` - latent today (nothing in the order module reacts
 *    to an `ORDER_UPDATED` event yet), but a correctness trap for event
 *    grouping/idempotency the day one is added.
 * 3. Pass the exact same `sharedContext` object into every call below -
 *    the validation lookups and the final batched `updateOrders` call.
 * 4. Flush the manager ourselves afterwards. Taking `updateOrders_`'s
 *    early-return branch (point 1) means `MikroOrmBaseRepository.
 *    transaction()` - which normally flushes the manager for us when its
 *    callback resolves - never runs. Without an explicit `manager.flush()`
 *    the tag/order assignments stay queued in the unit of work and are
 *    silently never persisted (verified: the call resolves with no error,
 *    but the association never reaches the database).
 *
 * @example
 * const data = bulkTagOrdersStep({
 *   order_ids: ["order_123", "order_456"],
 *   add: ["otag_123"],
 *   remove: ["otag_456"]
 * })
 */
export const bulkTagOrdersStep = createStep(
  bulkTagOrdersStepId,
  async (input: BulkTagOrdersStepInput, { container, context }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)
    const { context: sharedContext, manager } = buildSharedEntityManagerContext(
      service,
      context
    )

    const orderIds = input.order_ids
    const addIds = input.add ?? []
    const removeIds = input.remove ?? []
    const distinctTagIds = Array.from(new Set([...addIds, ...removeIds]))

    const orders = await service.listOrders(
      { id: orderIds },
      { select: ["id"], relations: ["tags"] },
      sharedContext
    )

    const missingOrderIds = arrayDifference(
      orderIds,
      orders.map((order) => order.id)
    )
    if (missingOrderIds.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order${missingOrderIds.length > 1 ? "s" : ""} with id${
          missingOrderIds.length > 1 ? "s" : ""
        }: ${missingOrderIds.join(", ")} ${
          missingOrderIds.length > 1 ? "were" : "was"
        } not found`
      )
    }

    const tags = distinctTagIds.length
      ? await service.listOrderTags(
          { id: distinctTagIds },
          { select: ["id"] },
          sharedContext
        )
      : []

    const missingTagIds = arrayDifference(
      distinctTagIds,
      tags.map((tag) => tag.id)
    )
    if (missingTagIds.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order tag${missingTagIds.length > 1 ? "s" : ""} with id${
          missingTagIds.length > 1 ? "s" : ""
        }: ${missingTagIds.join(", ")} ${
          missingTagIds.length > 1 ? "were" : "was"
        } not found`
      )
    }

    const addSet = new Set(addIds)
    const removeSet = new Set(removeIds)

    const prevTagIdsByOrder: Record<string, string[]> = {}
    const toUpdate = orders.map((order) => {
      const currentTagIds = (order.tags ?? []).map((tag) => tag.id)
      prevTagIdsByOrder[order.id] = currentTagIds

      const newTagIds = new Set(currentTagIds)
      for (const id of addSet) {
        newTagIds.add(id)
      }
      // Remove wins on overlap - this runs after the adds above.
      for (const id of removeSet) {
        newTagIds.delete(id)
      }

      return {
        id: order.id,
        tags: Array.from(newTagIds).map((id) => ({ id })),
      }
    })

    const updatedOrders = await updateOrdersWithContext(
      service,
      toUpdate,
      sharedContext
    )

    // See point 4 above: nothing else flushes this manager.
    await manager.flush()

    return new StepResponse(updatedOrders, { prevTagIdsByOrder })
  },
  async (compensationData, { container, context }) => {
    if (!compensationData?.prevTagIdsByOrder) {
      return
    }

    const { prevTagIdsByOrder } = compensationData
    const toRestore = Object.entries(prevTagIdsByOrder).map(
      ([orderId, tagIds]) => ({
        id: orderId,
        tags: tagIds.map((id) => ({ id })),
      })
    )

    if (!toRestore.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)
    const { context: sharedContext, manager } = buildSharedEntityManagerContext(
      service,
      context
    )

    // Same reasoning as the main step: the tags being restored need to be
    // loaded into this same `sharedContext`/manager before `updateOrders`
    // re-assigns them by `{ id }`, or MikroORM tries to create them as new
    // rows and crashes on the non-nullable `value` column.
    const allPrevTagIds = Array.from(
      new Set(Object.values(prevTagIdsByOrder).flat())
    )
    if (allPrevTagIds.length) {
      await service.listOrderTags(
        { id: allPrevTagIds },
        { select: ["id"] },
        sharedContext
      )
    }

    await updateOrdersWithContext(service, toRestore, sharedContext)
    await manager.flush()
  }
)
