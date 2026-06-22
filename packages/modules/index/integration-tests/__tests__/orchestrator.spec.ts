import { Orchestrator } from "@utils"
import { FakeLocking, FakeLogger } from "../__fixtures__"

const entities = ["brand", "product"]

describe("Orchestrator", () => {
  const logger = new FakeLogger().asLogger()

  test("process each entity via the task runner", async () => {
    const processedEntities: string[] = []
    const locking = new FakeLocking()

    async function taskRunner(entity: string) {
      processedEntities.push(entity)
    }

    const orchestrator = new Orchestrator(locking, entities, {
      lockDuration: 60 * 1000,
      logger,
    })

    await orchestrator.process(taskRunner)

    expect(locking.locks.size).toEqual(0)
    expect(orchestrator.state).toEqual("completed")
    expect(processedEntities).toEqual(["brand", "product"])
  })

  test("do not process tasks when unable to acquire lock", async () => {
    const processedEntities: string[] = []
    const locking = new FakeLocking()

    // Another process already holds the locks for every entity
    await locking.acquire(entities, { ownerId: "another-process" })

    const orchestrator = new Orchestrator(locking, entities, {
      lockDuration: 60 * 1000,
      logger,
    })

    async function taskRunner(entity: string) {
      processedEntities.push(entity)
    }

    await orchestrator.process(taskRunner)

    expect(processedEntities).toEqual([])
  })

  test("share tasks between multiple instances", async () => {
    const processedEntities: { owner: string; entity: string }[] = []
    const locking = new FakeLocking()

    async function taskRunner(entity: string) {
      processedEntities.push({ entity: entity, owner: "instance-1" })
    }

    const orchestrator = new Orchestrator(locking, entities, {
      lockDuration: 60 * 1000,
      logger,
    })

    async function taskRunner2(entity: string) {
      processedEntities.push({ entity: entity, owner: "instance-2" })
    }

    const orchestrator1 = new Orchestrator(locking, entities, {
      lockDuration: 60 * 1000,
      logger,
    })

    await Promise.all([
      orchestrator.process(taskRunner),
      orchestrator1.process(taskRunner2),
    ])

    expect(processedEntities).toEqual(
      expect.arrayContaining([
        {
          entity: "brand",
          owner: "instance-1",
        },
        {
          entity: "product",
          owner: "instance-2",
        },
      ])
    )
    expect(locking.locks.size).toEqual(0)
  })

  test("stop processing when task runner throws error", async () => {
    const processedEntities: string[] = []
    const locking = new FakeLocking()

    async function taskRunner(entity: string) {
      if (entity === "product") {
        throw new Error("Cannot process")
      }
      processedEntities.push(entity)
    }

    const orchestrator = new Orchestrator(locking, entities, {
      lockDuration: 60 * 1000,
      logger,
    })

    await expect(orchestrator.process(taskRunner)).rejects.toThrow(
      "Cannot process"
    )
    expect(orchestrator.state).toEqual("error")
    expect(processedEntities).toEqual(["brand"])
    expect(locking.locks.size).toEqual(0)
  })

  test("throw error when the same instance is executed to process tasks parallely", async () => {
    const processedEntities: string[] = []
    const locking = new FakeLocking()

    async function taskRunner(entity: string) {
      expect(orchestrator.state).toEqual("processing")
      processedEntities.push(entity)
    }

    const orchestrator = new Orchestrator(locking, entities, {
      lockDuration: 60 * 1000,
      logger,
    })

    await expect(
      Promise.all([
        orchestrator.process(taskRunner),
        orchestrator.process(taskRunner),
      ])
    ).rejects.toThrow("Cannot re-run an already running orchestrator instance")

    expect(locking.locks.size).toEqual(0)
  })
})
