import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
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
    const giftCardRepo = MockRepository({
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
      order_id: IdMap.getId("order-id"),
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
        order_id: IdMap.getId("order-id"),
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
    const giftCardRepo = MockRepository({
      findOne: () => {
        return Promise.resolve({})
      },
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    const giftCardService = new GiftCardService({
      manager: MockManager,
      giftCardRepository: giftCardRepo,
    })

    it("it calls order model functions", async () => {
      await giftCardService.retrieve(IdMap.getId("gift-card"), {
        relations: ["region"],
        select: ["id"],
      })

      expect(giftCardRepo.findOne).toHaveBeenCalledTimes(1)
      expect(giftCardRepo.findOne).toHaveBeenCalledWith({
        where: {
          id: IdMap.getId("gift-card"),
        },
        relations: ["region"],
        select: ["id"],
      })
    })
  })

  describe("retrieveByCode", () => {
    const giftCardRepo = MockRepository({
      findOne: () => {
        return Promise.resolve({})
      },
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    const giftCardService = new GiftCardService({
      manager: MockManager,
      giftCardRepository: giftCardRepo,
    })

    it("it calls order model functions", async () => {
      await giftCardService.retrieveByCode("1234-1234-1234-1234", {
        relations: ["region"],
        select: ["id"],
      })

      expect(giftCardRepo.findOne).toHaveBeenCalledTimes(1)
      expect(giftCardRepo.findOne).toHaveBeenCalledWith({
        where: {
          code: "1234-1234-1234-1234",
        },
        relations: ["region"],
        select: ["id"],
      })
    })
  })

  describe("update", () => {
    const giftCard = {
      region_id: IdMap.getId("region-id"),
      order_id: IdMap.getId("order-id"),
      is_disabled: true,
    }

    const giftCardRepo = MockRepository({
      findOne: s => {
        return Promise.resolve(giftCard)
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
          id: IdMap.getId("other-region"),
        })
      },
    }

    const giftCardService = new GiftCardService({
      manager: MockManager,
      giftCardRepository: giftCardRepo,
      regionService: regionService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("calls order model functions", async () => {
      await giftCardService.update(IdMap.getId("giftcard-id"), {
        is_disabled: false,
        region_id: IdMap.getId("other-region"),
      })

      expect(giftCardRepo.save).toHaveBeenCalledTimes(1)
      expect(giftCardRepo.save).toHaveBeenCalledWith({
        region_id: IdMap.getId("other-region"),
        order_id: IdMap.getId("order-id"),
        is_disabled: false,
      })
    })
  })

  describe("delete", () => {
    const giftCard = {
      region_id: IdMap.getId("region-id"),
      order_id: IdMap.getId("order-id"),
    }

    const giftCardRepo = MockRepository({
      findOne: s => {
        switch (s.where.id) {
          case IdMap.getId("gift-card"):
            return Promise.resolve(giftCard)
          default:
            return Promise.resolve()
        }
      },
      softRemove: s => {
        return Promise.resolve()
      },
    })

    const giftCardService = new GiftCardService({
      manager: MockManager,
      giftCardRepository: giftCardRepo,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully deletes existing gift-card", async () => {
      await giftCardService.delete(IdMap.getId("gift-card"))

      expect(giftCardRepo.softRemove).toHaveBeenCalledTimes(1)
      expect(giftCardRepo.softRemove).toHaveBeenCalledWith({
        region_id: IdMap.getId("region-id"),
        order_id: IdMap.getId("order-id"),
      })
    })

    it("returns if no gift-card found", async () => {
      await giftCardService.delete(IdMap.getId("other"))

      expect(giftCardRepo.softRemove).toHaveBeenCalledTimes(0)
    })
  })
})
