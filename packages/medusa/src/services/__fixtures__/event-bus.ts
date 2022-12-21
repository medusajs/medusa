import { asValue, createContainer } from "awilix"
import FakeRedis from "ioredis-mock"
import { MockManager } from "medusa-test-utils"
import { cacheServiceMock } from "../__mocks__/cache"

export const defaultEventBusContainerMock = createContainer()
defaultEventBusContainerMock.register("manager", asValue(MockManager))
defaultEventBusContainerMock.register(
  "logger",
  asValue({
    info: jest.fn().mockReturnValue(console.log),
    warn: jest.fn().mockReturnValue(console.log),
    error: jest.fn().mockReturnValue(console.log),
  })
)
defaultEventBusContainerMock.register("cacheService", asValue(cacheServiceMock))
defaultEventBusContainerMock.register("redisClient", asValue(FakeRedis))
defaultEventBusContainerMock.register("redisSubscriber", asValue(FakeRedis))
