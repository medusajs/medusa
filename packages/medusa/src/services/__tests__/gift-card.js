import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import idMap from "medusa-test-utils/dist/id-map"
import mockRepository from "medusa-test-utils/dist/mock-repository"

import GiftCardService from "../gift-card"

describe("GiftCardService", () => {
  const eventBusService = {
    emit: jest.fn(),
    withTransaction: function() {
      return this
    },
  }

  describe("create", () => {
    const giftCardRepo = mockRepository({
      create: s => {
        return Promise.resolve(s)
      },
      save: s => {
        return Promise.resolve(s)
      },
    })

    const regionService = {
      withTransaction: function() {
        return this
      },
      retrieve: () => {
        return Promise.resolve({
          id: IdMap.getId("region-id"),
        })
      },
    }

    const giftCardService = new GiftCardService({
      manager: MockManager,
      giftCardRepository: giftCardRepo,
      regionService: regionService,
      eventBusService: eventBusService,
    })

    const giftCard = {
      region_id: IdMap.getId("region-id"),
      order_id: "order-id",
      is_disabled: true,
    }

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("correctly creates a giftcard", async () => {
      await giftCardService.create(giftCard)

      expect(giftCardRepo.create).toHaveBeenCalledTimes(1)
      expect(giftCardRepo.create).toHaveBeenCalledWith({
        region_id: IdMap.getId("region-id"),
        order_id: "order-id",
        is_disabled: true,
        code: expect.any(String),
      })
    })

    it("fails to create giftcard if no region is provided", async () => {
      const card = {
        ...giftCard,
      }

      card.region_id = undefined

      await expect(giftCardService.create(card)).rejects.toThrow(
        "Gift card is missing region_id"
      )
    })
  })

  describe("retrieve", () => {
    const giftCardRepo = {
      findOne: () => {
        return Promise.resolve({})
      },
    }

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("it calls order model functions", async () => {})
  })

  describe("retrieveByCode", () => {
    it("test1", async () => {
      fail("impl")
    })
  })

  describe("update", () => {
    it("test1", async () => {
      fail("impl")
    })
  })

  describe("delete", () => {
    it("test1", async () => {
      fail("impl")
    })
  })
})
