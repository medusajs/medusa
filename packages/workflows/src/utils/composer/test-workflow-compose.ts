/*
import { createStep } from "./create-step"
import { createWorkflow } from "./create-workflow"
import { StepExecutionContext, StepReturn } from "./type"
import { transform } from "./transform"
import { hook } from "./hook"

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
  async function (
    context: any,
    input: Step1Input
  ): Promise<{ test: "test"; foo: "bar"; compensateInput: { foo: string } }> {
    return { test: "test", foo: "bar", compensateInput: { foo: "test" } }
  },
  async function (context: any, input) {
    return input.foo
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
  async (input: Step4Input): Promise<step4Return> => {
    return {
      test: "test2",
      depth: {
        test2: "test",
      },
    }
  }
)

type WorkflowHooks = {
  someHook(
    fn: (
      context: StepExecutionContext,
      input: WorkflowInput
    ) => Promise<unknown>
  ): void
}

const workflow = createWorkflow<WorkflowInput, step3Return, WorkflowHooks>(
  "workflow1",
  function (input: StepReturn<WorkflowInput>): StepReturn<step3Return> {
    const ret1 = step1(input)
    const test = ret1.test
    const ret2 = step2(test)
    const ret3 = step3(ret2)
    const ret4 = step4(ret2)

    const hookedData = hook("someHook", input)

    const testHookData = transform(hookedData, (context, input) => {
      return input
    })

    const ret4Transformed = transform(
      [ret4, ret3],
      async (context, input, input2): Promise<{ test: string }> => {
        return { test: input.test }
      },
      async (context, input): Promise<{ test: string }> => {
        return { test: input.test }
      }
    )
    const v = ret4Transformed.test

    return ret3
  }
)

workflow.someHook((context, input) => {
  return Promise.resolve("test")
})

workflow()
  .run({ input: { cart_id: "test" } })
  .then((res) => {
    console.log(res.result.test)
  })
*/

import { createStep } from "./create-step"
import { createWorkflow } from "./create-workflow"
import { StepExecutionContext, StepReturn } from "./type"
import { transform } from "./transform"
import { hook } from "./hook"

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
  async function (
    input: Step1Input,
    context: StepExecutionContext
  ): Promise<{ test: "test"; foo: "bar"; compensateInput: { foo: string } }> {
    return { test: "test", foo: "bar", compensateInput: { foo: "test" } }
  },
  async function (input, context) {
    return input.foo
  }
)

const step2 = createStep(
  "step2",
  async (
    input: { test: "test"; foo: "bar" },
    context: StepExecutionContext
  ): Promise<{ test: "test" }> => {
    return { test: "test" }
  }
)

type step3Return = { test: "test2" }
const step3 = createStep(
  "step3",
  async (
    input: { test: "test" },
    context: StepExecutionContext
  ): Promise<step3Return> => {
    return { test: "test2" }
  }
)

type step4Return = { test: "test2"; depth: { test2: string } }

const step4 = createStep(
  "step4",
  async (
    input: step3Return,
    context: StepExecutionContext
  ): Promise<step4Return> => {
    return {
      test: "test2",
      depth: {
        test2: "test",
      },
    }
  }
)

type WorkflowHooks = {
  someHook(
    fn: (
      context: StepExecutionContext,
      input: WorkflowInput
    ) => Promise<unknown>
  ): void
}

const workflow = createWorkflow<WorkflowInput, step3Return, WorkflowHooks>(
  "workflow1",
  function (input: StepReturn<WorkflowInput>): StepReturn<step3Return> {
    const ret1 = step1(input)
    const test = ret1.test
    const ret2 = step2(ret1)
    const ret3 = step3(ret2)
    const ret4 = step4(ret3)

    const hookedData = hook("someHook", input)

    const testHookData = transform(hookedData, (context, input) => {
      return input
    })

    const ret4Transformed = transform(
      [ret4, ret3],
      async (context, input, input2): Promise<{ test: string }> => {
        return { test: input.test }
      },
      async (context, input): Promise<{ test: string }> => {
        return { test: input.test }
      }
    )
    const v = ret4Transformed.test

    return ret3
  }
)

workflow.someHook((context, input) => {
  return Promise.resolve("test")
})

workflow()
  .run({ input: { cart_id: "test" } })
  .then((res) => {
    console.log(res.result.test)
  })
