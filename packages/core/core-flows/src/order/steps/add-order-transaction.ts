import { CreateOrderTransactionDTO } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

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
