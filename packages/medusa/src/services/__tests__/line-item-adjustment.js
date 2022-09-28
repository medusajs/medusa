import { MockManager, MockRepository } from "medusa-test-utils"
import { In } from "typeorm"
import LineItemAdjustmentService from "../line-item-adjustment"
import { DiscountServiceMock } from "../__mocks__/discount"
import { EventBusServiceMock } from "../__mocks__/event-bus"

describe("LineItemAdjustmentService", () => {
  describe("list", () => {
    const lineItemAdjustmentRepo = MockRepository({
      find: (q) => {
        return Promise.resolve([
          {
            id: "lia-1",
            description: "discount",
            amount: 1000,
            item: "li-1",
            discount_id: "disc_1",
          },
        ])
      },
    })

    const lineItemAdjustmentService = new LineItemAdjustmentService({
      manager: MockManager,
      lineItemAdjustmentRepository: lineItemAdjustmentRepo,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls lineItemAdjustment list method", async () => {
      await lineItemAdjustmentService.list(
        { item_id: "li-1" },
        {
          relations: ["item"],
        }
      )
      expect(lineItemAdjustmentRepo.find).toHaveBeenCalledTimes(1)
      expect(lineItemAdjustmentRepo.find).toHaveBeenCalledWith({
        where: {
          item_id: "li-1",
        },
        relations: ["item"],
      })
    })
  })

  describe("retrieve", () => {
    const lineItemAdjustmentRepo = MockRepository({
      findOne: (q) => {
        switch (q.where.id) {
          case "lia-1":
            return Promise.resolve({
              id: "lia-1",
              description: "discount",
            })
          default:
            return Promise.resolve()
        }
      },
    })

    const lineItemAdjustmentService = new LineItemAdjustmentService({
      manager: MockManager,
      lineItemAdjustmentRepository: lineItemAdjustmentRepo,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls lineItemAdjustment retrieve method", async () => {
      await lineItemAdjustmentService.retrieve("lia-1", {
        relations: ["item"],
      })

      expect(lineItemAdjustmentRepo.findOne).toHaveBeenCalledTimes(1)
      expect(lineItemAdjustmentRepo.findOne).toHaveBeenCalledWith({
        where: { id: "lia-1" },
        relations: ["item"],
      })
    })

    it("fails when lineItemAdjustment is not found", async () => {
      await expect(
        lineItemAdjustmentService.retrieve("not-existing")
      ).rejects.toThrow(
        `Line item adjustment with id: not-existing was not found`
      )
    })
  })

  describe("create", () => {
    const lineItemAdjustment = {
      id: "lia-1",
      amount: 2000,
      description: "discount",
      item_id: "li-3",
      discount_id: "disc_999",
    }

    const lineItemAdjustmentRepo = MockRepository({
      create: (f) => lineItemAdjustment,
      save: (f) => Promise.resolve(lineItemAdjustment),
    })

    const lineItemAdjustmentService = new LineItemAdjustmentService({
      manager: MockManager,
      lineItemAdjustmentRepository: lineItemAdjustmentRepo,
      eventBusService: EventBusServiceMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls lineItemAdjustment create method", async () => {
      await lineItemAdjustmentService.create({
        amount: 2000,
        description: "discount",
        item_id: "li-3",
        discount_id: "disc_999",
      })

      expect(lineItemAdjustmentRepo.create).toHaveBeenCalledTimes(1)
      expect(lineItemAdjustmentRepo.create).toHaveBeenCalledWith({
        amount: 2000,
        description: "discount",
        item_id: "li-3",
        discount_id: "disc_999",
      })

      expect(lineItemAdjustmentRepo.save).toHaveBeenCalledTimes(1)
      expect(lineItemAdjustmentRepo.save).toHaveBeenCalledWith({
        id: "lia-1",
        amount: 2000,
        description: "discount",
        item_id: "li-3",
        discount_id: "disc_999",
      })
    })
  })

  describe("update", () => {
    const lineItemAdjustment = { id: "lia-1" }

    const lineItemAdjustmentRepo = MockRepository({
      findOne: (f) => Promise.resolve(lineItemAdjustment),
      save: (f) => Promise.resolve(lineItemAdjustment),
    })

    const lineItemAdjustmentService = new LineItemAdjustmentService({
      manager: MockManager,
      lineItemAdjustmentRepository: lineItemAdjustmentRepo,
      eventBusService: EventBusServiceMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls lineItemAdjustment uppdate method", async () => {
      await lineItemAdjustmentService.update("lia-1", {
        amount: 6000,
      })

      expect(lineItemAdjustmentRepo.save).toHaveBeenCalledTimes(1)
      expect(lineItemAdjustmentRepo.save).toHaveBeenCalledWith({
        ...lineItemAdjustment,
      })
    })
  })

  describe("delete", () => {
    beforeAll(async () => {
      jest.clearAllMocks()
    })

    describe("delete by line item adjustment id", () => {
      const lineItemAdjustment = { id: "lia-1", item_id: "li-1" }
      const lineItemAdjustmentRepo = MockRepository({
        find: (f) => Promise.resolve(lineItemAdjustment),
      })

      const lineItemAdjustmentService = new LineItemAdjustmentService({
        manager: MockManager,
        lineItemAdjustmentRepository: lineItemAdjustmentRepo,
        eventBusService: EventBusServiceMock,
      })

      it("calls lineItemAdjustment delete method with the right params", async () => {
        await lineItemAdjustmentService.delete("lia-1")

        expect(lineItemAdjustmentRepo.delete).toHaveBeenCalledTimes(1)
        expect(lineItemAdjustmentRepo.delete).toHaveBeenCalledWith({
          id: In(["lia-1"]),
        })
      })
    })

    describe("delete by item ids", () => {
      const lineItemAdjustment = [
        { id: "lia-1", item: "li-1" },
        { id: "lia-2", item_id: "li-2" },
      ]
      const lineItemAdjustmentRepo = MockRepository({
        find: (f) => Promise.resolve(lineItemAdjustment),
      })

      const lineItemAdjustmentService = new LineItemAdjustmentService({
        manager: MockManager,
        lineItemAdjustmentRepository: lineItemAdjustmentRepo,
        eventBusService: EventBusServiceMock,
      })

      it("calls lineItemAdjustment delete method with the right query", async () => {
        const query = { item_id: ["li-1", "li-2", "li-3"] }
        await lineItemAdjustmentService.delete(query)

        expect(lineItemAdjustmentRepo.find).toHaveBeenCalledTimes(1)
        expect(lineItemAdjustmentRepo.find).toHaveBeenCalledWith({
          where: {
            item_id: In(query.item_id),
          },
        })

        expect(lineItemAdjustmentRepo.remove).toHaveBeenCalledTimes(1)
        expect(lineItemAdjustmentRepo.remove).toHaveBeenCalledWith(
          lineItemAdjustment
        )
      })
    })
  })

  describe("createAdjustments", () => {
    beforeEach(async () => {
      jest.clearAllMocks()
    })

    const lineItemAdjustmentRepo = MockRepository({
      find: (f) => Promise.resolve(lineItemAdjustment),
    })

    const lineItemAdjustmentService = new LineItemAdjustmentService({
      manager: MockManager,
      lineItemAdjustmentRepository: lineItemAdjustmentRepo,
      discountService: DiscountServiceMock,
      eventBusService: EventBusServiceMock,
    })

    lineItemAdjustmentService.createAdjustmentForLineItem = jest
      .fn()
      .mockImplementation(() => {
        return Promise.resolve({
          item_id: "li-1",
          amount: 1000,
          discount_id: "disc-1",
          id: "lia-1",
          description: "discount",
        })
      })

    it("calls createAdjustmentForLineItem once when given a line item", () => {
      const cart = {
        id: "cart1",
        discounts: ["disc-1"],
        items: [{ id: "li-1" }],
      }
      const lineItem = { id: "li-1" }

      lineItemAdjustmentService.createAdjustments(cart, lineItem)
      expect(
        lineItemAdjustmentService.createAdjustmentForLineItem
      ).toHaveBeenCalledTimes(1)
      expect(
        lineItemAdjustmentService.createAdjustmentForLineItem
      ).toHaveBeenCalledWith(cart, lineItem)
    })

    it("calls createAdjustmentForLineItem 3 times when given a cart containing 3 line items", () => {
      const cart = {
        id: "cart1",
        discounts: ["disc-1"],
        items: [
          {
            id: "li-2",
          },
          {
            id: "li-3",
          },
          {
            id: "li-4",
          },
        ],
      }

      lineItemAdjustmentService.createAdjustments(cart)
      expect(
        lineItemAdjustmentService.createAdjustmentForLineItem
      ).toHaveBeenCalledTimes(3)
      expect(
        lineItemAdjustmentService.createAdjustmentForLineItem
      ).toHaveBeenNthCalledWith(1, cart, { id: "li-2" })
    })
  })
})
