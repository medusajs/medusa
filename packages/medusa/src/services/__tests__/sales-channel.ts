import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import SalesChannelService from "../sales-channel"
import { EventBusService } from "../index"
import { SalesChannel } from "../../models/sales-channel"
import { salesChannel1 } from "../__mocks__/sales-channel"

const eventBusServiceMock = {
  emit: jest.fn(),
  withTransaction: function() {
    return this
  },
} as unknown as EventBusService

const salesChannelRepositoryMock = MockRepository({
  create: jest.fn().mockImplementation((data) => {
    return Object.assign(new SalesChannel(), data)
  }),
  retrieve: jest.fn().mockImplementation((id: string): any => {
    if (id === IdMap.getId("sales_channel_1")) {
      return Promise.resolve(salesChannel1)
    }
    return Promise.resolve()
  }),
  findOneWithRelations: jest.fn().mockImplementation(
    (relations: string[], config): Promise<SalesChannel | void> => {
      if (config?.where?.id === IdMap.getId("sales_channel_1")) {
        return Promise.resolve(salesChannel1 as SalesChannel)
      }
      return Promise.resolve()
    }
  ),
})

describe('SalesChannelService', () => {
  const salesChannelService = new SalesChannelService({
    manager: MockManager,
    eventBusService: eventBusServiceMock,
    salesChannelRepository: salesChannelRepositoryMock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should retrieve a sales channel', async () => {
    const salesChannel = await salesChannelService.retrieve(
      IdMap.getId("sales_channel_1")
    )

    expect(salesChannel).toBeTruthy()
    expect(salesChannel).toEqual(salesChannel1)

    expect(salesChannelRepositoryMock.findOneWithRelations)
      .toHaveBeenCalledTimes(1)
    expect(salesChannelRepositoryMock.findOneWithRelations)
      .toHaveBeenLastCalledWith(
        undefined,
        { where: { id: IdMap.getId("sales_channel_1") } },
     )
  })
})
