import {
  createStep,
  createWorkflow,
  StepResponse,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

const step1 = createStep(
  {
    name: "step1",
    async: true,
  },
  async (_, context) => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return new StepResponse({ result: "step1" })
  }
)
const step2 = createStep("step2", async (input: string, context) => {
  return new StepResponse({ result: input })
})
const step3 = createStep(
  "step3",
  async (input: string | undefined, context) => {
    return new StepResponse({ result: input ?? "default response" })
  }
)

export const workflowWhenSub = createWorkflow(
  "wf-when-sub",
  function (input: WorkflowData<string>) {
    return new WorkflowResponse(step2(input))
  }
)

export const workflowWhen = createWorkflow(
  "wf-when",
  function (input: { callSubFlow: boolean }) {
    step1()
    const subWorkflowRes = when("sub-flow", { input }, ({ input }) => {
      return input.callSubFlow
    }).then(() => {
      const res = workflowWhenSub.runAsStep({
        input: "hi from outside",
      })

      return {
        result: res,
      }
    }) as any

    return new WorkflowResponse(step3(subWorkflowRes.result))
  }
)
