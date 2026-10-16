import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

const BATCH_SIZE = 50_000

const backfillRefundStatusStep = createStep(
  "backfill-refund-status",
  async (_, { container }) => {
    const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    let updated = 0

    for (;;) {
      const { rowCount } = await knex.raw(
        `update refund set status = 'succeeded'
         where id in (
           select id from refund
           where status = 'pending' and deleted_at is null
           limit ? for update skip locked
         )`,
        [BATCH_SIZE]
      )

      if (!rowCount) {
        break
      }

      updated += rowCount
    }

    // No compensation: the rows that were pending before the backfill can't be
    // told apart afterwards, and re-marking refunds as pending would be a worse
    // state than leaving the backfill applied.
    return new StepResponse(updated)
  }
)

const backfillRefundStatusWorkflow = createWorkflow(
  "backfill-refund-status",
  () => {
    return new WorkflowResponse(backfillRefundStatusStep())
  }
)

export default async function backfillRefundStatus({ container }: ExecArgs) {
  if (!MedusaModule.isInstalled(Modules.PAYMENT)) {
    return
  }

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("Backfilling the status of existing refunds")

  try {
    const { result } = await backfillRefundStatusWorkflow(container).run()
    logger.info(`Marked ${result} refunds as succeeded`)
  } catch (e) {
    logger.error(e)
    throw e
  }
}
