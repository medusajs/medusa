import { IdMap, MockManager, MockRepository } from "medusa-test-utils"

import GiftCardService from "../gift-card"

describe("GiftCardService", () => {
  const eventBusService = {
    emit: jest.fn(),
    withTransaction: function () {
      return this
    },
  }

  describe("create", () => {
    const giftCardRepo = MockRepository({
      create: (s) => {
        return Promise.resolve(s)
      },
      save: (s) => {
        return Promise.resolve(s)
      },
    })

    const regionService = {
      withTransaction: function () {
        return this
      },
      retrieve: () => {
        return Promise.resolve({
          id: IdMap.getId("region-id"),
          tax_rate: 19,
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
        tax_rate: null
      })
    })
  })

  describe("retrieve", () => {
    const giftCardRepo = MockRepository({
      findOneWithRelations: () => {
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

      expect(giftCardRepo.findOneWithRelations).toHaveBeenCalledTimes(1)
      expect(giftCardRepo.findOneWithRelations).toHaveBeenCalledWith(
        ["region"],
        {
          where: {
            id: IdMap.getId("gift-card"),
          },
          select: ["id"],
        }
      )
    })
  })

  describe("retrieveByCode", () => {
    const giftCardRepo = MockRepository({
      findOneWithRelations: () => {
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

      expect(giftCardRepo.findOneWithRelations).toHaveBeenCalledTimes(1)
      expect(giftCardRepo.findOneWithRelations).toHaveBeenCalledWith(
        ["region"],
        {
          where: {
            code: "1234-1234-1234-1234",
          },
          select: ["id"],
        }
      )
    })
  })

  describe("update", () => {
    const giftCard = {
      region_id: IdMap.getId("region-id"),
      order_id: IdMap.getId("order-id"),
      is_disabled: true,
      value: 5000,
    }

    const giftCardRepo = MockRepository({
      findOneWithRelations: (s) => {
        return Promise.resolve(giftCard)
      },
      save: (s) => {
        return Promise.resolve(s)
      },
    })

    const regionService = {
      withTransaction: function () {
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
        value: 5000,
      })
    })

    it.each([[-100], [6000]])(
      "fails to update balance with illegal input '%s'",
      async (input) => {
        await expect(
          giftCardService.update(IdMap.getId("giftcard-id"), {
            balance: input,
          })
        ).rejects.toThrow("new balance is invalid")
      }
    )
  })

  describe("delete", () => {
    const giftCard = {
      region_id: IdMap.getId("region-id"),
      order_id: IdMap.getId("order-id"),
    }

    const giftCardRepo = MockRepository({
      findOne: (s) => {
        switch (s.where.id) {
          case IdMap.getId("gift-card"):
            return Promise.resolve(giftCard)
          default:
            return Promise.resolve()
        }
      },
      softRemove: (s) => {
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
