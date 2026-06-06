import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@zjedene-medusa/framework/workflows-sdk"
import { isPresent } from "@zjedene-medusa/framework/utils"

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

export const workflowNotIdempotentWithRetentionStep2Invoke = jest.fn(
  (input, context) => {
    if (isPresent(input)) {
      return new StepResponse({ notAsyncResponse: input.hey })
    }
  }
)
const step_2 = createStep(
  "step_2",
  workflowNotIdempotentWithRetentionStep2Invoke,
  jest.fn((_, context) => {
    return new StepResponse({
      step: context.metadata.action,
      idempotency_key: context.metadata.idempotency_key,
      reverted: true,
    })
  })
)

export const workflowNotIdempotentWithRetentionStep3Invoke = jest.fn((res) => {
  return new StepResponse({
    done: {
      inputFromSyncStep: res.notAsyncResponse,
    },
  })
})
const step_3 = createStep(
  "step_3",
  workflowNotIdempotentWithRetentionStep3Invoke
)

createWorkflow(
  {
    name: "workflow_not_idempotent_with_retention",
    retentionTime: 60,
  },
  function (input) {
    step_1(input)

    step_2({ hey: "oh" })

    const ret2 = step_2({ hey: "hello" }).config({
      name: "new_step_name",
    })

    return step_3(ret2)
  }
)
