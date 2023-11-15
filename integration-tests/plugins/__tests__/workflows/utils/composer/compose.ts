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
    const mockStep1Fn = jest.fn().mockImplementation((input, context) => {
      return { inputs: [input], obj: "return from 1" }
    })
    const mockStep2Fn = jest.fn().mockImplementation((...inputs) => {
      const context = inputs.pop()
      return {
        inputs,
        obj: "return from 2",
      }
    })
    const mockStep3Fn = jest.fn().mockImplementation((...inputs) => {
      const context = inputs.pop()
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
      input: workflowInput,
    })

    expect(mockStep1Fn).toHaveBeenCalledTimes(1)
    expect(mockStep1Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep1Fn.mock.calls[0][0]).toEqual(workflowInput)

    expect(mockStep2Fn).toHaveBeenCalledTimes(1)
    expect(mockStep2Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep2Fn.mock.calls[0][0]).toEqual({
      inputs: [workflowInput],
      obj: "return from 1",
    })

    expect(mockStep3Fn).toHaveBeenCalledTimes(1)
    expect(mockStep3Fn.mock.calls[0]).toHaveLength(3)
    expect(mockStep3Fn.mock.calls[0][0]).toEqual({
      inputs: [workflowInput],
      obj: "return from 1",
    })
    expect(mockStep3Fn.mock.calls[0][1]).toEqual({
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
    const mockStep1Fn = jest.fn().mockImplementation((input, context) => {
      return { inputs: [input], obj: "return from 1" }
    })
    const mockStep2Fn = jest.fn().mockImplementation((...inputs) => {
      const context = inputs.pop()
      return {
        inputs,
        obj: "return from 2",
      }
    })
    const mockStep3Fn = jest.fn().mockImplementation((...inputs) => {
      const context = inputs.pop()
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

    const workflow2 = createWorkflow("workflow2", function (input) {
      const returnStep1 = step1(input)
      const ret2 = step2(returnStep1)
      return step3(returnStep1, ret2)
    })

    const workflowInput = { test: "payload1" }
    const { result: workflowResult } = await workflow().run({
      input: workflowInput,
    })

    const workflow2Input = { test: "payload2" }
    const { result: workflow2Result } = await workflow2().run({
      input: workflow2Input,
    })

    expect(mockStep1Fn).toHaveBeenCalledTimes(2)
    expect(mockStep1Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep1Fn.mock.calls[0][0]).toEqual(workflowInput)
    expect(mockStep1Fn.mock.calls[1]).toHaveLength(2)
    expect(mockStep1Fn.mock.calls[1][0]).toEqual(workflow2Input)

    expect(mockStep2Fn).toHaveBeenCalledTimes(2)
    expect(mockStep2Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep2Fn.mock.calls[0][0]).toEqual({
      inputs: [workflowInput],
      obj: "return from 1",
    })
    expect(mockStep2Fn.mock.calls[1]).toHaveLength(2)
    expect(mockStep2Fn.mock.calls[1][0]).toEqual({
      inputs: [workflow2Input],
      obj: "return from 1",
    })

    expect(mockStep3Fn).toHaveBeenCalledTimes(2)
    expect(mockStep3Fn.mock.calls[0]).toHaveLength(3)
    expect(mockStep3Fn.mock.calls[0][0]).toEqual({
      inputs: [workflowInput],
      obj: "return from 1",
    })
    expect(mockStep3Fn.mock.calls[0][1]).toEqual({
      inputs: [
        {
          inputs: [workflowInput],
          obj: "return from 1",
        },
      ],
      obj: "return from 2",
    })
    expect(mockStep3Fn.mock.calls[1][0]).toEqual({
      inputs: [workflow2Input],
      obj: "return from 1",
    })
    expect(mockStep3Fn.mock.calls[1][1]).toEqual({
      inputs: [
        {
          inputs: [workflow2Input],
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
    expect(workflow2Result).toEqual({
      inputs: [
        {
          inputs: [workflow2Input],
          obj: "return from 1",
        },
        {
          inputs: [
            {
              inputs: [workflow2Input],
              obj: "return from 1",
            },
          ],
          obj: "return from 2",
        },
      ],
      obj: "return from 3",
    })
  })

  it("should compose two new workflows concurrently and execute them sequentially", async () => {
    const mockStep1Fn = jest.fn().mockImplementation((input, context) => {
      return { inputs: [input], obj: "return from 1" }
    })
    const mockStep2Fn = jest.fn().mockImplementation((...inputs) => {
      const context = inputs.pop()
      return {
        inputs,
        obj: "return from 2",
      }
    })
    const mockStep3Fn = jest.fn().mockImplementation((...inputs) => {
      const context = inputs.pop()
      return {
        inputs,
        obj: "return from 3",
      }
    })

    const step1 = createStep("step1", mockStep1Fn)
    const step2 = createStep("step2", mockStep2Fn)
    const step3 = createStep("step3", mockStep3Fn)

    const [workflow, workflow2] = await promiseAll([
      createWorkflow("workflow1", function (input) {
        const returnStep1 = step1(input)
        const ret2 = step2(returnStep1)
        return step3(returnStep1, ret2)
      }),

      createWorkflow("workflow2", function (input) {
        const returnStep1 = step1(input)
        const ret2 = step2(returnStep1)
        return step3(returnStep1, ret2)
      }),
    ])

    const workflowInput = { test: "payload1" }
    const { result: workflowResult } = await workflow().run({
      input: workflowInput,
    })

    const workflow2Input = { test: "payload2" }
    const { result: workflow2Result } = await workflow2().run({
      input: workflow2Input,
    })

    expect(mockStep1Fn).toHaveBeenCalledTimes(2)
    expect(mockStep1Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep1Fn.mock.calls[0][0]).toEqual(workflowInput)
    expect(mockStep1Fn.mock.calls[1]).toHaveLength(2)
    expect(mockStep1Fn.mock.calls[1][0]).toEqual(workflow2Input)

    expect(mockStep2Fn).toHaveBeenCalledTimes(2)
    expect(mockStep2Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep2Fn.mock.calls[0][0]).toEqual({
      inputs: [workflowInput],
      obj: "return from 1",
    })
    expect(mockStep2Fn.mock.calls[1]).toHaveLength(2)
    expect(mockStep2Fn.mock.calls[1][0]).toEqual({
      inputs: [workflow2Input],
      obj: "return from 1",
    })

    expect(mockStep3Fn).toHaveBeenCalledTimes(2)
    expect(mockStep3Fn.mock.calls[0]).toHaveLength(3)
    expect(mockStep3Fn.mock.calls[0][0]).toEqual({
      inputs: [workflowInput],
      obj: "return from 1",
    })
    expect(mockStep3Fn.mock.calls[0][1]).toEqual({
      inputs: [
        {
          inputs: [workflowInput],
          obj: "return from 1",
        },
      ],
      obj: "return from 2",
    })
    expect(mockStep3Fn.mock.calls[1][0]).toEqual({
      inputs: [workflow2Input],
      obj: "return from 1",
    })
    expect(mockStep3Fn.mock.calls[1][1]).toEqual({
      inputs: [
        {
          inputs: [workflow2Input],
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
    expect(workflow2Result).toEqual({
      inputs: [
        {
          inputs: [workflow2Input],
          obj: "return from 1",
        },
        {
          inputs: [
            {
              inputs: [workflow2Input],
              obj: "return from 1",
            },
          ],
          obj: "return from 2",
        },
      ],
      obj: "return from 3",
    })
  })

  it("should compose two new workflows concurrently and execute them concurrently", async () => {
    const mockStep1Fn = jest.fn().mockImplementation((input, context) => {
      return { inputs: [input], obj: "return from 1" }
    })
    const mockStep2Fn = jest.fn().mockImplementation((...inputs) => {
      const context = inputs.pop()
      return {
        inputs,
        obj: "return from 2",
      }
    })
    const mockStep3Fn = jest.fn().mockImplementation((...inputs) => {
      const context = inputs.pop()
      return {
        inputs,
        obj: "return from 3",
      }
    })

    const step1 = createStep("step1", mockStep1Fn)
    const step2 = createStep("step2", mockStep2Fn)
    const step3 = createStep("step3", mockStep3Fn)

    const [workflow, workflow2] = await promiseAll([
      createWorkflow("workflow1", function (input) {
        const returnStep1 = step1(input)
        const ret2 = step2(returnStep1)
        return step3(returnStep1, ret2)
      }),

      createWorkflow("workflow2", function (input) {
        const returnStep1 = step1(input)
        const ret2 = step2(returnStep1)
        return step3(returnStep1, ret2)
      }),
    ])

    const workflowInput = { test: "payload1" }
    const workflow2Input = { test: "payload2" }

    const [{ result: workflowResult }, { result: workflow2Result }] =
      await promiseAll([
        workflow().run({
          input: workflowInput,
        }),
        workflow2().run({
          input: workflow2Input,
        }),
      ])

    expect(mockStep1Fn).toHaveBeenCalledTimes(2)
    expect(mockStep1Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep1Fn.mock.calls[0][0]).toEqual(workflowInput)
    expect(mockStep1Fn.mock.calls[1]).toHaveLength(2)
    expect(mockStep1Fn.mock.calls[1][0]).toEqual(workflow2Input)

    expect(mockStep2Fn).toHaveBeenCalledTimes(2)
    expect(mockStep2Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep2Fn.mock.calls[0][0]).toEqual({
      inputs: [workflowInput],
      obj: "return from 1",
    })
    expect(mockStep2Fn.mock.calls[1]).toHaveLength(2)
    expect(mockStep2Fn.mock.calls[1][0]).toEqual({
      inputs: [workflow2Input],
      obj: "return from 1",
    })

    expect(mockStep3Fn).toHaveBeenCalledTimes(2)
    expect(mockStep3Fn.mock.calls[0]).toHaveLength(3)
    expect(mockStep3Fn.mock.calls[0][0]).toEqual({
      inputs: [workflowInput],
      obj: "return from 1",
    })
    expect(mockStep3Fn.mock.calls[0][1]).toEqual({
      inputs: [
        {
          inputs: [workflowInput],
          obj: "return from 1",
        },
      ],
      obj: "return from 2",
    })
    expect(mockStep3Fn.mock.calls[1][0]).toEqual({
      inputs: [workflow2Input],
      obj: "return from 1",
    })
    expect(mockStep3Fn.mock.calls[1][1]).toEqual({
      inputs: [
        {
          inputs: [workflow2Input],
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
    expect(workflow2Result).toEqual({
      inputs: [
        {
          inputs: [workflow2Input],
          obj: "return from 1",
        },
        {
          inputs: [
            {
              inputs: [workflow2Input],
              obj: "return from 1",
            },
          ],
          obj: "return from 2",
        },
      ],
      obj: "return from 3",
    })
  })

  it("should compose a new workflow with parallelize steps", async () => {
    const mockStep1Fn = jest.fn().mockImplementation((input, context) => {
      return { inputs: [input], obj: "return from 1" }
    })
    const mockStep2Fn = jest.fn().mockImplementation((...inputs) => {
      const context = inputs.pop()
      return {
        inputs,
        obj: "return from 2",
      }
    })
    const mockStep3Fn = jest.fn().mockImplementation((...inputs) => {
      const context = inputs.pop()
      return {
        inputs,
        obj: "return from 3",
      }
    })
    const mockStep4Fn = jest.fn().mockImplementation((...inputs) => {
      const context = inputs.pop()
      return {
        inputs,
        obj: "return from 4",
      }
    })

    const step1 = createStep("step1", mockStep1Fn)
    const step2 = createStep("step2", mockStep2Fn)
    const step3 = createStep("step3", mockStep3Fn)
    const step4 = createStep("step4", mockStep4Fn)

    const workflow = createWorkflow("workflow1", function (input) {
      const returnStep1 = step1(input)
      const [ret2, ret3] = parallelize(step2(returnStep1), step3(returnStep1))
      return step4(ret2, ret3)
    })

    const workflowInput = { test: "payload1" }
    const { result: workflowResult } = await workflow().run({
      input: workflowInput,
    })

    expect(mockStep1Fn).toHaveBeenCalledTimes(1)
    expect(mockStep1Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep1Fn.mock.calls[0][0]).toEqual(workflowInput)

    expect(mockStep2Fn).toHaveBeenCalledTimes(1)
    expect(mockStep2Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep2Fn.mock.calls[0][0]).toEqual({
      inputs: [workflowInput],
      obj: "return from 1",
    })

    expect(mockStep3Fn).toHaveBeenCalledTimes(1)
    expect(mockStep3Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep3Fn.mock.calls[0][0]).toEqual({
      inputs: [workflowInput],
      obj: "return from 1",
    })

    expect(mockStep4Fn).toHaveBeenCalledTimes(1)
    expect(mockStep4Fn.mock.calls[0]).toHaveLength(3)
    expect(mockStep4Fn.mock.calls[0][0]).toEqual({
      inputs: [
        {
          inputs: [workflowInput],
          obj: "return from 1",
        },
      ],
      obj: "return from 2",
    })
    expect(mockStep4Fn.mock.calls[0][1]).toEqual({
      inputs: [
        {
          inputs: [workflowInput],
          obj: "return from 1",
        },
      ],
      obj: "return from 3",
    })

    expect(workflowResult).toEqual({
      inputs: [
        {
          inputs: [
            {
              inputs: [workflowInput],
              obj: "return from 1",
            },
          ],
          obj: "return from 2",
        },
        {
          inputs: [
            {
              inputs: [workflowInput],
              obj: "return from 1",
            },
          ],
          obj: "return from 3",
        },
      ],
      obj: "return from 4",
    })
  })

  it("should overwrite existing workflows if the same name is used", async () => {
    const mockStep1Fn = jest.fn().mockImplementation((input, context) => {
      return { inputs: [input], obj: "return from 1" }
    })
    const mockStep2Fn = jest.fn().mockImplementation((...inputs) => {
      const context = inputs.pop()
      return {
        inputs,
        obj: "return from 2",
      }
    })
    const mockStep3Fn = jest.fn().mockImplementation((...inputs) => {
      const context = inputs.pop()
      return {
        inputs,
        obj: "return from 3",
      }
    })

    const step1 = createStep("step1", mockStep1Fn)
    const step2 = createStep("step2", mockStep2Fn)
    const step3 = createStep("step3", mockStep3Fn)

    createWorkflow("workflow1", function (input) {
      const returnStep1 = step1(input)
      const ret2 = step2(returnStep1)
      return step3(returnStep1, ret2)
    })

    const overriddenWorkflow = createWorkflow("workflow1", function (input) {
      const ret2 = step2(input)
      const returnStep1 = step1(ret2)
      return step3(returnStep1, ret2)
    })

    const workflowInput = { test: "payload1" }
    const { result: workflowResult } = await overriddenWorkflow().run({
      input: workflowInput,
    })

    expect(mockStep1Fn).toHaveBeenCalledTimes(1)
    expect(mockStep1Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep1Fn.mock.calls[0][0]).toEqual({
      inputs: [workflowInput],
      obj: "return from 2",
    })

    expect(mockStep2Fn).toHaveBeenCalledTimes(1)
    expect(mockStep2Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep2Fn.mock.calls[0][0]).toEqual(workflowInput)

    expect(mockStep3Fn).toHaveBeenCalledTimes(1)
    expect(mockStep3Fn.mock.calls[0]).toHaveLength(3)
    expect(mockStep3Fn.mock.calls[0][0]).toEqual({
      inputs: [
        {
          inputs: [workflowInput],
          obj: "return from 2",
        },
      ],
      obj: "return from 1",
    })
    expect(mockStep3Fn.mock.calls[0][1]).toEqual({
      inputs: [workflowInput],
      obj: "return from 2",
    })

    expect(workflowResult).toEqual({
      inputs: [
        {
          inputs: [
            {
              inputs: [workflowInput],
              obj: "return from 2",
            },
          ],
          obj: "return from 1",
        },
        {
          inputs: [workflowInput],
          obj: "return from 2",
        },
      ],
      obj: "return from 3",
    })
  })

  it("should transform the values before forward them to the next step", async () => {
    const mockStep1Fn = jest.fn().mockImplementation((obj, context) => {
      const ret = {
        property: "property",
      }
      return ret
    })

    const mockStep2Fn = jest.fn().mockImplementation((obj, context) => {
      const ret = {
        ...obj,
        sum: "sum = " + obj.sum,
      }

      return ret
    })

    const mockStep3Fn = jest.fn().mockImplementation((param, context) => {
      const ret = {
        avg: "avg = " + param.avg,
        ...param,
      }
      return ret
    })

    const transform1Fn = jest.fn((input, step1Res, context) => {
      const newObj = {
        ...step1Res,
        ...input,
        sum: input.a + input.b,
      }
      return newObj
    })

    const transform2Fn = jest.fn(async (input, context) => {
      input.another_prop = "another_prop"
      return input
    })

    const transform3Fn = jest.fn((obj, context) => {
      obj.avg = (obj.a + obj.b) / 2

      return obj
    })

    const step1 = createStep("step1", mockStep1Fn)
    const step2 = createStep("step2", mockStep2Fn)
    const step3 = createStep("step3", mockStep3Fn)

    const mainFlow = createWorkflow("test_", function (input) {
      const step1Result = step1(input)

      const sum = transform([input, step1Result], transform1Fn, transform2Fn)

      const ret2 = step2(sum)

      const avg = transform(ret2, transform1Fn, transform3Fn)

      return step3(avg)
    })

    const workflowInput = { a: 1, b: 2 }
    await mainFlow().run({ input: workflowInput })

    expect(mockStep1Fn.mock.calls[0][0]).toEqual(workflowInput)

    expect(mockStep2Fn.mock.calls[0][0]).toEqual({
      property: "property",
      a: 1,
      b: 2,
      sum: 3,
      another_prop: "another_prop",
    })

    expect(mockStep3Fn.mock.calls[0][0]).toEqual({
      sum: 3,
      property: "property",
      a: 1,
      b: 2,
      another_prop: "another_prop",
      avg: 1.5,
    })

    expect(transform1Fn).toHaveBeenCalledTimes(2)
    expect(transform2Fn).toHaveBeenCalledTimes(1)
    expect(transform3Fn).toHaveBeenCalledTimes(1)
  })

  it("should compose a new workflow and access properties from steps", async () => {
    const mockStep1Fn = jest.fn().mockImplementation((input, context) => {
      return { id: input, product: "product_1", variant: "variant_2" }
    })
    const mockStep2Fn = jest.fn().mockImplementation((product, context) => {
      return {
        product: "Saved product - " + product,
      }
    })
    const mockStep3Fn = jest.fn().mockImplementation((variant, context) => {
      return {
        variant: "Saved variant - " + variant,
      }
    })

    const getData = createStep("step1", mockStep1Fn)
    const saveProduct = createStep("step2", mockStep2Fn)
    const saveVariant = createStep("step3", mockStep3Fn)

    const workflow = createWorkflow("workflow1", function (input) {
      const data = getData(input)

      parallelize(saveProduct(data.product), saveVariant(data.variant))
    })

    const workflowInput = "id_123"
    await workflow().run({
      input: workflowInput,
    })

    expect(mockStep1Fn).toHaveBeenCalledTimes(1)
    expect(mockStep1Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep1Fn.mock.calls[0][0]).toEqual(workflowInput)

    expect(mockStep2Fn).toHaveBeenCalledTimes(1)
    expect(mockStep2Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep2Fn.mock.calls[0][0]).toEqual("product_1")

    expect(mockStep3Fn).toHaveBeenCalledTimes(1)
    expect(mockStep3Fn.mock.calls[0]).toHaveLength(2)
    expect(mockStep3Fn.mock.calls[0][0]).toEqual("variant_2")
  })
})
