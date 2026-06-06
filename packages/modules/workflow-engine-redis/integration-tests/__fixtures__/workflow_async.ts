import {
  createStep,
  createWorkflow,
  parallelize,
  StepResponse,
  WorkflowResponse,
} from "@zjedene-medusa/framework/workflows-sdk"

const step_1_background = createStep(
  {
    name: "step_1_background",
    async: true,
  },
  jest.fn(async (input) => {
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
        .config({ name: "step_sub_flow_2" }),
      nestedWorkflow
        .runAsStep({
          input,
        })
        .config({ name: "step_sub_flow_3" }),
      nestedWorkflow
        .runAsStep({
          input,
        })
        .config({ name: "step_sub_flow_4" })
    )

    return new WorkflowResponse(ret)
  }
)
