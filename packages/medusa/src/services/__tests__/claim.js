import _ from "lodash"
import { IdMap, MockRepository, MockManager } from "medusa-test-utils"
import ClaimService from "../claim"

const withTransactionMock = jest.fn()
const eventBusService = {
  emit: jest.fn(),
  withTransaction: function() {
    withTransactionMock("eventBus")
    return this
  },
}

const totalsService = {
  getRefundTotal: jest.fn(() => 1000),
}

describe("ClaimService", () => {
  describe("create", () => {
    const testClaim = {
      type: "refund",
      order: {
        id: "1234",
        region_id: "order_region",
        no_notification: true,
        items: [
          {
            id: "itm_1",
            unit_price: 8000,
          },
        ],
      },
      claim_items: [
        {
          item_id: "itm_1",
          tags: ["fluff"],
          reason: "production_failure",
          note: "Details",
          quantity: 1,
          images: ["url.com/1234"],
        },
      ],
      return_shipping: {
        option_id: "opt_13",
        price: 0,
      },
      additional_items: [
        {
          variant_id: "var_123",
          quantity: 1,
        },
      ],
      shipping_address_id: "adr_1234",
    }

    const claimRepo = MockRepository({
      create: d => ({ id: "claim_134", ...d }),
    })

    const returnService = {
      create: jest.fn(),
      withTransaction: function() {
        withTransactionMock("return")
        return this
      },
    }

    const lineItemService = {
      generate: jest.fn((d, _, q) => ({ variant_id: d, quantity: q })),
      withTransaction: function() {
        withTransactionMock("lineItem")
        return this
      },
    }

    const claimItemService = {
      create: jest.fn(),
      withTransaction: function() {
        withTransactionMock("claimItem")
        return this
      },
    }

    const claimService = new ClaimService({
      manager: MockManager,
      claimRepository: claimRepo,
      totalsService,
      returnService,
      lineItemService,
      claimItemService,
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("successfully creates a claim", async () => {
      await claimService.create(testClaim)

      expect(withTransactionMock).toHaveBeenCalledWith("return")

      expect(returnService.create).toHaveBeenCalledTimes(1)
      expect(returnService.create).toHaveBeenCalledWith({
        order_id: "1234",
        claim_order_id: "claim_134",
        shipping_method: {
          option_id: "opt_13",
          price: 0,
        },
        items: [
          {
            item_id: "itm_1",
            quantity: 1,
          },
        ],
        no_notification: true,
      })

      expect(withTransactionMock).toHaveBeenCalledWith("lineItem")
      expect(lineItemService.generate).toHaveBeenCalledTimes(1)
      expect(lineItemService.generate).toHaveBeenCalledWith(
        "var_123",
        "order_region",
        1
      )

      expect(withTransactionMock).toHaveBeenCalledWith("claimItem")
      expect(claimItemService.create).toHaveBeenCalledTimes(1)
      expect(claimItemService.create).toHaveBeenCalledWith({
        claim_order_id: "claim_134",
        item_id: "itm_1",
        tags: ["fluff"],
        reason: "production_failure",
        note: "Details",
        quantity: 1,
        images: ["url.com/1234"],
      })

      expect(claimRepo.create).toHaveBeenCalledTimes(1)
      expect(claimRepo.create).toHaveBeenCalledWith({
        payment_status: "not_refunded",
        no_notification: true,
        refund_amount: 1000,
        type: "refund",
        order_id: "1234",
        additional_items: [
          {
            variant_id: "var_123",
            quantity: 1,
          },
        ],
        shipping_address_id: "adr_1234",
      })

      expect(claimRepo.save).toHaveBeenCalledTimes(1)

      expect(withTransactionMock).toHaveBeenCalledWith("eventBus")
      expect(eventBusService.emit).toHaveBeenCalledTimes(1)
      expect(eventBusService.emit).toHaveBeenCalledWith("claim.created", {
        id: "claim_134",
        no_notification: true,
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
      ).rejects.toThrow(
        `Claims with type "replace" must have at least one additional item.`
      )
    })

    it("fails if replace and refund amount", async () => {
      await expect(
        claimService.create({
          ...testClaim,
          type: "replace",
          refund_amount: 102,
        })
      ).rejects.toThrow(
        `Claim has type "replace" but must be type "refund" to have a refund_amount.`
      )
    })

    it("fails if type is unknown", async () => {
      await expect(
        claimService.create({
          ...testClaim,
          type: "unknown",
        })
      ).rejects.toThrow(`Claim type must be one of "refund" or "replace".`)
    })

    it("fails if no claim items", async () => {
      await expect(
        claimService.create({
          ...testClaim,
          claim_items: [],
        })
      ).rejects.toThrow(`Claims must have at least one claim item.`)
    })

    it.each(
      [
        [false, false],
        [undefined, true],
      ],
      "passes correct no_notification status to event bus",
      async (input, expected) => {
        await claimService.create({
          ...testClaim,
          no_notification: input,
        })

        expect(eventBusService.emit).toHaveBeenCalledWith(expect.any(String), {
          id: expect.any(String),
          no_notification: expected,
        })
      }
    )
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
      claimRepo.setFindOne(() => Promise.resolve({ id: "claim_id" }))
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
      createFulfillment: jest.fn((_, items) =>
        Promise.resolve([{ id: "ful", items }])
      ),
      withTransaction: function() {
        withTransactionMock("fulfillment")
        return this
      },
    }

    const order = {
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
    }

    const claim = {
      type: "replace",
      fulfillment_status: "not_fulfilled",
      order,
      additional_items: [{ id: "item_test", quantity: 1 }],
      shipping_methods: [{ id: "method_test" }],
    }

    const claimRepo = MockRepository({
      findOne: () => Promise.resolve({ ...claim }),
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
      await claimService.createFulfillment("claim_id", {
        metadata: { meta: "data" },
      })

      expect(withTransactionMock).toHaveBeenCalledTimes(3)
      expect(withTransactionMock).toHaveBeenCalledWith("eventBus")

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
          items: claim.additional_items,
          shipping_methods: claim.shipping_methods,
          is_claim: true,
        },
        [
          {
            item_id: "item_test",
            quantity: 1,
          },
        ],
        { claim_order_id: "claim_id", metadata: { meta: "data" } }
      )

      expect(withTransactionMock).toHaveBeenCalledWith("lineItem")
      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith("item_test", {
        fulfilled_quantity: 1,
      })
    })

    it("fails if no shipping_methods", async () => {
      claimRepo.setFindOne(() =>
        Promise.resolve({ ...claim, shipping_methods: [] })
      )

      await expect(
        claimService.createFulfillment("claim_id", { meta: "data" })
      ).rejects.toThrow(`Cannot fulfill a claim without a shipping method.`)
    })

    it("fails if already fulfilled", async () => {
      claimRepo.setFindOne(() =>
        Promise.resolve({ ...claim, fulfillment_status: "fulfilled" })
      )

      await expect(
        claimService.createFulfillment("claim_id", { meta: "data" })
      ).rejects.toThrow(`The claim has already been fulfilled.`)
    })

    it("fails if type is refund", async () => {
      claimRepo.setFindOne(() => Promise.resolve({ ...claim, type: "refund" }))

      await expect(
        claimService.createFulfillment("claim_id", { meta: "data" })
      ).rejects.toThrow(`Claims with the type "refund" can not be fulfilled`)
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
      eventBusService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
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
        metadata: {
          meta: "data",
        },
        no_notification: false,
      })

      expect(withTransactionMock).toHaveBeenCalledTimes(3)
      expect(withTransactionMock).toHaveBeenCalledWith("fulfillment")
      expect(withTransactionMock).toHaveBeenCalledWith("lineItem")
      expect(withTransactionMock).toHaveBeenCalledWith("eventBus")

      expect(fulfillmentService.createShipment).toHaveBeenCalledTimes(1)
      expect(fulfillmentService.createShipment).toHaveBeenCalledWith(
        "ful_123",
        ["track1234"],
        {
          metadata: {
            meta: "data",
          },
          no_notification: false,
        }
      )

      expect(lineItemService.update).toHaveBeenCalledTimes(1)
      expect(lineItemService.update).toHaveBeenCalledWith("item_1", {
        shipped_quantity: 1,
      })
    })
  })

  describe("cancel", () => {
    const fulfillmentService = {
      cancelFulfillment: jest.fn(),
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
      eventBusService,
      returnService,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
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

      expect(withTransactionMock).toHaveBeenCalledTimes(3)
      expect(withTransactionMock).toHaveBeenCalledWith("fulfillment")
      expect(withTransactionMock).toHaveBeenCalledWith("return")
      expect(withTransactionMock).toHaveBeenCalledWith("eventBus")

      expect(fulfillmentService.cancelFulfillment).toHaveBeenCalledTimes(1)
      expect(fulfillmentService.cancelFulfillment).toHaveBeenCalledWith({
        id: "ful_21",
      })

      expect(returnService.cancel).toHaveBeenCalledTimes(1)
      expect(returnService.cancel).toHaveBeenCalledWith("ret")
    })

    it("fails if fulfillment is shipped", async () => {
      claimRepo.setFindOne(() =>
        Promise.resolve({
          fulfillment_status: "shipped",
        })
      )

      await expect(claimService.cancel("id")).rejects.toThrow(
        "Cannot cancel a claim that has been shipped."
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

      await expect(claimService.cancel("id")).rejects.toThrow(
        "Cannot cancel a claim that has a received return."
      )
    })
  })
})
