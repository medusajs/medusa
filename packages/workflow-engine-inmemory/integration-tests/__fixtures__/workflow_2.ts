import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@medusajs/workflows-sdk"

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

    return new StepResponse({
      reverted: true,
    })
  })
)

export const workflow2Step2Invoke = jest.fn((input, context) => {
  if (input) {
    return new StepResponse({ notAsyncResponse: input.hey })
  }
})
const step_2 = createStep(
  "step_2",
  workflow2Step2Invoke,
  jest.fn((_, context) => {
    return new StepResponse({
      step: context.metadata.action,
      idempotency_key: context.metadata.idempotency_key,
      reverted: true,
    })
  })
)

export const workflow2Step3Invoke = jest.fn((res) => {
  return new StepResponse({
    done: {
      inputFromSyncStep: res.notAsyncResponse,
    },
  })
})
const step_3 = createStep("step_3", workflow2Step3Invoke)

createWorkflow(
  {
    name: "workflow_2",
    retentionTime: 1000,
  },
  function (input) {
    step_1(input)

    step_2({ hey: "oh" })

    const ret2_async = step_2({ hey: "async hello" }).config({
      name: "new_step_name",
      async: true,
    })

    return step_3(ret2_async)
  }
)
