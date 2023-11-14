import { createStep } from "./create-step"
import { createWorkflow } from "./create-workflow"
import { StepReturn } from "./type"
import { transform } from "./transform"

interface WorkflowInput {
  cart_id: string
}

interface Step1Input {
  cart_id: string
}

type Step2Input = "test"

interface Step3Input {
  test: string
}

interface Step4Input {
  test: string
}

const step1 = createStep(
  "step1",
  async (
    context: any,
    input: Step1Input
  ): Promise<{ test: "test"; foo: "bar" }> => {
    return { test: "test", foo: "bar" }
  }
)

const step2 = createStep(
  "step2",
  async (context: any, input: Step2Input): Promise<{ test: "test" }> => {
    return { test: "test" }
  }
)

type step3Return = { test: "test2" }
const step3 = createStep(
  "step3",
  async (context: any, input: Step3Input): Promise<step3Return> => {
    return { test: "test2" }
  }
)

type step4Return = { test: "test2"; depth: { test2: string } }

const step4 = createStep(
  "step4",
  async (context: any, input: Step4Input): Promise<step4Return> => {
    return {
      test: "test2",
      depth: {
        test2: "test",
      },
    }
  }
)

const workflow = createWorkflow(
  "workflow1",
  function (input: StepReturn<WorkflowInput>) {
    const ret1 = step1(input)
    const test = ret1.test
    const ret2 = step2(test)
    const ret3 = step3(ret2)
    const ret4 = step4(ret2)

    const ret1_2 = step1(input)

    const ret4Transformed = transform(
      [ret4, ret3],
      async (
        context,
        input: step4Return,
        input2: step3Return
      ): Promise<{ test: string }> => {
        return { test: input.depth.test2 }
      },
      function (context: any, input) {
        return { foo: "value2" }
      }
    )
    const v = ret4Transformed.foo

    return ret3
  }
)

workflow()
  .run({ input: { cart_id: "test" } })
  .then((res) => {
    console.log(res)
  })
