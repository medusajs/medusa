import { mockContainer } from "../__fixtures__/sales-channel"

describe("Sales channel service", function () {
  beforeEach(function () {
    jest.clearAllMocks()
  })

  it("should list sales channels with filters and relations", async function () {
    const salesChannelRepository = mockContainer.resolve(
      "salesChannelRepository"
    )
    const salesChannelService = mockContainer.resolve("salesChannelService")

    const config = {
      select: ["id", "name"],
    }

    await salesChannelService.list({}, config)

    expect(salesChannelRepository.find).toHaveBeenCalledWith(
      {
        where: {},
        options: {
          fields: ["id", "name"],
          limit: 15,
          offset: 0,
          withDeleted: undefined,
          populate: [],
        },
      },
      expect.any(Object)
    )
  })
})
