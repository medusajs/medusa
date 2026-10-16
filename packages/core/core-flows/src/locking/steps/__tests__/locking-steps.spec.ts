import { MedusaContainer } from "@medusajs/framework/types"
import { asFunction, createContainer } from "@medusajs/framework/awilix"
import { Modules } from "@medusajs/framework/utils"
import { createWorkflow, createStep, WorkflowResponse } from "@medusajs/workflows-sdk"
import { acquireLockStep } from "../acquire-lock"
import { releaseLockStep } from "../release-lock"

describe("acquireLockStep & releaseLockStep", () => {
  let container: MedusaContainer
  let mockLockingService: {
    acquire: jest.Mock
    release: jest.Mock
  }

  beforeEach(() => {
    mockLockingService = {
      acquire: jest.fn().mockResolvedValue(void 0),
      release: jest.fn().mockResolvedValue(true),
    }

    container = createContainer() as unknown as MedusaContainer
    container.register(
      Modules.LOCKING,
      asFunction(() => mockLockingService)
    )
  })

  describe("acquireLockStep", () => {
    it("defaults ownerId to workflow transactionId when not explicitly passed", async () => {
      const workflow = createWorkflow("test-acquire-default-owner", () => {
        acquireLockStep({
          key: "cart_123",
          ttl: 60,
        })
        return new WorkflowResponse({})
      })

      await workflow(container).run({
        context: { transactionId: "tx_cart_completion_1" },
      })

      expect(mockLockingService.acquire).toHaveBeenCalledWith("cart_123", {
        expire: 60,
        ownerId: "tx_cart_completion_1",
        provider: undefined,
      })
    })

    it("automatically derives unique transactionId when context has no transactionId", async () => {
      const workflow = createWorkflow("test-acquire-auto-owner", () => {
        acquireLockStep({
          key: "cart_123",
          ttl: 60,
        })
        return new WorkflowResponse({})
      })

      await workflow(container).run()

      expect(mockLockingService.acquire).toHaveBeenCalledWith(
        "cart_123",
        expect.objectContaining({
          expire: 60,
          ownerId: expect.stringMatching(/^auto-/),
        })
      )
    })

    it("preserves explicit ownerId when provided", async () => {
      const workflow = createWorkflow("test-acquire-explicit-owner", () => {
        acquireLockStep({
          key: "cart_123",
          ttl: 60,
          ownerId: "custom_worker_id",
        })
        return new WorkflowResponse({})
      })

      await workflow(container).run({
        context: { transactionId: "tx_cart_completion_2" },
      })

      expect(mockLockingService.acquire).toHaveBeenCalledWith("cart_123", {
        expire: 60,
        ownerId: "custom_worker_id",
        provider: undefined,
      })
    })

    it("releases lock with the workflow transactionId during compensation", async () => {
      const failingStep = createStep("failing-step", async () => {
        throw new Error("step failure after lock")
      })

      const workflow = createWorkflow("test-acquire-compensation", () => {
        acquireLockStep({
          key: "cart_123",
          ttl: 60,
        })
        failingStep()
        return new WorkflowResponse({})
      })

      const { errors } = await workflow(container).run({
        context: { transactionId: "tx_cart_completion_compensate" },
        throwOnError: false,
      })

      expect(errors.length).toBeGreaterThan(0)
      expect(mockLockingService.release).toHaveBeenCalledWith(["cart_123"], {
        ownerId: "tx_cart_completion_compensate",
        provider: undefined,
      })
    })

    it("skips acquire when keys are empty", async () => {
      const workflow = createWorkflow("test-acquire-empty", () => {
        acquireLockStep({
          key: [],
        })
        return new WorkflowResponse({})
      })

      await workflow(container).run({
        context: { transactionId: "tx_empty" },
      })

      expect(mockLockingService.acquire).not.toHaveBeenCalled()
    })
  })

  describe("releaseLockStep", () => {
    it("defaults ownerId to workflow transactionId when not explicitly passed", async () => {
      const workflow = createWorkflow("test-release-default-owner", () => {
        releaseLockStep({
          key: "cart_123",
        })
        return new WorkflowResponse({})
      })

      await workflow(container).run({
        context: { transactionId: "tx_cart_completion_release_1" },
      })

      expect(mockLockingService.release).toHaveBeenCalledWith(["cart_123"], {
        ownerId: "tx_cart_completion_release_1",
        provider: undefined,
      })
    })

    it("preserves explicit ownerId when provided", async () => {
      const workflow = createWorkflow("test-release-explicit-owner", () => {
        releaseLockStep({
          key: "cart_123",
          ownerId: "custom_worker_id",
        })
        return new WorkflowResponse({})
      })

      await workflow(container).run({
        context: { transactionId: "tx_cart_completion_release_2" },
      })

      expect(mockLockingService.release).toHaveBeenCalledWith(["cart_123"], {
        ownerId: "custom_worker_id",
        provider: undefined,
      })
    })

    it("skips release when keys are empty", async () => {
      const workflow = createWorkflow("test-release-empty", () => {
        releaseLockStep({
          key: [],
        })
        return new WorkflowResponse({})
      })

      await workflow(container).run({
        context: { transactionId: "tx_empty_release" },
      })

      expect(mockLockingService.release).not.toHaveBeenCalled()
    })
  })
})
