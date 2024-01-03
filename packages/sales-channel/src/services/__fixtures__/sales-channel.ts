import { SalesChannelService, SalesChannelModuleService } from "@services"
import { asClass, asValue, createContainer } from "awilix"

export const mockContainer = createContainer()

mockContainer.register({
  transaction: asValue(async (task) => await task()),
  salesChannelRepository: asValue({
    find: jest.fn().mockImplementation(async ({ where: { code } }) => {
      return [{}]
    }),
    findAndCount: jest.fn().mockResolvedValue([[], 0]),
    getFreshManager: jest.fn().mockResolvedValue({}),
  }),
  salesChannelService: asClass(SalesChannelService),
  salesChannelModuleService: asClass(SalesChannelModuleService),
})
