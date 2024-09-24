import {
  StepResponse,
  WorkflowResponse,
  createStep,
  createWorkflow,
  parallelize,
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

const nestedWorkflow = createWorkflow(
  {
    name: "nested_sub_flow_async",
  },
  function (input) {
    const resp = step_1_background(input)

    return resp
  }
)

createWorkflow(
  {
    name: "workflow_async_background",
  },
  function (input) {
    const [ret] = parallelize(
      nestedWorkflow
        .runAsStep({
          input,
        })
        .config({ name: "step_sub_flow_1" }),
      nestedWorkflow
        .runAsStep({
          input,
        })
        .config({ name: "step_sub_flow_2" })
    )

    return new WorkflowResponse(ret)
  }
)
