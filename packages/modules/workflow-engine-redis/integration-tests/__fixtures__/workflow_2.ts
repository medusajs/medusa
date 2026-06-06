import { isPresent } from "@zjedene-medusa/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@zjedene-medusa/framework/workflows-sdk"

const step_1 = createStep(
  "step_1",
  jest.fn((input) => {
    input.test = "test"
    return new StepResponse(input, { compensate: 123 })
  }),
  jest.fn((compensateInput) => {
    if (!compensateInput) {
      return
    }

    console.log("reverted", compensateInput.compensate)
    return new StepResponse({
      reverted: true,
    })
  })
)

const step_2 = createStep(
  "step_2",
  jest.fn((input, context) => {
    if (isPresent(input)) {
      return new StepResponse({ notAsyncResponse: input.hey })
    }
  }),
  jest.fn((_, context) => {
    return new StepResponse({
      step: context.metadata.action,
      idempotency_key: context.metadata.idempotency_key,
      reverted: true,
    })
  })
)

const step_3 = createStep(
  "step_3",
  jest.fn((res) => {
    return new StepResponse({
      done: {
        inputFromSyncStep: res.notAsyncResponse,
      },
    })
  })
)

const broken_step_2 = createStep(
  "broken_step_2",
  jest.fn(() => {}),
  jest.fn((_, context) => {
    throw new Error("Broken compensation step")
  })
)

createWorkflow(
  {
    name: "workflow_2",
    retentionTime: 1000,
  },
  function (input) {
    step_1(input)

    const ret2 = step_2({ hey: "oh" })

    step_2().config({
      name: "new_step_name",
      async: true,
    })

    return step_3(ret2)
  }
)

createWorkflow(
  {
    name: "workflow_2_revert_fail",
    retentionTime: 1000,
  },
  function (input) {
    step_1(input)

    broken_step_2().config({
      async: true,
    })

    return new WorkflowResponse("done")
  }
)
