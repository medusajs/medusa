import { promiseAll } from "@medusajs/utils"
import {
  createStep,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows"

jest.setTimeout(30000)

describe("Workflow composer", function () {
  afterEach(async () => {
    jest.clearAllMocks()
  })

  it("should compose a new workflow and execute it", async () => {
    const mockStep1Fn = jest.fn().mockImplementation((context, input) => {
      return { inputs: [input], obj: "return from 1" }
    })
    const mockStep2Fn = jest.fn().mockImplementation((context, ...inputs) => {
      return {
        inputs,
        obj: "return from 2",
      }
    })
    const mockStep3Fn = jest.fn().mockImplementation((context, ...inputs) => {
      return {
        inputs,
        obj: "return from 3",
      }
    })

    const step1 = createStep("step1", mockStep1Fn)
    const step2 = createStep("step2", mockStep2Fn)
    const step3 = createStep("step3", mockStep3Fn)

    const workflow = createWorkflow("workflow1", function (input) {
      const returnStep1 = step1(input)
      const ret2 = step2(returnStep1)
      return step3(returnStep1, ret2)
    })

    const workflowInput = { test: "payload1" }
    const { result: workflowResult } = await workflow().run({
      input: { test: "payload1" },
    })

    expect(mockStep1Fn).toHaveBeenCalledTimes(1)
    expect(mockStep1Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep1Fn.mock.calls[0][1]).toEqual(workflowInput)

    expect(mockStep2Fn).toHaveBeenCalledTimes(1)
    expect(mockStep2Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep2Fn.mock.calls[0][1]).toEqual({
      inputs: [workflowInput],
      obj: "return from 1",
    })

    expect(mockStep3Fn).toHaveBeenCalledTimes(1)
    expect(mockStep3Fn.mock.calls[0]).toHaveLength(3)
    expect(mockStep3Fn.mock.calls[0][1]).toEqual({
      inputs: [workflowInput],
      obj: "return from 1",
    })
    expect(mockStep3Fn.mock.calls[0][2]).toEqual({
      inputs: [
        {
          inputs: [workflowInput],
          obj: "return from 1",
        },
      ],
      obj: "return from 2",
    })

    expect(workflowResult).toEqual({
      inputs: [
        {
          inputs: [workflowInput],
          obj: "return from 1",
        },
        {
          inputs: [
            {
              inputs: [workflowInput],
              obj: "return from 1",
            },
          ],
          obj: "return from 2",
        },
      ],
      obj: "return from 3",
    })
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

    const mainFlow = createWorkflow("test_", function (input) {
      const returnStep1 = step1(input)
      const ret2 = step2(returnStep1)
      return step3(returnStep1, ret2)
    })

    const mainFlow2 = createWorkflow("test_2", function (input) {
      const ret2 = step2(input)
      const returnStep1 = step1(ret2)
      return step3(ret2, returnStep1)
    })

    await mainFlow().run({ input: { test: "payload3" } })
    await mainFlow2().run({ input: { test: "payload2" } })
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
      createWorkflow("test_other", function (input) {
        const returnStep1 = step1(input)
        const ret2 = step2(returnStep1)
        return step3(returnStep1, ret2)
      }),

      createWorkflow("test_other2", function (input) {
        const ret2 = step2(input)
        const returnStep1 = step1(ret2)
        return step3(ret2, returnStep1)
      }),
    ])

    await mainFlow().run({ input: { test: "payload3" } })
    await mainFlow2().run({ input: { test: "payload2" } })
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
      createWorkflow("test", function (input) {
        const returnStep1 = step1(input)
        const ret2 = step2(returnStep1)
        return step3(returnStep1, ret2)
      }),

      createWorkflow("test2", function (input) {
        const ret2 = step2(input)
        const returnStep1 = step1(ret2)
        return step3(ret2, returnStep1)
      }),
    ])

    await promiseAll([
      mainFlow().run({ input: { intest: "payload3" } }),
      mainFlow2().run({ input: { test: "payload2" } }),
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

    const mainFlow = createWorkflow("test", function (input) {
      const returnStep1 = step1(input)
      const parallelize1 = parallelize(step2(returnStep1), step3(returnStep1))
      return step4(parallelize1)
    })

    await mainFlow().run({ input: { test: "payload1" } })
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

    const main = createWorkflow("test", function (input) {
      step1(input)
    })

    await main().run({ input: 12345 })

    const overwrite = createWorkflow("test", function (input) {
      step1(input)
    })

    await overwrite().run({ input: "str value" })
  })

  it("should transform the values before forward them to the next step", async () => {
    const step1 = createStep("step1", (context, obj) => {
      const ret = {
        property: "property",
      }
      console.log(ret)
      return ret
    })

    const step2 = createStep("step2", (context, obj) => {
      const ret = {
        sum: "sum = " + obj.sum,
        ...obj,
      }
      console.log(ret)
      return ret
    })

    const step3 = createStep("step3", (context, param) => {
      const ret = {
        avg: "avg = " + param.avg,
        ...param,
      }
      console.log(ret)
      return ret
    })

    const mainFlow = createWorkflow("test_", function (input) {
      const step1Result = step1(input)

      const sum = transform(
        [input, step1Result],
        (context, input, step1Res) => {
          const newObj = {
            ...step1Res,
            ...input,
            sum: input.a + input.b,
          }
          return newObj
        }
      )

      const ret2 = step2(sum)

      const avg = transform(ret2, (context, obj) => {
        obj.avg = (obj.a + obj.b) / 2
        return obj
      })

      return step3(avg)
    })

    await mainFlow().run({ input: { a: 1, b: 2 } })
  })
})
