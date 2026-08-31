jest.mock("bullmq", () => ({
  Queue: jest.fn().mockImplementation(() => ({
    addBulk: jest.fn().mockResolvedValue([]),
    close: jest.fn().mockResolvedValue(undefined),
  })),
  Worker: jest.fn().mockImplementation(() => ({
    close: jest.fn().mockResolvedValue(undefined),
  })),
}))

import RedisEventBusService from "../event-bus-redis"

describe("RedisEventBusService", () => {
  let service: RedisEventBusService
  let mockPipeline: any
  let mockRedisConnection: any
  let mockQueue: any

  beforeEach(() => {
    mockPipeline = {
      rpush: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      del: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }

    mockRedisConnection = {
      pipeline: jest.fn().mockReturnValue(mockPipeline),
      lrange: jest.fn().mockResolvedValue([]),
      unlink: jest.fn().mockResolvedValue(1),
      expire: jest.fn().mockResolvedValue(1),
    }

    mockQueue = {
      addBulk: jest.fn().mockResolvedValue([]),
    }

    service = new RedisEventBusService(
      {
        eventBusRedisConnection: mockRedisConnection,
        logger: {
          info: jest.fn(),
          warn: jest.fn(),
          error: jest.fn(),
        } as any,
        eventBusRedisQueueName: "test-queue",
        eventBusRedisQueueOptions: {},
        eventBusRedisWorkerOptions: {},
        eventBusRedisJobOptions: {},
      },
      {
        redisUrl: "redis://localhost:6379",
      },
      {
        worker_mode: "server",
      } as any
    )
    ;(service as any).queue_ = mockQueue
  })

  describe("groupEvents with TTL", () => {
    it("should pipeline rpush and expire in the correct order on emit with grouped events", async () => {
      await service.emit([
        {
          name: "order.created",
          data: { id: "order_123" },
          metadata: {
            eventGroupId: "group_abc",
          },
        },
      ])

      expect(mockRedisConnection.pipeline).toHaveBeenCalled()
      expect(mockPipeline.rpush).toHaveBeenCalledWith(
        "staging:group_abc",
        expect.stringContaining("order.created")
      )
      expect(mockPipeline.expire).toHaveBeenCalledWith("staging:group_abc", 600)
      expect(mockPipeline.exec).toHaveBeenCalled()

      // Verify rpush was called before expire in the pipeline
      const rpushOrder = mockPipeline.rpush.mock.invocationCallOrder[0]
      const expireOrder = mockPipeline.expire.mock.invocationCallOrder[0]
      expect(rpushOrder).toBeLessThan(expireOrder)
    })
  })

  describe("clearGroupedEvents", () => {
    it("should not call rpush with empty list when all events are filtered out", async () => {
      mockRedisConnection.lrange.mockResolvedValue([
        JSON.stringify({ name: "order.created", data: { id: "1" } }),
        JSON.stringify({ name: "order.created", data: { id: "2" } }),
      ])

      await service.clearGroupedEvents("group_abc", {
        eventNames: ["order.created"],
      })

      expect(mockRedisConnection.pipeline).toHaveBeenCalled()
      expect(mockPipeline.del).toHaveBeenCalledWith("staging:group_abc")
      expect(mockPipeline.rpush).not.toHaveBeenCalled()
      expect(mockPipeline.exec).toHaveBeenCalled()
    })

    it("should call rpush with remaining events when partially cleared", async () => {
      mockRedisConnection.lrange.mockResolvedValue([
        JSON.stringify({ name: "order.created", data: { id: "1" } }),
        JSON.stringify({ name: "order.updated", data: { id: "2" } }),
      ])

      await service.clearGroupedEvents("group_abc", {
        eventNames: ["order.created"],
      })

      expect(mockRedisConnection.pipeline).toHaveBeenCalled()
      expect(mockPipeline.del).toHaveBeenCalledWith("staging:group_abc")
      expect(mockPipeline.rpush).toHaveBeenCalledWith(
        "staging:group_abc",
        JSON.stringify({ name: "order.updated", data: { id: "2" } })
      )
      expect(mockPipeline.exec).toHaveBeenCalled()
    })
  })
})
