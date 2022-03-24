import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import DiscountService from "../discount"

describe("DiscountService", () => {
  describe("create", () => {
    const discountRepository = MockRepository({})

    const discountRuleRepository = MockRepository({})

    const regionService = {
      retrieve: () => {
        return {
          id: IdMap.getId("france"),
        }
      },
      withTransaction: function() {
        return this
      },
    }

    const discountService = new DiscountService({
      manager: MockManager,
      discountRepository,
      discountRuleRepository,
      regionService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("fails to create a fixed discount with multiple regions", async () => {
      expect.assertions(3)
      try {
        await discountService.create({
          code: "test",
          rule: {
            type: "fixed",
            allocation: "total",
            value: 20,
          },
          regions: [IdMap.getId("france"), IdMap.getId("Italy")],
        })
      } catch (err) {
        expect(err.type).toEqual("invalid_data")
        expect(err.message).toEqual("Fixed discounts can have one region")
        expect(discountRepository.create).toHaveBeenCalledTimes(0)
      }
    })

    it("successfully creates discount", async () => {
      await discountService.create({
        code: "test",
        rule: {
          type: "percentage",
          allocation: "total",
          value: 20,
        },
        regions: [IdMap.getId("france")],
      })

      expect(discountRuleRepository.create).toHaveBeenCalledTimes(1)
      expect(discountRuleRepository.create).toHaveBeenCalledWith({
        type: "percentage",
        allocation: "total",
        value: 20,
      })

      expect(discountRuleRepository.save).toHaveBeenCalledTimes(1)

      expect(discountRepository.create).toHaveBeenCalledTimes(1)
      expect(discountRepository.create).toHaveBeenCalledWith({
        code: "TEST",
        rule: expect.anything(),
        regions: [{ id: IdMap.getId("france") }],
      })

      expect(discountRepository.save).toHaveBeenCalledTimes(1)
    })

    it("successfully creates discount with start and end dates", async () => {
      await discountService.create({
        code: "test",
        rule: {
          type: "percentage",
          allocation: "total",
          value: 20,
        },
        starts_at: new Date("03/14/2021"),
        ends_at: new Date("03/15/2021"),
        regions: [IdMap.getId("france")],
      })

      expect(discountRuleRepository.create).toHaveBeenCalledTimes(1)
      expect(discountRuleRepository.create).toHaveBeenCalledWith({
        type: "percentage",
        allocation: "total",
        value: 20,
      })

      expect(discountRuleRepository.save).toHaveBeenCalledTimes(1)

      expect(discountRepository.create).toHaveBeenCalledTimes(1)
      expect(discountRepository.create).toHaveBeenCalledWith({
        code: "TEST",
        rule: expect.anything(),
        regions: [{ id: IdMap.getId("france") }],
        starts_at: new Date("03/14/2021"),
        ends_at: new Date("03/15/2021"),
      })

      expect(discountRepository.save).toHaveBeenCalledTimes(1)
    })

    it("successfully creates discount with start date and a valid duration", async () => {
      await discountService.create({
        code: "test",
        rule: {
          type: "percentage",
          allocation: "total",
          value: 20,
        },
        starts_at: new Date("03/14/2021"),
        valid_duration: "P0Y0M1D",
        regions: [IdMap.getId("france")],
      })

      expect(discountRuleRepository.create).toHaveBeenCalledTimes(1)
      expect(discountRuleRepository.create).toHaveBeenCalledWith({
        type: "percentage",
        allocation: "total",
        value: 20,
      })

      expect(discountRuleRepository.save).toHaveBeenCalledTimes(1)

      expect(discountRepository.create).toHaveBeenCalledTimes(1)
      expect(discountRepository.create).toHaveBeenCalledWith({
        code: "TEST",
        rule: expect.anything(),
        regions: [{ id: IdMap.getId("france") }],
        starts_at: new Date("03/14/2021"),
        valid_duration: "P0Y0M1D",
      })

      expect(discountRepository.save).toHaveBeenCalledTimes(1)
    })
  })

  describe("retrieve", () => {
    const discountRepository = MockRepository({
      findOne: (query) => {
        if (query.where.id) {
          return Promise.resolve({ id: IdMap.getId("total10") })
        }
        return Promise.resolve(undefined)
      },
    })

    const discountService = new DiscountService({
      manager: MockManager,
      discountRepository,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully retrieves discount", async () => {
      await discountService.retrieve(IdMap.getId("total10"))
      expect(discountRepository.findOne).toHaveBeenCalledTimes(1)
      expect(discountRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: IdMap.getId("total10"),
        },
      })
    })

    it("throws on invalid discount id", async () => {
      try {
        await discountService.retrieve(IdMap.getId("invalid"))
      } catch (error) {
        expect(error.message).toBe(
          `Discount with ${IdMap.getId("invalid")} was not found`
        )
      }
    })
  })

  describe("retrieveByCode", () => {
    const discountRepository = MockRepository({
      findOne: (query) => {
        if (query.where.code === "10%OFF") {
          return Promise.resolve({ id: IdMap.getId("total10"), code: "10%OFF" })
        }
        if (query.where.code === "DYNAMIC") {
          return Promise.resolve({ id: IdMap.getId("total10"), code: "10%OFF" })
        }
        return Promise.resolve(undefined)
      },
    })

    const discountService = new DiscountService({
      manager: MockManager,
      discountRepository,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully finds discount by code", async () => {
      await discountService.retrieveByCode("10%OFF")
      expect(discountRepository.findOne).toHaveBeenCalledTimes(1)
      expect(discountRepository.findOne).toHaveBeenCalledWith({
        where: {
          code: "10%OFF",
          is_dynamic: false,
        },
        relations: [],
      })
    })
  })

  describe("update", () => {
    const discountRepository = MockRepository({
      findOne: () =>
        Promise.resolve({
          id: IdMap.getId("total10"),
          code: "10%OFF",
          rule: { type: "fixed" },
        }),
    })

    const discountRuleRepository = MockRepository({})

    const regionService = {
      retrieve: () => {
        return {
          id: IdMap.getId("france"),
        }
      },
    }

    const discountService = new DiscountService({
      manager: MockManager,
      discountRepository,
      discountRuleRepository,
      regionService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("fails to update a fixed discount with multiple regions", async () => {
      expect.assertions(3)
      try {
        await discountService.update(IdMap.getId("total10"), {
          code: "test",
          regions: [IdMap.getId("france"), IdMap.getId("Italy")],
        })
      } catch (err) {
        expect(err.type).toEqual("invalid_data")
        expect(err.message).toEqual("Fixed discounts can have one region")
        expect(discountRepository.create).toHaveBeenCalledTimes(0)
      }
    })

    it("successfully updates discount", async () => {
      await discountService.update(IdMap.getId("total10"), {
        code: "test",
        regions: [IdMap.getId("france")],
      })
      expect(discountRepository.save).toHaveBeenCalledTimes(1)
      expect(discountRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("total10"),
        code: "TEST",
        rule: { type: "fixed" },
        regions: [{ id: IdMap.getId("france") }],
      })
    })

    it("successfully updates discount rule", async () => {
      await discountService.update(IdMap.getId("total10"), {
        rule: { type: "fixed", value: 10, allocation: "total" },
      })
      expect(discountRepository.save).toHaveBeenCalledTimes(1)
      expect(discountRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("total10"),
        code: "10%OFF",
        rule: { type: "fixed", value: 10, allocation: "total" },
      })
    })

    it("successfully updates metadata", async () => {
      await discountService.update(IdMap.getId("total10"), {
        metadata: { testKey: "testValue" },
      })
      expect(discountRepository.save).toHaveBeenCalledTimes(1)
      expect(discountRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("total10"),
        rule: { type: "fixed" },
        code: "10%OFF",
        metadata: { testKey: "testValue" },
      })
    })
  })

  describe("addRegion", () => {
    const discountRepository = MockRepository({
      findOne: (q) => {
        if (q.where.id === "fixed") {
          return Promise.resolve({
            id: IdMap.getId("total10"),
            regions: [{ id: IdMap.getId("test-region") }],
            rule: {
              type: "fixed",
            },
          })
        }
        return Promise.resolve({
          id: IdMap.getId("total10"),
          regions: [{ id: IdMap.getId("test-region") }],
          rule: {
            type: "percentage",
          },
        })
      },
    })

    const discountRuleRepository = MockRepository({})

    const regionService = {
      retrieve: () => {
        return {
          id: IdMap.getId("test-region-2"),
        }
      },
    }

    const discountService = new DiscountService({
      manager: MockManager,
      discountRepository,
      discountRuleRepository,
      regionService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("fails to add a region to a fixed discount with an existing region", async () => {
      expect.assertions(3)
      try {
        await discountService.addRegion("fixed", IdMap.getId("test-region-2"))
      } catch (err) {
        expect(err.type).toEqual("invalid_data")
        expect(err.message).toEqual("Fixed discounts can have one region")
        expect(discountRepository.save).toHaveBeenCalledTimes(0)
      }
    })

    it("successfully adds a region", async () => {
      await discountService.addRegion(
        IdMap.getId("total10"),
        IdMap.getId("test-region-2")
      )

      expect(discountRepository.save).toHaveBeenCalledTimes(1)
      expect(discountRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("total10"),
        regions: [
          { id: IdMap.getId("test-region") },
          { id: IdMap.getId("test-region-2") },
        ],
        rule: {
          type: "percentage",
        },
      })
    })

    it("successfully resolves if region already exists", async () => {
      await discountService.addRegion(
        IdMap.getId("total10"),
        IdMap.getId("test-region")
      )

      expect(discountRepository.save).toHaveBeenCalledTimes(0)
    })
  })

  describe("createDynamicDiscount", () => {
    const discountRepository = MockRepository({
      create: (d) => d,
      findOne: () =>
        Promise.resolve({
          id: "parent",
          is_dynamic: true,
          rule_id: "parent_rule",
          valid_duration: "P1Y",
        }),
    })

    const discountRuleRepository = MockRepository({})

    const regionService = {
      retrieve: () => {
        return {
          id: IdMap.getId("test-region"),
        }
      },
    }

    const discountService = new DiscountService({
      manager: MockManager,
      discountRepository,
      discountRuleRepository,
      regionService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully removes a region", async () => {
      await discountService.createDynamicCode("former", {
        code: "hi",
      })

      expect(discountRepository.save).toHaveBeenCalledTimes(1)
      expect(discountRepository.save).toHaveBeenCalledWith({
        is_dynamic: true,
        is_disabled: false,
        rule_id: "parent_rule",
        parent_discount_id: "parent",
        code: "HI",
        usage_limit: undefined,
        ends_at: expect.any(Date),
      })
    })
  })

  describe("removeRegion", () => {
    const discountRepository = MockRepository({
      findOne: () =>
        Promise.resolve({
          id: IdMap.getId("total10"),
          regions: [{ id: IdMap.getId("test-region") }],
        }),
    })

    const discountRuleRepository = MockRepository({})

    const regionService = {
      retrieve: () => {
        return {
          id: IdMap.getId("test-region"),
        }
      },
    }

    const discountService = new DiscountService({
      manager: MockManager,
      discountRepository,
      discountRuleRepository,
      regionService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully removes a region", async () => {
      await discountService.removeRegion(
        IdMap.getId("total10"),
        IdMap.getId("test-region")
      )

      expect(discountRepository.save).toHaveBeenCalledTimes(1)
      expect(discountRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("total10"),
        regions: [],
      })
    })

    it("successfully resolve if region does not exist", async () => {
      await discountService.removeRegion(
        IdMap.getId("total10"),
        IdMap.getId("test-region-2")
      )

      expect(discountRepository.save).toHaveBeenCalledTimes(0)
    })
  })

  describe("listAndCount", () => {
    const discountRepository = MockRepository({
      findAndCount: () =>
        Promise.resolve([
          {
            id: IdMap.getId("total10"),
            code: "OLITEST",
          },
        ]),
    })

    const discountService = new DiscountService({
      manager: MockManager,
      discountRepository,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls repository function with query and default config", async () => {
      await discountService.listAndCount({ q: "OLI" })

      expect(discountRepository.findAndCount).toHaveBeenCalledTimes(1)
      expect(discountRepository.findAndCount).toHaveBeenCalledWith({
        where: expect.anything(),
        skip: 0,
        take: 20,
        order: { created_at: "DESC" },
      })
    })

    it("calls repository function specified query", async () => {
      await discountService.listAndCount(
        {},
        { skip: 50, take: 50, order: { created_at: "ASC" } }
      )

      expect(discountRepository.findAndCount).toHaveBeenCalledTimes(1)
      expect(discountRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 50,
        take: 50,
        order: { created_at: "ASC" },
      })
    })
  })

  describe("calculateDiscountForLineItem", () => {
    const discountRepository = MockRepository({
      findOne: ({ where }) => {
        if (where.id === "disc_percentage") {
          return Promise.resolve({
            code: "MEDUSA",
            rule: {
              type: "percentage",
              allocation: "total",
              value: 15,
            },
          })
        }
        if (where.id === "disc_fixed_total") {
          return Promise.resolve({
            code: "MEDUSA",
            rule: {
              type: "fixed",
              allocation: "total",
              value: 400,
            },
          })
        }
        return Promise.resolve({
          id: "disc_fixed",
          code: "MEDUSA",
          rule: {
            type: "fixed",
            allocation: "item",
            value: 200,
          },
        })
      },
    })

    const totalsService = {
      getSubtotal: () => {
        return 1100
      },
    }

    const discountService = new DiscountService({
      manager: MockManager,
      discountRepository,
      totalsService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("correctly calculates fixed + item discount", async () => {
      const adjustment = await discountService.calculateDiscountForLineItem(
        "disc_fixed",
        {
          unit_price: 300,
          quantity: 2,
          allow_discounts: true,
        }
      )

      expect(adjustment).toBe(400)
    })

    it("correctly calculates fixed + total discount", async () => {
      const adjustment1 = await discountService.calculateDiscountForLineItem(
        "disc_fixed_total",
        {
          unit_price: 400,
          quantity: 2,
          allow_discounts: true,
        }
      )

      const adjustment2 = await discountService.calculateDiscountForLineItem(
        "disc_fixed_total",
        {
          unit_price: 300,
          quantity: 1,
          allow_discounts: true,
        }
      )

      expect(adjustment1).toBe(291)
      expect(adjustment2).toBe(109)
    })

    it("returns line item amount if discount exceeds lime item price", async () => {
      const adjustment = await discountService.calculateDiscountForLineItem(
        "disc_fixed",
        {
          unit_price: 100,
          quantity: 1,
          allow_discounts: true,
        }
      )

      expect(adjustment).toBe(100)
    })

    it("correctly calculates percentage discount", async () => {
      const adjustment = await discountService.calculateDiscountForLineItem(
        "disc_percentage",
        {
          unit_price: 400,
          quantity: 2,
          allow_discounts: true,
        }
      )

      expect(adjustment).toBe(120)
    })

    it("returns full amount if exceeds total line item amount", async () => {
      const adjustment = await discountService.calculateDiscountForLineItem(
        "disc_fixed",
        {
          unit_price: 50,
          quantity: 2,
          allow_discounts: true,
        }
      )

      expect(adjustment).toBe(100)
    })

    it("returns early if discounts are not allowed", async () => {
      const adjustment = await discountService.calculateDiscountForLineItem(
        "disc_percentage",
        {
          unit_price: 400,
          quantity: 2,
          allow_discounts: false,
        }
      )

      expect(adjustment).toBe(0)
    })
  })

  describe("canApplyForCustomer", () => {
    const discountConditionRepository = {
      canApplyForCustomer: jest
        .fn()
        .mockImplementation(() => Promise.resolve(true)),
    }

    const customerService = {
      retrieve: jest.fn().mockImplementation((id) => {
        if (id === "customer-no-groups") {
          return Promise.resolve({ id: "customer-no-groups" })
        }
        if (id === "customer-with-groups") {
          return Promise.resolve({
            id: "customer-with-groups",
            groups: [{ id: "group-1" }],
          })
        }
      }),
    }

    const discountService = new DiscountService({
      manager: MockManager,
      discountConditionRepository,
      customerService,
    })

    it("returns false on undefined customer id", async () => {
      const res = await discountService.canApplyForCustomer("rule-1")

      expect(res).toBe(false)

      expect(
        discountConditionRepository.canApplyForCustomer
      ).toHaveBeenCalledTimes(0)
    })

    it("returns true on customer with groups", async () => {
      const res = await discountService.canApplyForCustomer(
        "rule-1",
        "customer-with-groups"
      )

      expect(res).toBe(true)

      expect(
        discountConditionRepository.canApplyForCustomer
      ).toHaveBeenCalledTimes(1)
      expect(
        discountConditionRepository.canApplyForCustomer
      ).toHaveBeenCalledWith("rule-1", "customer-with-groups")
    })
  })
})
