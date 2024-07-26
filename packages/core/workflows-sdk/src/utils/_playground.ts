import {
  createStep,
  createWorkflow,
  createWorkflowWithHooks,
  StepResponse,
  transform,
  UseHook,
  when,
  WorkflowData,
} from "./composer"

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

const workflow = createWorkflow(
  "sub-workflow",
  function (input: WorkflowData<{ outsideWorkflowData: string }>) {
    step1()
    step3()
    return step2({ filters: { id: input.outsideWorkflowData } })
  }
)

const workflow2 = createWorkflow("workflow", function () {
  const step1Res = step1()

  const step3Res = when({ value: true }, ({ value }) => {
    return value
  }).then(() => {
    return step3()
  })

  transform({ step3Res }, ({ step3Res }) => {
    console.log(step3Res)
  })

  /*const workflowRes = workflow.runAsStep({ outsideWorkflowData: step1Res.step1 })*/

  return step3Res
})

workflow2()
  .run({})
  .then((res) => {
    console.log(res.result)
  })

type MyWorkflowHooks = {
  beforeCreate: (id: string) => string
}

const workflowWithHooks = createWorkflowWithHooks(
  (useHook: UseHook<MyWorkflowHooks>) => {
    return createWorkflow(
      "sub-workflow",
      function (input: WorkflowData<{ outsideWorkflowData: string }>) {
        step1()
        step3()
        const res = useHook("beforeCreate", "id")
        return step2({ filters: { id: input.outsideWorkflowData } })
      }
    )
  }
)

workflowWithHooks.beforeCreate((id) => {
  return "test"
})

/*const step1 = createStep("step1", async (input: {}, context) => {
  return new StepResponse({ step1: ["step1"] })
})

const step2 = createStep("step2", async (input: string[], context) => {
  return new StepResponse({ step2: input })
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
    console.log(res.result)
  })*/
