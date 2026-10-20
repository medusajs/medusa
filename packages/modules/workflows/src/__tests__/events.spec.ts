import { asValue } from "@medusajs/framework/awilix"
import type { IEventBusModuleService } from "@medusajs/framework/types"
import {
  createMedusaContainer,
  Modules,
  withEventGrouping,
} from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createEngine, createOutbox, MemoryStore } from "@medusajs/workflow-engine"
import { createEventPublisher } from "../events/event-group-router"
import { WorkflowsModuleService } from "../services"

describe("grouped events of a workflow", () => {
  let emitted: { name: string; metadata?: Record<string, unknown> }[]
  let service: WorkflowsModuleService
  let releaseOnBus: jest.Mock

  const createService = () => {
    emitted = []
    releaseOnBus = jest.fn(async () => {})
    const bus = withEventGrouping({
      emit: async (data: any) => {
        emitted.push(...(Array.isArray(data) ? data : [data]))
      },
      releaseGroupedEvents: releaseOnBus,
      clearGroupedEvents: async () => {},
    } as unknown as IEventBusModuleService)

    const container = createMedusaContainer()
    container.register(Modules.EVENT_BUS, asValue(bus))

    const store = new MemoryStore()
    const outbox = createOutbox(store, {
      publish: createEventPublisher(() => bus),
      groupOf: (run) => run.context?.eventGroupId as string | undefined,
      releases: (run) => !run.context?.preventReleaseEvents,
    })
    service = new WorkflowsModuleService({
      workflowEngine: createEngine({ store, extensions: [outbox.extension] }),
      workflowOutbox: outbox,
      sharedContainer: container,
      logger: { error: () => {}, warn: () => {} } as any,
    })
  }

  beforeEach(async () => {
    createService()
    await service.__hooks.onApplicationStart()
  })

  afterEach(async () => {
    await service.engine.shutdown({ graceMs: 0 })
  })

  const emitStep = createStep(
    "emit-grouped",
    async (name: string, { container, context }) => {
      await container.resolve<IEventBusModuleService>(Modules.EVENT_BUS).emit({
        name,
        data: {},
        metadata: { eventGroupId: context!.eventGroupId },
      })
      return new StepResponse(name)
    }
  )
  const failStep = createStep("fail-after-emit", async () => {
    throw new Error("boom")
  })

  it("publishes events emitted inside the run once it succeeds", async () => {
    const workflow = createWorkflow("events-ok", () => {
      emitStep("product.created")
      return new WorkflowResponse(void 0)
    })
    await service.registerWorkflows([workflow])

    await service.run("events-ok", { throwOnError: true })

    expect(emitted).toEqual([
      expect.objectContaining({ name: "product.created", metadata: {} }),
    ])
  })

  it("drops events emitted inside a run that fails", async () => {
    const workflow = createWorkflow("events-failed", () => {
      emitStep("product.created")
      failStep()
      return new WorkflowResponse(void 0)
    })
    await service.registerWorkflows([workflow])

    await service.run("events-failed", { throwOnError: false })

    expect(emitted).toEqual([])
  })

  it("does not release groups on the event bus for runs the outbox stages", async () => {
    const workflow = createWorkflow("events-staged", () => {
      emitStep("product.created")
      return new WorkflowResponse(void 0)
    })
    await service.registerWorkflows([workflow])

    await service.run("events-staged", { throwOnError: true })

    expect(releaseOnBus).not.toHaveBeenCalled()
  })

  it("releases groups on the event bus for runs started before the application started", async () => {
    await service.engine.shutdown({ graceMs: 0 })
    createService()
    const workflow = createWorkflow("events-before-start", () => {
      emitStep("product.created")
      return new WorkflowResponse(void 0)
    })
    await service.registerWorkflows([workflow])

    const { transaction } = await service.run("events-before-start", {
      throwOnError: true,
    })

    expect(releaseOnBus).toHaveBeenCalledWith(
      transaction.getFlow().metadata.eventGroupId
    )
  })
})
