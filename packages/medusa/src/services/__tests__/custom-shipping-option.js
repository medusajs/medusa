import CustomShippingOptionService from "../custom-shipping-option"
import { MockManager, MockRepository, IdMap } from "medusa-test-utils"

describe("CustomShippingOptionService", () => {
  describe("list", () => {
    const customShippingOptionRepository = MockRepository({
      find: (q) => {
        return Promise.resolve([
          {
            id: "cso-test",
            shipping_option_id: "test-so",
            price: 0,
            cart_id: "test-cso-cart",
          },
        ])
      },
    })

    const customShippingOptionService = new CustomShippingOptionService({
      manager: MockManager,
      customShippingOptionRepository,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls customShippingOptionRepository find method", async () => {
      await customShippingOptionService.list(
        { cart_id: "test-cso-cart" },
        {
          relations: ["shipping_option"],
        }
      )
      expect(customShippingOptionRepository.find).toHaveBeenCalledTimes(1)
      expect(customShippingOptionRepository.find).toHaveBeenCalledWith({
        where: {
          cart_id: "test-cso-cart",
        },
        relations: ["shipping_option"],
      })
    })
  })

  describe("retrieve", () => {
    const customShippingOptionRepository = MockRepository({
      findOne: (q) => {
        if (q.where.id === "cso-test") {
          return Promise.resolve({
            id: "cso-test",
            shipping_option_id: "test-so",
            price: 0,
            cart_id: "test-cso-cart",
          })
        }
      },
    })

    const customShippingOptionService = new CustomShippingOptionService({
      manager: MockManager,
      customShippingOptionRepository,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls customShippingOptionRepository findOne method", async () => {
      await customShippingOptionService.retrieve("cso-test", {
        relations: ["shipping_option", "cart"],
      })

      expect(customShippingOptionRepository.findOne).toHaveBeenCalledTimes(1)
      expect(customShippingOptionRepository.findOne).toHaveBeenCalledWith({
        where: { id: "cso-test" },
        relations: ["shipping_option", "cart"],
      })
    })

    it("fails when custom shipping option is not found", async () => {
      expect(customShippingOptionService.retrieve("bad-cso")).rejects.toThrow(
        `Custom shipping option with id: bad-cso was not found.`
      )
    })
  })

  describe("create", () => {
    const customShippingOptionRepository = MockRepository({
      create: jest.fn().mockImplementation((f) => ({ id: "test-cso", ...f })),
      save: jest.fn().mockImplementation((f) => Promise.resolve(f)),
    })

    const customShippingOptionService = new CustomShippingOptionService({
      manager: MockManager,
      customShippingOptionRepository,
    })

    beforeAll(async () => {
      jest.clearAllMocks()
    })

    it("calls customShippingOptionRepository create method", async () => {
      const customShippingOption = {
        cart_id: "test-cso-cart",
        shipping_option_id: "test-so",
        price: 30,
      }
      await customShippingOptionService.create(customShippingOption)

      expect(customShippingOptionRepository.create).toHaveBeenCalledTimes(1)
      expect(customShippingOptionRepository.create).toHaveBeenCalledWith({
        cart_id: "test-cso-cart",
        shipping_option_id: "test-so",
        price: 30,
        metadata: undefined,
      })

      expect(customShippingOptionRepository.save).toHaveBeenCalledTimes(1)
      expect(customShippingOptionRepository.save).toHaveBeenCalledWith({
        id: "test-cso",
        cart_id: "test-cso-cart",
        shipping_option_id: "test-so",
        price: 30,
        metadata: undefined,
      })
    })
  })
})
