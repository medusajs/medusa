import { IdMap, MockManager, MockRepository } from "medusa-test-utils"
import TaxInclusivePricingFeatureFlag from "../../loaders/feature-flags/tax-inclusive-pricing"
import { FlagRouter } from "../../utils/flag-router"
import ShippingOptionService from "../shipping-option"

describe("ShippingOptionService", () => {
  describe("retrieve", () => {
    afterAll(() => {
      jest.clearAllMocks()
    })
    const shippingOptionRepository = MockRepository({
      findOne: () => Promise.resolve({}),
    })
    const optionService = new ShippingOptionService({
      manager: MockManager,
      shippingOptionRepository,
      featureFlagRouter: new FlagRouter({}),
    })

    it("successfully gets shipping option", async () => {
      await optionService.retrieve(IdMap.getId("validId"))

      expect(shippingOptionRepository.findOne).toHaveBeenCalledWith({
        where: { id: IdMap.getId("validId") },
      })
    })
  })

  describe("update", () => {
    const shippingOptionRepository = MockRepository({
      findOne: (q) => {
        switch (q.where.id) {
          case IdMap.getId("noCalc"):
            return Promise.resolve({
              provider_id: "no_calc",
            })
          case IdMap.getId("validId"):
            return Promise.resolve({
              provider_id: "provider",
              amount: 100,
              data: {
                provider_data: "true",
              },
            })
          case "flat-rate-no-amount":
            return Promise.resolve({
              provider_id: "provider",
              data: {
                provider_data: "true",
              },
            })
          default:
            return Promise.resolve({})
        }
      },
    })

    const fulfillmentProviderService = {
      canCalculate: jest
        .fn()
        .mockImplementation((option) => option.provider_id !== "no_calc"),
    }

    const shippingOptionRequirementRepository = MockRepository({
      create: (r) => r,
    })
    const optionService = new ShippingOptionService({
      manager: MockManager,
      shippingOptionRepository,
      shippingOptionRequirementRepository,
      fulfillmentProviderService,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      await optionService.update(IdMap.getId("option"), { name: "new title" })

      expect(shippingOptionRepository.save).toBeCalledTimes(1)
      expect(shippingOptionRepository.save).toBeCalledWith({
        name: "new title",
      })
    })

    it("sets requirements", async () => {
      const requirements = [
        {
          type: "min_subtotal",
          amount: 1,
        },
      ]

      await optionService.update(IdMap.getId("option"), { requirements })

      expect(shippingOptionRepository.save).toHaveBeenCalledTimes(1)
      expect(shippingOptionRequirementRepository.save).toHaveBeenCalledTimes(1)
      expect(shippingOptionRequirementRepository.save).toHaveBeenCalledWith({
        shipping_option_id: IdMap.getId("option"),
        type: "min_subtotal",
        amount: 1,
      })
    })

    it("fails on invalid req", async () => {
      const requirements = [
        {
          type: "_",
          amount: 2,
        },
        {
          type: "min_subtotal",
          amount: 1,
        },
      ]

      await expect(
        optionService.update(IdMap.getId("option"), { requirements })
      ).rejects.toThrow(
        "Requirement type must be one of min_subtotal, max_subtotal"
      )
    })

    it("fails on duplicate reqs", async () => {
      const requirements = [
        {
          type: "min_subtotal",
          amount: 2,
        },
        {
          type: "min_subtotal",
          amount: 1,
        },
      ]

      await expect(
        optionService.update(IdMap.getId("validId"), { requirements })
      ).rejects.toThrow("Only one requirement of each type is allowed")
    })

    it("sets flat rate price", async () => {
      await optionService.update(IdMap.getId("validId"), {
        price_type: "flat_rate",
        amount: 200,
      })

      expect(shippingOptionRepository.save).toHaveBeenCalledTimes(1)
      expect(shippingOptionRepository.save).toHaveBeenCalledWith({
        provider_id: "provider",
        data: {
          provider_data: "true",
        },
        price_type: "flat_rate",
        amount: 200,
      })
    })

    it("throws on flat rate but no amount", async () => {
      expect.assertions(1)
      try {
        await optionService.update(IdMap.getId("flat-rate-no-amount"), {
          price_type: "flat_rate",
        })
      } catch (error) {
        expect(error.message).toEqual(
          "Shipping options of type `flat_rate` must have an `amount`"
        )
      }
    })

    it("sets a price to", async () => {
      await optionService.update(IdMap.getId("validId"), {
        price_type: "flat_rate",
        amount: 0,
      })

      expect(shippingOptionRepository.save).toHaveBeenCalledTimes(1)
      expect(shippingOptionRepository.save).toHaveBeenCalledWith({
        provider_id: "provider",
        data: {
          provider_data: "true",
        },
        price_type: "flat_rate",
        amount: 0,
      })
    })

    it("sets calculated price", async () => {
      await optionService.update(IdMap.getId("validId"), {
        price_type: "calculated",
      })

      expect(fulfillmentProviderService.canCalculate).toHaveBeenCalledTimes(1)
      expect(fulfillmentProviderService.canCalculate).toHaveBeenCalledWith({
        data: { provider_data: "true" },
        provider_id: "provider",
      })

      expect(shippingOptionRepository.save).toHaveBeenCalledTimes(1)
      expect(shippingOptionRepository.save).toHaveBeenCalledWith({
        provider_id: "provider",
        data: {
          provider_data: "true",
        },
        price_type: "calculated",
        amount: null,
      })
    })

    it("fails on invalid type", async () => {
      await expect(
        optionService.update(IdMap.getId("validId"), {
          price_type: "non",
        })
      ).rejects.toThrow("The price must be of type flat_rate or calculated")
    })

    it("fails if provider cannot calculate", async () => {
      await expect(
        optionService.update(IdMap.getId("noCalc"), {
          price_type: "calculated",
        })
      ).rejects.toThrow(
        "The fulfillment provider cannot calculate prices for this option"
      )
    })

    it("throws error when trying to update region_id", async () => {
      const id = IdMap.getId("validId")
      await expect(
        optionService.update(`${id}`, { region_id: "id" })
      ).rejects.toThrow("Region and Provider cannot be updated after creation")
    })

    it("throws error when trying to update provider_id", async () => {
      const id = IdMap.getId("validId")
      await expect(
        optionService.update(`${id}`, { provider_id: "id" })
      ).rejects.toThrow("Region and Provider cannot be updated after creation")
    })
  })

  describe("delete", () => {
    const shippingOptionRepository = MockRepository({
      findOne: (i) =>
        i.where.id === IdMap.getId("validId")
          ? { id: IdMap.getId("validId") }
          : null,
    })
    const optionService = new ShippingOptionService({
      manager: MockManager,
      shippingOptionRepository,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("deletes the option successfully", async () => {
      await optionService.delete(IdMap.getId("validId"))

      expect(shippingOptionRepository.softRemove).toBeCalledTimes(1)
      expect(shippingOptionRepository.softRemove).toBeCalledWith({
        id: IdMap.getId("validId"),
      })
    })

    it("is idempotent", async () => {
      await expect(optionService.delete(IdMap.getId("delete"))).resolves

      expect(shippingOptionRepository.softRemove).toBeCalledTimes(0)
    })
  })

  describe("addRequirement", () => {
    const shippingOptionRepository = MockRepository({
      findOne: (q) => {
        switch (q.where.id) {
          case IdMap.getId("has-min"):
            return Promise.resolve({
              requirements: [
                {
                  type: "min_subtotal",
                  amount: 1234,
                },
              ],
            })
          default:
            return Promise.resolve({ requirements: [] })
        }
      },
    })

    const shippingOptionRequirementRepository = MockRepository({
      create: (r) => r,
    })
    const optionService = new ShippingOptionService({
      manager: MockManager,
      shippingOptionRepository,
      shippingOptionRequirementRepository,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("add product to profile successfully", async () => {
      await optionService.addRequirement(IdMap.getId("validId"), {
        type: "max_subtotal",
        amount: 10,
      })

      expect(shippingOptionRequirementRepository.create).toBeCalledTimes(0)

      expect(shippingOptionRepository.save).toBeCalledTimes(1)
      expect(shippingOptionRepository.save).toBeCalledWith({
        requirements: [
          {
            type: "max_subtotal",
            amount: 10,
          },
        ],
      })
    })

    it("fails if type exists", async () => {
      await expect(
        optionService.addRequirement(IdMap.getId("has-min"), {
          type: "min_subtotal",
          amount: 100,
        })
      ).rejects.toThrow("A requirement with type: min_subtotal already exists")
    })
  })

  describe("removeRequirement", () => {
    const shippingOptionRequirementRepository = MockRepository({
      softRemove: (q) => {
        return Promise.resolve()
      },
      findOne: (i) =>
        i.where.id === IdMap.getId("requirement_id")
          ? { id: IdMap.getId("requirement_id") }
          : null,
    })

    const optionService = new ShippingOptionService({
      manager: MockManager,
      shippingOptionRequirementRepository,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("remove requirement successfully", async () => {
      await optionService.removeRequirement(IdMap.getId("requirement_id"))

      expect(shippingOptionRequirementRepository.findOne).toBeCalledTimes(1)
      expect(shippingOptionRequirementRepository.findOne).toBeCalledWith({
        where: { id: IdMap.getId("requirement_id") },
      })
      expect(shippingOptionRequirementRepository.softRemove).toBeCalledTimes(1)
    })

    it("is idempotent", async () => {
      await optionService.removeRequirement(IdMap.getId("validId"), "something")

      expect(shippingOptionRequirementRepository.softRemove).toBeCalledTimes(1)
    })
  })

  describe("create", () => {
    const shippingOptionRepository = MockRepository({
      create: (r) => r,
    })

    const fulfillmentProviderService = {
      validateOption: jest.fn().mockImplementation((o) => {
        return Promise.resolve(o.data.res)
      }),
    }

    const regionService = {
      withTransaction: function () {
        return this
      },
      retrieve: () => {
        return Promise.resolve({ fulfillment_providers: [{ id: "provider" }] })
      },
    }

    const shippingOptionRequirementRepository = MockRepository({
      create: (r) => r,
    })
    const optionService = new ShippingOptionService({
      manager: MockManager,
      shippingOptionRepository,
      shippingOptionRequirementRepository,
      fulfillmentProviderService,
      regionService,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("creates a shipping option", async () => {
      const option = {
        name: "Test Option",
        provider_id: "provider",
        data: {
          res: true,
        },
        region_id: IdMap.getId("reg"),
        requirements: [
          {
            type: "min_subtotal",
            amount: 1,
          },
        ],
        price_type: "flat_rate",
        amount: 13,
      }

      await optionService.create(option)

      expect(shippingOptionRepository.create).toHaveBeenCalledTimes(1)
      expect(shippingOptionRepository.create).toHaveBeenCalledWith(option)

      expect(fulfillmentProviderService.validateOption).toHaveBeenCalledTimes(1)
      expect(fulfillmentProviderService.validateOption).toHaveBeenCalledWith(
        option
      )

      expect(shippingOptionRepository.save).toHaveBeenCalledTimes(1)
      expect(shippingOptionRepository.save).toHaveBeenCalledWith(option)
    })

    it("fails if region doesn't have fulfillment provider", async () => {
      const option = {
        name: "Test Option",
        provider_id: "testshipper",
        data: {
          id: "new",
        },
        region_id: IdMap.getId("region-france"),
        requirements: [
          {
            type: "min_subtotal",
            amount: 1,
          },
        ],
        price_type: "flat_rate",
        amount: 13,
      }

      await expect(optionService.create(option)).rejects.toThrow(
        "The fulfillment provider is not available in the provided region"
      )
    })

    it("fails if fulfillment provider cannot validate", async () => {
      const option = {
        name: "Test Option",
        provider_id: "provider",
        data: {
          res: false,
        },
        region_id: IdMap.getId("region-france"),
        price_type: "flat_rate",
        amount: 13,
      }

      await expect(optionService.create(option)).rejects.toThrow(
        "The fulfillment provider cannot validate the shipping option"
      )
    })

    it("fails if requirement is not validated", async () => {
      const option = {
        name: "Test Option",
        provider_id: "provider",
        data: {
          res: true,
        },
        requirements: [
          {
            type: "_subtotal",
            value: 100,
          },
        ],
        region_id: IdMap.getId("region-france"),
        price_type: "flat_rate",
        amount: 13,
      }

      await expect(optionService.create(option)).rejects.toThrow(
        "Requirement type must be one of min_subtotal, max_subtotal"
      )
    })

    it("fails if price is not validated", async () => {
      const option = {
        name: "Test Option",
        provider_id: "provider",
        data: {
          res: true,
        },
        region_id: IdMap.getId("region-france"),
        price_type: "nonon",
        amount: 13,
      }

      await expect(optionService.create(option)).rejects.toThrow(
        "The price must be of type flat_rate or calculated"
      )
    })
  })

  describe("createShippingMethod", () => {
    const option = (id) => ({
      id,
      region_id: IdMap.getId("region"),
      price_type: "flat_rate",
      amount: 10,
      data: {
        something: "yes",
      },
      requirements: [
        {
          type: "min_subtotal",
          amount: 100,
        },
      ],
    })
    const shippingOptionRepository = MockRepository({
      findOne: (q) => {
        switch (q.where.id) {
          default:
            return Promise.resolve(option(q.where.id))
        }
      },
    })
    const shippingMethodRepository = MockRepository({ create: (r) => r })
    const totalsService = {
      getSubtotal: (c) => {
        return c.subtotal
      },
    }

    const providerService = {
      validateFulfillmentData: jest
        .fn()
        .mockImplementation((r) => Promise.resolve(r.data)),
      getPrice: (d) => d.price,
    }

    const optionService = new ShippingOptionService({
      manager: MockManager,
      shippingMethodRepository,
      shippingOptionRepository,
      totalsService,
      fulfillmentProviderService: providerService,
      featureFlagRouter: new FlagRouter({}),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("validates", async () => {
      const cart = {
        id: IdMap.getId("cart"),
        region_id: IdMap.getId("region"),
        subtotal: 400,
      }

      await optionService.createShippingMethod(
        IdMap.getId("option"),
        { provider_data: "dat" },
        { cart }
      )

      expect(providerService.validateFulfillmentData).toHaveBeenCalledTimes(1)
      expect(providerService.validateFulfillmentData).toHaveBeenCalledWith(
        option(IdMap.getId("option")),
        { provider_data: "dat" },
        cart
      )

      expect(shippingMethodRepository.save).toHaveBeenCalledTimes(1)
      expect(shippingMethodRepository.save).toHaveBeenCalledWith({
        cart_id: IdMap.getId("cart"),
        shipping_option_id: IdMap.getId("option"),
        price: 10,
        data: { something: "yes" },
      })
    })

    it("fails on invalid req", async () => {
      const id = IdMap.getId("option")
      const d = { some: "thing" }
      const c = { region_id: IdMap.getId("nomatch") }

      await expect(
        optionService.createShippingMethod(id, d, { cart: c })
      ).rejects.toThrow(
        "The shipping option is not available in the cart's region"
      )
    })

    it("fails if reqs are not satisfied", async () => {
      const data = { some: "thing" }
      const cart = {
        region_id: IdMap.getId("region"),
        subtotal: 2,
      }

      await expect(
        optionService.createShippingMethod(IdMap.getId("validId"), data, {
          cart,
        })
      ).rejects.toThrow(
        "The Cart does not satisfy the shipping option's requirements"
      )
    })
  })

  describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] createShippingMethod", () => {
    const option = (id) => ({
      id,
      region_id: IdMap.getId("region"),
      price_type: "flat_rate",
      amount: 10,
      includes_tax: true,
      data: {
        something: "yes",
      },
      requirements: [
        {
          type: "min_subtotal",
          amount: 100,
        },
      ],
    })
    const shippingOptionRepository = MockRepository({
      findOne: (q) => {
        switch (q.where.id) {
          default:
            return Promise.resolve(option(q.where.id))
        }
      },
    })
    const shippingMethodRepository = MockRepository({ create: (r) => r })
    const totalsService = {
      getSubtotal: (c) => {
        return c.subtotal
      },
    }

    const providerService = {
      validateFulfillmentData: jest
        .fn()
        .mockImplementation((r) => Promise.resolve(r.data)),
      getPrice: (d) => d.price,
    }

    const optionService = new ShippingOptionService({
      manager: MockManager,
      shippingMethodRepository,
      shippingOptionRepository,
      totalsService,
      fulfillmentProviderService: providerService,
      featureFlagRouter: new FlagRouter({
        [TaxInclusivePricingFeatureFlag.key]: true,
      }),
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("should create a shipping method that also includes the taxes", async () => {
      await optionService.createShippingMethod("random_id", {}, { price: 10 })
      expect(shippingMethodRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          includes_tax: true,
        })
      )
    })
  })
})
