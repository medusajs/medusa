import { promiseAll } from "@medusajs/utils"
import { createStep, createWorkflow, parallelize } from "@medusajs/workflows"

jest.setTimeout(30000)

describe("Workflow composer", function () {
  beforeAll(async () => {})

  afterAll(async () => {})

  it("should compose a new workflow and execute it", async () => {
    const step1 = createStep("step1", (context, input) => {
      const ret = "return from 1 + input = " + JSON.stringify(input)
      return ret
    })

    const step2 = createStep("step2", (context, param) => {
      const ret = {
        complex: "return from 2",
        arg: param,
      }
      return ret
    })

    const step3 = createStep("step3", (context, param, other) => {
      const ret = {
        obj: "return from 3",
        args: [param, other],
      }

      return ret
    })

    const mainFlow = createWorkflow("test", function (this: any, input) {
      const returnStep1 = step1(input)
      const ret2 = step2(returnStep1)
      return step3(returnStep1, ret2)
    })

    await mainFlow().run({ test: "payload1" })
  })

  it("should compose two new workflows sequentially and execute them sequentially", async () => {
    const step1 = createStep("step1", (context, input) => {
      const ret = "return from 1 + input = " + JSON.stringify(input)
      return ret
    })

    const step2 = createStep("step2", (context, param) => {
      const ret = {
        complex: "return from 2",
        arg: param,
      }
      return ret
    })

    const step3 = createStep("step3", (context, param, other) => {
      const ret = {
        obj: "return from 3",
        args: [param, other],
      }
      return ret
    })

    const mainFlow = createWorkflow("test_", function (this: any, input) {
      const returnStep1 = step1(input)
      const ret2 = step2(returnStep1)
      return step3(returnStep1, ret2)
    })

    const mainFlow2 = createWorkflow("test_2", function (this: any, input) {
      const ret2 = step2(input)
      const returnStep1 = step1(ret2)
      return step3(ret2, returnStep1)
    })

    await mainFlow().run({ test: "payload3" })
    await mainFlow2().run({ test: "payload2" })
  })

  it("should compose two new workflows concurrently and execute them sequentially", async () => {
    const step1 = createStep("step1", (context, input) => {
      const ret = "return from 1 + input = " + JSON.stringify(input)
      return ret
    })

    const step2 = createStep("step2", (context, param) => {
      const ret = {
        complex: "return from 2",
        arg: param,
      }
      return ret
    })

    const step3 = createStep("step3", (context, param, other) => {
      const ret = {
        obj: "return from 3",
        args: [param, other],
      }
      return ret
    })

    const [mainFlow, mainFlow2] = await promiseAll([
      createWorkflow("test_other", function (this: any, input) {
        const returnStep1 = step1(input)
        const ret2 = step2(returnStep1)
        return step3(returnStep1, ret2)
      }),

      createWorkflow("test_other2", function (this: any, input) {
        const ret2 = step2(input)
        const returnStep1 = step1(ret2)
        return step3(ret2, returnStep1)
      }),
    ])

    await mainFlow().run({ test: "payload3" })
    await mainFlow2().run({ test: "payload2" })
  })

  it("should compose two new workflows concurrently and execute them concurrently", async () => {
    const step1 = createStep("step1", (context, input) => {
      const ret = "return from 1 + input = " + JSON.stringify(input)
      return ret
    })

    const step2 = createStep("step2", (context, param) => {
      const ret = {
        complex: "return from 2",
        arg: param,
      }
      return ret
    })

    const step3 = createStep("step3", (context, param, other) => {
      const ret = {
        obj: "return from 3",
        args: [param, other],
      }
      return ret
    })

    const [mainFlow, mainFlow2] = await promiseAll([
      createWorkflow("test", function (this: any, input) {
        const returnStep1 = step1(input)
        const ret2 = step2(returnStep1)
        return step3(returnStep1, ret2)
      }),

      createWorkflow("test2", function (this: any, input) {
        const ret2 = step2(input)
        const returnStep1 = step1(ret2)
        return step3(ret2, returnStep1)
      }),
    ])

    await promiseAll([
      mainFlow().run({ test: "payload3" }),
      mainFlow2().run({ test: "payload2" }),
    ])
  })

  it("should compose a new workflow with parallelize steps", async () => {
    const step1 = createStep("step1", (context, input) => {
      const ret = "return from 1 + input = " + JSON.stringify(input)
      return ret
    })

    const step2 = createStep("step2", (context, ...param) => {
      const ret = {
        complex: "return from 2",
        arg: param,
      }
      return ret
    })

    const step3 = createStep("step3", (context, ...input) => {
      const ret = {
        obj: "return from 3",
        args: input,
      }
      return ret
    })

    const step4 = createStep("step4", (context, ...input) => {
      const ret = {
        obj: "return from 4",
        args: input,
      }
      return ret
    })

    const mainFlow = createWorkflow("test", function (this: any, input) {
      const returnStep1 = step1(input)
      const parallelize1 = parallelize(step2(returnStep1), step3(returnStep1))
      return step4(parallelize1)
    })

    await mainFlow().run({ test: "payload1" })
  })

  it("should overwrite existing workflows if the same name is used", async () => {
    const step1 = createStep("step1", (context, primitiveValue) => {
      const ret =
        "return from 1 + input = " +
        primitiveValue +
        ": " +
        typeof primitiveValue

      return ret
    })

    const main = createWorkflow("test", function (this: any, input) {
      step1(input)
    })

    await main().run(12345)

    const overwrite = createWorkflow("test", function (this: any, input) {
      step1(input)
    })

    await overwrite().run("str value")
  })
})
