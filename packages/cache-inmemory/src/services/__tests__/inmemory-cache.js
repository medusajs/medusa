import { MockManager } from "medusa-test-utils"

import { InMemoryCacheService } from "../index"

const loggerMock = {
  info: jest.fn().mockReturnValue(console.log),
  warn: jest.fn().mockReturnValue(console.log),
  error: jest.fn().mockReturnValue(console.log),
}

describe("InMemoryCacheService", () => {
  let eventBus

  describe("constructor", () => {
    beforeAll(() => {
      jest.resetAllMocks()
    })

    it("Creates a InMemoryCacheService", () => {
      eventBus = new InMemoryCacheService(
        {
          manager: MockManager,
          logger: loggerMock,
        },
        {
          // redisUrl: "test-url",
        },
        {
          resources: "shared",
        }
      )
    })

    it("Throws on isolated module declaration", () => {
      try {
        eventBus = new InMemoryCacheService(
          {
            manager: MockManager,
            logger: loggerMock,
          },
          {
            // redisUrl: "test-url",
          },
          {
            resources: "isolated",
          }
        )
      } catch (error) {
        expect(error.message).toEqual(
          "At the moment this module can only be used with shared resources"
        )
      }
    })
  })
})
