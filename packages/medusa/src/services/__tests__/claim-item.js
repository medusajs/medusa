import _ from "lodash"
import { IdMap, MockRepository, MockManager } from "medusa-test-utils"
import ClaimItemService from "../claim-item"

const withTransactionMock = jest.fn()
const eventBusService = {
  emit: jest.fn(),
  withTransaction: function () {
    withTransactionMock("eventBus")
    return this
  },
}

describe("ClaimItemService", () => {
  describe("create", () => {
    const testItem = {
      claim_order_id: "claim_13",
      item_id: "itm_1",
      tags: ["fluff"],
      reason: "production_failure",
      note: "Details",
      quantity: 1,
      images: ["url.com/1234"],
    }

    const claimTagRepo = MockRepository({
      findOne: () => Promise.resolve(),
      create: (d) => d,
    })

    const claimImgRepo = MockRepository({
      findOne: () => Promise.resolve(),
      create: (d) => d,
    })

    const claimItemRepo = MockRepository({
      create: (d) => ({ id: "ci_1234", ...d }),
    })

    const lineItemService = {
      withTransaction: function () {
        withTransactionMock("lineItem")
        return this
      },
    }

    const claimItemService = new ClaimItemService({
      manager: MockManager,
      lineItemService,
      claimTagRepository: claimTagRepo,
      claimItemRepository: claimItemRepo,
      claimImageRepository: claimImgRepo,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully creates a claim item", async () => {
      lineItemService.retrieve = jest.fn(() =>
        Promise.resolve({
          variant_id: "var_1",
          fulfilled_quantity: 1,
        })
      )
      await claimItemService.create(testItem)

      expect(withTransactionMock).toHaveBeenCalledWith("lineItem")
      expect(lineItemService.retrieve).toHaveBeenCalledTimes(1)

      expect(claimTagRepo.findOne).toHaveBeenCalledTimes(1)
      expect(claimTagRepo.findOne).toHaveBeenCalledWith({
        where: { value: "fluff" },
      })

      expect(claimTagRepo.create).toHaveBeenCalledTimes(1)
      expect(claimTagRepo.create).toHaveBeenCalledWith({
        value: "fluff",
      })

      expect(claimItemRepo.create).toHaveBeenCalledTimes(1)
      expect(claimItemRepo.create).toHaveBeenCalledWith({
        claim_order_id: "claim_13",
        item_id: "itm_1",
        variant_id: "var_1",
        reason: "production_failure",
        note: "Details",
        quantity: 1,
        tags: [{ value: "fluff" }],
        images: [{ url: "url.com/1234" }],
      })
    })

    it("normalizes claim tag value", async () => {
      lineItemService.retrieve = jest.fn(() =>
        Promise.resolve({
          variant_id: "var_1",
          fulfilled_quantity: 1,
        })
      )
      await claimItemService.create({
        ...testItem,
        tags: ["  FLUFF "],
      })
      expect(claimTagRepo.findOne).toHaveBeenCalledTimes(1)
      expect(claimTagRepo.findOne).toHaveBeenCalledWith({
        where: { value: "fluff" },
      })
    })

    it("fails if fulfilled_quantity < quantity", async () => {
      lineItemService.retrieve = jest.fn(() =>
        Promise.resolve({
          variant_id: "var_1",
          fulfilled_quantity: 0,
        })
      )
      await expect(claimItemService.create(testItem)).rejects.toThrow(
        "Cannot claim more of an item than has been fulfilled"
      )
    })

    it("fails if reason is unknown", async () => {
      lineItemService.retrieve = jest.fn(() =>
        Promise.resolve({ fulfilled_quantity: 1 })
      )
      await expect(
        claimItemService.create({
          ...testItem,
          reason: "unknown",
        })
      ).rejects.toThrow(
        `Claim Item reason must be one of "missing_item", "wrong_item", "production_failure" or "other".`
      )
    })
  })
})
