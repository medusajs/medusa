import { createMedusaContainer } from "@medusajs/utils"
import { asValue } from "awilix"
import ContainerLoader from "../../loaders/container"
import { salesChannelRepositoryMock } from "../__fixtures__/sales-channel"

describe("Sales channel service", function () {
  let container

  beforeEach(async function () {
    jest.clearAllMocks()

    container = createMedusaContainer()
    container.register("manager", asValue({}))

    await ContainerLoader({ container })

    container.register(salesChannelRepositoryMock)
  })

  it("should list sales channels with filters and relations", async function () {
    const salesChannelRepository = container.resolve("salesChannelRepository")
    const salesChannelService = container.resolve("salesChannelService")

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
          orderBy: {
            id: "ASC",
          },
          withDeleted: undefined,
          populate: [],
        },
      },
      expect.any(Object)
    )
  })
})
