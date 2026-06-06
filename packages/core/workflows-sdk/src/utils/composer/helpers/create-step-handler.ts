import { WorkflowStepHandlerArguments } from "@zjedene-medusa/orchestration"
import { OrchestrationUtils } from "@zjedene-medusa/utils"
import { ApplyStepOptions } from "../create-step"
import {
  CreateWorkflowComposerContext,
  StepExecutionContext,
  WorkflowData,
} from "../type"
import { resolveValue } from "./resolve-value"
import { StepResponse } from "./step-response"

function buildStepContext({
  action,
  stepArguments,
}: {
  action: StepExecutionContext["action"]
  stepArguments: WorkflowStepHandlerArguments
}) {
  const metadata = stepArguments.metadata
  const idempotencyKey = metadata.idempotency_key

  stepArguments.context!.idempotencyKey = idempotencyKey

  const flow = stepArguments.transaction.getFlow()
  const flowMetadata = flow?.metadata
  const stepDefinition = stepArguments.step.definition

  const executionContext: StepExecutionContext = {
    workflowId: metadata.model_id,
    stepName: metadata.action,
    action,
    idempotencyKey,
    attempt: metadata.attempt,
    container: stepArguments.container,
    metadata,
    eventGroupId:
      flowMetadata?.eventGroupId ?? stepArguments.context!.eventGroupId,
    parentStepIdempotencyKey: flowMetadata?.parentStepIdempotencyKey as string,
    preventReleaseEvents: flowMetadata?.preventReleaseEvents ?? false,
    transactionId: stepArguments.context!.transactionId,
    runId: flow.runId,
    context: stepArguments.context!,
    " stepDefinition": stepDefinition,
    " getStepResult"(
      stepId: string,
      action: "invoke" | "compensate" = "invoke"
    ) {
      return (stepArguments[action][stepId] as any)?.output?.output
    },
  }

  return executionContext
}

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
      const executionContext = buildStepContext({
        action: "invoke",
        stepArguments,
      })

      let argInput = {}
      if (input) {
        argInput = resolveValue(input, stepArguments)
        if (argInput instanceof Promise) {
          argInput = await argInput
        }
      }

      const stepResponse: StepResponse<any, any> = await invokeFn.apply(this, [
        argInput,
        executionContext,
      ])

      if (!stepResponse || typeof stepResponse !== "object") {
        return {
          __type: OrchestrationUtils.SymbolWorkflowWorkflowData,
          output: stepResponse,
        }
      }

      const stepResponseJSON =
        stepResponse.__type === OrchestrationUtils.SymbolWorkflowStepResponse
          ? stepResponse.toJSON()
          : stepResponse

      return {
        __type: OrchestrationUtils.SymbolWorkflowWorkflowData,
        output: stepResponseJSON,
      }
    },
    compensate: compensateFn
      ? async (stepArguments: WorkflowStepHandlerArguments) => {
          const executionContext = buildStepContext({
            action: "compensate",
            stepArguments,
          })

          const stepOutput = (stepArguments.invoke[stepName] as any)?.output

          if (!stepOutput) {
            const output = await compensateFn.apply(this, [
              stepOutput,
              executionContext,
            ])
            return { output }
          }

          const invokeResult =
            stepOutput.__type === OrchestrationUtils.SymbolWorkflowStepResponse
              ? stepOutput.compensateInput
              : stepOutput

          const output = await compensateFn.apply(this, [
            invokeResult,
            executionContext,
          ])
          return {
            output,
          }
        }
      : undefined,
  }

  return handler
}
