import { TransactionHandlerType } from "@medusajs/utils"
import { z } from "zod"
import { createFindParams, createSelectParams } from "../../utils/validators"

export type AdminGetWorkflowExecutionDetailsParamsType = z.infer<
  typeof AdminGetWorkflowExecutionDetailsParams
>

export const AdminGetWorkflowExecutionDetailsParams = createSelectParams()

export type AdminGetWorkflowExecutionsParamsType = z.infer<
  typeof AdminGetWorkflowExecutionsParams
>
export const AdminGetWorkflowExecutionsParams = createFindParams({
  offset: 0,
  limit: 100,
}).merge(
  z.object({
    transaction_id: z.union([z.string(), z.array(z.string())]).optional(),
    workflow_id: z.union([z.string(), z.array(z.string())]).optional(),
  })
)

export type AdminCreateWorkflowsRunType = z.infer<
  typeof AdminCreateWorkflowsRun
>
export const AdminCreateWorkflowsRun = z.object({
  input: z.any().optional(),
  transaction_id: z.string().optional(),
})

export type AdminCreateWorkflowsAsyncResponseType = z.infer<
  typeof AdminCreateWorkflowsAsyncResponse
>
export const AdminCreateWorkflowsAsyncResponse = z.object({
  transaction_id: z.string(),
  step_id: z.string(),
  response: z.any().optional(),
  compensate_input: z.any().optional(),
  action: z
    .preprocess(
      (val: any) => (val + "").toLowerCase(),
      z.nativeEnum(TransactionHandlerType).optional()
    )
    .optional(),
})
