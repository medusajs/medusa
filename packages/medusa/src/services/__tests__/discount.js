import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import { FlagRouter } from "../../utils/flag-router"
import DiscountService from "../discount"
import { TotalsServiceMock } from "../__mocks__/totals"
import { newTotalsServiceMock } from "../__mocks__/new-totals"
import { In } from "typeorm"

const featureFlagRouter = new FlagRouter({})

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
      withTransaction: function () {
        return this
      },
    }

    const discountService = new DiscountService({
      manager: MockManager,
      discountRepository,
      discountRuleRepository,
      regionService,
      featureFlagRouter,
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

    it("fails to create a discount without regions", async () => {
      const err = await discountService
        .create({
          code: "test",
          rule: {
            type: "fixed",
            allocation: "total",
            value: 20,
          },
        })
        .catch((e) => e)

      expect(err.type).toEqual("invalid_data")
      expect(err.message).toEqual("Discount must have atleast 1 region")
      expect(discountRepository.create).toHaveBeenCalledTimes(0)
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
        code: "test",
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
        code: "test",
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
        code: "test",
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
      featureFlagRouter,
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
      featureFlagRouter,
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
        },
      })
    })

    it("successfully trims, uppdercases, and finds discount by code", async () => {
      await discountService.retrieveByCode(" 10%Off ")
      expect(discountRepository.findOne).toHaveBeenCalledTimes(1)
      expect(discountRepository.findOne).toHaveBeenCalledWith({
        where: {
          code: "10%OFF",
        },
      })
    })
  })

  describe("listByCodes", () => {
    const discountRepository = MockRepository({
      find: (query) => {
        if (query.where.code.value.includes("10%OFF")) {
          return Promise.resolve([
            { id: IdMap.getId("total10"), code: "10%OFF" },
          ])
        }
        if (query.where.code.value.includes("DYNAMIC")) {
          return Promise.resolve([
            { id: IdMap.getId("total10"), code: "10%OFF" },
          ])
        }
        return Promise.resolve([])
      },
    })

    const discountService = new DiscountService({
      manager: MockManager,
      discountRepository,
      featureFlagRouter,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully finds discount by code", async () => {
      await discountService.listByCodes(["10%OFF"])
      expect(discountRepository.find).toHaveBeenCalledTimes(1)
      expect(discountRepository.find).toHaveBeenCalledWith({
        where: {
          code: In(["10%OFF"]),
        },
      })
    })

    it("successfully trims, uppdercases, and finds discount by code", async () => {
      await discountService.listByCodes([" 10%Off "])
      expect(discountRepository.find).toHaveBeenCalledTimes(1)
      expect(discountRepository.find).toHaveBeenCalledWith({
        where: {
          code: In(["10%OFF"]),
        },
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

    const discountRuleRepository = MockRepository({
      create: (values) => values,
    })

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
      featureFlagRouter,
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
      featureFlagRouter,
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
      featureFlagRouter,
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
      featureFlagRouter,
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
      featureFlagRouter,
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
      ...TotalsServiceMock,
      getSubtotal: async () => {
        return 1100
      },
    }

    const newTotalsService = {
      ...newTotalsServiceMock,
      getLineItemTotals: async () => {
        return [
          {
            subtotal: 1100,
          },
        ]
      },
    }

    const discountService = new DiscountService({
      manager: MockManager,
      discountRepository,
      totalsService,
      newTotalsService,
      featureFlagRouter,
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
      let item = {
        unit_price: 400,
        quantity: 2,
        allow_discounts: true,
      }

      const adjustment1 = await discountService.calculateDiscountForLineItem(
        "disc_fixed_total",
        item,
        {
          items: [item],
        }
      )

      item = {
        unit_price: 300,
        quantity: 1,
        allow_discounts: true,
      }

      const adjustment2 = await discountService.calculateDiscountForLineItem(
        "disc_fixed_total",
        item,
        {
          items: [item],
        }
      )

      // The sum of both is equal to the expected 400
      expect(adjustment1).toBeCloseTo(291, 0)
      expect(adjustment2).toBeCloseTo(109, 0)
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

  describe("validateDiscountForCartOrThrow", () => {
    const discount = { code: "TEST" }
    const getCart = (id) => {
      if (id === "with-d") {
        return {
          id: "cart",
          discounts: [
            {
              code: "1234",
              rule: {
                type: "fixed",
              },
            },
            {
              code: "FS1234",
              rule: {
                type: "free_shipping",
              },
            },
          ],
          region_id: "good",
          items: [
            {
              id: "li1",
              quantity: 2,
              unit_price: 1000,
            },
            {
              id: "li2",
              quantity: 1,
              unit_price: 500,
            },
          ],
        }
      }
      if (id === "with-d-and-customer") {
        return {
          id: "with-d-and-customer",
          discounts: [
            {
              code: "ApplicableForCustomer",
              rule: {
                type: "fixed",
              },
            },
          ],
          region_id: "good",
          customer_id: "test-customer",
        }
      }
      return {
        id: "cart",
        discounts: [
          {
            code: "CODE",
            rule: {
              type: "percentage",
            },
          },
        ],
        region_id: "good",
        items: [
          {
            id: "li1",
            quantity: 2,
            unit_price: 1000,
          },
          {
            id: "li2",
            quantity: 1,
            unit_price: 500,
          },
        ],
      }
    }

    let discountService

    beforeEach(async () => {
      discountService = new DiscountService({
        manager: MockManager,
        featureFlagRouter,
      })
      const hasReachedLimitMock = jest.fn().mockImplementation(() => false)
      const isDisabledMock = jest.fn().mockImplementation(() => false)
      const isValidForRegionMock = jest
        .fn()
        .mockImplementation(() => Promise.resolve(true))
      const canApplyForCustomerMock = jest.fn().mockImplementation(() => {
        return Promise.resolve(true)
      })
      discountService.hasReachedLimit = hasReachedLimitMock
      discountService.isDisabled = isDisabledMock
      discountService.canApplyForCustomer = canApplyForCustomerMock
      discountService.isValidForRegion = isValidForRegionMock
    })

    it("calls all validation methods when cart includes a customer_id and doesn't throw", async () => {
      const discount = {
        id: "10off",
        code: "10%OFF",
        regions: [{ id: "good" }],
        rule: {
          id: "10off-rule",
          type: "percentage",
        },
      }
      const cart = getCart("with-d-and-customer")
      const result = await discountService.validateDiscountForCartOrThrow(
        cart,
        discount
      )
      expect(result).toBeUndefined()

      expect(discountService.hasReachedLimit).toHaveBeenCalledTimes(1)
      expect(discountService.hasReachedLimit).toHaveBeenCalledWith(discount)

      expect(discountService.isDisabled).toHaveBeenCalledTimes(1)
      expect(discountService.isDisabled).toHaveBeenCalledWith(discount)

      expect(discountService.isValidForRegion).toHaveBeenCalledTimes(1)
      expect(discountService.isValidForRegion).toHaveBeenCalledWith(
        discount,
        cart.region_id
      )

      expect(discountService.canApplyForCustomer).toHaveBeenCalledTimes(1)
      expect(discountService.canApplyForCustomer).toHaveBeenCalledWith(
        discount.rule.id,
        cart.customer_id
      )
    })

    it("throws when hasReachedLimit returns true", async () => {
      const cart = getCart("with-d-and-customer")
      discountService.hasReachedLimit = jest.fn().mockImplementation(() => true)

      expect(
        discountService.validateDiscountForCartOrThrow(cart, discount)
      ).rejects.toThrow({
        message: `Discount ${discount.code} has been used maximum allowed times`,
      })
    })

    it("throws when hasNotStarted returns true", async () => {
      const cart = getCart("with-d-and-customer")
      discountService.hasNotStarted = jest.fn().mockImplementation(() => true)

      expect(
        discountService.validateDiscountForCartOrThrow(cart, discount)
      ).rejects.toThrow({
        message: `Discount ${discount.code} is not valid yet`,
      })
    })

    it("throws when hasExpired returns true", async () => {
      const cart = getCart("with-d-and-customer")
      discountService.hasExpired = jest.fn().mockImplementation(() => true)

      expect(
        discountService.validateDiscountForCartOrThrow(cart, discount)
      ).rejects.toThrow({
        message: `Discount ${discount.code} is expired`,
      })
    })

    it("throws when isDisabled returns true", async () => {
      const cart = getCart("with-d-and-customer")
      discountService.isDisabled = jest.fn().mockImplementation(() => true)

      expect(
        discountService.validateDiscountForCartOrThrow(cart, discount)
      ).rejects.toThrow({
        message: `The discount code ${discount.code} is disabled`,
      })
    })

    it("throws when isValidForRegion returns false", async () => {
      const discount = {}
      const cart = getCart("with-d-and-customer")
      discountService.isValidForRegion = jest
        .fn()
        .mockImplementation(() => Promise.resolve(false))

      expect(
        discountService.validateDiscountForCartOrThrow(cart, discount)
      ).rejects.toThrow({
        message: "The discount is not available in current region",
      })
    })

    it("throws when canApplyForCustomer returns false", async () => {
      const discount_ = { code: discount.code, rule: { id: "" } }
      const cart = getCart("with-d-and-customer")
      discountService.canApplyForCustomer = jest
        .fn()
        .mockImplementation(() => Promise.resolve(false))

      expect(
        discountService.validateDiscountForCartOrThrow(cart, discount_)
      ).rejects.toThrow({
        message: `Discount ${discount.code} is not valid for customer`,
      })
    })
  })

  describe("hasReachedLimit", () => {
    const discountService = new DiscountService({
      featureFlagRouter,
    })

    it("returns true if discount limit is reached", () => {
      const discount = {
        id: "limit-reached",
        code: "limit-reached",
        regions: [{ id: "good" }],
        rule: {},
        usage_count: 2,
        usage_limit: 2,
      }
      const hasReachedLimit = discountService.hasReachedLimit(discount)
      expect(hasReachedLimit).toBe(true)
    })

    it("returns false if discount limit is not reached", () => {
      const discount = {
        id: "limit-reached",
        code: "limit-reached",
        regions: [{ id: "good" }],
        rule: {},
        usage_count: 1,
        usage_limit: 100,
      }

      const hasReachedLimit = discountService.hasReachedLimit(discount)
      expect(hasReachedLimit).toBe(false)
    })

    it("returns false if discount limit is not set", () => {
      const discount = {
        id: "limit-reached",
        code: "limit-reached",
        regions: [{ id: "good" }],
        rule: {},
        usage_count: 1,
      }

      const hasReachedLimit = discountService.hasReachedLimit(discount)
      expect(hasReachedLimit).toBe(false)
    })
  })

  describe("isDisabled", () => {
    const discountService = new DiscountService({
      featureFlagRouter,
    })

    it("returns false if discount not disabled", async () => {
      const discount = {
        id: "10off",
        code: "10%OFF",
        regions: [{ id: "good" }],
        rule: {
          id: "10off-rule",
          type: "percentage",
        },
        is_disabled: false,
      }

      const isDisabled = discountService.isDisabled(discount)
      expect(isDisabled).toBe(false)
    })

    it("returns true if discount is disabled", async () => {
      const discount = {
        id: "10off",
        code: "10%OFF",
        regions: [{ id: "good" }],
        rule: {
          id: "10off-rule",
          type: "percentage",
        },
        is_disabled: true,
      }

      const isDisabled = discountService.isDisabled(discount)
      expect(isDisabled).toBe(true)
    })
  })

  describe("hasNotStarted", () => {
    const discountService = new DiscountService({
      featureFlagRouter,
    })

    it("returns true if discount has a future starts_at date", async () => {
      const discount = {
        id: "10off",
        code: "10%OFF",
        regions: [{ id: "good" }],
        rule: {
          type: "percentage",
        },
        starts_at: getOffsetDate(1),
        ends_at: getOffsetDate(10),
      }

      const hasNotStarted = discountService.hasNotStarted(discount)
      expect(hasNotStarted).toBe(true)
    })

    it("returns false if discount has a past starts_at date", async () => {
      const discount = {
        id: "10off",
        code: "10%OFF",
        regions: [{ id: "good" }],
        rule: {
          type: "percentage",
        },
        starts_at: getOffsetDate(-2),
        ends_at: getOffsetDate(10),
      }

      const hasNotStarted = discountService.hasNotStarted(discount)
      expect(hasNotStarted).toBe(false)
    })
  })

  describe("hasExpired", () => {
    const discountService = new DiscountService({
      featureFlagRouter,
    })

    it("returns false if discount has a future ends_at date", async () => {
      const discount = {
        id: "10off",
        code: "10%OFF",
        regions: [{ id: "good" }],
        rule: {
          type: "percentage",
        },
        ends_at: getOffsetDate(10),
        starts_at: getOffsetDate(-1),
      }

      const hasExpired = discountService.hasExpired(discount)
      expect(hasExpired).toBe(false)
    })

    it("returns true if discount has a past ends_at date", async () => {
      const discount = {
        id: "10off",
        code: "10%OFF",
        regions: [{ id: "good" }],
        rule: {
          type: "percentage",
        },
        starts_at: getOffsetDate(-10),
        ends_at: getOffsetDate(-1),
      }

      const hasExpired = discountService.hasExpired(discount)
      expect(hasExpired).toBe(true)
    })
  })

  describe("isValidForRegion", () => {
    const retrieveMock = jest.fn().mockImplementation((id) => {
      if (id === "parent-discount-us") {
        return Promise.resolve({
          id,
          regions: [{ id: "us" }],
          rule: {
            id: "10off-rule",
            type: "percentage",
          },
        })
      } else if (id === "parent-discount-dk") {
        return Promise.resolve({
          id,
          regions: [{ id: "dk" }],
          rule: {
            id: "10off-rule",
            type: "percentage",
          },
        })
      }
    })

    const discountService = new DiscountService({
      manager: MockManager,
      featureFlagRouter,
    })
    discountService.retrieve = retrieveMock

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("returns false if discount is not available in a given region", async () => {
      const discount = {
        id: "10off",
        code: "10%OFF",
        regions: [{ id: "us" }],
        rule: {
          id: "10off-rule",
          type: "percentage",
        },
      }

      const isValidForRegion = await discountService.isValidForRegion(
        discount,
        "dk"
      )

      expect(retrieveMock).toBeCalledTimes(0)
      expect(isValidForRegion).toBe(false)
    })

    it("returns true if discount is available in a given region", async () => {
      const discount = {
        id: "10off",
        code: "10%OFF",
        regions: [{ id: "us" }],
        rule: {
          id: "10off-rule",
          type: "percentage",
        },
      }

      const isValidForRegion = await discountService.isValidForRegion(
        discount,
        "us"
      )

      expect(retrieveMock).toBeCalledTimes(0)
      expect(isValidForRegion).toBe(true)
    })

    it("returns false if discount has a parent discount and is not available in region", async () => {
      const discount = {
        id: "10off",
        code: "10%OFF",
        parent_discount_id: "parent-discount-us",
      }

      const isValidForRegion = await discountService.isValidForRegion(
        discount,
        "dk"
      )

      expect(retrieveMock).toBeCalledTimes(1)
      expect(retrieveMock).toBeCalledWith(discount.parent_discount_id, {
        relations: ["rule", "regions"],
      })
      expect(isValidForRegion).toBe(false)
    })

    it("returns true if discount has a parent discount and is available in region", async () => {
      const discount = {
        id: "10off",
        code: "10%OFF",
        parent_discount_id: "parent-discount-dk",
      }

      const isValidForRegion = await discountService.isValidForRegion(
        discount,
        "dk"
      )
      expect(retrieveMock).toBeCalledTimes(1)
      expect(retrieveMock).toBeCalledWith(discount.parent_discount_id, {
        relations: ["rule", "regions"],
      })
      expect(isValidForRegion).toBe(true)
    })
  })

  describe("canApplyForCustomer", () => {
    const discountConditionRepository = {
      canApplyForCustomer: jest
        .fn()
        .mockImplementation(() => Promise.resolve(true)),
    }

    const customerService = {
      withTransaction: function () {
        return this
      },
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
      featureFlagRouter,
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

const getOffsetDate = (offset) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date
}
