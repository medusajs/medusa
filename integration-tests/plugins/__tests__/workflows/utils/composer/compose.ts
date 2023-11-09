jest.setTimeout(30000)

import { createStep, createWorkflow } from "@medusajs/workflows"

describe("Workflow composer", function () {
  beforeAll(async () => {})

  afterAll(async () => {})

  it("should compose a new workflow and execute it", async () => {
    const step1 = createStep("step1", (input) => {
      const ret = "return from 1 + input = " + input
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

    const mainFlow = createWorkflow("test", function (input) {
      // @ts-ignore
      const returnStep1 = step1.bind(this)(input)

      // @ts-ignore
      const ret2 = step2.bind(this)(returnStep1)

      // @ts-ignore
      const ret3 = step3.bind(this)(returnStep1, ret2)
    })

    await mainFlow({ test: "payload" })
  })
})
