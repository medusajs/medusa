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

const step2InvokeMock = jest.fn(async (input, context) => {
  if (context.metadata.attempt === 1) {
    await new Promise((resolve) => setTimeout(resolve, 100000))
    return new StepResponse("success after 100 seconds")
  }

  return new StepResponse("success")
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

createWorkflow("workflow_1_manual_retry_step", function (input) {
  step_1(input)

  const ret2 = step_2({ hey: "oh" }).config({
    async: true,
  })

  return ret2
})
