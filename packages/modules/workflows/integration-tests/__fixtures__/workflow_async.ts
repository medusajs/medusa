import {
  createStep,
  createWorkflow,
  parallelize,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { setTimeout } from "timers/promises"

const step_1_background = createStep(
  {
    name: "step_1_background",
    async: true,
  },
  jest.fn(async (input) => {
    await setTimeout(200)

    return new StepResponse(input)
  })
)

export const nestedSubFlowAsync = createWorkflow(
  {
    name: "nested_sub_flow_async",
  },
  function (input) {
    const resp = step_1_background(input)

    return resp
  }
)

export const nestedSubFlowAsync2 = createWorkflow(
  {
    name: "nested_sub_flow_async_2",
  },
  function (input) {
    const resp = step_1_background(input)

    return resp
  }
)

export const workflowAsyncBackground = createWorkflow(
  {
    name: "workflow_async_background",
  },
  function (input) {
    const [ret] = parallelize(
      nestedSubFlowAsync
        .runAsStep({
          input,
        })
        .config({ name: "step_sub_flow_1" }),
      nestedSubFlowAsync2
        .runAsStep({
          input,
        })
        .config({ name: "step_sub_flow_2" })
    )

    return new WorkflowResponse(ret)
  }
)
