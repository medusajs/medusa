import {
  CreateOrderChangeDTO,
  IOrderModuleService,
} from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"
import { randomUUID } from "node:crypto"
import { setTimeout } from "timers/promises"

const ORDER_CHANGE_LOCK_TIMEOUT_MS = 30_000
const ORDER_CHANGE_LOCK_TTL_SECONDS = 10
const ORDER_CHANGE_LOCK_RETRY_INTERVAL_MS = 300

/**
 * The key of the lock held while an order change is created for an order.
 * Workflows that must not see a new order change for an order while they run,
 * such as `refundPaymentWorkflow`, hold this lock to make order change
 * creation wait.
 *
 * @param orderId - The order's ID.
 */
export const getOrderChangeLockKey = (orderId: string): string =>
  `order-change:${orderId}`

export const createOrderChangeStepId = "create-order-change"
/**
 * This step creates an order change.
 *
 * When the step runs in a top-level workflow, it creates the order change while
 * holding the order's order change lock (see {@link getOrderChangeLockKey}), so it waits
 * for a workflow holding that lock to finish. In a workflow run as a step of another
 * workflow, it doesn't take the lock, since the parent workflow may be the one holding it.
 */
export const createOrderChangeStep = createStep(
  createOrderChangeStepId,
  async (
    data: CreateOrderChangeDTO,
    { container, parentStepIdempotencyKey }
  ) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    if (parentStepIdempotencyKey) {
      const created = await service.createOrderChange(data)
      return new StepResponse(created, created.id)
    }

    // Uses acquire/release, like `acquireLockStep`, rather than `execute`:
    // some providers keep the two in separate lock spaces.
    const locking = container.resolve(Modules.LOCKING)
    const key = getOrderChangeLockKey(data.order_id)
    const ownerId = `create-order-change:${randomUUID()}`
    const tryUntil = Date.now() + ORDER_CHANGE_LOCK_TIMEOUT_MS

    while (true) {
      try {
        await locking.acquire(key, {
          ownerId,
          expire: ORDER_CHANGE_LOCK_TTL_SECONDS,
        })
        break
      } catch {
        if (Date.now() >= tryUntil) {
          throw new MedusaError(
            MedusaError.Types.CONFLICT,
            `Order (${data.order_id}) is being updated by another operation. Try again later.`
          )
        }
      }

      await setTimeout(ORDER_CHANGE_LOCK_RETRY_INTERVAL_MS)
    }

    try {
      const created = await service.createOrderChange(data)
      return new StepResponse(created, created.id)
    } finally {
      await locking.release(key, { ownerId })
    }
  },
  async (id, { container }) => {
    if (!id) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.deleteOrderChanges(id)
  }
)
