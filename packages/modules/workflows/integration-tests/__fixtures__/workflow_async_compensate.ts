import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

const step_1_background = createStep(
  {
    name: "step_1_background_fail",
    async: true,
  },
  jest.fn(async (input) => {
    return new StepResponse(input)
  })
)

export const nestedSubFlowAsyncFail = createWorkflow(
  {
    name: "nested_sub_flow_async_fail",
  },
  function (input) {
    const resp = step_1_background(input)

    return resp
  }
)

const step_2 = createStep(
  {
    name: "step_2_fail",
  },
  jest.fn(async () => {
    throw new Error("step_2_fail")
  })
)

export const workflowAsyncBackgroundFail = createWorkflow(
  {
    name: "workflow_async_background_fail",
  },
  function (input) {
    const ret = nestedSubFlowAsyncFail.runAsStep({
      input,
    })

    step_2()
    return new WorkflowResponse(ret)
  }
)
