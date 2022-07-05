import { MockManager, MockRepository, IdMap } from "medusa-test-utils"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import SalesChannelService from "../sales-channel"

describe("SalesChannelService", () => {
  describe("update", () => {
    const salesChannelRepository = MockRepository({
      findOne: (id) => {
        return Promise.resolve({
          id,
          name: "some sc",
          description: "just an sc",
          is_disabled: false,
        })
      },
      save: (salesChannel) => Promise.resolve(salesChannel),
    })

    const salesChannelService = new SalesChannelService({
      manager: MockManager,
      eventBusService: EventBusServiceMock,
      salesChannelRepository: salesChannelRepository,
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
      expect(salesChannelRepository.save).toHaveBeenCalledWith({
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
