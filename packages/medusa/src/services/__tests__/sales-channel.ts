import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import SalesChannelService from "../sales-channel"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import { EventBusService } from "../index"
import { FindConditions, FindOneOptions } from "typeorm"
import { SalesChannel } from "../../models"

describe("SalesChannelService", () => {
  const salesChannelData = {
    name: "sales channel 1 name",
    description: "sales channel 1 description",
    is_disabled: false,
  }

  const salesChannelRepositoryMock = MockRepository({
    findOne: jest
      .fn()
      .mockImplementation(
        (queryOrId: string | FindOneOptions<SalesChannel>): any => {
          return Promise.resolve({
            id:
              typeof queryOrId === "string"
                ? queryOrId
                : (queryOrId?.where as FindConditions<SalesChannel>)?.id ??
                  IdMap.getId("sc_adjhlukiaeswhfae"),
            ...salesChannelData,
          })
        }
      ),
    save: (salesChannel) => Promise.resolve(salesChannel),
  })

  describe("retrieve", () => {
    const salesChannelService = new SalesChannelService({
      manager: MockManager,
      eventBusService: EventBusServiceMock as unknown as EventBusService,
      salesChannelRepository: salesChannelRepositoryMock,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should retrieve a sales channel", async () => {
      const salesChannel = await salesChannelService.retrieve(
        IdMap.getId("sales_channel_1")
      )

      expect(salesChannel).toBeTruthy()
      expect(salesChannel).toEqual({
        id: IdMap.getId("sales_channel_1"),
        ...salesChannelData,
      })

      expect(salesChannelRepositoryMock.findOne).toHaveBeenCalledTimes(1)
      expect(salesChannelRepositoryMock.findOne).toHaveBeenLastCalledWith({
        where: { id: IdMap.getId("sales_channel_1") },
      })
    })
  })

  describe("update", () => {
    const salesChannelService = new SalesChannelService({
      manager: MockManager,
      eventBusService: EventBusServiceMock as unknown as EventBusService,
      salesChannelRepository: salesChannelRepositoryMock,
    })

    const update = {
      name: "updated name",
      description: "updated description",
      is_disabled: true,
    }

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls save with the updated sales channel", async () => {
      await salesChannelService.update(IdMap.getId("sc"), update)
      expect(salesChannelRepositoryMock.save).toHaveBeenCalledWith({
        id: IdMap.getId("sc"),
        ...update,
      })
    })

    it("returns the saved sales channel", async () => {
      const res = await salesChannelService.update(IdMap.getId("sc"), update)
      expect(res).toEqual({
        id: IdMap.getId("sc"),
        ...update,
      })
    })
  })
})
