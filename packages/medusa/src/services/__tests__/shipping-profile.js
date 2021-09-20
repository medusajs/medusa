import { In } from "typeorm"
import { IdMap, MockRepository, MockManager } from "medusa-test-utils"
import ShippingProfileService from "../shipping-profile"
//import { ShippingProfileModelMock } from "../../models/__mocks__/shipping-profile"
//import { ProductServiceMock, products } from "../__mocks__/product"
//import {
//  ShippingOptionServiceMock,
//  shippingOptions,
//} from "../__mocks__/shipping-option"

describe("ShippingProfileService", () => {
  describe("retrieve", () => {
    describe("successfully get profile", () => {
      afterAll(() => {
        jest.clearAllMocks()
      })

      it("calls model layer findOne", async () => {
        const profRepo = MockRepository({
          findOne: () => Promise.resolve({}),
        })
        const profileService = new ShippingProfileService({
          manager: MockManager,
          shippingProfileRepository: profRepo,
        })

        await profileService.retrieve(IdMap.getId("validId"))

        expect(profRepo.findOne).toHaveBeenCalledTimes(1)
        expect(profRepo.findOne).toHaveBeenCalledWith({
          where: { id: IdMap.getId("validId") },
        })
      })
    })
  })

  describe("update", () => {
    const profRepo = MockRepository({
      findOne: q => {
        return Promise.resolve({ id: q.where.id })
      },
    })

    const productService = {
      update: jest.fn(),
      withTransaction: function() {
        return this
      },
    }

    const shippingOptionService = {
      update: jest.fn(),
      withTransaction: function() {
        return this
      },
    }

    const profileService = new ShippingProfileService({
      manager: MockManager,
      shippingProfileRepository: profRepo,
      productService,
      shippingOptionService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("calls updateOne with correct params", async () => {
      const id = IdMap.getId("validId")

      await profileService.update(id, { name: "new title" })

      expect(profRepo.save).toBeCalledTimes(1)
      expect(profRepo.save).toBeCalledWith({ id, name: "new title" })
    })

    it("calls updateOne products", async () => {
      const id = IdMap.getId("validId")

      await profileService.update(id, {
        products: [IdMap.getId("product1")],
      })

      expect(productService.update).toBeCalledTimes(1)
      expect(productService.update).toBeCalledWith(IdMap.getId("product1"), {
        profile_id: id,
      })
    })

    it("calls updateOne with shipping options", async () => {
      const id = IdMap.getId("profile1")

      await profileService.update(id, {
        shipping_options: [IdMap.getId("validId")],
      })

      expect(shippingOptionService.update).toBeCalledTimes(1)
      expect(shippingOptionService.update).toBeCalledWith(
        IdMap.getId("validId"),
        { profile_id: id }
      )
    })
  })

  describe("delete", () => {
    const profRepo = MockRepository({
      findOne: q => {
        return Promise.resolve({ id: q.where.id })
      },
    })
    const profileService = new ShippingProfileService({
      manager: MockManager,
      shippingProfileRepository: profRepo,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("deletes the profile successfully", async () => {
      await profileService.delete(IdMap.getId("validId"))

      expect(profRepo.softRemove).toBeCalledTimes(1)
      expect(profRepo.softRemove).toBeCalledWith({
        id: IdMap.getId("validId"),
      })
    })
  })

  describe("addProduct", () => {
    const profRepo = MockRepository({ findOne: () => Promise.resolve({}) })

    const productService = {
      update: jest.fn(),
      withTransaction: function() {
        return this
      },
    }

    const profileService = new ShippingProfileService({
      manager: MockManager,
      shippingProfileRepository: profRepo,
      productService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("add product to profile successfully", async () => {
      await profileService.addProduct(
        IdMap.getId("validId"),
        IdMap.getId("product2")
      )

      expect(productService.update).toBeCalledTimes(1)
      expect(productService.update).toBeCalledWith(IdMap.getId("product2"), {
        profile_id: IdMap.getId("validId"),
      })
    })
  })

  describe("fetchCartOptions", () => {
    const profRepo = MockRepository({
      find: q => {
        switch (q.where.id) {
          default:
            return Promise.resolve([
              {
                shipping_options: [],
              },
            ])
        }
      },
    })

    const shippingOptionService = {
      list: jest.fn().mockImplementation(() =>
        Promise.resolve([
          {
            id: "ship_1",
          },
          {
            id: "ship_2",
          },
        ])
      ),
      validateCartOption: jest.fn().mockImplementation(s => s),
      withTransaction: function() {
        return this
      },
    }

    const profileService = new ShippingProfileService({
      manager: MockManager,
      shippingProfileRepository: profRepo,
      shippingOptionService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("fetches correct options", async () => {
      const cart = {
        items: [
          {
            variant: {
              product: {
                _id: IdMap.getId("product_1"),
                profile_id: IdMap.getId("profile"),
              },
            },
          },
          {
            variant: {
              product: {
                _id: IdMap.getId("product_2"),
                profile_id: IdMap.getId("profile"),
              },
            },
          },
        ],
      }

      await expect(profileService.fetchCartOptions(cart)).resolves.toEqual([
        { id: "ship_1" },
        { id: "ship_2" },
      ])

      expect(shippingOptionService.validateCartOption).toBeCalledTimes(2)
      expect(shippingOptionService.validateCartOption).toBeCalledWith(
        { id: "ship_1" },
        cart
      )
      expect(shippingOptionService.validateCartOption).toBeCalledWith(
        { id: "ship_2" },
        cart
      )
    })
  })

  describe("fetchRMAOptions", () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("given a swap cart with rma shipping options, should return correct rma shipping options ", async () => {
      const swapRepository = MockRepository({
        findOne() {
          return Promise.resolve({
            id: "swap-cart",
            type: "swap",
            rma_shipping_options: [
              { option_id: "test-option1", id: "rmsao-option1", price: 10 },
              { option_id: "test-option2", id: "rmsao-option2", price: 0 },
            ],
          })
        },
      })

      const profileService = new ShippingProfileService({
        manager: MockManager,
        swapRepository,
      })

      const cart = {
        id: "swap-cart",
        type: "swap",
      }

      await expect(profileService.fetchRMAOptions(cart)).resolves.toEqual([
        expect.objectContaining({ id: "rmsao-option1" }),
        expect.objectContaining({ id: "rmsao-option2" }),
      ])
    })

    it("given a swap cart with no rma shipping options, should call fetchCartOptions and return normal shipping options ", async () => {
      const swapRepository = MockRepository({
        findOne() {
          return Promise.resolve({
            id: "swap-cart",
            type: "swap",
            rma_shipping_options: [],
          })
        },
      })

      const profileService = new ShippingProfileService({
        manager: MockManager,
        swapRepository,
      })

      profileService.fetchCartOptions = jest.fn().mockImplementation(() => {
        return Promise.resolve([
          {
            id: "normal-option1",
          },
          {
            id: "normal-option2",
          },
        ])
      })

      const cart = {
        id: "swap-cart",
        type: "swap",
      }

      await expect(profileService.fetchRMAOptions(cart)).resolves.toEqual([
        expect.objectContaining({
          id: "normal-option1",
        }),
        expect.objectContaining({ id: "normal-option2" }),
      ])

      expect(profileService.fetchCartOptions).toHaveBeenCalledTimes(1)
      expect(profileService.fetchCartOptions).toHaveBeenCalledWith({
        id: "swap-cart",
        type: "swap",
      })
    })

    it("when cart is default, then should throw", async () => {
      const profileService = new ShippingProfileService({
        manager: MockManager,
      })

      const cart = {
        id: "normal-cart",
        type: "default",
      }

      await expect(profileService.fetchRMAOptions(cart)).rejects.toThrow({
        type: "invalid_data",
        message: "error",
      })
    })
  })

  describe("addShippingOption", () => {
    const profRepo = MockRepository({ findOne: () => Promise.resolve({}) })

    const shippingOptionService = {
      update: jest.fn(),
      withTransaction: function() {
        return this
      },
    }

    const profileService = new ShippingProfileService({
      manager: MockManager,
      shippingProfileRepository: profRepo,
      shippingOptionService,
    })

    beforeEach(() => {
      jest.clearAllMocks()
    })

    it("add shipping option to profile successfully", async () => {
      await profileService.addShippingOption(
        IdMap.getId("validId"),
        IdMap.getId("freeShipping")
      )

      expect(shippingOptionService.update).toBeCalledTimes(1)
      expect(shippingOptionService.update).toBeCalledWith(
        IdMap.getId("freeShipping"),
        { profile_id: IdMap.getId("validId") }
      )
    })
  })

  describe("create", () => {
    const profRepo = MockRepository()
    const profileService = new ShippingProfileService({
      manager: MockManager,
      shippingProfileRepository: profRepo,
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it("successfully creates a new shipping profile", async () => {
      await profileService.create({
        name: "New Profile",
      })

      expect(profRepo.create).toHaveBeenCalledTimes(1)
      expect(profRepo.create).toHaveBeenCalledWith({
        name: "New Profile",
      })
    })

    it("throws if trying to create with products", async () => {
      await expect(
        profileService.create({
          name: "New Profile",
          products: ["144"],
        })
      ).rejects.toThrow(
        "Please add products and shipping_options after creating Shipping Profiles"
      )
    })
  })
})
