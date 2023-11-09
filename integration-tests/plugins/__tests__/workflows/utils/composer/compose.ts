import { createStep, createWorkflow } from "@medusajs/workflows"
import { promiseAll } from "@medusajs/utils"

jest.setTimeout(30000)

describe("Workflow composer", function () {
  beforeAll(async () => {})

  afterAll(async () => {})

  it.only("should compose a new workflow and execute it", async () => {
    const step1 = createStep("step1", (input) => {
      const ret = "return from 1 + input = " + JSON.stringify(input)
      console.log(ret)
      return ret
    })

    const step2 = createStep("step2", (param) => {
      const ret = {
        complex: "return from 2",
        arg: param,
      }
      console.log(ret)
      return ret
    })

    const step3 = createStep("step3", (param, other) => {
      const ret = {
        obj: "return from 3",
        args: [param, other],
      }
      console.log(ret)
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
    const step1 = createStep("step1", (input) => {
      const ret = "return from 1 + input = " + JSON.stringify(input)
      console.log(ret)
      return ret
    })

    const step2 = createStep("step2", (param) => {
      const ret = {
        complex: "return from 2",
        arg: param,
      }
      console.log(ret)
      return ret
    })

    const step3 = createStep("step3", (param, other) => {
      const ret = {
        obj: "return from 3",
        args: [param, other],
      }
      console.log(ret)
      return ret
    })

    const mainFlow = createWorkflow("test", function (this: any, input) {
      const returnStep1 = step1(input)
      const ret2 = step2(returnStep1)
      return step3(returnStep1, ret2)
    })

    const mainFlow2 = createWorkflow("test2", function (this: any, input) {
      const ret2 = step2(input)
      const returnStep1 = step1(ret2)
      return step3(ret2, returnStep1)
    })

    await mainFlow().run({ test: "payload3" })
    await mainFlow2().run({ test: "payload2" })
  })

  it("should compose two new workflows concurrently and execute them sequentially", async () => {
    const step1 = createStep("step1", (input) => {
      const ret = "return from 1 + input = " + JSON.stringify(input)
      console.log(ret)
      return ret
    })

    const step2 = createStep("step2", (param) => {
      const ret = {
        complex: "return from 2",
        arg: param,
      }
      console.log(ret)
      return ret
    })

    const step3 = createStep("step3", (param, other) => {
      const ret = {
        obj: "return from 3",
        args: [param, other],
      }
      console.log(ret)
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

    await mainFlow().run({ test: "payload3" })
    await mainFlow2().run({ test: "payload2" })
  })

  it("should compose two new workflows concurrently and execute them concurrently", async () => {
    const step1 = createStep("step1", (input) => {
      const ret = "return from 1 + input = " + JSON.stringify(input)
      console.log(ret)
      return ret
    })

    const step2 = createStep("step2", (param) => {
      const ret = {
        complex: "return from 2",
        arg: param,
      }
      console.log(ret)
      return ret
    })

    const step3 = createStep("step3", (param, other) => {
      const ret = {
        obj: "return from 3",
        args: [param, other],
      }
      console.log(ret)
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
})
