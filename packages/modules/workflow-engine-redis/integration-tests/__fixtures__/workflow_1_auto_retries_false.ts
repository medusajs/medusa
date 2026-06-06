import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@zjedene-medusa/framework/workflows-sdk"

const step1InvokeMock = jest.fn((input) => {
  input.test = "test"
  return new StepResponse(input, { compensate: 123 })
})

const step1CompensateMock = jest.fn((compensateInput) => {
  if (!compensateInput) {
    return
  }

  return new StepResponse({
    reverted: true,
  })
})

const step2InvokeMock = jest.fn((input) => {
  throw new Error("Temporary failure")
})

const step2CompensateMock = jest.fn((compensateInput) => {
  if (!compensateInput) {
    return
  }

  return new StepResponse({
    reverted: true,
  })
})

export {
  step1CompensateMock,
  step1InvokeMock,
  step2CompensateMock,
  step2InvokeMock,
}

const step_1 = createStep("step_1", step1InvokeMock, step1CompensateMock)

const step_2 = createStep("step_2", step2InvokeMock, step2CompensateMock)

createWorkflow("workflow_1_auto_retries_false", function (input) {
  step_1(input)

  const ret2 = step_2({ hey: "oh" }).config({
    async: true,
    maxRetries: 2,
    autoRetry: false,
  })

  return ret2
})
