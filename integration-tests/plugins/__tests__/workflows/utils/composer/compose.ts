import { isString } from "@medusajs/utils"
import { createStep, createWorkflow } from "@medusajs/workflows"

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

    await mainFlow({ test: "payload" })
  })

  it("should compose a new workflow and execute it with async steps", async () => {
    class WorkflowContext {
      steps = {}
      ctx = ((that) => {
        return {
          addStep: function ({ name, invoke }) {
            that.steps[name] = invoke
            return (invoke.prototype._stepDetails = { name, invoke })
          },
        }
      })(this)

      step(nameOrFn, fn) {
        const name = isString(nameOrFn)
          ? nameOrFn
          : nameOrFn.prototype._stepDetails.name
        fn ??= nameOrFn.prototype._stepDetails.invoke

        const stepDetails = {
          name,
          invoke: fn,
        }

        return this.ctx.addStep(stepDetails)
      }
    }

    class CreateWorkflow {
      private static context() {
        return new WorkflowContext()
      }

      static init(): {
        step: any
        createWorkflow: (name, composer) => { run: (...input) => Promise<any> }
      } {
        const context = CreateWorkflow.context()

        return {
          step: context.step.bind(context),
          createWorkflow(name, composer): { run: (...input) => Promise<any> } {
            return {
              async run(...input) {
                return await composer.apply(context, input)
              },
            }
          },
        }
      }
    }

    const { step: step1 } = CreateWorkflow.init()

    const prepareProductDataStep = step1("a1", (input) => {
      console.log("prepareProductDataStep invoke", input)
      return input
    })

    const action1 = step1("a2", (input) => {
      console.log("action1 invoke", input)
      return {
        ...input,
        prop: "test",
      }
    })

    const { createWorkflow } = CreateWorkflow.init()

    const workflow = createWorkflow("test", function (this: any, input) {
      const preparedResponse = this.step(prepareProductDataStep(input))
      return this.step(action1(preparedResponse))
    })

    const result = await workflow.run({ test: "payload" })
    console.log(result)
  })
})
