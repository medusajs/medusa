import { importProductsWorkflowId } from "@medusajs/core-flows"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { generateEntityId } from "@medusajs/utils"
import { IWorkflowEngineService } from "@medusajs/workflows-sdk"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

const batchJobToWorkflowMap = new Map([
  ["product-import", importProductsWorkflowId],
])

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const batchJobId = generateEntityId("batch")

  const { type } = req.validatedBody

  const workflowModule = req.scope.resolve<IWorkflowEngineService>(
    ModuleRegistrationName.WORKFLOW_ENGINE
  )

  const workflowId = batchJobToWorkflowMap.get(type)

  if (!workflowId) {
    throw new Error(`No batch job found for type ${type}`)
  }

  await workflowModule.run(workflowId, {
    transactionId: batchJobId,
  })

  res.status(200).json({ success: true })
}

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const workflowModule = req.scope.resolve<IWorkflowEngineService>(
    ModuleRegistrationName.WORKFLOW_ENGINE
  )

  const [workflows, count] = await workflowModule.listAndCountWorkflowExecution(
    {
      transaction_id: { $contains: ["batch_"] },
    },
    {
      take: req.remoteQueryConfig.pagination.take,
      skip: req.remoteQueryConfig.pagination.skip,
    }
  )

  res.status(200).json({
    batch_jobs: workflows,
    count,
    offset: req.remoteQueryConfig.pagination.skip,
    limit: req.remoteQueryConfig.pagination.take,
  })
}
