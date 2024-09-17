import { WorkflowStepHandlerArguments } from "@medusajs/orchestration"
import { OrchestrationUtils, deepCopy } from "@medusajs/utils"
import { ApplyStepOptions } from "../create-step"
import {
  CreateWorkflowComposerContext,
  StepExecutionContext,
  WorkflowData,
} from "../type"
import { resolveValue } from "./resolve-value"
import { StepResponse } from "./step-response"

export function createStepHandler<
  TInvokeInput,
  TStepInput extends {
    [K in keyof TInvokeInput]: WorkflowData<TInvokeInput[K]>
  },
  TInvokeResultOutput,
  TInvokeResultCompensateInput
>(
  this: CreateWorkflowComposerContext,
  {
    stepName,
    input,
    invokeFn,
    compensateFn,
  }: ApplyStepOptions<
    TStepInput,
    TInvokeInput,
    TInvokeResultOutput,
    TInvokeResultCompensateInput
  >
) {
  const handler = {
    invoke: async (stepArguments: WorkflowStepHandlerArguments) => {
      const metadata = stepArguments.metadata
      const idempotencyKey = metadata.idempotency_key

      stepArguments.context!.idempotencyKey = idempotencyKey

      const flowMetadata = stepArguments.transaction.getFlow()?.metadata
      const executionContext: StepExecutionContext = {
        workflowId: metadata.model_id,
        stepName: metadata.action,
        action: "invoke",
        idempotencyKey,
        attempt: metadata.attempt,
        container: stepArguments.container,
        metadata,
        eventGroupId:
          flowMetadata?.eventGroupId ?? stepArguments.context!.eventGroupId,
        parentStepIdempotencyKey:
          flowMetadata?.parentStepIdempotencyKey as string,
        transactionId: stepArguments.context!.transactionId,
        context: stepArguments.context!,
      }

      const argInput = input ? await resolveValue(input, stepArguments) : {}
      const stepResponse: StepResponse<any, any> = await invokeFn.apply(this, [
        argInput,
        executionContext,
      ])

      const stepResponseJSON =
        stepResponse?.__type === OrchestrationUtils.SymbolWorkflowStepResponse
          ? stepResponse.toJSON()
          : stepResponse

      return {
        __type: OrchestrationUtils.SymbolWorkflowWorkflowData,
        output: stepResponseJSON,
      }
    },
    compensate: compensateFn
      ? async (stepArguments: WorkflowStepHandlerArguments) => {
          const metadata = stepArguments.metadata
          const idempotencyKey = metadata.idempotency_key

          stepArguments.context!.idempotencyKey = idempotencyKey

          const flowMetadata = stepArguments.transaction.getFlow()?.metadata
          const executionContext: StepExecutionContext = {
            workflowId: metadata.model_id,
            stepName: metadata.action,
            action: "compensate",
            idempotencyKey,
            parentStepIdempotencyKey:
              flowMetadata?.parentStepIdempotencyKey as string,
            attempt: metadata.attempt,
            container: stepArguments.container,
            metadata,
            context: stepArguments.context!,
          }

          const stepOutput = (stepArguments.invoke[stepName] as any)?.output
          const invokeResult =
            stepOutput?.__type === OrchestrationUtils.SymbolWorkflowStepResponse
              ? stepOutput.compensateInput &&
                deepCopy(stepOutput.compensateInput)
              : stepOutput && deepCopy(stepOutput)

          const args = [invokeResult, executionContext]
          const output = await compensateFn.apply(this, args)
          return {
            output,
          }
        }
      : undefined,
  }

  return handler
}
