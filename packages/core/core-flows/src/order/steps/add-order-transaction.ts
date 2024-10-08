import { CreateOrderTransactionDTO } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const addOrderTransactionStepId = "add-order-transaction"
/**
 * This step creates an order transaction.
 */
export const addOrderTransactionStep = createStep(
  addOrderTransactionStepId,
  async (data: CreateOrderTransactionDTO, { container }) => {
    const service = container.resolve(Modules.ORDER)

    const created = await service.addOrderTransactions(data)

    return new StepResponse(created, created.id)
  },
  async (id, { container }) => {
    if (!id) {
      return
    }

    const service = container.resolve(Modules.ORDER)

    await service.deleteOrderTransactions(id)
  }
)
