import { createStep, createWorkflow, StepResponse } from "./composer"

const step1 = createStep("step1", async (input: {}, context) => {
  console.log("step1", input) // Here the input will be `{}` and the createWorkflow does not have to provide an input
  return new StepResponse({ step1: "step1" })
})

const step2 = createStep("step2", async (input: string, context) => {
  console.log("step2", input) // Here the input will be the string value `step1`
  return new StepResponse({ step2: "step2" })
})

const step3 = createStep("step3", async () => {
  return new StepResponse({ step3: "step3" })
})

const workflow = createWorkflow("workflow", function () {
  const step1Res = step1()
  step3()
  return step2(step1Res.step1)
})

workflow()
  .run({})
  .then((res) => {
    console.log(res.result) // result: { step2: "step2" }
  })
