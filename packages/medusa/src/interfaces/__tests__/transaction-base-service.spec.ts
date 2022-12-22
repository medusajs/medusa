import { EntityManager } from "typeorm"
import { MockManager } from "medusa-test-utils"
import { TransactionBaseService } from "../transaction-base-service"

describe("TransactionBaseService", () => {
  it("should cloned the child class withTransaction", () => {
    class Child extends TransactionBaseService {
      protected manager_!: EntityManager
      protected transactionManager_!: EntityManager

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
})