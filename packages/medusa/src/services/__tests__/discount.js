import DiscountService from "../discount"
import { IdMap, MockManager, MockRepository } from "medusa-test-utils"

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
  })

  describe("retrieve", () => {
    const discountRepository = MockRepository({
      findOne: query => {
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
      findOne: query => {
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
        Promise.resolve({ id: IdMap.getId("total10"), code: "10%OFF" }),
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

    it("successfully updates discount", async () => {
      await discountService.update(IdMap.getId("total10"), {
        code: "test",
        regions: [IdMap.getId("france")],
      })
      expect(discountRepository.save).toHaveBeenCalledTimes(1)
      expect(discountRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("total10"),
        code: "test",
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
        code: "10%OFF",
        metadata: { testKey: "testValue" },
      })
    })
  })

  describe("addValidProduct", () => {
    const discountRepository = MockRepository({
      findOne: () =>
        Promise.resolve({
          id: IdMap.getId("total10"),
          rule: {
            id: IdMap.getId("test-rule"),
            valid_for: [{ id: IdMap.getId("test-product") }],
          },
        }),
    })

    const discountRuleRepository = MockRepository({})

    const productService = {
      retrieve: () => {
        return {
          id: IdMap.getId("test-product-2"),
        }
      },
    }

    const discountService = new DiscountService({
      manager: MockManager,
      discountRepository,
      discountRuleRepository,
      productService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully adds a product", async () => {
      await discountService.addValidProduct(
        IdMap.getId("total10"),
        IdMap.getId("test-product-2")
      )

      expect(discountRuleRepository.save).toHaveBeenCalledTimes(1)
      expect(discountRuleRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("test-rule"),
        valid_for: [
          { id: IdMap.getId("test-product") },
          { id: IdMap.getId("test-product-2") },
        ],
      })
    })

    it("successfully resolves if product already exists", async () => {
      await discountService.addValidProduct(
        IdMap.getId("total10"),
        IdMap.getId("test-product")
      )

      expect(discountRuleRepository.save).toHaveBeenCalledTimes(0)
    })
  })

  describe("removeValidVariant", () => {
    const discountRepository = MockRepository({
      findOne: () =>
        Promise.resolve({
          id: IdMap.getId("total10"),
          rule: {
            id: IdMap.getId("test-rule"),
            valid_for: [{ id: IdMap.getId("test-product") }],
          },
        }),
    })

    const discountRuleRepository = MockRepository({})

    const productService = {
      retrieve: () => {
        return {
          id: IdMap.getId("test-product"),
        }
      },
    }

    const discountService = new DiscountService({
      manager: MockManager,
      discountRepository,
      discountRuleRepository,
      productService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("successfully removes a product", async () => {
      await discountService.removeValidProduct(
        IdMap.getId("total10"),
        IdMap.getId("test-product")
      )

      expect(discountRuleRepository.save).toHaveBeenCalledTimes(1)
      expect(discountRuleRepository.save).toHaveBeenCalledWith({
        id: IdMap.getId("test-rule"),
        valid_for: [],
      })
    })

    it("successfully resolve if product does not exist", async () => {
      await discountService.removeValidProduct(
        IdMap.getId("total10"),
        IdMap.getId("test-product-2")
      )

      expect(discountRuleRepository.save).toHaveBeenCalledTimes(0)
    })
  })

  describe("addRegion", () => {
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
      create: d => d,
      findOne: () =>
        Promise.resolve({
          id: "parent",
          is_dynamic: true,
          rule_id: "parent_rule",
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
        take: 50,
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
})
