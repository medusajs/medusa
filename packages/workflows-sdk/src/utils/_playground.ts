import { createStep, createWorkflow, StepResponse } from "./composer"

const step1 = createStep("step1", async (input: {}, context) => {
  return new StepResponse({ step1: "step1" })
})

const step2 = createStep(
  "step2",
  async (input: { test: string; test2: string }, context) => {
    return new StepResponse({ step2: input })
  }
)

const step3 = createStep("step3", async () => {
  return new StepResponse({ step3: "step3" })
})

const workflow = createWorkflow("workflow", function () {
  const step1Res = step1()
  step3()
  return step2({ test: "test", test2: step1Res.step1 })
})

workflow()
  .run({})
  .then((res) => {
    console.log(res.result) // result: { step2: { test: "test", test2: "step1" } }
  })

/*type type0 = typeof workflow extends ReturnWorkflow<infer T, infer R, infer X>
  ? T
  : never

function run<
  TWorkflow extends ReturnWorkflow<any, any, any>,
  TData = TWorkflow extends ReturnWorkflow<infer T, infer R, infer X>
    ? T
    : never
>(name: string, options: FlowRunOptions<TData>) {}

const test = run<typeof workflow>("workflow", { input: "string" })*/
