import { asValue } from "@medusajs/framework/awilix"
import { createMedusaContainer, MedusaError } from "@medusajs/framework/utils"
import {
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createEngine } from "@medusajs/workflow-engine"
import { WorkflowsModuleService } from "../services"
import { createWorkflow, useTestEngine } from "./__fixtures__/test-engine"

const engine = useTestEngine()

let count = 0
const nextId = (prefix: string) => `${prefix}-${++count}`

const ofType = (type: string) => expect.objectContaining({ type })

/**
 * A workflow whose first step waits to be completed from outside, then
 * returns what the second step resolves as "marker" from its container.
 */
function waitingWorkflow() {
  const id = nextId("waiting")
  const wait = createStep({ name: `${id}-wait`, async: true }, async () => {})
  const read = createStep(`${id}-read`, async (_, { container }) => {
    return new StepResponse(
      container.resolve("marker", { allowUnregistered: true }) ?? null
    )
  })
  createWorkflow({ name: id, store: true }, () => {
    wait()
    return new WorkflowResponse(read())
  })
  return { id, waitStep: `${id}-wait` }
}

const stepKey = (workflowId: string, transactionId: string, stepId: string) =>
  `${workflowId}:${transactionId}:${stepId}:invoke`

describe("WorkflowsModuleService operations", () => {
  describe("run callbacks", () => {
    it("keeps the first caller's callbacks when a duplicate run is rejected", async () => {
      const { id, waitStep } = waitingWorkflow()
      const first = jest.fn()
      const second = jest.fn()

      await engine.service.run(id, {
        transactionId: "trx",
        events: { onFinish: first },
      })
      await expect(
        engine.service.run(id, {
          transactionId: "trx",
          events: { onFinish: second },
        })
      ).rejects.toEqual(ofType(MedusaError.Types.CONFLICT))

      await engine.service.setStepSuccess({
        idempotencyKey: stepKey(id, "trx", waitStep),
        stepResponse: "done",
      })

      expect(first).toHaveBeenCalledTimes(1)
      expect(second).not.toHaveBeenCalled()
    })

    it("keeps the duplicate run's error message", async () => {
      const { id } = waitingWorkflow()
      await engine.service.run(id, { transactionId: "trx" })

      await expect(
        engine.service.run(id, { transactionId: "trx" })
      ).rejects.toThrow("Transaction already started for transactionId: trx")
    })

    it("drops the callbacks of a step call that fails", async () => {
      const { id, waitStep } = waitingWorkflow()
      const failed = jest.fn()
      const later = jest.fn()

      await expect(
        engine.service.setStepSuccess({
          idempotencyKey: stepKey(id, "missing", waitStep),
          stepResponse: "done",
          options: { events: { onFinish: failed } },
        })
      ).rejects.toEqual(ofType(MedusaError.Types.NOT_FOUND))

      await engine.service.run(id, {
        transactionId: "missing",
        events: { onFinish: later },
      })
      await engine.service.setStepSuccess({
        idempotencyKey: stepKey(id, "missing", waitStep),
        stepResponse: "done",
      })

      expect(later).toHaveBeenCalledTimes(1)
      expect(failed).not.toHaveBeenCalled()
    })
  })

  describe("errors", () => {
    it("rejects a malformed idempotency key as invalid data", async () => {
      await expect(
        engine.service.setStepSuccess({
          idempotencyKey: "not-a-key",
          stepResponse: "done",
        })
      ).rejects.toEqual(ofType(MedusaError.Types.INVALID_DATA))
    })

    it("rejects completing a compensation from outside", async () => {
      const { id, waitStep } = waitingWorkflow()

      await expect(
        engine.service.setStepSuccess({
          idempotencyKey: `${id}:trx:${waitStep}:compensate`,
          stepResponse: "done",
        })
      ).rejects.toEqual(ofType(MedusaError.Types.NOT_ALLOWED))
    })

    it("maps a cancel that is not allowed and does not throw without throwOnError", async () => {
      const id = nextId("failed")
      const done = createStep(
        `${id}-done`,
        async () => new StepResponse("done"),
        async () => {
          throw new Error("compensation failed")
        }
      )
      const failing = createStep(`${id}-failing`, async () => {
        throw new Error("invoke failed")
      })
      createWorkflow({ name: id, store: true, retentionTime: 60 }, () => {
        done()
        failing()
        return new WorkflowResponse(void 0)
      })
      await engine.service.run(id, {
        transactionId: "trx",
        throwOnError: false,
      })

      await expect(
        engine.service.cancel(id, { transactionId: "trx" })
      ).rejects.toEqual(ofType(MedusaError.Types.NOT_ALLOWED))

      const result = await engine.service.cancel(id, {
        transactionId: "trx",
        throwOnError: false,
      })
      expect(result.acknowledgement).toEqual(
        expect.objectContaining({ exists: true, hasFailed: true })
      )
      expect(result.thrownError).toEqual(
        ofType(MedusaError.Types.NOT_ALLOWED)
      )
    })

    it("does not throw for a missing transaction without throwOnError", async () => {
      const { id } = waitingWorkflow()

      const result = await engine.service.cancel(id, {
        transactionId: "missing",
        throwOnError: false,
      })

      expect(result.acknowledgement).toEqual(
        expect.objectContaining({ exists: false })
      )
    })
  })

  describe("options", () => {
    it("returns a step's output as the result with resultFrom", async () => {
      const id = nextId("result-from")
      const first = createStep(`${id}-first`, async () => {
        return new StepResponse("first output")
      })
      const second = createStep(`${id}-second`, async () => {
        return new StepResponse("second output")
      })
      createWorkflow(id, () => {
        first()
        return new WorkflowResponse(second())
      })

      const { result } = await engine.service.run(id, {
        resultFrom: `${id}-first`,
      })

      expect(result).toEqual("first output")
    })

    it("continues the run with the container a step call passes", async () => {
      const { id, waitStep } = waitingWorkflow()
      await engine.service.run(id, { transactionId: "trx" })

      const container = createMedusaContainer()
      container.register("marker", asValue("from the call"))
      const { result } = await engine.service.setStepSuccess({
        idempotencyKey: stepKey(id, "trx", waitStep),
        stepResponse: "done",
        options: { container },
      })

      expect(result).toEqual("from the call")
    })

    it("keeps the first run's container when a duplicate run is rejected", async () => {
      const { id, waitStep } = waitingWorkflow()
      const first = createMedusaContainer()
      first.register("marker", asValue("first"))
      const second = createMedusaContainer()
      second.register("marker", asValue("second"))

      await engine.service.run(id, { transactionId: "trx", container: first })
      await expect(
        engine.service.run(id, { transactionId: "trx", container: second })
      ).rejects.toEqual(ofType(MedusaError.Types.CONFLICT))

      const { result } = await engine.service.setStepSuccess({
        idempotencyKey: stepKey(id, "trx", waitStep),
        stepResponse: "done",
      })

      expect(result).toEqual("first")
    })
  })

  describe("application start", () => {
    it("logs a failed legacy check without failing startup", async () => {
      const warn = jest.fn()
      const service = new WorkflowsModuleService({
        workflowEngine: createEngine(),
        logger: { error: () => {}, warn } as any,
        workflowEngineLegacyCheck: async () => {
          throw new Error("relation does not exist")
        },
      })

      try {
        await expect(
          service.__hooks.onApplicationStart()
        ).resolves.toBeUndefined()
        expect(warn).toHaveBeenCalledWith(
          expect.stringContaining("relation does not exist")
        )
      } finally {
        await service.engine.shutdown()
      }
    })
  })
})
