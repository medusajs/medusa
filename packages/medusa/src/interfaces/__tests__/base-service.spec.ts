import { BaseService } from "../base-service"
import { In, Not } from "typeorm"
import { MockManager } from "medusa-test-utils"

describe("BaseService", () => {
  it("should cloned the child class withTransaction", () => {
    class Child extends BaseService<Child> {
      constructor(protected readonly container) {
        super(container);
        this.container = container
      }

      message() {
        return `child class message method called with title ${this.container.title}`
      }

      getTransactionManager() {
        return this.transactionManager_
      }
    }

    const child = new Child({ title: 'title' })

    expect(child.message()).toBe(`child class message method called with title title`)
    expect(child.getTransactionManager()).toBeFalsy()

    const fakeManager = MockManager
    fakeManager.testProp = 'testProp'
    const child2 = child.withTransaction(fakeManager)

    expect(child2.message()).toBe(`child class message method called with title title`)
    expect(child2.getTransactionManager()).toBeTruthy()
    expect((child2.getTransactionManager() as any)?.testProp).toBe('testProp')
  })

  describe("buildQuery_", () => {
    const baseService = new BaseService({}, {})

    it("successfully creates query", () => {
      const q = baseService.buildQuery_(
        {
          id: "1234",
          test1: ["123", "12", "1"],
          test2: Not("this"),
        },
        {
          relations: ["1234"],
        }
      )

      expect(q).toEqual({
        where: {
          id: "1234",
          test1: In(["123", "12", "1"]),
          test2: Not("this"),
        },
        relations: ["1234"],
      })
    })
  })
})