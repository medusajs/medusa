import { InMemoryDistributedTransactionStorage } from "../workflow-orchestrator-storage"

const MAX_TIMER_DELAY_MS = 2_147_483_647

describe("InMemoryDistributedTransactionStorage", () => {
  describe("schedule", () => {
    let storage: InMemoryDistributedTransactionStorage
    let run: jest.Mock

    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date("2024-01-01T00:00:00.000Z"))

      run = jest.fn().mockResolvedValue(undefined)
      storage = new InMemoryDistributedTransactionStorage({
        workflowExecutionService: {} as any,
        logger: { warn: jest.fn() } as any,
      })
      storage.setWorkflowOrchestratorService({ run } as any)
    })

    afterEach(async () => {
      await storage.removeAll()
      await storage.onApplicationShutdown()
      jest.useRealTimers()
    })

    it("arms timers within the 32-bit setTimeout limit for a long-interval cron", async () => {
      const setTimeoutSpy = jest.spyOn(global, "setTimeout")

      await storage.schedule("monthly-job", { cron: "0 0 1 * *" } as any)

      const delays = setTimeoutSpy.mock.calls.map(([, delay]) => delay)
      expect(delays.length).toBeGreaterThan(0)
      for (const delay of delays) {
        expect(delay).toBeLessThanOrEqual(MAX_TIMER_DELAY_MS)
      }
    })

    it("runs a long-interval cron job once when its delay elapses", async () => {
      await storage.schedule("monthly-job", { cron: "0 0 1 * *" } as any)

      const delay = new Date("2024-02-01T00:00:00.000Z").getTime() - Date.now()
      await jest.advanceTimersByTimeAsync(delay)

      expect(run).toHaveBeenCalledTimes(1)
    })

    it("does not run a removed job once a later chunk of its delay elapses", async () => {
      await storage.schedule("monthly-job", { cron: "0 0 1 * *" } as any)

      // Advance past the first chunk so the timer re-arms for the remaining delay
      await jest.advanceTimersByTimeAsync(MAX_TIMER_DELAY_MS + 1)

      await storage.remove("monthly-job")

      const delay = new Date("2024-02-01T00:00:00.000Z").getTime() - Date.now()
      await jest.advanceTimersByTimeAsync(delay)

      expect(run).not.toHaveBeenCalled()
    })
  })
})
