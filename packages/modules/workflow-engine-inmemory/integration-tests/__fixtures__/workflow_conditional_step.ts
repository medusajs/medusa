import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@medusajs/workflows-sdk"
import { when } from "@medusajs/workflows-sdk/src/utils/composer"

const step_1 = createStep(
  "step_1",
  jest.fn((input) => {
    input.test = "test"
    return new StepResponse(input, { compensate: 123 })
  })
)

export const conditionalStep2Invoke = jest.fn((input, context) => {
  if (input) {
    return new StepResponse({ notAsyncResponse: input.hey })
  }
})
const step_2 = createStep("step_2", conditionalStep2Invoke)

export const conditionalStep3Invoke = jest.fn((res) => {
  return new StepResponse({
    done: {
      inputFromSyncStep: res.notAsyncResponse,
    },
  })
})
const step_3 = createStep("step_3", conditionalStep3Invoke)

createWorkflow(
  {
    name: "workflow_conditional_step",
    retentionTime: 1000,
  },
  function (input) {
    step_1(input)

    const ret = step_2({ hey: "oh" })

    const ret2_async = when({ input, ret }, ({ input, ret }) => {
      return input.runNewStepName && ret.notAsyncResponse === "oh"
    }).then(() => {
      return step_2({ hey: "hello" }).config({
        name: "new_step_name",
        async: true,
      })
    })

    return when({ ret2_async }, ({ ret2_async }) => {
      return ret2_async?.notAsyncResponse === "hello"
    }).then(() => {
      return step_3(ret2_async)
    })
  }
)
