import LineItemAdjustmentService from "../line-item-adjustment"
import { MockManager, MockRepository, IdMap } from "medusa-test-utils"
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
            resource_id: "disc_1",
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
      resource_id: "disc_999",
    }

    const lineItemAdjustmentRepo = MockRepository({
      create: (f) => Promise.resolve(lineItemAdjustment),
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
        resource_id: "disc_999",
      })

      expect(lineItemAdjustmentRepo.create).toHaveBeenCalledTimes(1)
      expect(lineItemAdjustmentRepo.create).toHaveBeenCalledWith({
        amount: 2000,
        description: "discount",
        item_id: "li-3",
        resource_id: "disc_999",
      })

      expect(lineItemAdjustmentRepo.save).toHaveBeenCalledTimes(1)
      expect(lineItemAdjustmentRepo.save).toHaveBeenCalledWith({
        id: "lia-1",
        amount: 2000,
        description: "discount",
        item_id: "li-3",
        resource_id: "disc_999",
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
    const lineItemAdjustment = { id: "lia-1" }

    const lineItemAdjustmentRepo = MockRepository({
      softRemove: (f) => Promise.resolve(),
      findOne: (f) => Promise.resolve(lineItemAdjustment),
    })

    const lineItemAdjustmentService = new LineItemAdjustmentService({
      manager: MockManager,
      lineItemAdjustmentRepository: lineItemAdjustmentRepo,
      eventBusService: EventBusServiceMock,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls lineItemAdjustment delete method", async () => {
      await lineItemAdjustmentService.delete("lia-1")

      expect(lineItemAdjustmentRepo.remove).toHaveBeenCalledTimes(1)
      expect(lineItemAdjustmentRepo.remove).toHaveBeenCalledWith(
        lineItemAdjustment
      )
    })
  })
})
