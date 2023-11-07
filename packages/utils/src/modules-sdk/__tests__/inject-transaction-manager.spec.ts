import { InjectIntoContext, InjectTransactionManager } from "../decorators"
import { MedusaContext } from "../../decorators"

class T1 {
  repo: any

  constructor() {
    this.repo = {
      transaction: async function (task) {
        return await task()
      },
    }
  }

  @InjectIntoContext({
    collection: [1],
  })
  async method1(@MedusaContext() context: any = {}) {
    await Promise.all([
      this.method2(context),
      this.method3(context),
      this.method4(context),
      this.method5(context),
    ])

    return context
  }

  @InjectTransactionManager("repo")
  async method2(@MedusaContext() context) {
    context.collection.push(2)
  }
  @InjectTransactionManager("repo")
  async method3(@MedusaContext() context) {
    await new Promise((resolve) => setTimeout(resolve, 100))
    context.collection.push(3)
  }
  @InjectTransactionManager("repo")
  async method4(@MedusaContext() context) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    context.collection.push(4)
  }
  @InjectTransactionManager("repo")
  async method5(@MedusaContext() context) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    context.collection.push(5)
  }
}

describe("InjectTransactionManager", function () {
  it("should return the mutated object properties during concurrent calls without mutating the original context reference", async function () {
    const t1 = new T1()
    const res = await t1.method1()

    expect(Object.keys(res)).toEqual(["collection"])
    expect(res.collection).toEqual([1, 2, 3, 4, 5])
  })
})
