import { createStep, StepResponse } from "./composer"

const step1 = createStep("step1", async (input: {}, context) => {
  return new StepResponse({ step1: "step1" })
})

type Step2Input = { filters: { id: string[] } } | { filters: { id: string } }
const step2 = createStep("step2", async (input: Step2Input, context) => {
  return new StepResponse({ step2: input })
})

const step3 = createStep("step3", async () => {
  return new StepResponse({ step3: "step3" })
})

/*const workflow = createWorkflow(
  "sub-workflow",
  function (input: WorkflowData<{ outsideWorkflowData: string }>) {
    step1()
    step3()
    return step2({ filters: { id: input.outsideWorkflowData } })
  }
)*/
/*
const workflow2 = createWorkflow("workflow", function () {
  const step1Res = step1()
  step3()

  const workflowRes = workflow.runAsStep({
    outsideWorkflowData: step1Res.step1,
  })

  return workflowRes
})*/

/*workflow2()
  .run({})
  .then((res) => {
    console.log(res.result)
  })*/

// run a step as a workflow
step2
  .run({
    input: { filters: { id: "123" } },
  })
  .then((res) => {
    console.log(res.result)
  })
