import { asValue } from "@zjedene-medusa/framework/awilix"
import { container, logger } from "@zjedene-medusa/framework"
import type { IndexTypes } from "@zjedene-medusa/types"
import { Orchestrator } from "@utils"

function creatingFakeLockingModule() {
  return {
    lockEntities: new Set(),
    acquire(key: string) {
      if (this.lockEntities.has(key)) {
        throw new Error("Lock already exists")
      }
      this.lockEntities.add(key)
    },
    async release(key: string) {
      this.lockEntities.delete(key)
    },
  }
}

describe("Orchestrator", () => {
  test("process each entity via the task runner", async () => {
    const processedEntities: string[] = []
    const lockingModule = creatingFakeLockingModule()

    const entities: IndexTypes.SchemaObjectEntityRepresentation[] = [
      {
        entity: "brand",
        alias: "brand",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
      {
        entity: "product",
        alias: "product",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
    ]

    container.register({
      locking: asValue(lockingModule),
    })

    async function taskRunner(entity: string) {
      processedEntities.push(entity)
    }

    const orchestrator = new Orchestrator(
      container.resolve("locking"),
      entities.map((e) => e.entity),
      {
        lockDuration: 60 * 1000,
        logger: logger,
      }
    )

    await orchestrator.process(taskRunner)
    expect(lockingModule.lockEntities.size).toEqual(0)
    expect(orchestrator.state).toEqual("completed")
    expect(processedEntities).toEqual(["brand", "product"])
  })

  test("do not process tasks when unable to acquire lock", async () => {
    const processedEntities: string[] = []
    const lockingModule = creatingFakeLockingModule()

    const entities: IndexTypes.SchemaObjectEntityRepresentation[] = [
      {
        entity: "brand",
        alias: "brand",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
      {
        entity: "product",
        alias: "product",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
    ]

    container.register({
      locking: asValue({
        ...lockingModule,
        acquire() {
          throw new Error("Unable to acquire lock")
        },
      }),
    })

    const orchestrator = new Orchestrator(
      container.resolve("locking"),
      entities.map((e) => e.entity),
      {
        lockDuration: 60 * 1000,
        logger: logger,
      }
    )

    async function taskRunner(entity: string) {
      processedEntities.push(entity)
    }

    await orchestrator.process(taskRunner)
    expect(processedEntities).toEqual([])
  })

  test("share tasks between multiple instances", async () => {
    const processedEntities: { owner: string; entity: string }[] = []
    const lockingModule = creatingFakeLockingModule()

    const entities: IndexTypes.SchemaObjectEntityRepresentation[] = [
      {
        entity: "brand",
        alias: "brand",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
      {
        entity: "product",
        alias: "product",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
    ]

    container.register({
      locking: asValue(lockingModule),
    })

    const entityNames = entities.map((e) => e.entity)

    async function taskRunner(entity: string) {
      processedEntities.push({ entity: entity, owner: "instance-1" })
    }

    const orchestrator = new Orchestrator(
      container.resolve("locking"),
      entityNames,
      {
        lockDuration: 60 * 1000,
        logger: logger,
      }
    )

    async function taskRunner2(entity: string) {
      processedEntities.push({ entity: entity, owner: "instance-2" })
    }

    const orchestrator1 = new Orchestrator(
      container.resolve("locking"),
      entityNames,
      {
        lockDuration: 60 * 1000,
        logger: logger,
      }
    )

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
    expect(lockingModule.lockEntities.size).toEqual(0)
  })

  test("stop processing when task runner throws error", async () => {
    const processedEntities: string[] = []
    const lockingModule = creatingFakeLockingModule()

    const entities: IndexTypes.SchemaObjectEntityRepresentation[] = [
      {
        entity: "brand",
        alias: "brand",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
      {
        entity: "product",
        alias: "product",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
    ]

    container.register({
      locking: asValue(lockingModule),
    })

    async function taskRunner(entity: string) {
      if (entity === "product") {
        throw new Error("Cannot process")
      }
      processedEntities.push(entity)
    }

    const orchestrator = new Orchestrator(
      container.resolve("locking"),
      entities.map((e) => e.entity),
      {
        lockDuration: 60 * 1000,
        logger: logger,
      }
    )

    await expect(orchestrator.process(taskRunner)).rejects.toThrow(
      "Cannot process"
    )
    expect(orchestrator.state).toEqual("error")
    expect(processedEntities).toEqual(["brand"])
    expect(lockingModule.lockEntities.size).toEqual(0)
  })

  test("throw error when the same instance is executed to process tasks parallely", async () => {
    const processedEntities: string[] = []
    const lockingModule = creatingFakeLockingModule()

    const entities: IndexTypes.SchemaObjectEntityRepresentation[] = [
      {
        entity: "brand",
        alias: "brand",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
      {
        entity: "product",
        alias: "product",
        fields: ["*"],
        listeners: [],
        moduleConfig: {},
        parents: [],
      },
    ]

    container.register({
      locking: asValue(lockingModule),
    })

    async function taskRunner(entity: string) {
      expect(orchestrator.state).toEqual("processing")
      processedEntities.push(entity)
    }

    const orchestrator = new Orchestrator(
      container.resolve("locking"),
      entities.map((e) => e.entity),
      {
        lockDuration: 60 * 1000,
        logger: logger,
      }
    )

    await expect(
      Promise.all([
        orchestrator.process(taskRunner),
        orchestrator.process(taskRunner),
      ])
    ).rejects.toThrow("Cannot re-run an already running orchestrator instance")

    expect(lockingModule.lockEntities.size).toEqual(0)
  })
})
