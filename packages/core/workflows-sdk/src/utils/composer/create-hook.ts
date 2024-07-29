import { CompensateFn, createStep, InvokeFn } from "./create-step"
import { deepCopy, OrchestrationUtils } from "@medusajs/utils"
import { CreateWorkflowComposerContext, StepExecutionContext } from "./type"
import { WorkflowStepHandlerArguments } from "@medusajs/orchestration"
import { resolveValue, StepResponse } from "./helpers"

function replaceStepHandlers(
  this: CreateWorkflowComposerContext,
  { stepName, input, invokeFn, compensateFn }
) {
  const handler = {
    invoke: async (stepArguments: WorkflowStepHandlerArguments) => {
      const metadata = stepArguments.metadata
      const idempotencyKey = metadata.idempotency_key

      stepArguments.context!.idempotencyKey = idempotencyKey
      const executionContext: StepExecutionContext = {
        workflowId: metadata.model_id,
        stepName: metadata.action,
        action: "invoke",
        idempotencyKey,
        attempt: metadata.attempt,
        container: stepArguments.container,
        metadata,
        eventGroupId:
          stepArguments.transaction.getFlow()?.metadata?.eventGroupId ??
          stepArguments.context!.eventGroupId,
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

          const executionContext: StepExecutionContext = {
            workflowId: metadata.model_id,
            stepName: metadata.action,
            action: "compensate",
            idempotencyKey,
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

  this.handlers.set(stepName, handler)
}

export function createHook<Name extends string, TInvokeInput>(
  name: Name,
  input: TInvokeInput
) {
  const context = global[
    OrchestrationUtils.SymbolMedusaWorkflowComposerContext
  ] as CreateWorkflowComposerContext

  createStep(
    name,
    (_: TInvokeInput) => void 0,
    () => void 0
  )(input)

  context.hooks_.push(name)
  context.hooksCallback_[name] = function foo<TInvokeResultCompensateInput>(
    this: CreateWorkflowComposerContext,
    invokeFn: InvokeFn<TInvokeInput, unknown, TInvokeResultCompensateInput>,
    compensateFn?: CompensateFn<TInvokeResultCompensateInput>
  ) {
    replaceStepHandlers.bind(this)({
      stepName: name,
      input,
      invokeFn,
      compensateFn,
    })
  }

  return {
    __type: OrchestrationUtils.SymbolWorkflowHook,
  }
}
/*
createHook("productCreated", { product: { id: 1 } })(({ product }) => {
  product.id
})*/
