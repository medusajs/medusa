import type {
  CreateOrderDTO,
  IOrderModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The orders to create.
 */
export type CreateOrdersStepInput = CreateOrderDTO[]

export const createOrdersStepId = "create-orders"
/**
 * This step creates one or more orders.
 *
 * @example
 * const data = createOrdersStep([{
 *   region_id: "region_123",
 *   customer_id: "customer_123",
 *   items: [
 *     {
 *       variant_id: "variant_123",
 *       quantity: 1,
 *       title: "Shirt",
 *       unit_price: 10,
 *     }
 *   ]
 * }])
 */
export const createOrdersStep = createStep(
  createOrdersStepId,
  async (data: CreateOrderDTO[], { container }) => {
    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    const created = await service.createOrders(data)
    return new StepResponse(
      created,
      created.map((store) => store.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(Modules.ORDER)

    await service.deleteOrders(createdIds)
  }
)
