import type { CreateOrderTransactionDTO } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The transaction(s) to add to the order.
 */
export type AddOrderTransactionStepInput =
  | CreateOrderTransactionDTO
  | CreateOrderTransactionDTO[]

/**
 * The added order transaction(s).
 */
export type AddOrderTransactionStepOutput =
  | CreateOrderTransactionDTO
  | CreateOrderTransactionDTO[]

export const addOrderTransactionStepId = "add-order-transaction"
/**
 * This step creates order transactions.
 */
export const addOrderTransactionStep = createStep(
  addOrderTransactionStepId,
  async (data: AddOrderTransactionStepInput, { container }) => {
    const service = container.resolve(Modules.ORDER)

    const trxsData = Array.isArray(data) ? data : [data]

    if (!trxsData.length) {
      return new StepResponse(null)
    }

    const existingQuery: any[] = []
    for (const trx of trxsData) {
      existingQuery.push({
        order_id: trx.order_id,
        reference: trx.reference,
        reference_id: trx.reference_id,
      })
    }

    const existing = await service.listOrderTransactions(
      {
        $or: existingQuery,
      },
      {
        select: ["order_id", "reference", "reference_id"],
      }
    )
    const existingSet = new Set<string>(
      existing.map(
        (trx) => `${trx.order_id}-${trx.reference}-${trx.reference_id}`
      )
    )

    const selectedData: CreateOrderTransactionDTO[] = []
    for (const trx of trxsData) {
      if (
        !existingSet.has(`${trx.order_id}-${trx.reference}-${trx.reference_id}`)
      ) {
        selectedData.push(trx)
      }
    }

    if (!selectedData.length) {
      return new StepResponse(null)
    }

    const created = await service.addOrderTransactions(selectedData)

    return new StepResponse(
      (Array.isArray(data)
        ? created
        : created[0]) as AddOrderTransactionStepOutput,
      created.map((c) => c.id)
    )
  },
  async (id, { container }) => {
    if (!id?.length) {
      return
    }

    const service = container.resolve(Modules.ORDER)

    await service.deleteOrderTransactions(id)
  }
)
