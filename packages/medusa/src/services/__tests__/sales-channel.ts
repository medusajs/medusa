import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import SalesChannelService from "../sales-channel"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import { EventBusService } from "../index"
import { FindConditions, FindOneOptions } from "typeorm"
import { SalesChannel } from "../../models"

describe('SalesChannelService', () => {
  describe("retrieve", () => {
    const salesChannelData = {
      name: "sales channel 1 name",
      description: "sales channel 1 description",
      is_disabled: false,
    }

    const salesChannelRepositoryMock = MockRepository({
      findOne: jest.fn().mockImplementation((queryOrId: string | FindOneOptions<SalesChannel>): any => {
        return Promise.resolve({
          id:
            typeof queryOrId === "string"
              ? queryOrId
              : ((queryOrId?.where as FindConditions<SalesChannel>)?.id ?? IdMap.getId("sc_adjhlukiaeswhfae")),
          ...salesChannelData
        })
      }),
    })

    const salesChannelService = new SalesChannelService({
      manager: MockManager,
      eventBusService: EventBusServiceMock as unknown as EventBusService,
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
      expect(salesChannel).toEqual({
        id:  IdMap.getId("sales_channel_1"),
        ...salesChannelData
      })

      expect(salesChannelRepositoryMock.findOne)
        .toHaveBeenCalledTimes(1)
      expect(salesChannelRepositoryMock.findOne)
        .toHaveBeenLastCalledWith(
          { where: { id: IdMap.getId("sales_channel_1") } },
       )
    })
  })
})
