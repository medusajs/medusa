import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@zjedene-medusa/framework/workflows-sdk"

const step_1_background = createStep(
  {
    name: "step_1_background_fail",
    async: true,
  },
  jest.fn(async (input) => {
    return new StepResponse(input)
  })
)

const nestedWorkflow = createWorkflow(
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

createWorkflow(
  {
    name: "workflow_async_background_fail",
  },
  function (input) {
    const ret = nestedWorkflow.runAsStep({
      input,
    })

    step_2()
    return new WorkflowResponse(ret)
  }
)
