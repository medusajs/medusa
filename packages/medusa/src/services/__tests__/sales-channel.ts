import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import SalesChannelService from "../sales-channel"
import { EventBusServiceMock } from "../__mocks__/event-bus"
import { EventBusService, ProductService, StoreService } from "../index"
import { FindConditions, FindOneOptions } from "typeorm"
import { SalesChannel } from "../../models"
import { ProductServiceMock } from "../__mocks__/product";
import { store, StoreServiceMock } from "../__mocks__/store";

describe("SalesChannelService", () => {
  const salesChannelData = {
    name: "sales channel 1 name",
    description: "sales channel 1 description",
    is_disabled: false,
  }

  const salesChannelRepositoryMock = {
    ...MockRepository({
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
      findAndCount: jest.fn().mockImplementation(() =>
        Promise.resolve([
          {
            id: IdMap.getId("sales_channel_1"),
            ...salesChannelData
          },
        ]),
      ),
      create: jest.fn().mockImplementation((data) => data),
      save: (salesChannel) => Promise.resolve({
        id: IdMap.getId("sales_channel_1"),
        ...salesChannel
      }),
      softRemove: jest.fn().mockImplementation((id: string): any => {
          return Promise.resolve()
      }),
    }),
    getFreeTextSearchResultsAndCount: jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: IdMap.getId("sales_channel_1"),
          ...salesChannelData
        },
      ])
    ),
    removeProducts: jest.fn().mockImplementation((id: string, productIds: string[]): any => {
      Promise.resolve([
        {
          id: IdMap.getId("sales_channel_1"),
          ...salesChannelData
        },
      ])
    }),
    addProducts: jest.fn().mockImplementation((id: string, productIds: string[]): any => {
      return Promise.resolve()
    }),
  }

  describe("create default", async () => {
    const salesChannelService = new SalesChannelService({
      manager: MockManager,
      eventBusService: EventBusServiceMock as unknown as EventBusService,
      salesChannelRepository: salesChannelRepositoryMock,
      storeService: StoreServiceMock as unknown as StoreService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should call the save method if the store does not have a default sales channel", async () => {
      await salesChannelService.createDefault()

      expect(salesChannelRepositoryMock.save).toHaveBeenCalledTimes(1)
      expect(salesChannelRepositoryMock.save).toHaveBeenCalledWith({
        description: "Created by Medusa",
        name: "Default Sales Channel",
        is_disabled: false,
      })
    })

    it("should return the default sales channel if it already exists", async () => {
      const localSalesChannelService = new SalesChannelService({
        manager: MockManager,
        eventBusService: EventBusServiceMock as unknown as EventBusService,
        salesChannelRepository: salesChannelRepositoryMock,
        storeService: {
          ...StoreServiceMock,
          retrieve: jest.fn().mockImplementation(() => {
            return Promise.resolve({
              ...store,
              default_sales_channel_id: IdMap.getId("sales_channel_1"),
              default_sales_channel: {
                id: IdMap.getId("sales_channel_1"),
                ...salesChannelData,
              },
            })
          }),
        } as any,
      })

      const salesChannel = await localSalesChannelService.createDefault()

      expect(salesChannelRepositoryMock.save).toHaveBeenCalledTimes(0)
      expect(salesChannelRepositoryMock.save).not.toHaveBeenCalledTimes(1)
      expect(salesChannel).toEqual({
        id: IdMap.getId("sales_channel_1"),
        ...salesChannelData,
      })
    })
  })

  describe("retrieve", () => {
    const salesChannelService = new SalesChannelService({
      manager: MockManager,
      eventBusService: EventBusServiceMock as unknown as EventBusService,
      salesChannelRepository: salesChannelRepositoryMock,
      storeService: StoreServiceMock as unknown as StoreService,
    })

    beforeEach(() => {
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
      storeService: StoreServiceMock as unknown as StoreService,
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

  describe("list", () => {
    const salesChannelService = new SalesChannelService({
      manager: MockManager,
      eventBusService: EventBusServiceMock as unknown as EventBusService,
      salesChannelRepository: salesChannelRepositoryMock,
      storeService: StoreServiceMock as unknown as StoreService,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("should retrieve a sales channel using free text search", async () => {
      const q = "free search text"

      const salesChannel = await salesChannelService.listAndCount({ q })

      expect(salesChannel).toBeTruthy()
      expect(salesChannel).toEqual(
        expect.arrayContaining([{
          id: IdMap.getId("sales_channel_1"),
          ...salesChannelData,
        }])
      )

      expect(salesChannelRepositoryMock.findAndCount).toHaveBeenCalledTimes(0)
      expect(salesChannelRepositoryMock.getFreeTextSearchResultsAndCount).toHaveBeenCalledTimes(1)
      expect(salesChannelRepositoryMock.getFreeTextSearchResultsAndCount).toHaveBeenLastCalledWith(
        q,
        {
          skip: 0,
          take: 20,
          where: {},
        }
      )
    })

    it("should retrieve a sales channel using find and count", async () => {
      const salesChannel = await salesChannelService.listAndCount({
        id: IdMap.getId("sales_channel_1")
      })

      expect(salesChannel).toBeTruthy()
      expect(salesChannel).toEqual(
        expect.arrayContaining([{
          id: IdMap.getId("sales_channel_1"),
          ...salesChannelData,
        }])
      )

      expect(salesChannelRepositoryMock.getFreeTextSearchResultsAndCount).toHaveBeenCalledTimes(0)
      expect(salesChannelRepositoryMock.findAndCount).toHaveBeenCalledTimes(1)
      expect(salesChannelRepositoryMock.findAndCount).toHaveBeenLastCalledWith(
        {
          skip: 0,
          take: 20,
          where: {
            id: IdMap.getId("sales_channel_1"),
          },
        }
      )
    })
  })

  describe("delete", () => {
    const salesChannelService = new SalesChannelService({
      manager: MockManager,
      eventBusService: EventBusServiceMock as unknown as EventBusService,
      salesChannelRepository: salesChannelRepositoryMock,
      storeService: {
        ...StoreServiceMock,
        retrieve: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            ...store,
            default_sales_channel_id: "default_channel",
            default_sales_channel: {
              id: "default_channel",
              ...salesChannelData,
            },
          })
        }),
      } as any,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should soft remove a sales channel", async () => {
      const res = await salesChannelService.delete(
        IdMap.getId("sales_channel_1")
      )

      expect(res).toBeUndefined()

      expect(salesChannelRepositoryMock.softRemove).toHaveBeenCalledTimes(1)
      expect(salesChannelRepositoryMock.softRemove).toHaveBeenLastCalledWith({
        id: IdMap.getId("sales_channel_1"),
        ...salesChannelData,
      })

      expect(EventBusServiceMock.emit).toHaveBeenCalledTimes(1)
      expect(EventBusServiceMock.emit).toHaveBeenLastCalledWith(
        SalesChannelService.Events.DELETED,
        { id: IdMap.getId("sales_channel_1") }
      )
    })

    it("should fail if delete of the default channel is attempted", async () => {
      try {
        await salesChannelService.delete("default_channel")
      } catch (error) {
        expect(error.message).toEqual(
          "You cannot delete the default sales channel"
        )
      }
    })
  })

  describe("Remove products", () => {
    const salesChannelService = new SalesChannelService({
      manager: MockManager,
      eventBusService: EventBusServiceMock as unknown as EventBusService,
      salesChannelRepository: salesChannelRepositoryMock,
      storeService: StoreServiceMock as unknown as StoreService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should remove a list of product to a sales channel', async () => {
      const salesChannel = await salesChannelService.removeProducts(
        IdMap.getId("sales_channel_1"),
        [IdMap.getId("sales_channel_1_product_1")]
      )

      expect(salesChannelRepositoryMock.removeProducts).toHaveBeenCalledTimes(1)
      expect(salesChannelRepositoryMock.removeProducts).toHaveBeenCalledWith(
        IdMap.getId("sales_channel_1"),
        [IdMap.getId("sales_channel_1_product_1")]
      )
      expect(salesChannel).toBeTruthy()
      expect(salesChannel).toEqual({
        id: IdMap.getId("sales_channel_1"),
        ...salesChannelData,
      })
    })
  })

  describe("Add products", () => {
    const salesChannelService = new SalesChannelService({
      manager: MockManager,
      eventBusService: EventBusServiceMock as unknown as EventBusService,
      salesChannelRepository: salesChannelRepositoryMock,
      storeService: StoreServiceMock as unknown as StoreService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should add a list of product to a sales channel', async () => {
      const salesChannel = await salesChannelService.addProducts(
        IdMap.getId("sales_channel_1"),
        [IdMap.getId("sales_channel_1_product_1")]
      )

      expect(salesChannelRepositoryMock.addProducts).toHaveBeenCalledTimes(1)
      expect(salesChannelRepositoryMock.addProducts).toHaveBeenCalledWith(
        IdMap.getId("sales_channel_1"),
        [IdMap.getId("sales_channel_1_product_1")]
      )
      expect(salesChannel).toBeTruthy()
      expect(salesChannel).toEqual({
        id: IdMap.getId("sales_channel_1"),
        ...salesChannelData,
      })
    })
  })
})
