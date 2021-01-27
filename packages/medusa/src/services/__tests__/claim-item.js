import _ from "lodash"
import { IdMap, MockRepository, MockManager } from "medusa-test-utils"
import ClaimItemService from "../claim-item"

const withTransactionMock = jest.fn()
const eventBusService = {
  emit: jest.fn(),
  withTransaction: function() {
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
      findOne: () => Promise.resolve()
    })

    const claimItemRepo = MockRepository({
      create: d => ({ id: "ci_1234", ...d }),
    })

    const lineItemService = {
      retrieve: jest.fn(() => Promise.resolve({fulfilled_quantity: 1})),
      withTransaction: function() {
        withTransactionMock("lineItem")
        return this
      },
    }

    const claimItemService = new ClaimItemService({
      manager: MockManager,
      lineItemService,
      claimTagRepository: claimTagRepo,
      claimItemRepository: claimItemRepo,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully creates a claim item", async () => {
      await claimItemService.create(testItem)

      expect(withTransactionMock).toHaveBeenCalledWith("lineItem")
      expect(lineItemService.retrieve).toHaveBeenCalledTimes(1)

      expect(claimRepoItem.create).toHaveBeenCalledTimes(1)
      expect(claimRepoItem.create).toHaveBeenCalledWith({
      })

      expect(claimRepo.save).toHaveBeenCalledTimes(1)

      expect(withTransactionMock).toHaveBeenCalledWith("eventBus")
      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledTimes("claim.created", {
        id: "claim_1234",
      })
    })

    it("return only created when return shipping provided", async () => {
      await claimService.create({
        ...testClaim,
        return_shipping: null,
      })
      expect(returnService.create).toHaveBeenCalledTimes(0)
    })

    it("fails if replace and no additional items", async () => {
      await expect(
        claimService.create({
          ...testClaim,
          type: "replace",
          additional_items: null,
        })
      ).rejects.toThrow("A replace claim must have at least 1 additional item")
    })

    it("fails if type is unknown", async () => {
      await expect(
        claimService.create({
          ...testClaim,
          type: "unknown",
        })
      ).rejects.toThrow(`Claim type must be "refund" or "replace"`)
    })

    it("fails if no claim items", async () => {
      await expect(
        claimService.create({
          ...testClaim,
          claim_items: [],
        })
      ).rejects.toThrow(`Claim must have claim items`)
    })
  })

  describe("retrieve", () => {
    const claimRepo = MockRepository()
    const claimService = new ClaimService({
      manager: MockManager,
      claimRepository: claimRepo,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully creates a claim", async () => {
      await claimService.retrieve("claim_id", {
        relations: ["order"],
      })

      expect(claimRepo.findOne).toHaveBeenCalledWith({
        where: { id: "claim_id" },
        relations: ["order"],
      })
    })
  })

  describe("createFulfillment", () => {
    const fulfillmentService = {
      createFulfillment: jest.fn(),
      withTransaction: function() {
        withTransactionMock("fulfillment")
        return this
      },
    }

    const claim = {
      type: "replace",
      order: {
        email: "hi@123",
        discounts: [
          {
            id: "disc_1234",
          },
        ],
        payments: [{ id: "pay_test" }],
        currency_code: "dkk",
        tax_rate: 25,
        region_id: "test_region",
        display_id: 112345,
        billing_address: { first_name: "hi" },
      },
      additional_items: [{ id: "item_test", quantity: 1 }],
      shipping_methods: [{ id: "method_test" }],
    }

    const claimRepo = MockRepository({
      findOne: () => Promise.resolve(claim),
    })

    const lineItemService = {
      update: jest.fn(),
      withTransaction: function() {
        withTransactionMock("lineItem")
        return this
      },
    }

    const claimService = new ClaimService({
      manager: MockManager,
      claimRepository: claimRepo,
      fulfillmentService,
      lineItemService,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully creates fulfillment", async () => {
      await claimService.createFulfillment("claim_id", { meta: "data" })

      expect(withTransactionMock).toHaveBeenCalledTimes(2)

      expect(withTransactionMock).toHaveBeenCalledWith("fulfillment")
      expect(fulfillmentService.createFulfillment).toHaveBeenCalledTimes(1)
      expect(fulfillmentService.createFulfillment).toHaveBeenCalledWith(
        {
          ...claim,
          payments: order.payments,
          email: order.email,
          discounts: order.discounts,
          currency_code: order.currency_code,
          tax_rate: order.tax_rate,
          region_id: order.region_id,
          display_id: order.display_id,
          billing_address: order.billing_address,
          items: swap.additional_items,
          shipping_methods: swap.shipping_methods,
          is_claim: true,
        },
        [
          {
            item_id: "item_test",
            quantity: 1,
          },
        ],
        { claim_id: "claim_id", metadata: { meta: "data" } }
      )

      expect(withTransactionMock).toHaveBeenCalledWith("lineItem")
      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith("item_test", {
        fulfilled_quantity: 1,
      })
    })

    it("fails if type is refund", async () => {
      claimRepo.setFindOne(() => Promise.resolve({ ...claim, type: "refund" }))

      await expect(
        claimService.createFulfillment("claim_id", { meta: "data" })
      ).rejects.toThrow(`Claims with type "refund" can not be fulfilled`)
    })
  })

  describe("createShipment", () => {
    const fulfillmentService = {
      createShipment: jest.fn(() => {
        return Promise.resolve({
          items: [
            {
              item_id: "item_1",
              quantity: 1,
            },
          ],
        })
      }),
      withTransaction: function() {
        withTransactionMock("fulfillment")
        return this
      },
    }

    const lineItemService = {
      update: jest.fn(),
      withTransaction: function() {
        withTransactionMock("lineItem")
        return this
      },
    }

    const claimRepo = MockRepository()

    const claimService = new ClaimService({
      manager: MockManager,
      claimRepository: claimRepo,
      fulfillmentService,
      lineItemService,
    })

    it("calls fulfillment service", async () => {
      claimRepo.setFindOne(() =>
        Promise.resolve({
          additional_items: [
            {
              id: "item_1",
              shippied_quantity: 1,
            },
          ],
        })
      )

      await claimService.createShipment("claim", "ful_123", ["track1234"], {
        meta: "data",
      })

      expect(withTransactionMock).toHaveBeenCalledTimes(2)
      expect(withTransactionMock).toHaveBeenCalledWith("fulfillment")
      expect(withTransactionMock).toHaveBeenCalledWith("lineItem")

      expect(fulfillmentService.createShipment).toHaveBeenCalledTimes(1)
      expect(fulfillmentService.createShipment).toHaveBeenCalledWith(
        "ful_123",
        ["track1234"],
        { meta: "data" }
      )

      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith("item_1", {
        shipped_quantity: 1,
      })
    })
  })

  describe("cancel", () => {
    const fulfillmentService = {
      cancel: jest.fn(),
      withTransaction: function() {
        withTransactionMock("fulfillment")
        return this
      },
    }

    const returnService = {
      cancel: jest.fn(),
      withTransaction: function() {
        withTransactionMock("return")
        return this
      },
    }

    const claimRepo = MockRepository()

    const claimService = new ClaimService({
      manager: MockManager,
      claimRepository: claimRepo,
      fulfillmentService,
      lineItemService,
    })

    it("calls fulfillment service", async () => {
      claimRepo.setFindOne(() =>
        Promise.resolve({
          return_order: {
            id: "ret",
            status: "requested",
          },
          fulfillments: [
            {
              id: "ful_21",
            },
          ],
        })
      )

      await claimService.cancel("claim")

      expect(withTransactionMock).toHaveBeenCalledTimes(2)
      expect(withTransactionMock).toHaveBeenCalledWith("fulfillment")
      expect(withTransactionMock).toHaveBeenCalledWith("return")

      expect(fulfillmentService.cancelFulfillment).toHaveBeenCalledTimes(1)
      expect(fulfillmentService.cancelFulfillment).toHaveBeenCalledWith(
        "ful_21"
      )

      expect(returnService.cancel).toHaveBeenCalledTimes(1)
      expect(returnService.cancel).toHaveBeenCalledWith("ret")
    })

    it("fails if fulfillment is shipped", async () => {
      claimRepo.setFindOne(() =>
        Promise.resolve({
          fulfillment_status: "shipped",
        })
      )

      await expect(claimService.cancel).rejects.toThrow(
        "Cannot cancel a received return"
      )
    })

    it("fails if return is received", async () => {
      claimRepo.setFindOne(() =>
        Promise.resolve({
          return_order: {
            id: "ret",
            status: "received",
          },
        })
      )

      await expect(claimService.cancel).rejects.toThrow(
        "Cannot cancel a received return"
      )
    })
  })
})
